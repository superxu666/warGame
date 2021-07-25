class LayerManager {
	private static _instance: LayerManager;
	public static getInstance(): LayerManager {
		if (LayerManager._instance == null) LayerManager._instance = new LayerManager;
		return LayerManager._instance;
	}
		/**普通屏*/public static MODE_COMMON: number = 0;
		/**画中画*/public static MODE_INSCREEN: number = 1;

		/**等比满屏显示全部*/public static SHOWALL: number = 0;
		/**等比全屏拉满*/public static NOBORD: number = 1;
		/**等比宽度拉满*/public static FIX_WIDTH: number = 2;
		/**等比高度拉满*/public static FIX_HEIGHT: number = 3;
		/**无缩放*/public static NO_SCALE: number = 4;

	private _game: GameManager;
	private _stageSp: GYLite.GYUIComponent;
	private _gameSp: GYLite.GYUIComponent;
	private _uiLay: GYLite.GYUIComponent;
	private _topLay: GYLite.GYUIComponent;
	private _backImage: GYLite.GYImage;
	private _screenBack: ScreenBack;
	private _shortcutImage: GYLite.GYImage;
	private _modalShape: GYLite.GYScaleSprite;
	private _maskIsOn: boolean;
	private _model: number;
	private _winScale: number;
	private _win: GYLite.GYUIComponent;
	private _winWidth: number;
	private _winHeight: number;
	private _winX: number;
	private _winY: number;
	private _mode: number;
	private _layoutMode: number;
	/**相对交互区域的坐标系顶满浏览器的rectangle区域*/
	public frameBound: egret.Rectangle;
	/**相对游戏区域的坐标系顶满浏览器的rectangle区域*/
	public stageFrameBound: egret.Rectangle;
	public loadDiv: any;
	public loadDiv2: any;
	private _fixList: Array<any> = [];
	private _renderTexture: egret.RenderTexture;
	// private _drawData:BitmapData;
	public constructor() {
		let s = this;
		s._winX = s._winY = 0;
		s._game = GameManager.getInstance();
		s._mode = s._game.configMgr.screenMode;
		s._layoutMode = s._game.configMgr.layoutMode;
		s.frameBound = new egret.Rectangle(GYLite.GYSprite.stage.stageWidth, GYLite.GYSprite.stage.stageHeight);
		s.stageFrameBound = new egret.Rectangle(GYLite.GYSprite.stage.stageWidth, GYLite.GYSprite.stage.stageHeight);
		s._renderTexture = new egret.RenderTexture;
		s.loadDiv2 = document.getElementById("loading2");
		s.loadDiv = document.getElementById("loading");
	}
	public initLayer(stg: any): void {
		var s = this;
		s._stageSp = new GYLite.GYUIComponent;
		s._win = new GYLite.GYUIComponent;
		s._backImage = new GYLite.GYImage;
		s._shortcutImage = new GYLite.GYImage;		
		s._gameSp = new GYLite.GYUIComponent;
		s._gameSp.width = GameManager.getInstance().stardardWidth;
		s._gameSp.height = GameManager.getInstance().stardardHeight;
		s._gameSp.touchEnabled = true;
		// s._gameSp.scaleX = s._gameSp.scaleY = GameManager.getInstance().gameScale;
		s._stageSp.addElement(s._win);
		
		s._win.addElement(s._backImage);
		s._win.addElement(s._gameSp);
		s._screenBack = new ScreenBack;
		if (egret.is(stg, "egret.Stage")) {
			stg.addChild(s._screenBack);
			stg.addChild(s._shortcutImage);
			// stg.addChild(s._backImage);
			stg.addChild(s._stageSp);
		}
		else {
			stg.addElement(s._screenBack);
			stg.addElement(s._shortcutImage);
			// stg.addElement(s._backImage);
			stg.addElement(s._stageSp);
		}
		// let testBtn:GYLite.GYButton;//测试画中画按钮
		// testBtn = new GYLite.GYButton;
		// testBtn.width = 60;
		// testBtn.height = 30;
		// testBtn.x = s._game.winWidth;
		// testBtn.y = 100;
		// testBtn.label = "画中画";
		// testBtn.setOnClick(function(e:egret.TouchEvent):void{
		// 	if(testBtn.label == "画中画")
		// 	{
		// 		testBtn.label = "全屏";
		// 		s.setWinSize(GYLite.GYSprite.stage.stageWidth,GYLite.GYSprite.stage.stageHeight);
		// 	}
		// 	else{
		// 		testBtn.label = "画中画";
		// 		s.setWinSize(s._game.winWidth,s._game.winHeight);
		// 	}
		// },s);
		// s._stageSp.addElement(testBtn);
		s._uiLay = new GYLite.GYUIComponent;
		s._gameSp.addElement(s._uiLay);		

		let theme: Win7SkinTheme = <Win7SkinTheme>GYLite.GYSprite.skinTheme;
		s._topLay = new GYLite.GYUIComponent;
		s._topLay.touchEnabled = true;
		s._modalShape = new GYLite.GYScaleSprite(Main.instance.getRes("mask", theme.themeName + ".png"), new GYLite.Scale9GridRect(4, 4, 4, 4));
		s._modalShape.visible = false;
		s._modalShape.touchEnabled = true;

		// let g:egret.Graphics = s._modalShape.graphics;
		// g.clear();
		// g.beginFill(0,1);
		// g.drawRect(0,0,10,10);
		// g.endFill();
		// s._topLay.addElement(s._modalShape);
		s._gameSp.addElement(s._topLay);
		s.rectToLocal(s._uiLay, s.frameBound, null, s.frameBound);

		// var b:egret.Bitmap = new egret.Bitmap;
		// this._drawData = b.bitmapData = new egret.BitmapData(GameManager.getInstance().gameWidth,GameManager.getInstance().gameHeight, true, 0);
		// s._gameSp.addChild(b);
		s.setWinSize(s._game.configMgr.winWidth, s._game.configMgr.winHeight, true);
	}
	public setWinPos(x: number, y: number, reset: boolean = false): void {
		let s = this;
		s._win.x = x;
		s._win.y = y;
		s._gameSp.x = s._win.width - s._gameSp.width * s._winScale >> 1;
		s._gameSp.y = s._win.height - s._gameSp.height * s._winScale >> 1;
		if (reset) {
			s._winX = x;
			s._winY = y;
		}
	}
	public setWinSize(w: number, h: number, reset: boolean = false): void {
		let s = this;
		let sclX: number, sclY: number;
		let game: GameManager = GameManager.getInstance();
		s._gameSp.width = game.stardardWidth;
		s._gameSp.height = game.stardardHeight;
		sclX = w / game.stardardWidth;
		sclY = h / game.stardardHeight;
		if (s._layoutMode == LayerManager.FIX_WIDTH)
			s._winScale = sclX;
		else if (s._layoutMode == LayerManager.FIX_HEIGHT)
			s._winScale = sclY;
		else if (s._layoutMode == LayerManager.NOBORD)
			s._winScale = sclX > sclY ? sclX : sclY;
		else if (s._layoutMode == LayerManager.SHOWALL)
			s._winScale = sclX < sclY ? sclX : sclY;
		else
			s._winScale = 1;
		s._win.width = w;
		s._win.height = h;
		s._backImage.width = w;
		s._backImage.height = h;
		// s._backImage.x = s.gameLeft;
		// s._backImage.y = s.gameTop;
		if (s._mode == LayerManager.MODE_INSCREEN) {
			s._win.scrollRect = new egret.Rectangle(0, 0, w, h);
		}
		else
			s._win.scrollRect = null;
		if (reset) {
			s._winWidth = w;
			s._winHeight = h;
		}

		//居中布局
		s._gameSp.scaleX = s._gameSp.scaleY = s._winScale;
		s._gameSp.x = w - s._gameSp.width * s._winScale >> 1;
		s._gameSp.y = h - s._gameSp.height * s._winScale >> 1;
		s._topLay.width = s._gameSp.width;
		s._topLay.height = s._gameSp.height;
		s._uiLay.width = s._gameSp.width;
		s._uiLay.height = s._gameSp.height;
		//计算游戏区域的坐标系，满屏的宽高Rectangle			
		s.frameBound.x = 0;
		s.frameBound.y = 0;
		s.frameBound.width = w;
		s.frameBound.height = h;
		s.rectToLocal(s._uiLay, s.frameBound, s._win, s.frameBound);
	}

	public resize(w: number, h: number, offsetX: number = 0, offsetY: number = 0): void {
		var s = this;
		let game: GameManager = GameManager.getInstance();
		let scl: number = game.gameScale;
		s._stageSp.width = game.stardardWidth;
		s._stageSp.height = game.stardardHeight;
		s._stageSp.scaleX = s._stageSp.scaleY = scl;
		//背景拉伸顶满
		s._screenBack.width = game.gameWidth;
		s._screenBack.height = game.gameHeight;
		s._stageSp.x = offsetX + (w - s._stageSp.width * scl >> 1);
		s._stageSp.y = offsetY + (h - s._stageSp.height * scl >> 1);
		//计算游戏区域的坐标系，满屏的宽高Rectangle
		s.stageFrameBound.x = offsetX;
		s.stageFrameBound.y = offsetY;
		s.stageFrameBound.width = w;
		s.stageFrameBound.height = h;
		s.rectToLocal(s._stageSp, s.stageFrameBound, GYLite.GYSprite.stage, s.stageFrameBound);
		if (s._mode == LayerManager.MODE_COMMON) {
			s.setWinSize(s.stageFrameBound.width, s.stageFrameBound.height);
			s.setWinPos(s.stageFrameBound.x, s.stageFrameBound.y);
			// s.setWinSize(s._stageSp.width,s._stageSp.height);
		}
		else {
			s.setWinSize(s._winWidth, s._winHeight);
			s.setWinPos(s._winX, s._winY);
		}
		if (s._maskIsOn)
			s.setTopMask(true, s._modalShape.alpha, (<GYLite.GYSprite>s._modalShape.parent).getElementIndex(s._modalShape), s._model);
		UIControl.getInstance().resize(s._win.width, s._win.height);
		let i: number, len: number;
		len = s._fixList.length;
		for (i = 0; i < len; i += 2) {
			s.fixLayout(s._fixList[i], s._fixList[i + 1]);
		}
	}
	/**监听浏览器变化，相对浏览器固定布局, 当l r t b 均为NaN相当于移除监听，避免其他组件的约束布局的干扰，清把其他布局约束清除
	 * @param l 左
	 * @param r 右,使用screenMode非noscale时，此参数作为宽度
	 * @param t 上
	 * @param b 下，使用screenMode非noscale时，此参数作为高度
	 * @param fixParent 相对的父级布局容器
	 * @param screenMode 布局模式 参考LayerManager常量
	 * @param preMulScale 预乘容器本身的缩放值，由于容器缩放会影响子级的布局，所以可以对拉伸结果的宽高进行缩放预乘
	*/
	public fixListen(display: egret.DisplayObject, l: number = NaN, r: number = NaN, t: number = NaN, b: number = NaN, fixParent: egret.DisplayObjectContainer = null, screenMode: number = 4, preMulScale: boolean = false): any {
		let s = this;
		let ind: number;
		ind = s._fixList.indexOf(display);
		if (l != l && r != r && t != t && b != b) {
			if (ind > -1) {
				s._fixList.splice(ind, 2);
				return null;
			}
		}
		let fixObj: any;
		if (ind == -1) {
			fixObj = { left: l, right: r, top: t, bottom: b, fixParent: fixParent, screenMode: screenMode, preMulScale: preMulScale };
			s._fixList.push(display, fixObj);
			s.fixLayout(display, fixObj);
		}
		else {
			fixObj = s._fixList[ind + 1];
			fixObj.left = l;
			fixObj.right = r;
			fixObj.top = t;
			fixObj.bottom = b;
			fixObj.fixParent = fixParent;
			fixObj.screenMode = screenMode;
			s.fixLayout(display, fixObj);
		}
		return fixObj;
	}
	public fixLayout(display: egret.DisplayObject, layoutObj: any): void {
		let s = this;
		let pt1: egret.Point, pt2: egret.Point;
		if (display.stage == null) {
			// Log.writeLog(MultiLang.str38,Log.WARN);
			return;
		}
		let tx: number, ty: number, r: number, b: number;
		let fixPrW: number, fixPrH: number;
		let fixParent: egret.DisplayObjectContainer;
		if (GYLite.GYSprite.stage == layoutObj.fixParent) {
			fixParent = GYLite.GYSprite.stage;
			fixPrW = s._game.gameWidth;
			fixPrH = s._game.gameHeight;
		}
		else if (layoutObj.fixParent) {
			fixParent = layoutObj.fixParent;
			fixPrW = layoutObj.fixParent.width;
			fixPrH = layoutObj.fixParent.height;
		}
		else {
			fixParent = s._win;
			fixPrW = s._win.width;
			fixPrH = s._win.height;
		}

		if (layoutObj.screenMode == LayerManager.NO_SCALE || layoutObj.screenMode == null) {
			tx = layoutObj.left;
			ty = layoutObj.top;
			r = fixPrW - layoutObj.right;
			b = fixPrH - layoutObj.bottom;
			GYLite.GYSprite._pt.x = tx == tx ? tx : 0;
			GYLite.GYSprite._pt.y = ty == ty ? ty : 0;
			pt1 = s.pointToLocal(display.parent, GYLite.GYSprite._pt, fixParent);
			GYLite.GYSprite._pt.x = r == r ? r : 0;
			GYLite.GYSprite._pt.y = b == b ? b : 0;
			pt2 = s.pointToLocal(display.parent, GYLite.GYSprite._pt, fixParent);
			if (tx == tx && r == r) {
				display.x = pt1.x;
				display.width = pt2.x - pt1.x;
				if (layoutObj.preMulScale)
					display.width /= display.scaleX;
			}
			else {
				if (tx == tx)
					display.x = pt1.x;
				else if (r == r)
					display.x = pt2.x - display.width;
			}

			if (ty == ty && b == b) {
				display.y = pt1.y;
				display.height = pt2.y - pt1.y;
				if (layoutObj.preMulScale)
					display.height /= display.scaleY;
			}
			else {
				if (ty == ty)
					display.y = pt1.y;
				else if (b == b)
					display.y = pt2.y - display.height;
			}
		}
		else {
			let sclX: number, sclY: number;
			let stW: number, stH: number, w: number, h: number, displayScale: number;
			w = layoutObj.right;
			h = layoutObj.bottom;
			stW = fixPrW;
			stH = fixPrH;
			sclX = stW / w;
			sclY = stH / h;
			if (layoutObj.screenMode == LayerManager.FIX_WIDTH)
				displayScale = sclX;
			else if (layoutObj.screenMode == LayerManager.FIX_HEIGHT)
				displayScale = sclY;
			else if (layoutObj.screenMode == LayerManager.NOBORD)
				displayScale = sclX > sclY ? sclX : sclY;
			else if (layoutObj.screenMode == LayerManager.SHOWALL)
				displayScale = sclX < sclY ? sclX : sclY;
			else
				displayScale = 1;
			GYLite.GYSprite._pt.x = (stW - w * displayScale >> 1);
			GYLite.GYSprite._pt.y = (stH - h * displayScale >> 1);
			pt1 = s.pointToLocal(display.parent, GYLite.GYSprite._pt, fixParent);
			GYLite.GYSprite._pt.x = GYLite.GYSprite._pt.x + w * displayScale;
			GYLite.GYSprite._pt.y = GYLite.GYSprite._pt.y + h * displayScale;
			pt2 = s.pointToLocal(display.parent, GYLite.GYSprite._pt, fixParent);
			display.x = pt1.x;
			display.y = pt1.y;
			display.scaleX = display.scaleY = (pt2.x - pt1.x) / w;
		}
	}
	/**清理已经销毁对象的fix进行垃圾回收*/
	public gc():void
	{let len:number;
		len = LayerManager.getInstance()._fixList.length;
		while(--len>-1)
		{
			if(LayerManager.getInstance()._fixList[len].disposed)
				LayerManager.getInstance()._fixList.splice(len,2);
		}
	}
	public getFixData(val: any): any {
		let s = this;
		let len: number;
		len = s._fixList.length;
		while (--len > -1) {
			if (s._fixList[len] == val)
				return s._fixList[len];
		}
		return null;
	}
	/*** 灰幕覆盖底部
	 * @param 是否打开
	 * @param alpha 透明度
	 * @param layerIndex 模态内的层级 默认-1，顶层
	 * @param model 选择模态的分层 默认0 最顶层容器，1 ui层
	*/
	public setTopMask(val: boolean, alpha: number = 0.5, layerIndex: number = -1, model: number = 0): void {
		let s = this;
		s._maskIsOn = val;
		s._modalShape.visible = val;
		s._model = model;
		let pr: GYLite.GYSprite;
		if (model == 1)
			pr = s._uiLay;
		else
			pr = s._topLay;
		if (val) {
			s._modalShape.alpha = alpha;
			s._modalShape.x = s.frameBound.x;
			s._modalShape.y = s.frameBound.y;
			s._modalShape.width = s.frameBound.width;
			s._modalShape.height = s.frameBound.height;
			if (s._modalShape.parent == null) {
				if (layerIndex == -1)
					pr.addElement(s._modalShape);
				else
					pr.addElementAt(s._modalShape, layerIndex);
			}
			else {
				if (layerIndex == -1)
					return;
				pr.addElementAt(s._modalShape, layerIndex);
			}

		}
		else {
			if (s._modalShape.parent)
				(<GYLite.GYSprite>s._modalShape.parent).removeElement(s._modalShape);
		}

	}

	public getModalShape() {
		let s = this;
		if (s._modalShape && s._modalShape.parent) {
			return s._modalShape;
		}
	}

	public removeLoadingUI(): void {
		let s = this;
		if (s.loadDiv2 && s.loadDiv2.parentNode)
			s.loadDiv2.parentNode.removeChild(s.loadDiv2);
		// s.setDivBackVis(false);			
	}
	public addLoadingUI(): void {
		let s = this;
		s.setDivBackVis(true);
		if (s.loadDiv2 && s.loadDiv2.parentNode == null) {
			s.loadDiv.appendChild(s.loadDiv2);
			s.loadDiv.style.zIndex = 0;
		}
	}
	public setDivBackVis(val: boolean): void {
		let s = this;
		// s.loadDiv.style.visibility = val?"visible":"hidden";
	}
	/**游戏交互区域距离浏览器左边的距离，win子窗口的适配*/
	public get gameLeft(): number {
		return this.win.x;
	}
	/**游戏交互区域距离浏览器上边的距离，win子窗口的适配*/
	public get gameTop(): number {
		return this.win.y;
	}	
	/**游戏交互窗口宽度*/
	public get winWidth(): number {
		return this._winWidth;
	}
	/**游戏交互窗口宽度*/
	public get winHeight(): number {
		return this._winHeight;
	}
	/**子窗口的舞台交互区域距离子窗口win的左边的距离，gameSp子窗口舞台的适配*/
	public get gameSpriteLeft(): number {
		return this.gameSp.x;
	}
	/**子窗口的舞台交互区域距离子窗口win的上边的距离，gameSp子窗口舞台的适配*/
	public get gameSpriteTop(): number {
		return this.gameSp.y;
	}
	/**子窗口的舞台交互区域的宽度，gameSp的高度*/
	public get gameSpriteWidth(): number {
		return this.gameSp.width;
	}
	/**子窗口的舞台交互区的高度，gameSp的高度*/
	public get gameSpriteHeight(): number {
		return this.gameSp.height;
	}

	/***把浏览器坐标系转至本地矩形
	 * @param pr 本地对象
	 * @param 全局Point	 
	 * @param pr2 point所属的坐标系对象 如果是null，则认为是gameSp
	 * @param result 返回的Point，不填则生产新的
	 * @return Point
	*/
	public pointToLocal(pr: egret.DisplayObject, pt: egret.Point, pr2: egret.DisplayObject = null, result: egret.Point = null): egret.Point {
		let p: egret.Point, p2: egret.Point;
		if (pr2 == null)
			pr2 = GYLite.GYSprite.stage;
		p = pr2.localToGlobal(pt.x, pt.y);
		p = pr.globalToLocal(p.x, p.y);
		if (result == null)
			result = new egret.Point;
		result.x = p.x;
		result.y = p.y;
		return result;
	}
	/***把坐标系转至本地矩形
	 * @param pr 本地对象
	 * @param 全局rect		 
	 * @param pr2 rect所属的坐标系对象 如果是null，则认为是stage
	 * @param result 返回的rect，不填则生产新的
	 * @return rect
	*/
	public rectToLocal(pr: egret.DisplayObject, rect: egret.Rectangle, pr2: egret.DisplayObject = null, result: egret.Rectangle = null): egret.Rectangle {
		let s = this;
		let p: egret.Point, p2: egret.Point;
		if (pr2 == null)
			pr2 = GYLite.GYSprite.stage;
		p = pr2.localToGlobal(rect.x, rect.y);
		p2 = pr2.localToGlobal(rect.right, rect.bottom);
		p = pr.globalToLocal(p.x, p.y);
		p2 = pr.globalToLocal(p2.x, p2.y);
		if (result == null)
			result = new egret.Rectangle;
		result.x = p.x;
		result.y = p.y;
		result.width = p2.x - p.x;
		result.height = p2.y - p.y;
		return result;
	}
	/***把游戏交互区域全局坐标转为本地坐标
	 * @param pr 本地显示对象
	 * @param tx 坐标x
	 * @param ty 坐标y
	 * @return 返回本地坐标
	*/
	public topToLocal(pr: egret.DisplayObject, tx: number, ty: number): egret.Point {
		let s = this;
		let p: egret.Point = s._topLay.localToGlobal(tx, ty);
		pr.globalToLocal(p.x, p.y, p);
		return p;
	}
	/***把本地坐标转为游戏交互区域topSp全局坐标 
	 * @param pr 本地显示对象
	 * @param tx 坐标x
	 * @param ty 坐标y
	 * @return 返回游戏交互区域坐标
	*/
	public localToTop(pr: egret.DisplayObject, tx: number, ty: number): egret.Point {
		let p: egret.Point = pr.localToGlobal(tx, ty);
		let s = this;
		s._topLay.globalToLocal(p.x, p.y, p);
		return p;
	}
	/***把游戏交互区域topSp全局坐标转为本地坐标 
	 * @param pr 本地显示对象
	 * @param tx 游戏交互区域坐标x
	 * @param ty 游戏交互区域坐标y
	 * @return 返回全局坐标
	*/
	public topToGlobal(pr: egret.DisplayObject, tx: number, ty: number): egret.Point {
		let s = this;
		let p: egret.Point = s._topLay.localToGlobal(tx, ty);
		pr.globalToLocal(p.x, p.y, p);
		return p;
	}
	/***把本地矩形转至浏览器坐标系
	 * @param pr 本地对象
	 * @param 本地rect
	 * @param result 返回的rect，不填则生产新的
	 * @return rect
	*/
	public localRectToGlobal(pr: egret.DisplayObject, rect: egret.Rectangle, result: egret.Rectangle = null): egret.Rectangle {
		let p: egret.Point, p2: egret.Point;
		p = pr.localToGlobal(rect.x, rect.y);
		p2 = pr.localToGlobal(rect.right, rect.bottom);
		if (result == null)
			result = new egret.Rectangle;
		result.x = p.x;
		result.y = p.y;
		result.width = p2.x - p.x;
		result.height = p2.y - p.y;
		return result;
	}
	/***把浏览器坐标系转至本地矩形
	 * @param pr 本地对象
	 * @param 全局rect		 
	 * @param result 返回的rect，不填则生产新的
	 * @return rect
	*/
	public globalRectToLocal(pr: egret.DisplayObject, rect: egret.Rectangle, result: egret.Rectangle = null): egret.Rectangle {
		let p: egret.Point, p2: egret.Point;
		p = pr.globalToLocal(rect.x, rect.y);
		p2 = pr.globalToLocal(rect.right, rect.bottom);
		if (result == null)
			result = new egret.Rectangle;
		result.x = p.x;
		result.y = p.y;
		result.width = p2.x - p.x;
		result.height = p2.y - p.y;
		return result;
	}
	/***把浏览器坐标系转至本地矩形
	 * @param pr 本地对象
	 * @param 全局Point	 
	 * @param result 返回的Point，不填则生产新的
	 * @return Point
	*/
	public globalPointToLocal(pr: egret.DisplayObject, pt: egret.Point, result: egret.Point = null): egret.Point {
		let p: egret.Point, p2: egret.Point;
		p = pr.globalToLocal(pt.x, pt.y);
		if (result == null)
			result = new egret.Point;
		result.x = p.x;
		result.y = p.y;
		return result;
	}
	/***把本地坐标转至浏览器坐标系
	 * @param pr 本地对象
	 * @param 本地Point
	 * @param result 返回的Point，不填则生产新的
	 * @return Point
	*/
	public localPointToGlobal(pr: egret.DisplayObject, pt: egret.Point, result: egret.Point = null): egret.Point {
		let p: egret.Point, p2: egret.Point;
		p = pr.localToGlobal(pt.x, pt.y);
		if (result == null)
			result = new egret.Point;
		result.x = p.x;
		result.y = p.y;
		return result;
	}
	/***把disObjA的坐标系转到disObjB的坐标系
	 * @param disObjA 本地对象
	 * @param p1x 坐标x
	 * @param p2y 坐标y
	 * @param disObjB 新坐标系
	*/
	public localAPointToB(disObjA: egret.DisplayObject, p1x: number, p1y: number, disObjB: egret.DisplayObject = null): egret.Point {
		let p: egret.Point, p2: egret.Point;
		p = disObjA.localToGlobal(p1x, p1y);
		if (disObjB)
			disObjB.globalToLocal(p.x, p.y, p);
		return p;
	}

	public get uiLay(): GYLite.GYUIComponent {
		var s = this;
		return s._uiLay;
	}

	public get stageSp(): GYLite.GYUIComponent {
		var s = this;
		return s._stageSp;
	}

	public get topLay(): GYLite.GYUIComponent {
		var s = this;
		return s._topLay;
	}
	public get screenBack(): ScreenBack {
		return this._screenBack;
	}
	public setBackground(color: number, alpha: number): void {
		let s = this;
		s._screenBack.setBackground(color, alpha);
	}

	public get backImage(): egret.Texture {
		return this._backImage.source;
	}

	public set backImage(val: egret.Texture) {
		this._backImage.source = val;
	}
	private _localBArr: number[] = [];
	/**判断轮廓是否相交
	 * @param disObjA 轮廓对象A
	 * @param disObjB 轮廓对象B
	 * @param includeOther 是否把包含状态也视为相交
	 * @param hitFlag 碰撞检测标志 1 矩形检测 2 轮廓检测 3 矩形和轮廓都检测
	 * @return 是否相交
	*/
	public isOutlineHit(disObjA: IOutline, disObjB: IOutline, includeOther: boolean = true, hitFlag: number = 3): boolean {
		let arr1: number[], arr2: number[], rect1Arr: number[], rect2Arr: number[];
		let i: number, len: number, j: number, len2: number;
		let nextInd1: number, nextInd2: number;
		let ap: egret.Point, bp: egret.Point;
		let localX: number, localY: number, localX2: number, localY2: number;
		let m: egret.Matrix;
		let flag: boolean, includeFlag;
		let s = this;

		if (hitFlag & 1) {
			if (disObjB.rectOutline && disObjA.rectOutline) {
				s._localBArr.length = 0;
				rect1Arr = disObjA.getGlobalRectOutline();
				rect2Arr = disObjB.rectOutline;
				len = rect1Arr.length;
				for (i = 0; i < len; i += 2) {
					m = (<egret.DisplayObject><any>disObjB).$getInvertedConcatenatedMatrix();
					s._localBArr[i] = m.a * rect1Arr[i] + m.c * rect1Arr[i + 1] + m.tx;
					s._localBArr[i + 1] = m.b * rect1Arr[i] + m.d * rect1Arr[i + 1] + m.ty;
				}
				rect2Arr = disObjB.rectOutline;
				len = s._localBArr.length;
				for (i = 0; i < len; i += 2) {
					nextInd1 = i + 2 >= s._localBArr.length ? 0 : i + 2;
					len2 = rect2Arr.length;
					for (j = 0; j < len2; j += 2) {
						nextInd2 = j + 2 >= rect2Arr.length ? 0 : j + 2;
						if (GYLite.PositionUtil.intersect(s._localBArr[i], s._localBArr[i + 1], s._localBArr[nextInd1], s._localBArr[nextInd1 + 1], rect2Arr[j], rect2Arr[j + 1], rect2Arr[nextInd2], rect2Arr[nextInd2 + 1])) {
							flag = true;
						}

					}
				}
				includeFlag = false;
				if (includeOther) {
					if (GYLite.PositionUtil.isPointInShape(s._localBArr[0], s._localBArr[1], rect2Arr)) {
						includeFlag = true;
					}
					if (GYLite.PositionUtil.isPointInShape(rect2Arr[0], rect2Arr[1], s._localBArr)) {
						includeFlag = true;
					}
				}

				if (hitFlag & 2) {//存在轮廓检测
					if (!flag && !includeFlag)
						return false;
				}
				else {//不存在轮廓检测
					return flag || includeFlag;
				}
			}

		}

		if (hitFlag & 2) {
			flag = includeFlag = false;
			s._localBArr.length = 0;
			arr1 = disObjA.getGlobalOutline();
			len = arr1.length;
			for (i = 0; i < len; i += 2) {
				m = (<egret.DisplayObject><any>disObjB).$getInvertedConcatenatedMatrix();
				s._localBArr[i] = m.a * arr1[i] + m.c * arr1[i + 1] + m.tx;
				s._localBArr[i + 1] = m.b * arr1[i] + m.d * arr1[i + 1] + m.ty;
			}
			arr2 = disObjB.outline;
			len = s._localBArr.length;
			for (i = 0; i < len; i += 2) {
				nextInd1 = i + 2 >= s._localBArr.length ? 0 : i + 2;
				len2 = arr2.length;
				for (j = 0; j < len2; j += 2) {
					nextInd2 = j + 2 >= arr2.length ? 0 : j + 2;
					if (GYLite.PositionUtil.intersect(s._localBArr[i], s._localBArr[i + 1], s._localBArr[nextInd1], s._localBArr[nextInd1 + 1], arr2[j], arr2[j + 1], arr2[nextInd2], arr2[nextInd2 + 1])) {
						flag = true;
					}

				}
			}
			if (includeOther) {
				if (GYLite.PositionUtil.isPointInShape(s._localBArr[0], s._localBArr[1], arr2)) {
					includeFlag = true;
				}
				if (GYLite.PositionUtil.isPointInShape(arr2[0], arr2[1], s._localBArr)) {
					includeFlag = true;
				}
			}
			return flag || includeFlag;
		}

		return false;
	}
	/**判断disObjA和disObjB是否相交(不同父级也能判断)*/
	public isHit(disObjA: egret.DisplayObject, disObjB: egret.DisplayObject): boolean {
		let s = this;
		let p1Pos: egret.Point, p2Pos: egret.Point, p1Size: egret.Point, p2Size: egret.Point;
		p1Pos = disObjA.localToGlobal(0, 0);
		p1Size = disObjA.localToGlobal(disObjA.width, disObjA.height);
		p2Pos = disObjB.localToGlobal(0, 0);
		p2Size = disObjB.localToGlobal(disObjB.width, disObjB.height);
		if (p1Pos.x > p2Size.x || p1Size.x < p2Pos.x || p1Size.y < p2Pos.y || p1Pos.y > p2Size.y)
			return false;
		return true;
	}
	/**判断rectA和rectB是否相交
	 * @param disObjA 所属坐标系
	 * @param rectA 矩形
	 * @param disObjB 所属坐标系
	 * @param rectB 矩形
	*/
	public isRectHitRect(disObjA: egret.DisplayObject, rectA: egret.Rectangle, disObjB: egret.DisplayObject, rectB: egret.Rectangle): boolean {
		let s = this;
		let p1Pos: egret.Point, p2Pos: egret.Point, p1Size: egret.Point, p2Size: egret.Point;
		p1Pos = disObjA.localToGlobal(rectA.left, rectA.top);
		p1Size = disObjA.localToGlobal(rectA.right, rectA.bottom);
		p2Pos = disObjB.localToGlobal(rectB.left, rectB.top);
		p2Size = disObjB.localToGlobal(rectB.right, rectB.bottom);
		if (p1Pos.x > p2Size.x || p1Size.x < p2Pos.x || p1Size.y < p2Pos.y || p1Pos.y > p2Size.y)
			return false;
		return true;
	}
	/**是否rect碰撞到坐标点
	 * @param disObjA 碰撞的对象
	 * @param rect 矩形
	 * @param disObjB 碰撞对象的坐标系，null则为stage
	 * @param p1x 相对disObjB的坐标x
	 * @param p1y 相对disObjB的坐标y		 
	 * **/
	public isRectHitPoint(disObjA: egret.DisplayObject, rect: egret.Rectangle, disObjB: egret.DisplayObject = null, p1x: number = 0, p1y: number = 0): boolean {
		let s = this;
		let p1Pos: egret.Point, p2Pos: egret.Point, p1Size: egret.Point;
		p1Pos = disObjA.localToGlobal(rect.left, rect.top);
		p1Size = disObjA.localToGlobal(rect.right, rect.bottom);
		p2Pos = disObjB.localToGlobal(p1x, p1y);
		if (p2Pos.x > p1Size.x || p2Pos.x < p1Pos.x || p1Size.y < p2Pos.y || p1Pos.y > p2Pos.y)
			return false;
		return true;
	}
	/**是否坐标点碰撞到disObjA
	 * @param disObjA 碰撞的对象
	 * @param p1x 相对disObjB的坐标x
	 * @param p1y 相对disObjB的坐标y
	 * @param disObjB 碰撞对象的坐标系，null则为stage
	 * **/
	public isHitPoint(disObjA: egret.DisplayObject, p1x: number, p1y: number, disObjB: egret.DisplayObject = null): boolean {
		let s = this;
		let p1Pos: egret.Point, p2Pos: egret.Point, p1Size: egret.Point;
		p1Pos = disObjA.localToGlobal(0, 0);
		p1Size = disObjA.localToGlobal(disObjA.width, disObjA.height);
		if (disObjB == GYLite.GYSprite.stage || disObjB == null) {
			if (p1x > p1Size.x || p1x < p1Pos.x || p1y < p1Pos.y || p1y > p1Size.y)
				return false;
		}
		else {
			p2Pos = disObjB.localToGlobal(p1x, p1y);
			if (p2Pos.x > p1Size.x || p2Pos.x < p1Pos.x || p2Pos.y < p1Pos.y || p2Pos.y > p1Size.y)
				return false;
		}
		return true;
	}
	/**等比缩放
	 * @param 显示对象
	 * @param 放置外框宽度
	 * @param 放置外框高度
	 * @param 放置的坐标x
	 * @param 放置的坐标y
	*/
	public sizeSet(img: GYLite.GYSprite, w: number, h: number, toX: number, toY: number, maxBorder: boolean = false): void {
		let sclX: number, sclY: number, scl: number;
		sclX = w / img.width;
		sclY = h / img.height;
		if (maxBorder)
			scl = sclX > sclY ? sclX : sclY;
		else
			scl = sclX < sclY ? sclX : sclY;
		img.scaleX = img.scaleY = scl;
		img.x = toX + (w - img.width * scl >> 1);
		img.y = toY + (h - img.height * scl >> 1);
	}

	// public setBackground(s:BitmapData):void
	// { var s =this;
	// 	s._backgroundLay.setBackground(s,GameManager.getInstance().gameWidth, GameManager.getInstance().gameHeight);
	// }

	// public setBackgroundByCfg(cfg:Object):void
	// { var s =this;
	// 	s._backgroundLay.setBackground(ResourceConfig.getBmpByCfg(cfg),GameManager.getInstance().gameWidth, GameManager.getInstance().gameHeight);
	// 	s._backgroundLay.setMove(cfg.backMoveSpeed==null?GameDefault.BACKMOVEs._SPEED:cfg.backMoveSpeed);
	// 	s._backgroundLay.setScaleMode(cfg.backgroundType==null?GameDefault.BACKGROUNDs._TYPE:cfg.backgroundType);
	// }
	// public setBackgroundMove(mapX:Number):void
	// { var s =this;
	// 	s._backgroundLay.move(mapX);
	// }
	/**屏幕显示模式 0 普通模式 1画中画模式*/
	public get mode(): number {
		return this._mode;
	}
	public set mode(val: number) {
		let s = this;
		s._mode = val;
		s.resize(GameManager.getInstance().stageWidth, GameManager.getInstance().stageHeight);
	}
	/**适配模式 参考LayerManager常量 如SHOWALL*/
	public get layoutMode(): number {
		return this._layoutMode;
	}
	public set layoutMode(val: number) {
		let s = this;
		s._layoutMode = val;
		s.resize(GameManager.getInstance().stageWidth, GameManager.getInstance().stageHeight);
	}
	public get gameSp(): GYLite.GYUIComponent {
		var s = this;
		return s._gameSp;
	}
	/**窗口*/
	public get win(): GYLite.GYUIComponent {
		return this._win;
	}
	/**窗口缩放值*/
	public get winScale(): number {
		return this._winScale;
	}

	public lockStage(val: boolean): void {
		let s = this;
		s._gameSp.touchEnabled = s._gameSp.touchChildren = !val;
	}
	public isStageLock(): boolean {
		return !this._gameSp.touchEnabled;
	}
	/**销毁舞台上其他的UI*/
	public disposeOthers(): void {
		let s = this;
		let len: number;
		let display: egret.DisplayObject;
		let arr: egret.DisplayObject[] = GYLite.GYSprite.stage.$children.concat();
		len = arr.length;
		while (--len > -1) {
			display = arr[len];
			if (display == Main.instance.parent || display == Main.instance || display == s._shortcutImage || display == s._screenBack || display == s._stageSp) continue;
			if (display.parent) {
				display.parent.removeChild(display);
			}
			if (display["dispose"] != null)
				display["dispose"]();
		}
	}
	/**清除顶层容器的内容*/
	public clearTopLay(): void {
		let s = this;
		let len: number;
		let sp: IUI;
		let arr: Array<GYLite.IGYDisplay>;
		arr = s._topLay.getElementList().concat();
		len = arr.length;
		while (--len > -1) {
			sp = <any>arr[len];
			if (sp.libType != null && sp.libType != "main") {
				sp.hide();
			}
		}
	}
	/**清除截屏界面区*/
	public clearShortcut(clearBackImg:boolean = false): void {
		let s = this;
		s._shortcutImage.source = null;
		if(clearBackImg)
		{
			if(s.backImage)
			{
				s.backImage.dispose();
				s.backImage = null;
			}
		}
	}
	/**截屏界面区*/
	public shortcut(): void {
		let s = this;
		if (s._uiLay.numElement == 1) return;
		s._renderTexture.drawToTexture(GYLite.GYSprite.stage, new egret.Rectangle(0, 0, GYLite.GYSprite.stage.stageWidth, GYLite.GYSprite.stage.stageHeight));
		// s.backImage = s._renderTexture;
		s._shortcutImage.source = s._renderTexture;
		// if(GYLite.GYSprite.stage.scaleMode != egret.StageScaleMode.NO_SCALE)
		// {
		// 	s._backImage.width = NaN;
		// 	s._backImage.height = NaN;
		// }
	}
	/**截屏返回base64界面区
	 * @param display 显示对象 不填则认为是UI层
	 * @param scale 缩放值
	 * @param rect 裁切框
	 * @param encoderOptions 压缩参数
	*/
	public shortcutBase64(display: egret.Sprite = null, scale: number = 0.5, rect?: egret.Rectangle, encoderOptions?): string {
		let s = this;
		if (display == null)
			display = s.uiLay;
		s._renderTexture.drawToTexture(display, rect, scale);
		let base64: string;
		try {
			base64 = s._renderTexture.toDataURL("image/png", rect, encoderOptions);
			return base64;
		}
		catch (e) {
			return null;
		}
	}
}
class ScreenBack extends GYLite.GYSprite {
	constructor() {
		super();
		let s = this;
		s.touchEnabled = true;
		s.setBackground(-1);
	}
	public setBackground(color: number, alpha: number = 1): void {
		let s = this;
		let g: egret.Graphics = this.graphics;
		g.clear();
		if (color == -1) {
			s.visible = false;
			return;
		}
		s.visible = true;
		g.beginFill(color, alpha);
		g.drawRect(0, 0, 100, 100);
		g.endFill();
	}

	public set width(val: number) {
		var s = this;
		if (s._width == val)
			return;
		s._width = val;
		s.scaleX = s._width != s._width ? 1 : s._width / 100;
	}
	public get width(): number {
		var s = this;
		if (s._width == s._width)
			return s._width;
		return egret.superGetter(ScreenBack, s, "width");
	}
	public set height(val: number) {
		var s = this;
		if (s._height == val)
			return;
		s._height = val;
		s.scaleY = s._height != s._height ? 1 : s._height / 100;
	}
	public get height(): number {
		var s = this;
		if (s._height == s._height)
			return s._height;
		return egret.superGetter(ScreenBack, s, "height");
	}
}