class UIControl {
	public static FAIL_RELOAD_COUNT:number=100;
	private static _instance: UIControl;
	public static getInstance(): UIControl {
		if (UIControl._instance == null) UIControl._instance = new UIControl;
		return UIControl._instance;
	}
	/**把UIID里面的'.'转化成'/'*/
	public static getUIIDPath(uiID: string): string {
		return uiID.replace(/\./g, "/");
	}
	/**根据uiID获取类定义*/
	public static getModuleCls(uiID: string): any {
		let arr: Array<string> = uiID.split(".");
		let i: number, len: number;
		let obj: any;
		obj = window;
		len = arr.length;
		for (i = 0; i < len; ++i) {
			obj = obj[arr[i]];
			if (obj == null) {
				Log.writeLog(MultiLang.str4 + arr.toString() + "-" + i, Log.ERROR);
				return null;
			}
		}
		return obj;
	}
	/**获取模块类名称， 根据uiPath, 如flower.bi1 返回bi1
	 * @param uiPath
	*/
	public static getUI_ID(uiPath: string): string {
		let arr: Array<string> = uiPath.split("/");
		return arr[arr.length - 1];
	}
	public constructor() {
		let s = this;
		MsgBase.getMsgHandle().regMsg(MsgBase.DOWNLOAD_CALL, s.downloadCall, s);
	}

	private _downloadDict:any = {};
	private _curUI: ModuleBase;
	private _uiVec: Array<UIOpenData> = [];
	private _uiDict: any = {};	
	private _curUIIndex: number = -1;
	private _openningUICfg:any;	

	
	public init(): void {
		var s = this;
	}
	public resize(w: number, h: number): void {
		let s = this;
		if (s._curUI) {
			if (GYLite.CommonUtil.GYIs(s._curUI, ModuleBase))
				(<ModuleBase>s._curUI).resize(w, h);
		}
	}
	/**获取模块实例
	 * @param uiPath 包全路径
	 * @param mdDirVer 版本目录
	 * @param fileID 文件ID，参考FileID常量
	 * @param fileType 文件类型，参考FileType常量
	 * @return 返回模块实例，不存在则null
	*/
	public getModule(uiPath: string, mdDirVer: string = "",fileID:string=FileID.UI,fileType:number=FileType.UI):ModuleBase
	{let s = this;
		let tempUrl:string[];		
		tempUrl = s.getUrl(uiPath,mdDirVer,fileID,fileType);
		return s._uiDict[tempUrl[0]];
	}
	public getUIData(url: string, uiPath:string = null, mdDirVer:string = ""): any {		
		let s = this;
		let deviceVer = GameManager.getInstance().deviceVer;
		let moduleName:string;
		let versionDir:string;
		if(uiPath)
			moduleName = uiPath.replace(".","/");
		else
		{
			moduleName = url.replace(URLConf.modules,"");
			moduleName = moduleName.split("?")[0];			
		}			
		if (s._uiDict[url]) 
		{
			if(uiPath != null && s._uiDict[url].uiPath == null)
			{
				s._uiDict[url].uiPath = uiPath;
			}
			return s._uiDict[url];
		}
		versionDir = mdDirVer == ""?"":moduleName + "V/";
		mdDirVer = mdDirVer == ""?"":mdDirVer + "/";		
	    if (url == URLConf.modules + versionDir + mdDirVer + "war" + deviceVer )
		{
		    s._uiDict[url] = new UICtrlData(url, uiPath, null, UICtrlData.STATE_UNLOAD, true, 0, false);
		}
		else if (url == URLConf.modules + versionDir + mdDirVer + "login" + deviceVer )
		{
		    s._uiDict[url] = new UICtrlData(url, uiPath, null, UICtrlData.STATE_UNLOAD, true, 0, false);
		}else{
			s._uiDict[url] = s.createDefaultData(url, uiPath);
		}
		return s._uiDict[url];
	}
	private downloadCall(d:any):void
	{
		let s = this;
		let obj:any = s._downloadDict[d.data.uid];
		let success:boolean=false;
		if(obj)							
			delete s._downloadDict[d.data.uid];
		if (d && d.data) {
			success = d.data.result == 1;
			if (success) {//下载成功
				Log.writeLog("下载zip成功!------------------------------->>>>"+d.data.uid);						
			}			
		}
		if(!success)
		{
			let str:string = "下载模块包失败，走远程!------------------------------->>>>"+d.data.uid;
			if(d.data)
			{			
				if(d.data.urlArray && d.data.urlArray.length > 0)
				{
					let i:number,len:number;
					len = d.data.urlArray.length;
					for(i=0;i<len;++i)
					{
						str += "\n" + d.data.urlArray[i].url + ",md5:" + d.data.urlArray[i].md5;
					}				
				}
			}		
			Log.writeLog(str,Log.WARN);
		}	
		
		if(obj)
		{
			if(obj.loaded == UICtrlData.STATE_LOADING)
			{
				let uiCfg:UICtrlData = obj.uiCfg;
				let openUIParam:any = uiCfg.openUIParam;
				s.openUI(openUIParam.openingUIPath,openUIParam.openingMdDirVer,openUIParam.openingMdVer,openUIParam.openingParam,openUIParam.mutual,openUIParam.fileType,openUIParam.fileID,false);
			}
			else if(obj.loaded == UICtrlData.STATE_PRELOADING)
			{
				let uiCfg:UICtrlData = obj.uiCfg;
				let openUIParam:any = uiCfg.openUIParam;
				s.preloadUI(openUIParam.openingUIPath, openUIParam.openingMdDirVer, openUIParam.openingMdVer, openUIParam.fileType, openUIParam.fileID, false);
			}
		}
		
	}
	/**预加载
	 * @param uiPath 模块类路径
	 * @param mdDirVer 模板版本目录
	 * @param mdVer 版本号参数
	 * @param fileType 模块打包的文件类型 参考FileType常量
	 * @param fileID 模块打包的文件目录分类 参考FileID常量
	 * @return 返回UICtrlData类型，控制加载的对象，如果此模块早已被加载成功，则返回null
	 * @param downloadZip 是否加载离线zip包
	*/
	public preloadUI(uiPath: string, mdDirVer: string = "", mdVer: string = null, fileType:number=4,fileID:string="UI", downloadZip:boolean=false):UICtrlData
	{let s = this;		
		let uiCfg: UICtrlData;
		let tempUrl:string[];		
		tempUrl = s.getUrl(uiPath,mdDirVer,fileID,fileType);
		uiCfg = s.getUIData(tempUrl[0], uiPath, tempUrl[1]);
		uiCfg.openUIParam = {openingUIPath:uiPath,openingMdVer:mdVer,openingMdDirVer:mdDirVer,openingUrl:tempUrl[0],fileType:fileType, fileID:fileID};

		if(uiCfg == null ||  uiCfg.loaded == UICtrlData.STATE_UNLOAD)
		{
			if(downloadZip && MsgBase.haveMsgHandle())
			{
				let uid: number = ++GameManager.getInstance().uidCount;
				s._downloadDict[uid] = {uid:uid, uiCfg:uiCfg, loaded:UICtrlData.STATE_PRELOADING};
				MsgBase.getMsgHandle().sendMsg(MsgBase.DOWNLOAD_CALL, {
					uid: uid,
					urlArray: [{
						url: uiCfg.openUIParam.openingUrl+".zip",
						type: fileType,
						fileID: fileID,
						version: mdDirVer,
						md5: GameManager.getInstance().configMgr.getModuleMD5(uiPath)
					}]
				});
				return;
			}
			mdVer = (mdVer==""||mdVer==null)?URLConf.getModuleVer():"?"+mdVer;
			uiCfg.preload(mdVer,false,fileType,fileID);
			return uiCfg;
		}
		return null;
	}
	/**打开一个模块
	 * @param uiPath 模块类路径
	 * @param mdDirVer 模板版本目录, 默认null
	 * @param mdVer 版本号参数，默认null
	 * @param args 附加参数，默认null
	 * @param mutual 是否互斥 默认true 互斥将会记录到历史记录中，不互斥作为弹出式模块覆盖在上面，默认true
	 * @param fileType 模块打包的文件类型 参考FileType常量
	 * @param fileID 模块打包的文件目录分类 参考FileID常量
	 * @param downloadZip 是否加载离线zip包
	*/
	public openUI(uiPath: string, mdDirVer: string = null, mdVer: string = null, args: any = null, mutual: boolean = true, fileType:number = FileType.UI, fileID:string = FileID.UI, downloadZip:boolean=false): void {
		var s = this;		
		let uiCfg: UICtrlData;
		let tempUrl:string[];		
		tempUrl = s.getUrl(uiPath,mdDirVer,fileID,fileType);
		s._openningUICfg = uiCfg = s.getUIData(tempUrl[0], uiPath, tempUrl[1]);		
		uiCfg.openUIParam = {
			openingUIPath:uiPath,
			openingMdDirVer:mdDirVer,
			openingMdVer:mdVer,
			openingParam:args,
			mutual:mutual,
			openingUrl:tempUrl[0],
			fileType:fileType,
			fileID:fileID
		};
		uiCfg.mdDirVer = tempUrl[1];
		if(uiCfg.loaded == UICtrlData.STATE_LOADING)
		{
			Log.writeLog(MultiLang.str53+uiPath,Log.WARN);//试图重复加载
			return;
		}
		if(downloadZip && uiCfg.loaded == UICtrlData.STATE_UNLOAD && MsgBase.haveMsgHandle())
		{
			let uid: number = ++GameManager.getInstance().uidCount;
			s._downloadDict[uid] = {uid:uid, uiCfg:uiCfg, loaded:UICtrlData.STATE_LOADING};
			MsgBase.getMsgHandle().sendMsg(MsgBase.DOWNLOAD_CALL, {
				uid: uid,
				urlArray: [{
					url: uiCfg.openUIParam.openingUrl+".zip",
					type: fileType,
					fileID: fileID,
					version: mdDirVer,
					md5: GameManager.getInstance().configMgr.getModuleMD5(uiPath)
				}]
			});
			return;
		}
		// if(GameManager.getInstance().firstIn)
		// 	GameManager.getInstance().firstIn = false;
		// else
		// 	MsgBase.getMsgHandle().sendMsg(MsgBase.ANI_CALL, { aniType:1,operType:1});				
		if(uiCfg.loaded != UICtrlData.STATE_LOADED && mutual && uiCfg.sceneChange > 0 && !GameManager.getInstance().firstIn)//互斥的模块才能允许转场动画
			SceneChange.getInstance().change(uiCfg.sceneChange,s.toOpenUI,s,null,null,uiCfg);
		else
		{
			s.toOpenUI(uiCfg);
		}			
			
	}
	private toOpenUI(uiCfg:UICtrlData=null):void
	{		
		let openParam:any;
		uiCfg = uiCfg?uiCfg:SceneChange.getInstance().param;
		openParam = uiCfg.openUIParam;
		// if(uiCfg.uiID != "lesson" && openParam.mutual)
		// 	LessonMgr.getInstance().closeVideo();
		if (uiCfg.loaded == UICtrlData.STATE_UNLOAD)//第一次创建
		{							
			if(openParam.mutual)
				LayerManager.getInstance().addLoadingUI();							
			openParam.mdVer = (openParam.mdVer==null)?URLConf.getModuleVer():"?"+openParam.mdVer;
			uiCfg.load(openParam.mdVer,GameManager.getInstance().debug||UserData.getInstance().getQueryVariable("debug")==1,openParam.fileType,openParam.fileID);
		}
		else
		{
			if(uiCfg.loaded == UICtrlData.STATE_PRELOADING)//预加载中，直接切换到加载中状态
				uiCfg.loaded = UICtrlData.STATE_LOADING;
			else
			{
				if(uiCfg.loaded == UICtrlData.STATE_PRELOADED)//已经预加载完成
				{
					uiCfg.loaded = UICtrlData.STATE_LOADED;
					LayerManager.getInstance().removeLoadingUI();
					uiCfg.doOpen();
				}
				else{
					uiCfg.doOpen();
					uiCfg.doOpenUI();					
					// uiCfg.openningUI();
				}				
			}
			
		}	
	}
	
	private getUrl(uiPath: string, mdDirVer: any = null, fileID:string=FileID.UI, fileType:number=FileType.UI): string[] {
		let s = this;
		let loadPath: any;
		let url = [];
		let uiMdDirVer:string = "";
		//加入版本号		
		if (mdDirVer == "" || mdDirVer == null) {
			mdDirVer = UserData.getInstance().getQueryVariable("mdDirVer");
			if(mdDirVer == null)
			{
				uiMdDirVer = GameManager.getInstance().getMdDirVer(uiPath);
				mdDirVer = uiMdDirVer == null?(fileType == FileType.LESSON?fileID+"/interaction":""):uiPath + "V/" + uiMdDirVer;
			}						
		}
		let mdDirVerStr:string = mdDirVer == "" ? mdDirVer : mdDirVer + "/";
		// let arr: Array<any> = uiPath.split(".");//统一使用版本号控制整个目录，所以注释掉了
		// if (arr.length > 1) {
		// 	let mainModule: string;
		// 	mainModule = arr.shift();
		// 	loadPath = URLConf.modules + mainModule + "/" + mdDirVerStr + arr.join("/") + GameManager.getInstance().deviceVer;
		// }
		// else
			loadPath = URLConf.modules + mdDirVerStr + uiPath.replace(/\./g, "/") + GameManager.getInstance().deviceVer;
		url.push(loadPath,uiMdDirVer);
		return url;
	}
	private createDefaultData(url:string=null, uiPath:string = null):UICtrlData
	{
		return new UICtrlData(url,uiPath);		
	}	
	/**获取当前模块的类路径*/
	public getCurClassPath(): Array<string> {
		let s = this;
		return s._curUI?s.getClassPath(s._curUI.uiID):null;
	}
	/**关闭当前模块
	 * @param removeFromRecord 是否从UI队列里面删除记录，默认是true，一般外部调用关闭，都应该自动把当前被关闭的UI记录删除，记录指针自动指向当前关闭的UI的上一个UI
	*/
	public closeCurUI(removeFromRecord:boolean=true): void {
		var s = this;
		var tUI: UIOpenData;
		//Bury.getInstance().closeHesitateCheck();
		if(s._curUI)
		{
			s.removeUI(s._curUI.url);
			s._curUI = null;
			if(removeFromRecord)					
				--s._curUIIndex;
		}		
	}
	/**返回到上一个模块*/
	public reback(): boolean {
		var s = this;
		var tUI: UIOpenData;
		var url:string;
		tUI = s._uiVec[s._curUIIndex];
		// s._uiVec.length = s._curUIIndex;
		if(s._curUIIndex > 0)
		{
			--s._curUIIndex;
			tUI = (s._curUIIndex >= 0 && s._curUIIndex < s._uiVec.length) ? s._uiVec[s._curUIIndex] : null;
			if(tUI)
			{
				--s._curUIIndex;
				s.openUI(tUI.uiPath,tUI.mdDirVer,tUI.mdVer,tUI.args);
				return true;
			}			
		}
		return false;
	}
	/**上一个打开的模块*/
	public get preUI(): ModuleBase {
		let s = this;
		let uiCfg = s._uiDict[s._uiVec[s._curUIIndex - 1].url];
		return s._curUIIndex > 0 ? (uiCfg?uiCfg.ui:uiCfg) : null;
	}
	/**当前打开的模块*/
	public get curUI(): ModuleBase {
		return this._curUI;
	}
	/**当前打开的模块的文件ID*/
	public get curFileID(): string {
		let s = this;
		return s._curUI ? s._curUI.fileID : null;
	}
	/**当前打开的模块的文件分类*/
	public get curFileType(): number {
		let s = this;
		return s._curUI ? s._curUI.fileType : NaN;
	}
	/**当前打开的模块的加载路径*/
	public get curURL(): string {
		let s = this;
		return s._curUI ? s._curUI.url : null;
	}
	/**当前模块的ID 例如main.login*/
	public get curUIID(): string {		
		let s = this;
		return s._curUI?s._curUI.uiID:null;
	}
	/**当前模块的UIID路径,UIID完整可能会有多层包名，例如main.login，这个函数返回main/login */
	public get curUIIDPath(): string {
		let s = this;		
		return s._curUI?UIControl.getUIIDPath(s._curUI.uiID):null;
	}
	/**当前模块的UI路径，全路径*/
	public get curUIPATH(): string {
		let s = this;
		return s._curUI?s._curUI.uiPath:null;
	}
	/**当前模块的UI数据*/
	public get curUICtrlData(): UICtrlData {
		let s = this;
		return s._curUI?s._curUI.uiData:null;
	}
	/**当前的模块观察器*/
	public get curModuleWatcher(): ModuleWatcher {
		let s = this;
		return s._curUI?s._curUI.uiData.moduleWatcher:ModuleWatcher.defaultWatcher;
	}
	/**添加一个模块到舞台
	 * @param uiPath 模块类路径
	 * @param url 模块加载的路径
	 * @param data 传入的数据
	 * @param fileType 模块打包的文件类型 参考FileType常量
	 * @param fileID 模块打包的文件目录分类 参考FileID常量
	*/
	public addUI(uiPath: string, url: string, data:any = null, fileType:number=4, fileID:string="UI"): void {
		let s = this;
		let ui: ModuleBase, preUI: ModuleBase;
		let uiID: string;
		let cls: any;
		let bgm:string;
		let uiData:UICtrlData = s._uiDict[url];
		// SceneChange.getInstance().changeState = 0;
		uiID = UIControl.getUI_ID(uiPath);

		if(uiData.haveBgm && uiData.openUIParam.mutual)
		{
			bgm = s.getBGMUrl(uiID);
			if(bgm!=null)
			{
				if(Main.instance.hasRes(bgm,null))
					SoundManager.instance.playBGM(bgm);
				else 
				{
					bgm = SoundManager.instance.getDefaultBgm();
					if(Main.instance.hasRes(bgm,null))
						SoundManager.instance.playBGM(bgm);
				}
				
			}
		}		
		let def: any = UIControl.getModuleCls(uiID);
		cls = def["Module"];
		if (cls == null) {
			Log.writeLog(MultiLang.str39 + uiPath, Log.ERROR);
			return;
		}
		
		ui = uiData.ui;		
		if (ui == null) {
			ui = uiData.ui = new cls;
		}
		ui.uiData = uiData;
		if(uiData.openUIParam.mutual)//互斥模块
		{
			s._curUI = ui;
			LayerManager.getInstance().removeLoadingUI();			
			if(uiData.openUIParam.openingUIPath)
			{
				++s._curUIIndex;
				s._uiVec[s._curUIIndex] = new UIOpenData(uiData.openUIParam.openingUIPath,uiData.openUIParam.openingMdDirVer,uiData.openUIParam.openingMdVer,uiData.openUIParam.openingParam,uiData.openUIParam.openingUrl);			
				s._uiVec.length = s._curUIIndex + 1;
			}
		}		
		ui.uiID = uiID;
		ui.uiPath = uiPath;
		ui.url = url;
		ui.fileID = fileID;
		ui.fileType = fileType;
		ui.setData(data);
		if (ui.parent == null) {
			ui.show();			
		}		
		
		// if(ui.uiID != "lesson")
		// 	LessonMgr.getInstance().closeVideo();		
		MsgBase.getMsgHandle().sendMsg(MsgBase.INTERATION_ENTER, { module: uiPath });		
	}
	/**移除模块，根据uiID
	 * @param url 模块加载路径
	*/
	public removeUI(url: string): void {
		let s = this;
		let ui: ModuleBase = s._uiDict[url]?s._uiDict[url].ui:null;
		if (ui && ui.parent) {
			ui.hide();
		}
	}
	/**获取背景声音url*/
	private getBGMUrl(uiID: string):string
	{
		let s = this;
		return uiID == null?null:(uiID.replace(/\./g, "/") +"/sound/BGM.mp3");
	}
	/**获取模块类路径数组
	 * @param uiID
	*/
	public getClassPath(uiID: string): Array<string> {
		let arr: Array<string> = uiID == null ? null : uiID.split(".");
		return arr;
	}

	/**销毁当前模块*/
	public disposeCurUI(): void {
		var s = this;
		if(s._curUI)
		{
			if (s._uiDict[s._curUI.url] && s._uiDict[s._curUI.url].native) return;		
			s.disposeUI(s._curUI.url);
			s._curUI = null;
			--s._curUIIndex;
		}
	}
	/**销毁模块
	 * @param url 模块加载路径
	*/
	public disposeUI(url: string): void {
		let s = this;
		if (s._uiDict[url] == null) return;
		if (s._uiDict[url].native) return;
		let ui: ModuleBase = s._uiDict[url].ui;
		if (ui == null) return;
		let uiID: string = ui.uiID;
		SoundManager.instance.closeBGM();
		UserData.getInstance().clearTempQuery();
		s.removeUI(url);
		ui.dispose();		
		Main.instance.disposeRes(UIControl.getUIIDPath(uiID));
		s._uiDict[url] = null;
		let classPath: Array<any>;
		classPath = s.getClassPath(uiID);
		let str: string = "";
		let i: number, len: number;
		let obj = window;
		len = classPath.length;
		for (i = 0; i < len; ++i) {
			if (obj[classPath[i]] == null)
				break;
			if (i == len - 1)
				delete obj[classPath[i]];
			else
				obj = obj[classPath[i]];
		}
	}
}
class UIOpenData{
	/**类路径*/public uiPath:string;
	/**版本目录*/public mdDirVer:string;
	/**版本模块*/public mdVer:string;
	/**打开参数*/public args:any;
	/**模块加载路径*/public url:string;
	/**
	 *@param uiPath 类路径
	 *@param mdDirVer 版本目录
	 *@param mdVer 版本模块
	 *@param args 打开参数
	 *@param url 模块加载路径**/
	public constructor(uiPath:string,mdDirVer:string,mdVer:string,args:string,url:string)
	{
		let s = this;
		s.uiPath = uiPath;
		s.mdDirVer = mdDirVer;
		s.mdVer = mdVer;
		s.args = args;
		s.url = url;
	}
}
class UICtrlData{
	/**未加载*/public static STATE_UNLOAD:number = 0;
	/**加载中*/public static STATE_LOADING:number = 1;
	/**预加载中*/public static STATE_PRELOADING:number = 2;
	/**加载完成*/public static STATE_LOADED:number = 3;
	/**预加载完成*/public static STATE_PRELOADED:number = 4;
	/**加载路径(全路径)*/
	private _loadUrl:string;
	/**加载路径(相对路径)*/
	public url:string;
	/**类路径-这个一般和uiID一样*/
	public uiPath:string;	
	/**UI实例*/
	public ui:ModuleBase;
	/**是否已加载 2则已加载，否则进入加载流程，0未加载 1加载中 2预加载中 3加载完成 4 预加载完成*/
	public loaded:number;
	/**是否本地模块 true则不会进行销毁 否则关闭模块时会进行销毁*/ 
	public native:boolean;
	/**是否有转场特效*/ 
	public sceneChange:number;	
	/**模块观察器*/
	protected _moduleWatcher:ModuleWatcher;	
	/**加载百分比*/
	protected _loadPercent:number;
	/**版本号*/
	private _mdVer:string;
	/**模块打包的文件类型，参考FileType常量*/
	private _fileType:number;
	/**模块打包的文件目录类型，参考FileID*/
	private _fileID:string;
	/**目录版本号*/
	public mdDirVer:string;
	/**是否有bgm*/
	public haveBgm:boolean;
	/**重加载次数*/
	public loadCount:number=0;
	/**重新加载的延时id*/
	private reloadId:number;
	/**显示的模式，参考Layermanager常量*/
	public mode:number;
	/**调用openUI时使用的参数*/
	public openUIParam:{
		openingUIPath:string,
		openingParam?:any,
		openingMdDirVer?:string,
		openingMdVer?:string,
		/**是否互斥，默认是*/
		mutual?:boolean,
		openingUrl?:string,
		fileID?:string,
		fileType?:number
	};
	private evaled:boolean;
	/**
	* @param url 加载路径
	* @param uiPath 模块类路径
	* @param ui UI实例
	* @param loaded 是否已加载
	* @param native 是否本地模块
	* @param sceneChange 是否有转场特效
	* @param bgm 是否有背景音乐
	*/ 
	public constructor(url:string=null,uiPath:string=null,ui:ModuleBase=null,loaded:number=0,native:boolean=false,sceneChange:number=0,bgm:boolean=true)
	{
		let s = this;
		s.url = url;
		s.uiPath = uiPath;
		s.ui = ui;		
		s.loaded = loaded;
		s.native = native;
		s.sceneChange = sceneChange;
		s._moduleWatcher = new ModuleWatcher(s);
		s._loadPercent = 0;
		s._mdVer = null;
		s.haveBgm = bgm;
		s.loadCount = 0;
		s.reloadId = -1;
	}
	/**类路径ID*/
	public get uiID():string
	{let s = this;
		return s.uiPath!=null?UIControl.getUI_ID(s.uiPath):null;
	}
	public get moduleWatcher():ModuleWatcher
	{
		return this._moduleWatcher;
	}
	/**预加载
	 * @param mdVer 版本号
	 * @param random 是否加版本随机数
	 * @param fileType 模块打包的文件类型 参考FileType常量
	 * @param fileID 模块打包的文件目录分类 参考FileID常量
	*/
	public preload(mdVer:string, random:boolean=false, fileType:number=4, fileID:string="UI"):void
	{let s = this;
		if(s.reloadId > -1)
		{
			GYLite.TimeManager.unTimeOut(s.reloadId,s.reload,s);
			s.reloadId = -1;
		}
		s.loaded = UICtrlData.STATE_PRELOADING;
		if(s._mdVer!=null && s._mdVer != mdVer)
		{
			Log.writeLog(MultiLang.str61,Log.ERROR);
		}
		s._mdVer = mdVer;
		s._fileType = fileType;
		s._fileID = fileID;
		s._loadUrl = s.url + mdVer + (mdVer=="?"?"":"&") + (random?Math.random()+"":"");
		GameManager.getInstance().loadData(s._loadUrl, s.uiLoadComp, s, s.preLoadProg, GYLite.GYLoader.TYPE_BINARY,"get",null,true,{save:false},fileType,fileID);
	}
	/**加载
	 * @param mdVer 版本号
	 * @param random 是否加版本随机数
	 * @param fileType 模块打包的文件类型 参考FileType常量
	 * @param fileID 模块打包的文件目录分类 参考FileID常量
	*/
	public load(mdVer:string, random:boolean=false, fileType:number=4, fileID:string="UI"):void
	{let s = this;
		if(s.reloadId > -1)
		{
			GYLite.TimeManager.unTimeOut(s.reloadId,s.reload,s);
			s.reloadId = -1;
		}
		s.loaded = UICtrlData.STATE_LOADING;
		if(s._mdVer!=null && s._mdVer != mdVer)
		{
			Log.writeLog(MultiLang.str61,Log.ERROR);
		}
		s._mdVer = mdVer;
		s._fileType = fileType;
		s._fileID = fileID;
		s._loadUrl = s.url + mdVer + (mdVer=="?"?"":"&") + (random?Math.random()+"":"");
		GameManager.getInstance().loadData(s._loadUrl, s.uiLoadComp, s, s.preLoadProg, GYLite.GYLoader.TYPE_BINARY,"get",null,true,{save:false},fileType,fileID,UIControl.FAIL_RELOAD_COUNT);
	}
	private uiLoadComp(l: GYLite.LoadInfo): void {
		let s = this;
		if (l.content == null) {			
			Log.writeLog((s.loaded == UICtrlData.STATE_LOADING?MultiLang.str3:MultiLang.str35) + l.path + "#" + l.msg, Log.WARN);
			s.loaded = UICtrlData.STATE_UNLOAD;
			return;
		}
		Log.loadLog(l);
		Main.instance.myLoader.loadGYCompressBytes(l.content.res, s.resUncompressComp, s, null, null, l.path);
	}
	private resUncompressComp(l: GYLite.CompressLoadInfo = null): void {
		let s = this;
		if(l.errorCode > 0)
		{			
			++s.loadCount;
			if(s.loadCount == 3)
			{
				s.loadCount = 0;
				s.loaded = UICtrlData.STATE_UNLOAD;
				Log.writeLog(MultiLang.str62 + s.uiID + l.msg,Log.WARN);
				return;
			}			
			Log.writeLog(MultiLang.str60 + s.uiID + l.msg,Log.WARN);
			s.reloadId = GYLite.TimeManager.timeOut(s.reload,s,2000);
			return;
		}				
		if (l.resCount == 0) {				
			Log.uncompressLog(l,s.uiID);
			let json: any = Main.instance.getDataRes(UIControl.getUIIDPath(s.uiPath) + "/moduleConfig.json");			
			s.moduleWatcher.modulePreStart(s.preLoadComp, s, json ? json.depends : null);			
		}
	}
	private reload():void
	{let s = this;
		if(s.loaded == UICtrlData.STATE_PRELOADING)
		{
			s.preload(s._mdVer, true, s._fileType, s._fileID);
		}
		else if(s.loaded == UICtrlData.STATE_LOADING)
		{
			s.load(s._mdVer, true, s._fileType, s._fileID);
		}
	}
	private preLoadComp():void
	{
		let s =this;
		if(s.loaded == UICtrlData.STATE_LOADING)
		{
			s.loaded = UICtrlData.STATE_LOADED;
			LayerManager.getInstance().removeLoadingUI();
			s.doOpen();	
			s.doOpenUI();
		}			
		else if(s.loaded == UICtrlData.STATE_PRELOADING)
		{
			s.loaded = UICtrlData.STATE_PRELOADED;
			s.doOpen();
			Log.writeLog(MultiLang.str36,Log.INFO);
		}
	}
	private preLoadProg(e:egret.Event):void
	{
		let l:GYLite.SeqURLLoader = e.currentTarget;					
		let s = this;		
		s._loadPercent = l.progressData.loaded / l.progressData.total;				
	}
	public get loadPercent():number
	{let s =this;
		return 0.8 * s._loadPercent + 0.2 * s._moduleWatcher.dependLoadedPercent;
	}
	/**加载路径(全路径)*/
	public get loadUrl():string
	{
		return this._loadUrl;
	}
	/**终止加载*/
	public cancelLoad():void
	{let s = this;		
		Main.instance.myLoader.cancelLoadData(s.url + s._mdVer, s.uiLoadComp, s);
		s.moduleWatcher.cancelDependLoad();
		Log.writeLog(MultiLang.str37,Log.INFO);
	}

	public doOpen(): void {
		let s = this;
		s.evalCode();
		// s.doOpenUI();
	}
	public evalCode():void
	{
		let s = this;
		let uiID: string, classPath: Array<any>;
		uiID = UIControl.getUI_ID(s.uiPath);
		classPath = UIControl.getInstance().getClassPath(uiID);
		if ((!GameManager.getInstance().debug || UIControl.getModuleCls(uiID) == null) && !s.evaled) {
			let res: GYLite.ResObject = GYLite.GYLoader.getDataRes(UIControl.getUIIDPath(uiID) + "/js/" + classPath[classPath.length - 1] + ".js");
			if (res == null) {
				Log.writeLog(MultiLang.str5 + s.uiPath, Log.ERROR);
				return;
			}			
			Log.recordTime();
			eval.call(window, res.res);//注入js
			Log.evalLog(uiID);
			s.evaled = true;
		}
		s.loaded = UICtrlData.STATE_LOADED;
	}
	// public openningUI():void
	// {let s =this;
	// 	if(s.sceneChange > 0 && !GameManager.getInstance().firstIn)
	// 		SceneChange.getInstance().change(s.sceneChange,s.doOpenUI,s);
	// 	else
	// 		s.doOpenUI();
	// }
	public doOpenUI():void
	{let s = this;
		if(s.uiPath == null)return;
		let uictrl:UIControl;
		uictrl = UIControl.getInstance();
		if(s.openUIParam.mutual)
			uictrl.closeCurUI(false);
		uictrl.addUI(s.uiPath, s.url, s.openUIParam.openingParam, s.openUIParam.fileType, s.openUIParam.fileID);
		// s.ui.setData(s.openUIParam.openingParam);
		// if(s.openUIParam.mutual)
		// 	Bury.getInstance().openHesitateCheck();	
		// s.openUIParam = null;
	}
	public clear():void
	{
		let s =this;
		s.loaded = UICtrlData.STATE_UNLOAD;
		s.ui = null;
		s.loadCount = 0;
	}
}