class GameManager {
	private static _instance: GameManager;
	public static version: string = window["game_version"] ? window["game_version"] : "";
	public static game: Main;
	public static WIN_WIDTH: number = 1440;
	public static WIN_HEIGHT: number = 810;
	public static getInstance(): GameManager {
		if (GameManager._instance == null) GameManager._instance = new GameManager;
		return GameManager._instance;
	}
	public debug: boolean = !window["release"];
	public debugWidth: number = 1920;
	public debugHeight: number = 1080;
	public gameScale: number = 1;
	public maxRatio:number;
	public minRatio:number;
	public startTime: number;
	public endTime: number;
	public deviceVer: string;
	public firstIn:boolean=true;
	private _gesture: Gesture;
	/**预留100个id位*/public uidCount: number = 100;
	private _isGameStart: boolean;
	private _configMgr: ConfigManager;
	private _stageWidth:number;
	private _stageHeight:number;
	private _urlSize:boolean;
	/**0 正常进行交互 1 本地调试回放交互 2 后台录制回放的交互*/public recordId: number = 0;
	//是否入门课
	public isTest: boolean = true;
	private _urlDict: any;
	/**录屏状态0没开始 1开始录制 2录制结束 3录制成功 4录制失败*/
	public recordState:number = 0;
	public errorTexture:egret.Texture;	
	public static inited:boolean;
	public constructor() {
		let s = this;
		//设备版本
		s.deviceVer = egret.WebGLUtils.checkCanUseWebGL() ? "" : "_cvs";
		s._urlDict = {};
		s.maxRatio = s.minRatio = NaN;				
	}
	public setConfig(val: any): void {
		let s = this;
		if (s._configMgr == null)
			s._configMgr = new ConfigManager(val);		
		s.maxRatio = s._configMgr.config.autoSize?16/9:NaN;
		s.minRatio = 4/3;
		let w: number = +UserData.getInstance().getQueryVariable("designWidth");
		let h: number = +UserData.getInstance().getQueryVariable("designHeight");
		if (w > 0 && h > 0) {
			s._urlSize = true;
			s.stardardWidth = w;
			s.stardardHeight = h;
		}
		else {
			s.resetStardardSize();
		}

	}
	public get configMgr(): ConfigManager {
		return this._configMgr;
	}
	public get config(): any {
		return this._configMgr.config;
	}
	/**获取配置的公共库版本号
	 * @param uiPath 模块名称
	*/
	public getLibDirVer(uiPath: string): string {
		let s = this;
		return s._configMgr.getLibDirVer(uiPath);
	}

	/**获取配置的模块版本号
	 * @param uiPath 模块名称
	*/
	public getMdDirVer(uiPath: string): string {
		let s = this;
		return s._configMgr.getMdDirVer(uiPath);
	}
	//预加载列表
	public get preloads(): string[] {
		return this._configMgr.config.preloads;
	}
	/**引擎初始化完成，未进入游戏，游戏配置、资源未加载*/
	public engineInited():void
	{let s = this;
		MsgBase.getMsgHandle().regMsg(MsgBase.CACHE_URL, s.cacheUrlBack, s);		
	}
	/**游戏初始化完成,进入游戏，游戏配置、资源已加载*/
	public gameInit(): void {
		var s = this;
		GameManager.inited = true;
		s._gesture = new Gesture;
		s.errorTexture = Main.instance.getRes("error.png");
		UIControl.getInstance().init();		
		MsgBase.getMsgHandle().regMsg(MsgBase.INTERATION_STATE_CHANGE, s.stateChange, s);
		MsgBase.getMsgHandle().regMsg(MsgBase.CALL_IN, s.callInModule, s);	
		MsgBase.getMsgHandle().regMsg(MsgBase.TIPS_CALL, s.tipCall, s);		
		Dispatcher.getInstance().addEventListener(Dispatcher.GAME_READY, s.gameReady, s);		
		Dispatcher.getInstance().addEventListener(Dispatcher.VIDEO_READY, s.videoReady, s);		
		if (Browser.onMobile) {
			MsgBase.getMsgHandle().regMsg(MsgBase.FRONT_BACK_CHANGE, s.frontBackChange, s);
		}
		else {
			document.addEventListener("visibilitychange", function () {
				if (document.visibilityState == "visible") {
					s.viewIn();
				}
				if (document.visibilityState == "hidden") {
					s.viewOut();
				}

			});
		}		
	}
	public showView:boolean = true;
	private frontBackChange(d: any): void {		
		if (d == null) return;
		let s = this;
		if (d.data) {
			if (d.data.type == 1) {
				s.viewOut();
				s.showView = false
			}
			else if (d.data.type == 2) {
				s.viewIn();
				s.showView = true
			}
		}
	}
	private viewIn(): void {
		Log.writeLog(MultiLang.str64, Log.WARN);
		let ctx = egret["web"].WebAudioDecode.ctx;
		if(ctx && ctx.state != "running")
		{
			ProtoExt.resumeAudioContext();
		}		
		SoundManager.instance.resume();
		// LessonMgr.getInstance().continueVideo()
		egret.ticker.resume();
	}
	private viewOut(): void {
		Log.writeLog(MultiLang.str63, Log.WARN);		
		SoundManager.instance.pause();
		egret.ticker.pause();
	}
	public debugStart(): void {
		var s = this;
	}
	// private testFileData:string;
	public gameStart(): void {
		var s = this;
		s._isGameStart = true;
		let modulePath: string = UserData.getInstance().getQueryModuleName();				
		Log.writeLog(MultiLang.str55 + (modulePath ? modulePath : ""), Log.INFO);
		if (s.lessonIsRunning()) {
			UIControl.getInstance().openUI(s._configMgr.defaultModule,null,null,null,true,FileType.UI,FileID.UI,false);

		}
		else {
			modulePath = (modulePath == null ? (window["gy_module"] ? window["gy_module"] : s._configMgr.defaultModule) : modulePath);
			if (modulePath == "wait") {				
				// Main.instance.myLoader.loadData("imageSource.txt",function(l:GYLite.LoadInfo):void{
				// 	s.testFileData = l.content.res;
				// 	s.callInModule({data:{module:"orchardWizard.bi1"}});				
				// },s,null,GYLite.GYLoader.TYPE_TEXT);

				return;
			}			

			if (UserData.getInstance().getQueryVariable("state") == 2)//预加载
			{
				LayerManager.getInstance().removeLoadingUI();
				UIControl.getInstance().preloadUI(modulePath);
			}
			else {
				let fileId:string = UserData.getInstance().getQueryVariable("fileId");
				UIControl.getInstance().openUI(modulePath, null, Math.random() + "", { mask: true },true,fileId?FileType.LESSON:FileType.UI,fileId?fileId:FileID.UI);
			}
		}
	}
	/**启动游戏的垃圾回收*/
	public gc():void
	{		
		let t = Date.now();
		GYLite.GYSprite.gc();//引擎垃圾回收		
		LayerManager.getInstance().gc();//清除全局的尺寸适配
		SoundManager.gc();//声音进行垃圾回收
		Log.writeLog("gc耗时:"+(Date.now() - t));
	}
	/**课程视频播放就绪*/
	private videoReady(e:egret.Event):void
	{
		let s = this;		
		s.gc();
	}	
	/**交互场景就绪*/
	private gameReady(e:egret.Event):void
	{
		let s = this;		
		s.gc();
		if(GameManager.getInstance().firstIn)
		{			
			GameManager.getInstance().firstIn = false;
		}		
	}
	private tipCall(d: any): void {
		let s = this;
		if (d && d.data) {
			Tips.instance.showTip(d.data.msg,d.data.type);
		}
	}
	private callInModule(d: any): void {
		let s = this;
		if (d && d.data) {
			
			UIControl.getInstance().openUI(d.data.module, d.data.mdDirVer, d.data.mdVer, { mask: true });
		}
	}
	private stateChange(d: any): void {
		let s = this;
		MsgBase.getMsgHandle().unregMsg(MsgBase.INTERATION_STATE_CHANGE, s.stateChange, s);
		if (d && d.data) {
			if (d.data.interationState == 1 && UserData.getInstance().getQueryVariable("state") == 2) {
				UserData.getInstance().setQueryVariable("state", 1);
				if (s._isGameStart)
					UIControl.getInstance().openUI(d.data.modulePath, null, null, { mask: true });
			}
		}
	}
	private enterScene(d: any): void {
		let s = this;
		if (d) {
			s.startTime = egret.getTimer();
			//UIControl.getInstance().openUI(d.modulePath);
		}
	}

	public gameEnd(): void {
		var s = this;
		// s.dispatchEvent(new GYViewEvent(GYViewEvent.UPDATE_COMPLETE));
	}
	/**屏幕宽高比类型
	 * @return 1 偏方型 2 偏横版 3 长方形
	*/
	public getRatioType():number
	{let s = this;
		let stRatio:number=(9/16 + 3/4)/2;
		let ratio:number = s._stageHeight / s._stageWidth;
		if(ratio != ratio)
			ratio = s._gameHeight / s._gameWidth;
		if(ratio < 9/16)return 3;
		return stRatio < ratio?1:2;
	}

	public resize(w: number, h: number): void {
		var s = this;
		// console.log("a",s.stardardWidth / w);
		let sclX: number, sclY: number,scl:number;
		let ww:number,wh:number;
		ww = window.screen?window.screen.width:0;
		wh = window.screen?window.screen.height:0;
		Log.writeLog("尺寸变更:w-" + w + ",h-" + h + "," + "winW:" + egret.Capabilities.boundingClientWidth + "-" + "winH:" + egret.Capabilities.boundingClientHeight + "," + window.screen.width + "-" + window.screen.height + ",devicePixelRatio:" + window.devicePixelRatio, Log.WARN);
		if(ww > 0 && w == 0)
		{			
			let temp:number;
			if(ww < wh)
			{
				temp = ww;
				ww = wh;
				wh = temp;
			}
			w = ww;
			h = wh;
		}
		s._gameWidth = s._stageWidth = w;
		s._gameHeight = s._stageHeight = h;	
		scl = w / h;
		if(scl > s.maxRatio)		
			s._stageWidth = h * s.maxRatio;		
		else if(scl < s.minRatio)		
			s._stageHeight = w / s.minRatio;
		s.resetStardardSize();
		sclX = s._stageWidth / s.stardardWidth;
		sclY = s._stageHeight / s.stardardHeight;		
		if (sclX < sclY)
			s.gameScale = sclX;
		else
			s.gameScale = sclY;		
		LayerManager.getInstance().resize(s._stageWidth, s._stageHeight, w - s._stageWidth >> 1, h - s._stageHeight >> 1);
	}
	private resetStardardSize():void
	{let s = this;
		let platform:string = UserData.getInstance().getPlatform();
		if(s._configMgr.config.autoSize && !s._urlSize)
		{			
			if(s.getRatioType() == 1)
			{
				s.stardardWidth = 1440;
				s.stardardHeight = 1080;
			}
			else
			{
				s.stardardWidth = 1920;
				s.stardardHeight = 1080;
			}
		}
		else
		{
			if(!s._urlSize)
			{
				s.stardardWidth = s._configMgr.config.designWidth;
				s.stardardHeight = s._configMgr.config.designHeight;
			}			
		}		
	}
	public get gameHeight(): number {
		var s = this;
		return s._gameHeight;
	}

	public get gameWidth(): number {
		var s = this;
		return s._gameWidth;
	}
	/**实际使用的舞台高度*/
	public get stageHeight(): number {
		var s = this;
		return s._stageHeight;
	}
	/**实际使用的舞台宽度*/
	public get stageWidth(): number {
		var s = this;
		return s._stageWidth;
	}
	/**是否启用课程模式，启用则进行环节跳转，否则只播放一个模块*/
	public lessonIsRunning(): boolean {
		return window["gy_module"] == null && UserData.getInstance().getQueryModuleName() == null;
	}	
	/**全局加载数据
	 * @param path 文件路径
	 * @param callBackFunc 回调
	 * @param thisObject
	 * @param progFunc 进度回调
	 * @param type 类型
	 * @param method 请求类型
	 * @param getCache 是否检测缓存
	 * @param loadInfoParam 附件参数
	 * @param fileType 文件类型 模块打包的文件类型 参考FileType常量
	 * @param fileID 文件分类id fileID 模块打包的文件目录分类 参考FileID常量
	 * @param failReloadCount 失败后重新尝试的次数
	*/
	public loadData(path: string, callBackFunc: Function, thisObject: any, progFunc = null, type = 6, method = "get", param = null, getCache: boolean = true, loadInfoParam: any = null, fileType:number=4, fileID:string="UI",failReloadCount:number=0): GYLite.LoadInfo {
		let s = this;
		let obj:any = { path: path, callBackFunc: callBackFunc, thisObject: thisObject, progFunc: progFunc, type: type, method: method, param: param, loadInfoParam: loadInfoParam, failReloadCount:failReloadCount };
		if (getCache && MsgBase.haveMsgHandle())// || s.testFileData!=null)
		{
			let uid: number = ++s.uidCount;
			if(loadInfoParam ==null)loadInfoParam = {};
			loadInfoParam.startTime = Date.now();
			loadInfoParam.path = path;
			s._urlDict[uid] = obj;
			obj.uid = uid;
			// if(s.testFileData!=null)
			// 	s.cacheUrlBack({data:{fileData:s.testFileData,uid:uid,url:path}});
			// 	else
			let filePath:string;						
			filePath = path.split("?")[0];
			filePath = filePath.replace(URLConf.modules,"");
			filePath = filePath.replace(URLConf.moduleLibs,"");
			if(fileType == FileType.LESSON)
			{
				// if(filePath.indexOf(".json") == -1)				
				// 	filePath = "interaction/" + filePath;
				filePath = filePath.replace(fileID + "/", "");
			}				
			else if(fileType == FileType.LIB)
			{
				let arr:string[] = filePath.split("/");
				filePath = "moduleLibRelease/" + arr[arr.length - 1];
			}				
			MsgBase.getMsgHandle().sendMsg(MsgBase.CACHE_URL, { uid: uid, url: path, filePath:filePath, type:fileType, fileID:fileID});
			return;
		}
		let loadInfo: GYLite.LoadInfo;
		loadInfo = Main.instance.myLoader.loadData(path, s.dataLoadComp, s, progFunc, type, method, {object:obj,loadCount:0});
		if (loadInfoParam) {
			for (var key in loadInfoParam) {
				loadInfo[key] = loadInfoParam[key];
			}
		}
		return null;
	}	
	private cacheUrlBack(d: any): void {
		let s = this;		
		if (d) {
			let obj: any;
			let loadInfo: GYLite.LoadInfo;			
			obj = s._urlDict[d.data.uid];			
			if(obj == null)return;
			// if(!Net.getInstance().check(s.cacheUrlBack,s,[d],obj.uid))
			// 	return;
			if (d.error) {
				Log.writeLog("无10117协议：" + obj.path, Log.WARN);
				loadInfo = Main.instance.myLoader.loadData(d.data.url, obj.callBackFunc, obj.thisObject, obj.progFunc, obj.type, obj.method, {object:obj,loadCount:0});
				if (obj.loadInfoParam) {
					for (var key in obj.loadInfoParam) {
						loadInfo[key] = obj.loadInfoParam[key];
					}
				}
				delete s._urlDict[d.data.uid];
			}
			else if (d.data) {
				if (d.data.fileData) {
					let t: number = Date.now();
					var resObj = GYLite.ResObject.getInstance();
					loadInfo = GYLite.LoadInfo.getInstance();
					if (obj.loadInfoParam) {
						for (var key in obj.loadInfoParam) {
							loadInfo[key] = obj.loadInfoParam[key];
						}
					}
					resObj.res = HttpMsg.base64ToArrayBuffer(d.data.fileData);
					resObj.pathKey = d.data.url;
					resObj.type = GYLite.GYLoader.TYPE_BINARY;
					loadInfo.content = resObj;
					loadInfo.msg = "加载完成！";
					obj.callBackFunc.call(obj.thisObject, loadInfo);
					loadInfo.clear();					
					Log.writeLog(obj.path + "耗时：" + (Date.now() - t) + "-base64长度：" + d.data.fileData.length, Log.WARN);
					// s.testFileData = null;
				}
				else {					
					Log.writeLog("100117加载：old-" + obj.path + "\nnew-" + d.data.url, Log.IMPORTANT);
					loadInfo = Main.instance.myLoader.loadData(d.data.url, s.dataLoadComp, s, obj.progFunc, obj.type, obj.method, {object:obj,loadCount:0});
					if (obj.loadInfoParam) {
						for (var key in obj.loadInfoParam) {
							loadInfo[key] = obj.loadInfoParam[key];
						}
					}
				}
				delete s._urlDict[obj.uid];			
			}
		}
	}
	private dataLoadComp(l:GYLite.LoadInfo):void
	{let s = this;
		let obj:any = l.param.object;
		let loadInfo:GYLite.LoadInfo;
		if(l.content == null)
		{
			// Net.getInstance().netSendAgain(obj.uid, 1000);
			// return;
			++l.param.loadCount;
			if(l.param.loadCount >= obj.failReloadCount)
			{
				l.param.loadCount = 0;	
				Log.writeLog(MultiLang.str62 + ",dataLoadComp:" + obj.path + "!" + l.msg,Log.WARN);
				return;
			}							
			GYLite.TimeManager.timeOut(function():void{		
				let url:string;
				url=obj.path.indexOf("?") > -1?(obj.path + "?r=" + Math.random()):(obj.path + "&r=" + Math.random());
				loadInfo = Main.instance.myLoader.loadData(url, s.dataLoadComp, s, obj.progFunc, obj.type, obj.method, {object:obj,loadCount:l.param.loadCount});
				if (obj.loadInfoParam) {
					for (var key in obj.loadInfoParam) {
						loadInfo[key] = obj.loadInfoParam[key];
					}
				}
			},s,2000);				
			Log.writeLog("dataLoadComp:" + MultiLang.str68 + l.msg,Log.WARN);			
			return;
		}		
		// Net.getInstance().netComplete(obj.uid);
		if(obj.callBackFunc!=null)
		{
			l.param = obj.param;
			obj.callBackFunc.call(obj.thisObject, l);
		}
	}
	public reload(delay: number = -1, forcedReload: boolean = true): void {
		let s = this;
		if (delay == -1) {
			location.reload(forcedReload);
			return;
		}
		GYLite.TimeManager.timeOut(function (): void {
			location.reload(forcedReload);
		}, s, delay);
	}


		/**标准宽度*/public stardardWidth: number;
		/**标准高度*/public stardardHeight: number;
		/**当前设备宽度*/private _gameWidth: number;
		/**当前设备高度*/private _gameHeight: number;
}