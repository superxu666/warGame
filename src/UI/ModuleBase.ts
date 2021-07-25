class ModuleBase extends GYLite.GYUIComponent {
	/**模块打包的文件类型，参考FileType类*/public fileType: number;
	/**模块打包的文件ID分类，参考FileID类*/public fileID: string;
	public uiPath: string;
	public uiID: string;
	public url: string;
	public uiData: UICtrlData;
	protected _baseData: any;	
	protected _screenMode: number;
	protected _moduleScale: number;
	protected _designWidth: number;
	protected _designHeight: number;
	protected _designScale:number;
	protected _designMaxRatio:number;
	protected _designMinRatio:number;
	protected _costCount:number;
	public constructor() {
		super();
		let s = this;
		s._costCount = 0;
		s._designScale = 1;
		s._screenMode = s._designHeight = s._designWidth = NaN;
		s.width = GameManager.getInstance().stardardWidth;
		s.height = GameManager.getInstance().stardardHeight;		
		this.modulePreStart();
	}
	/**重新适配模块
	 * @param w 模块的设计尺寸 宽度
	 * @param h 模块的设计尺寸 高度
	 * @param screenMode 适配方案参考LayerManager常量
	 * @param maxRatio 最宽的比例限制 默认NaN 无限制
	 * @param minRatio 最窄尺寸限制 默认0.75 4比3限制
	 * @param scale 设计的缩放比例，方便适配不同大小设备，前提是内容需要做成相对布局，否则会定位超出屏幕范围
	*/
	public resetSize(w: number, h: number, screenMode: number, maxRatio: number = NaN, minRatio: number = 0.75,scale:number=1): void {
		let s = this;		
		s._designMaxRatio = maxRatio;
		s._designMinRatio = minRatio;
		s._designScale = scale;
		s._designWidth = w;
		s._designHeight = h;
		w *= scale;
		h *= scale;
		s.width = w;
		s.height = h;
		let sclX: number, sclY: number, scl: number;
		let game: GameManager = GameManager.getInstance();
		let stdW: number, stdH: number;
		s._screenMode = screenMode;
		scl = w / h;
		stdW = game.stardardWidth;
		stdH = game.stardardHeight;
		if (scl > maxRatio)
			stdW = h * maxRatio;
		else if (scl < minRatio)
			stdH = w / minRatio;

		sclX = stdW / w;
		sclY = stdH / h;

		if (s._screenMode == LayerManager.FIX_WIDTH)
			s._moduleScale = sclX;
		else if (s._screenMode == LayerManager.FIX_HEIGHT)
			s._moduleScale = sclY;
		else if (s._screenMode == LayerManager.NOBORD)
			s._moduleScale = sclX > sclY ? sclX : sclY;
		else if (s._screenMode == LayerManager.SHOWALL)
			s._moduleScale = sclX < sclY ? sclX : sclY;
		else
			s._moduleScale = 1;		
		s.scaleX = s.scaleY = s._moduleScale;
		s.x = game.stardardWidth - w * s._moduleScale >> 1;
		s.y = game.stardardHeight - h * s._moduleScale >> 1;
	}
	public get designScale():number
	{
		return this._designScale;
	}

	public set mode(val: number) {
		let s = this;
		s.uiData.mode = val;
		if (s.uiData.mode == LayerManager.MODE_INSCREEN && s.parent != LayerManager.getInstance().stageSp)
			LayerManager.getInstance().stageSp.addElement(s);
	}
	/**设置呈现的模式，参考LayerManager常量*/
	public get mode(): number {
		let s = this;
		return s.uiData ? s.uiData.mode : LayerManager.MODE_COMMON;
	}
	public setBackground(color: number, alpha: number): void {
		let s = this;
		LayerManager.getInstance().setBackground(color, alpha);
	}
	/**模块启动之前*/
	public modulePreStart(): void {
		let s = this;
		let userData: UserData = UserData.getInstance();
		let w: number, h: number;
		w = Number(userData.getQueryVariable("designWidth"));
		h = Number(userData.getQueryVariable("designHeight"));
		// Log.writeLog("designWidth：" + w + "-------------designHeight:" + h)
		if (w > 0 && h > 0)
			s.resetSize(w, h, LayerManager.FIX_WIDTH,s._designMaxRatio,s._designMinRatio,s._designScale);
		s.addEventListener(egret.Event.ADDED_TO_STAGE, s.addToStage, s);
	}
	protected addToStage(e: egret.Event): void {
		let s = this;
		if (s.uiData) s.uiData.moduleWatcher.moduleStart(s.start, s);
	}
	/**模块启动(addToStage的时候启动，重复添加到stage可多次启动)*/
	protected start(): void {
		let s = this;
		// if(s._baseData)
		// {
		// 	let s = this;
		// 	if(s._baseData.mask)
		// 	{
		// 		s.setBackground(s._baseData.maskColor!=null?s._baseData.maskColor:0xff0000,s._baseData.maskAlpha!=null?s._baseData.maskAlpha:1);
		// 	}
		// }
		GYLite.TimeManager.timeOut(s.enterIfOk, s, 100);
		// s.enterIfOk()
	}
	/**场景就绪，过场拉开*/
	protected ready():void
	{

	}
	protected enterIfOk():void
	{let s = this;
		if(Log.costRender > 100 && s._costCount < 5)
		{
			++s._costCount;
			Log.writeLog("帧率低，等待进入：" + s._costCount,Log.WARN);
			GYLite.TimeManager.timeOut(s.enterIfOk, s, 200);
			return;
		}		
		s._costCount = 0;
		Dispatcher.getInstance().dispatchEventWith(Dispatcher.GAME_READY);		
		s.ready();	
	}	
	public show(pr: GYLite.GYSprite = null): void {
		let s = this;
		if (pr == null) {
			pr = (s.uiData && s.uiData.mode == LayerManager.MODE_INSCREEN) ? LayerManager.getInstance().stageSp : LayerManager.getInstance().uiLay;
		}		
		pr.addElement(s);		
	}

	public hide(): void {
		let s = this;
		if (s.parent)
			(<any>s.parent).removeElement(s);
		if (s.uiData) s.uiData.moduleWatcher.moduleEnd();
	}

	public dispose(disposeChild: boolean = true, removeChild: boolean = true, forceDispose: boolean = false): void {
		super.dispose(disposeChild, removeChild, forceDispose);
		let s = this;
		let soundDict = SoundManager.instance.soundDict;
		for (let key in soundDict) {
			if (key.indexOf(s.uiData.uiPath.replace(/\./g, "/")) !== -1) {
				SoundManager.instance.dispose(key, true);
			}
		}	
		if (s.uiData) {
			s.uiData.clear();
		}		
		s.removeEventListener(egret.Event.ADDED_TO_STAGE, s.addToStage, s);
	}

	public resize(w: number, h: number): void {
		let s = this;
		if (s._screenMode == s._screenMode)
			s.resetSize(s._designWidth, s._designHeight, s._screenMode, s._designMaxRatio, s._designMinRatio, s._designScale);
	}

	public setData(d: any): void {
		let s = this;
		s._baseData = d;
	}
	public getData(): any {
		return this._baseData;
	}
	/**重载场景*/
	public reloadScene(): void {

	}	

}
