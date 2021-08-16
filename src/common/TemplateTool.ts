class TemplateTool {
	public constructor() {
	}
	/**创建UI容器(GYUIComponent) */
	public static getContainer(pr: GYLite.GYSprite = null, w?: number, h?: number, x: number = 0, y: number = 0): GYLite.GYUIComponent {

		let c = new GYLite.GYUIComponent();
		c.width = w;
		c.height = h;
		c.x = x;
		c.y = y;
		if (pr != null) {
			pr.addElement(c);
			if (!w) {
				c.width = pr.width;
				c.height = pr.height;
			}
		}
		return c;
	}

	/**设置背景色(默认透明度0.5的随机色) */
	public static setBackGrapics(pr: GYLite.GYSprite, color: number = 0x000000, alpha: number = 0.5): void {

		let g: egret.Graphics;
		let c: any;
		if (color !== 0) {

			c = color;
		} else {

			c = Number('0x' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6));
		}
		if (pr.graphics)
			pr.graphics.clear();
		g = pr.graphics;
		g.beginFill(c, alpha);
		g.drawRect(0, 0, pr.width, pr.height);
		g.endFill();

	}

	public static setBorderRadius(target: GYLite.GYSprite): void {

		let mask = new GYLite.GYSprite;
		mask.x = target.x;
		mask.y = target.y;
		mask.width = mask.height = target.width;
		let g: egret.Graphics = mask.graphics;
		g.beginFill(0, 1);
		g.drawCircle(target.width / 2, target.height / 2, target.width / 2);
		g.endFill();
		target.mask = mask;
		if (target.parent)
			(target.parent as any).addElement(mask);

	}

	/**创建文本 */
	public static createText(x: number, y: number, label: string = '测试字样', size: number = 24, color: number = 0x777777, textAlign: string = "left", sound: boolean = false): GYLite.GYText {

		let txt = new GYLite.GYText(), s = this;
		txt.x = x;
		txt.y = y;
		txt.text = label;
		txt.size = size;
		txt.color = color;
		txt.textAlign = textAlign;
		if (sound)
			txt.addEventListener(egret.TouchEvent.TOUCH_TAP, function (): void {
				SoundManager.instance.play(URLConf.sound + "click_btn.mp3");
			}, s);
		return txt;
	}

	/**创建输入框 */
	public static createTextInput(pr: GYLite.GYSprite = null, x: number, y: number, w: number, h: number, prompt?: string, size: number = 18, color: number = 0x777777, maxChars: number = 20): GYLite.GYTextInput {

		let input = new GYLite.GYTextInput;
		input.x = x;
		input.y = y;
		input.width = input.promptText.width = input.textInput.width = w;
		input.height = input.promptText.height = input.textInput.height = h;
		input.paddingLeft = input.paddingRight = 10;
		input.prompt = prompt;
		input.promptText.size = size;
		input.promptText.paddingTop = input.textInput.paddingTop = h >> 1
		input.promptText.color = color;
		input.textInput.size = size;
		input.textInput.color = color;
		input.textInput.maxChars = maxChars;
		if (pr != null) pr.addElement(input);
		return input;
	}

	/**创建文本框 */
	public static createTextArea(pr: GYLite.GYSprite = null, x: number, y: number, w: number, h: number, size: number = 20, color: number = 0x777777, skin: GYLite.TextAreaSkin = null, maxChars: number = 50): GYLite.GYTextArea {

		let textArea = new GYLite.GYTextArea;
		textArea.skin = skin;
		textArea.editable = true;
		textArea.setPadding(10);
		textArea.textArea.size = size;
		textArea.textArea.color = color;
		textArea.x = x;
		textArea.y = y;
		textArea.width = w;
		textArea.height = h;
		if (pr != null) pr.addElement(textArea);
		return textArea;
	}

	/**
	 * 创建网络图片
	 * @param pr 父级
	 * @param source 网络图片地址
	 * @param defaultUrl 默认图
	 * @param alias 默认图的图集
	 * @param hasMask 是否圆角
	 */
	public static createLoadImage(pr: GYLite.GYSprite = null, x: number, y: number, w: number, h: number, source: string, defaultUrl?: string, alias?: string, hasMask: boolean = false): GYLite.GYLoadImage {

		let loadImg = new GYLite.GYLoadImage;
		loadImg.x = x;
		loadImg.y = y;
		loadImg.width = w;
		loadImg.height = h;
		if (source) loadImg.source = source;
		if (defaultUrl) loadImg.errorData = Main.instance.getRes(defaultUrl, alias);
		loadImg.clearImmedia = true;

		if (pr !== null) {
			pr.addElement(loadImg)
		}

		if (hasMask) {

			let mask = new GYLite.GYSprite;
			mask.x = loadImg.x;
			mask.y = loadImg.y;
			mask.width = mask.height = w;
			let g: egret.Graphics = mask.graphics;
			g.beginFill(0, 1);
			g.drawRoundRect(0, 0, w, h, 40);
			g.endFill();
			loadImg.mask = mask;

			if (pr !== null) {
				pr.addElement(mask)
			}
		}

		return loadImg;
	}

	/**创建滚动容器 */
	public static createScrollGroup(pr: GYLite.GYSprite = null, x: number, y: number, w: number, h: number, canDrag: boolean = false, /**滚动条 1显示 0不显示*/scrollBar: number = 0, /**滚动默认距离:5 */step: number = 5) {

		let scrollG = new GYLite.GYScrollGroup;
		scrollG.x = x;
		scrollG.y = y;
		scrollG.width = w;
		scrollG.height = h;
		scrollG.scrollerViewPort.canDrag = canDrag;
		scrollG.scroller.scrollBarH.alpha = scrollBar;
		scrollG.scroller.scrollBarV.alpha = scrollBar;
		scrollG.scroller.wheelScrollStep = step;

		scrollG.touchEnabled = true;
		let scrollBack = new GYLite.GYSprite;
		let g: egret.Graphics;
		g = scrollBack.graphics;
		g.beginFill(0, 0);
		g.drawRect(0, 0, scrollG.width, 100);
		g.endFill();
		scrollBack.touchEnabled = true;
		scrollG.addElement(scrollBack);

		if (pr)
			pr.addElement(scrollG);
		return scrollG;

	}

	// public static createTweenImage(pr: GYLite.GYSprite, x: number, y: number, source: string, alias: string = null): TweenImage {

	// 	let s = this;
	// 	let img: TweenImage = new TweenImage;
	// 	if (source) img.source = Main.instance.getRes(source, alias);
	// 	img.x = x;
	// 	img.y = y;
	// 	if (pr)
	// 		pr.addElement(img);
	// 	return img;
	// }

	// public static createTweenSkeleton(bName: string, skPath?: string, boneName?: string): TweenSkeleton {

	// 	let s = this;
	// 	let ske: TweenSkeleton = new TweenSkeleton;
	// 	ske.setDataByName(bName, skPath, boneName);
	// 	return ske;
	// }

	public static setButtonSkin(target: GYLite.GYButton, skinVec: Array<string>, alias: string = null, btnSkin: any = null): void {

		if (!btnSkin) btnSkin = GYLite.ButtonSkin;
		let vec: Array<egret.Texture> = [
			Main.instance.getRes(skinVec[0], alias),
			skinVec[1] ? Main.instance.getRes(skinVec[1], alias) : null,
			skinVec[2] ? Main.instance.getRes(skinVec[2], alias) : null,
			skinVec[3] ? Main.instance.getRes(skinVec[3], alias) : null,
			skinVec[4] ? Main.instance.getRes(skinVec[4], alias) : null,
			skinVec[5] ? Main.instance.getRes(skinVec[5], alias) : null,
			skinVec[6] ? Main.instance.getRes(skinVec[6], alias) : null,
			skinVec[7] ? Main.instance.getRes(skinVec[7], alias) : null
		];

		target.skin = new btnSkin(vec, null);

	}

	/**添加scroller滚动效果 */
	public static addScrollEvent(pr: GYLite.GYSprite, space: number, horizonal: boolean = true, callBack: Function = null, thisObject: any = null) {

		let scroller = null;
		if ((pr as any).wheelScroll) (pr as any).wheelScroll = false;
		let g: egret.Graphics;
		g = pr.graphics;
		g.beginFill(0, 0);
		g.drawRect(0, 0, pr.width, pr.height);
		g.endFill();
		if (horizonal) {

			scroller = (pr as any).hScroller;
		} else {
			scroller = (pr as any).vScroller;
		}

		pr.setWheelFunc((e: any) => {

			callBack && callBack.call(thisObject, e);

			if (e.deltaY > 0) {
				if (scroller.position >= scroller.maximum) return;
				let m = scroller.position + space;
				scroller.scrollToPosition(m);
			} else {
				if (0 >= scroller.position) return;
				let m = scroller.position - space;
				scroller.scrollToPosition(m);
			}

		}, thisObject);

	}

	public static removeScrollEvent(pr: GYLite.GYSprite): void {

		pr.setWheelFunc(null);
	}

	public static setDrag(pr: GYLite.GYSprite | any, id: number = 0): void {

		let s = this

		if (Object.prototype.toString.call(pr) === '[object Array]') {

			let arr: GYLite.GYSprite[] = pr;
			arr.forEach((item, index) => {

				item.touchEnabled = true;
				GYLite.DraggerHandle.getInstance(item).addBind(function (d: GYLite.DraggerHandle): void {
					d.handle.x = (<any>d.handle.parent).mouseX - d.dragMouseX;
					d.handle.y = (<any>d.handle.parent).mouseY - d.dragMouseY;
				}, s);
				item.addEventListener(egret.TouchEvent.TOUCH_END, function () {

					console.log({ id: id, x: Math.round(item.x), y: Math.round(item.y) });
				}, item);
			});

		} else {

			pr.touchEnabled = true;
			GYLite.DraggerHandle.getInstance(pr).addBind(function (d: GYLite.DraggerHandle): void {
				d.handle.x = (<any>d.handle.parent).mouseX - d.dragMouseX;
				d.handle.y = (<any>d.handle.parent).mouseY - d.dragMouseY;
			}, s);
			pr.addEventListener(egret.TouchEvent.TOUCH_END, function () {

				console.log({ id: id, x: Math.round(pr.x), y: Math.round(pr.y) });
			}, pr);
		}
	}

	public static openDrag(pr: GYLite.GYSprite): void {
		let s = this;
		let len: number;
		len = pr.numElement;
		while (--len > -1) {
			let sp: GYLite.GYSprite = <any>pr.getElementAt(len);
			sp.touchEnabled = true;
			GYLite.DraggerHandle.getInstance(sp).addBind(function (d: GYLite.DraggerHandle): void {
				d.handle.x = (<any>d.handle.parent).mouseX - d.dragMouseX;
				d.handle.y = (<any>d.handle.parent).mouseY - d.dragMouseY;
			}, s);
		}
		pr.addEventListener(egret.TouchEvent.TOUCH_END, function (e: any) {

			console.log({ x: Math.round(e.target.x), y: Math.round(e.target.y) });
		}, pr);
	}

}