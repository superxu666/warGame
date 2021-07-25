
class Tips {
	private static _instance: Tips;
	public static get instance(): Tips {
		if (Tips._instance == null)
			Tips._instance = new Tips;
		return Tips._instance;
	}
	private bigbg: GYLite.GYUIComponent;
	private mainBg: GYLite.GYUIComponent
	private txtbg: GYLite.GYScaleSprite;
	private text: GYLite.GYText;
	private curTween: GYLite.GYTween;
	public constructor() {
		Tips._instance = this;
	}

	public showTip(msg: string, type: number = 0) {
		let s = this
		this.removeNowTip();
		let bgWidth = 446;

		let width = LayerManager.getInstance().topLay.width
		let height = LayerManager.getInstance().topLay.height;
		let topLay = LayerManager.getInstance().topLay

		this.bigbg = new GYLite.GYUIComponent()
		// this.bigbg.width = width
		// this.bigbg.height = height;
		this.bigbg.touchEnabled = true
		topLay.addElement(this.bigbg)
		this.bigbg.addEventListener(egret.TouchEvent.TOUCH_TAP, s.onClickCourse, s);
		type = 1;
		let tipsImg = "tipbackgroup5";
		let tipsAni2 = "tipAni2";
		if (type == 0) {
			tipsImg = "tipbackgroup5";
			tipsAni2 = "tipAni2";
		} else if (type == 1) {
			tipsImg = "tipbackgroup4";
			tipsAni2 = "tipAni";
		}
		// picStr = "tipbackgroup5"
		// type = 0;

		let textbg = SkinManager.createScaleImage(this.bigbg, 0, 0, tipsImg, "tipsImg.png", new GYLite.Scale9GridRect(75, 75, 75, 75));
		this.txtbg = textbg;
		// this.txtbg.scaleX = this.txtbg.scaleY = 0.75
		let text = SkinManager.createText(this.bigbg, 0, 0, msg)
		this.text = text;
		this.text.size = 28;
		this.text.color = 0xffffff;


		let textwidth = this.text.textWidth
		let textheight = this.text.textHeight

		let mainbg = SkinManager.createScaleImage(this.bigbg, 0, 0, tipsAni2, "tipsImg.png");
		// mainbg.scaleX = mainbg.scaleY = 0.75
		mainbg.horizonalCenter = 0;
		mainbg.verticalCenter = -150;

		let fitWidth = textwidth + 185 > bgWidth ? textwidth + 185 : bgWidth
		this.txtbg.width = fitWidth;
		this.text.verticalCenter = 5;
		this.text.horizonalCenter = 0;

		this.txtbg.verticalCenter = 0;
		this.txtbg.horizonalCenter = 0;


		this.bigbg.scaleX = this.bigbg.scaleY = 0.75;
		this.bigbg.verticalCenter = 0;
		this.bigbg.horizonalCenter = 0;
		this.runAnimatian()
	}

	public runAnimatian() {
		this.curTween = GYLite.GYTween.to(this.bigbg, [GYLite.TweenData.getInstance("alpha", 0, NaN, GYLite.GYTween.commonEase)], 500, 3000, this, () => { this.removeNowTip() }, null, null, true, false);
		// GYLite.GYTween.to(this.text, [GYLite.TweenData.getInstance("alpha", 0, NaN, GYLite.GYTween.commonEase)], 2000, 3000, this, () => { this.removeNowTip() });
		// GYLite.GYTween.to(this.text, [GYLite.TweenData.getInstance("alpha", 0, NaN, GYLite.GYTween.commonEase)], 2000, 3000, this, () => { this.removeNowTip() });
	}
	public onClickCourse(e: egret.TouchEvent) {
		let curtag = e.currentTarget
		switch (curtag) {
			case this.bigbg:
				{
					this.removeNowTip()
				}
				break;
		}
	}

	public removeNowTip() {
		if (this.bigbg) {
			if (this.curTween) {
				this.curTween.clear();
				this.curTween = null;
			}
			let parent = <GYLite.GYUIComponent>this.bigbg.parent
			parent.removeElement(this.bigbg)
			this.bigbg = null
		}


	}
}


