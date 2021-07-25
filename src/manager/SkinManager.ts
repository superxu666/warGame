class SkinManager {
	private static _instance: SkinManager;
	private static _instanceC: number = 0;
	public static getInstance(): SkinManager {
		if (SkinManager._instance == null)
			SkinManager._instance = new SkinManager;
		return SkinManager._instance;
	}
	public constructor() {
		let s = this;
	}
	public static createImage(pr: GYLite.GYSprite, x: number, y: number, source: string, alias: string = null, imgCls: any = null): GYLite.GYImage {
		let s = this;
		if (imgCls == null) imgCls = GYLite.GYImage;
		let img: GYLite.GYImage = new imgCls;
		if (source) img.source = Main.instance.getRes(source, alias);
		img.x = x;
		img.y = y;
		if (pr) pr.addElement(img);
		return img;
	}
	/**创建8个状态的按钮，上面浮动位图label
	 * @param pr 父级容器
	 * @param x 坐标x
	 * @param y 坐标y
	 * @param skinVec 图片状态数组
	 * @param labSkinVec 图片状态数组
	 * @param alias 图集名
	 * @param n 组件name
	 * @param sound 按钮点击声音
	 * @param scale9GridRect 九宫格参数
	*/
	public static createImgBtn(pr: GYLite.GYSprite, x: number, y: number, skinVec: Array<string>, labSkinVec: Array<string> = null, alias: string = null, n: string = null, sound: string = null, scale9GridRect: GYLite.Scale9GridRect = null): GYLite.GYButton {
		let s = this;
		let vec: Array<egret.Texture> = [
			skinVec[0] ? Main.instance.getRes(skinVec[0], alias) : null,
			skinVec[1] ? Main.instance.getRes(skinVec[1], alias) : null,
			skinVec[2] ? Main.instance.getRes(skinVec[2], alias) : null,
			skinVec[3] ? Main.instance.getRes(skinVec[3], alias) : null,
			skinVec[4] ? Main.instance.getRes(skinVec[4], alias) : null,
			skinVec[5] ? Main.instance.getRes(skinVec[5], alias) : null,
			skinVec[6] ? Main.instance.getRes(skinVec[6], alias) : null,
			skinVec[7] ? Main.instance.getRes(skinVec[7], alias) : null
		];
		let buttonSkin: ImageButtonSkin;
		buttonSkin = new ImageButtonSkin(vec, scale9GridRect);
		if (labSkinVec) {
			buttonSkin.imageLabelVec = [
				labSkinVec[0] ? Main.instance.getRes(labSkinVec[0], alias) : null,
				labSkinVec[1] ? Main.instance.getRes(labSkinVec[1], alias) : null,
				labSkinVec[2] ? Main.instance.getRes(labSkinVec[2], alias) : null,
				labSkinVec[3] ? Main.instance.getRes(labSkinVec[3], alias) : null,
				labSkinVec[4] ? Main.instance.getRes(labSkinVec[4], alias) : null,
				labSkinVec[5] ? Main.instance.getRes(labSkinVec[5], alias) : null,
				labSkinVec[6] ? Main.instance.getRes(labSkinVec[6], alias) : null,
				labSkinVec[7] ? Main.instance.getRes(labSkinVec[7], alias) : null
			];
		}
		let btn: GYLite.GYButton = new GYLite.GYButton(buttonSkin);
		btn.name = n = null ? "instance" + (SkinManager._instanceC++) : n;
		btn.x = x;
		btn.y = y;
		btn["buttonModeForMouse"] = true;
		pr.addElement(btn);
		if (sound)
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (): void {
				SoundManager.instance.play(sound.indexOf("/") > -1 ? sound : (URLConf.sound + sound));
			}, s);
		return btn;
	}
	/**创建8个状态的按钮
	 * @param pr 父级容器
	 * @param x 坐标x
	 * @param y 坐标y
	 * @param skinVec 图片状态数组
	 * @param alias 图集名
	 * @param n 组件name
	 * @param scale9GridRect 九宫格参数
	 * @param sound 按钮点击声音
	*/
	public static createBtn2(pr: GYLite.GYSprite, x: number, y: number, skinVec: Array<string>, alias: string = null, n: string = null, btnCls: any = null, btnSkin: any = null, scale9GridRect: GYLite.Scale9GridRect = null, sound: string = null): GYLite.GYButton {
		let s = this;
		if (btnSkin == null) btnSkin = GYLite.ButtonSkin;
		if (btnCls == null) btnCls = GYLite.GYButton;
		let vec: Array<egret.Texture> = [
			skinVec[0] ? Main.instance.getRes(skinVec[0], alias) : null,
			skinVec[1] ? Main.instance.getRes(skinVec[1], alias) : null,
			skinVec[2] ? Main.instance.getRes(skinVec[2], alias) : null,
			skinVec[3] ? Main.instance.getRes(skinVec[3], alias) : null,
			skinVec[4] ? Main.instance.getRes(skinVec[4], alias) : null,
			skinVec[5] ? Main.instance.getRes(skinVec[5], alias) : null,
			skinVec[6] ? Main.instance.getRes(skinVec[6], alias) : null,
			skinVec[7] ? Main.instance.getRes(skinVec[7], alias) : null
		];
		let btn: any = new btnCls(new btnSkin(vec, scale9GridRect));
		btn.name = n = null ? "instance" + (SkinManager._instanceC++) : n;
		btn.x = x;
		btn.y = y;
		btn["buttonModeForMouse"] = true;
		if (pr) pr.addElement(btn);
		if (sound)
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (): void {
				SoundManager.instance.play(sound.indexOf("/") > -1 ? sound : (URLConf.sound + sound));
			}, s);
		return btn;
	}
	/**创建3个状态的按钮
	 * @param pr 父级容器
	 * @param x 坐标x
	 * @param y 坐标y
	 * @param up 抬起状态
	 * @param over 经过状态
	 * @param down 按下状态
	 * @param alias 图集名
	 * @param n 组件name
	 * @param sound 按钮点击声音
	 * @param scale9GridRect 九宫格参数	 
	*/
	public static createBtn(pr: GYLite.GYSprite, x: number, y: number, up: string, over: string = null, down: string = null, alias: string = null, n: string = null, sound: string = null, scale9GridRect: GYLite.Scale9GridRect = null): GYLite.GYButton {
		let s = this;
		let vec: Array<egret.Texture> = [
			Main.instance.getRes(up, alias),
			over ? Main.instance.getRes(over, alias) : null,
			down ? Main.instance.getRes(down, alias) : null
		];
		let btn: GYLite.GYButton = new GYLite.GYButton(new GYLite.ButtonSkin(vec));
		btn.name = n = null ? "instance" + (SkinManager._instanceC++) : n;
		btn.x = x;
		btn.y = y;
		btn["buttonModeForMouse"] = true;
		if (pr) pr.addElement(btn);
		if (sound)
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (): void {
				SoundManager.instance.play(sound.indexOf("/") > -1 ? sound : (URLConf.sound + sound));
			}, s);
		return btn;
	}
	/**创建位图文本
	 * @param pr 父级容器
	 * @param x 坐标x
	 * @param y 坐标y
	 * @param imgDict 位图数组
	 * @param align 水平对齐方式	 
	*/
	public static createImgLabel(pr: GYLite.GYSprite, x: number, y: number, imgDict: GYLite.Dictionary, align: string = "right"): GYLite.ImageLabel {
		let s = this;
		let img: GYLite.ImageLabel = new GYLite.ImageLabel;
		img.setData(imgDict);
		img.align = align;
		img.x = x;
		img.y = y;
		if (pr) pr.addElement(img);
		return img;
	}

	/**创建九宫格缩放图
	 * @param pr 父级容器
	 * @param x 坐标x
	 * @param y 坐标y
	 * @param image 图片名称，图集小图名称，非图集则是图路径	 
	 * @param alias 图集路径
	 * @param scale9Grid 九宫格对象
	*/
	public static createScaleImage(pr: GYLite.GYSprite, x: number, y: number, image: string = null, alias: string = null, scale9Grid: GYLite.Scale9GridRect = null): GYLite.GYScaleSprite {
		let s = this;
		let img: GYLite.GYScaleSprite = new GYLite.GYScaleSprite(image ? Main.instance.getRes(image, alias) : null, scale9Grid);
		img.x = x;
		img.y = y;
		if (pr) pr.addElement(img);
		return img;
	}

	/**创建一个纵向列表
	 * @param pr 父级容器
	 * @param x 坐标x
	 * @param y 坐标y
	 * @param w 宽度
	 * @param h 高度
	 * @param itemClass 单元格类定义
	 * **/
	public static createListV(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number, itemClass: any): GYLite.GYListV {
		let listV: GYLite.GYListV = new GYLite.GYListV(h, function (): GYLite.IItemRender {
			return new itemClass;
		}, null);
		listV.width = w;
		listV.x = x;
		listV.y = y;
		listV.rectHit = true;
		listV.touchEnabled = true;
		if (pr) pr.addElement(listV);
		return listV;
	}
	/**创建一个横向列表
	 * @param pr 父级容器
	 * @param x 坐标x
	 * @param y 坐标y
	 * @param w 宽度
	 * @param h 高度
	 * @param itemClass 单元格类定义
	 * **/
	public static createListH(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number, itemClass: any): GYLite.GYListH {
		let listH: GYLite.GYListH = new GYLite.GYListH(w, function (): GYLite.IItemRender {
			return new itemClass;
		}, null);
		listH.height = h;
		listH.x = x;
		listH.y = y;
		listH.rectHit = true;
		listH.touchEnabled = true;
		if (pr) pr.addElement(listH);
		return listH;
	}
	/***创建序列图动画
	 * @param pr 父级容器
	 * @param toX 坐标x
	 * @param toY 坐标y
	 * @param alias 图集路径(带后缀) 图集图名称从0开始
	*/
	public static createSeqImg(pr: GYLite.GYSprite, toX: number, toY: number, alias: string): GYLite.GYSeqImage {
		let arr: Array<egret.Texture>;
		var ind: number;
		let res: any;
		if (alias) {
			arr = [];
			res = Main.instance.getDataRes(alias.replace(".png", ".json"));
			for (var key in res.frames) {
				ind = Number(key);
				arr[ind] = Main.instance.getRes(ind + "", alias);
			}
		}
		let img: GYLite.GYSeqImage = new GYLite.GYSeqImage;
		if (arr) img.source = arr;
		img.x = toX;
		img.y = toY;
		if (pr) pr.addElement(img);
		return img;
	}
	/***创建分图集的序列图动画
	 * @param pr 父级容器
	 * @param toX 坐标x
	 * @param toY 坐标y
	 * @param aliasArray 图集路径数组(带后缀) 图集图名称从0开始
	*/
	public static createSeqByAliasArray(pr: GYLite.GYSprite, toX: number, toY: number, aliasArray: Array<string>): GYLite.GYSeqImage {
		let arr: Array<egret.Texture>;
		arr = SkinManager.getSeqArr(aliasArray);
		let img: GYLite.GYSeqImage = new GYLite.GYSeqImage;
		if (arr) img.source = arr;
		img.x = toX;
		img.y = toY;
		if (pr) pr.addElement(img);
		return img;
	}
	/**创建文本
	 * @param pr 父级不填则不添加到舞台
	 * @param toX 坐标x 
	 * @param toY 坐标y
	 * @param text 文本
	 * @param color 颜色
	 * @param size 字号
	 * @param align 水平对齐方式 left right center
	 * @param w 宽度
	 * @param h 高度
	*/
	public static createText(pr: GYLite.GYSprite, toX: number, toY: number, text: string, color: number = 0xffffff, size: number = 20, align: string = "left", w: number = NaN, h: number = NaN, fontFamily: string = ""): GYLite.GYText {
		let txt: GYLite.GYText;
		txt = new GYLite.GYText;
		txt.text = text;
		txt.color = color;
		txt.size = size;
		txt.align = align;
		txt.width = w;
		txt.height = h;
		txt.x = toX;
		txt.y = toY;
		if (pr) pr.addElement(txt);
		return txt;
	}
	/**创建文本框 
	 * @param pr 父级不填则不添加到舞台
	 * @param toX 坐标x 
	 * @param toY 坐标y
	 * @param w 宽度
	 * @param h 高度	 
	 * @param size 字号
	 * @param color 颜色	 	 
	 * @param skin 皮肤
	 * @param maxChars 最大字数	 
	*/
	public static createTextArea(pr: GYLite.GYSprite = null, x: number, y: number, w: number, h: number, size: number = 20, color: number = 0x777777, skin: GYLite.TextAreaSkin = null, maxChars: number = 999999): GYLite.GYTextArea {

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
	/**创建横向网格
	 * @param pr 父级不填则不添加到舞台
	 * @param toX 坐标x 
	 * @param toY 坐标y
	 * @param w 宽度
	 * @param h 高度
	 * @param itemClass
	*/
	public static createGridH(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number, itemClass: any): GYLite.GYGridH {

		let gridH = new GYLite.GYGridH(w, h, function (): GYLite.IItemRender {
			return new itemClass();
		}, null);
		gridH.x = x;
		gridH.y = y;
		gridH.rectHit = true;
		gridH.touchEnabled = true;
		pr.addElement(gridH);
		return gridH;
	}
	/**创建纵向网格
	 * @param pr 父级不填则不添加到舞台
	 * @param toX 坐标x 
	 * @param toY 坐标y
	 * @param w 宽度
	 * @param h 高度
	 * @param itemClass
	*/
	public static createGridV(pr: GYLite.GYSprite, x: number, y: number, w: number, h: number, itemClass: any): GYLite.GYGridV {

		let gridV = new GYLite.GYGridV(w, h, function (): GYLite.IItemRender {
			return new itemClass();
		}, null);
		gridV.x = x;
		gridV.y = y;
		gridV.rectHit = true;
		gridV.touchEnabled = true;
		pr.addElement(gridV);
		return gridV;
	}
	public static createProgressBar(pr: GYLite.GYSprite = null, x: number = 0, y: number = 0, w: number = 277, h: number = 27, back: string = null, bar: string = null, alias = null, rect: GYLite.Scale9GridRect = null, barTextFormat: GYLite.TextFormat = null, type: number = NaN): GYLite.GYProgressBar {
		let s = this;
		let prog: GYLite.GYProgressBar;
		let backSp: GYLite.GYScaleSprite;
		let barSp: GYLite.GYScaleSprite;
		// if(barTextFormat == null)barTextFormat = new GYLite.TextFormat(null,20,0xffffff,null,null,null,null,null,"center");
		backSp = new GYLite.GYScaleSprite(back == null ? null : Main.instance.getRes(back, alias), rect)
		barSp = new GYLite.GYScaleSprite(bar == null ? null : Main.instance.getRes(bar, alias), rect);
		prog = new GYLite.GYProgressBar(new GYLite.ProgressBarSkin(backSp, barSp, barTextFormat), type == type ? type : GYLite.GYProgressBar.LEFT_RIGHT)
		prog.x = x;
		prog.y = y;
		prog.width = w;
		prog.height = h;
		prog.barMax = prog.width;
		prog.max = 100;
		prog.value = 1;
		if (barTextFormat) {
			prog.label = prog.value + "/" + prog.max;
			prog.labelDisplay.width = prog.width;
			prog.labelDisplay.y = 5;
		}
		if (rect == null)
			prog.mode = GYLite.ScaleMode.CLIP;
		if (pr) pr.addElement(prog);
		return prog;
	}
	/**创建组合下拉框
	 * @param pr 父级不填则不添加到舞台
	 * @param toX 坐标x 
	 * @param toY 坐标y
	 * @param inputBack 输入框背景
	 * @param menuBack 菜单背景
	 * @param alias 图集
	 * @param scale9Grid 九切片配置
	 * @param comboBtnVec 下拉按钮的数组
	 * @param inputH 输入框高度
	 * @param menuItemClass 自定义菜单项类型
	 * @param menuW 菜单宽度
	 * @param menuH 菜单高度
	*/
	public static createComboBox(pr: GYLite.GYSprite = null, x: number = 0, y: number = 0, inputBack: string = null, menuBack: string = null, alias: string, scale9Grid: GYLite.Scale9GridRect = null, comboBtnVec: Array<string> = null, inputH: number = 30, menuItemClass = null, menuW: number = 50, menuH: number = 92): GYLite.GYComboBox {
		var s = this;
		var gyMenu: GYLite.GYMenu;
		var gyComboBox: GYLite.GYComboBox;
		gyMenu = s.createMenu(null, 0, 0, menuBack, alias, scale9Grid, menuW, menuH, menuItemClass);
		gyMenu.listV.canSelectNum = 1;

		var txt: GYLite.GYTextInput = new GYLite.GYTextInput(new GYLite.TextInputSkin(inputBack ? Main.instance.getRes(inputBack, alias) : null, scale9Grid), false);
		txt.paddingLeft = 5;
		txt.width = gyMenu.listV.width + 5;
		txt.height = inputH;
		txt.textInput.color = 0xff0000;
		txt.paddingTop = 6;
		let vec: Array<egret.Texture> = [
			Main.instance.getRes(comboBtnVec[0], alias),
			comboBtnVec[1] ? Main.instance.getRes(comboBtnVec[1], alias) : null,
			comboBtnVec[2] ? Main.instance.getRes(comboBtnVec[2], alias) : null,
			comboBtnVec[3] ? Main.instance.getRes(comboBtnVec[3], alias) : null,
			comboBtnVec[4] ? Main.instance.getRes(comboBtnVec[4], alias) : null,
			comboBtnVec[5] ? Main.instance.getRes(comboBtnVec[5], alias) : null,
			comboBtnVec[6] ? Main.instance.getRes(comboBtnVec[6], alias) : null,
			comboBtnVec[7] ? Main.instance.getRes(comboBtnVec[7], alias) : null
		];
		gyComboBox = new GYLite.GYComboBox();
		gyComboBox.x = x;
		gyComboBox.y = y;
		gyComboBox.textInput = txt;
		gyComboBox.menu = gyMenu;
		gyComboBox.comboBoxBtn = new GYLite.GYButton(new GYLite.ButtonSkin(vec));
		txt.paddingRight = gyComboBox.comboBoxBtn.width;
		if (pr != null) pr.addElement(gyComboBox);
		return gyComboBox;
	}

	/**创建一个菜单Menu 
	 * @param pr 父级不填则不添加到舞台
	 * @param toX 坐标x 
	 * @param toY 坐标y	 
	 * @param menuBack 菜单背景
	 * @param alias 图集
	 * @param scale9Grid 九切片配置	 
	 * @param itemClass 自定义菜单项类型
	 * @param w 菜单宽度
	 * @param h 菜单高度
	*/
	public static createMenu(pr: GYLite.GYSprite = null, x: number = 0, y: number = 0, menuBack: string = null, alias: string, scale9Grid: GYLite.Scale9GridRect = null, w: number = 50, h: number = 92, itemClass: any = null, padding: number = 5): GYLite.GYMenu {
		var s = this;
		var gyMenu: GYLite.GYMenu;
		gyMenu = new GYLite.GYMenu(new GYLite.MenuSkin(menuBack ? Main.instance.getRes(menuBack, alias) : null, scale9Grid), -5, itemClass ? function (): GYLite.IItemRender {
			return new itemClass();
		} : null);
		gyMenu.listV.width = w;
		gyMenu.listV.height = h;
		gyMenu.listV.paddingLeft = padding;
		gyMenu.listV.paddingTop = padding;
		gyMenu.listV.paddingRight = padding;
		gyMenu.listV.paddingBottom = padding;
		gyMenu.vScroller.right = 10;
		gyMenu.vScroller.height = h;
		if (pr != null) pr.addElement(gyMenu);
		return gyMenu;
	}
	/**创建滑块
	 * @param pr 父级不填则不添加到舞台
	 * @param toX 坐标x 
	 * @param toY 坐标y
	 * @param w 滑轨宽度
	 * @param h 滑轨高度
	 * @param skin 组件皮肤默认null
	 * @param value 初始值 默认0
	 * @param max 最大值 默认100
	*/
	public static createSlider(pr: GYLite.GYSprite = null, x: number = 0, y: number = 0, w: number, h: number, skin: GYLite.ISliderSkin = null, value: number = 0, max: number = 100): GYLite.GYSlider {
		var gySlider: GYLite.GYSlider;
		gySlider = new GYLite.GYSlider(skin, GYLite.GYProgressBar.LEFT_RIGHT);
		gySlider.mode = GYLite.ScaleMode.SCALE;
		gySlider.x = x;
		gySlider.y = y;
		// s.gySlider.min = 30;
		gySlider.max = max;
		gySlider.value = value;
		gySlider.barMax = gySlider.width = w;
		gySlider.height = h;
		gySlider.sliderX = -gySlider.sliderBtn.width >> 1;
		gySlider.sliderY = gySlider.height - gySlider.sliderBtn.height >> 1;
		if (pr != null) pr.addElement(gySlider);
		return gySlider;
	}
	/**获取序列图图集的位图数组
	 * @param aliasArray 图集数组
	*/
	public static getSeqArr(aliasArray: Array<string>): Array<egret.Texture> {
		let i: number, len: number;
		let arr: Array<any>;
		let res: any;
		let ind: number;
		if (aliasArray == null) return null;
		arr = [];
		len = aliasArray.length;
		for (i = 0; i < len; ++i) {
			res = Main.instance.getDataRes(aliasArray[i].replace(".png", ".json"));
			for (var key in res.frames) {
				ind = Number(key);
				arr.push(Main.instance.getRes(ind + "", aliasArray[i]));
			}
		}
		return arr;
	}
}
