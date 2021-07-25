/**模块监测类，监测模块运行的每个阶段*/
enum QuitType {
	QuitDirectly, // 直接退出
	QuitChallengeSuc // 挑战成功然后退出
}
class ModuleWatcher {	
	public static defaultWatcher: ModuleWatcher = new ModuleWatcher;
	// private static _instance: ModuleWatcher;
	public static getInstance(): ModuleWatcher {
		return UIControl.getInstance().curModuleWatcher;
	}
	private _callBack: Function;
	private _thisObject: any;
	private _param: any;
	private _depends: Array<any>;
	// private _dependLoader:GYLite.GYLoader;
	private _dependCounts: number;
	/**进入模块时间*/public startTime: number;
	/**离开模块时间*/public endTime: number;
	protected _uiData: UICtrlData;
	private _libList:string[];
	private _quitType:number;
	private _jobRank:number;//作业评级
	private _totalTries:number;//尝试次数
	public constructor(uiData: UICtrlData = null) {
		let s = this;
		s._dependCounts = NaN;
		s._uiData = uiData;
		s._libList = [];
		// s._dependLoader =new GYLite.GYLoader(0, 5);
	}
	public cancelDependLoad(): void {
		let s = this;
		if (s._depends && s._depends.length > 0) {
			let len: number;
			len = s._depends.length;
			while (--len > -1)
				Main.instance.myLoader.cancelLoadData(URLConf.moduleLibs + s._depends[len] + URLConf.getLibVer(), s.dependLoadComp, s);
			s._depends = null;
		}
	}
	private getUrl(uiPath: string, libDirVer: any = null): string[] {
		let s = this;
		let loadPath: any;
		let url = [];
		let uiLibDirVer:string;
		//加入版本号		
		if (libDirVer == "" || libDirVer == null) {
			libDirVer = UserData.getInstance().getQueryVariable("libDirVer");
			if(libDirVer == null)
			{
				uiLibDirVer = GameManager.getInstance().getLibDirVer(uiPath);
				libDirVer = uiLibDirVer == null?"":uiPath + "V/" + uiLibDirVer;
			}						
		}
		let libDirVerStr:string = libDirVer == "" ? libDirVer : libDirVer + "/";
		// let arr: Array<any> = uiPath.split(".");//统一使用版本号控制整个目录，所以注释掉了
		// if (arr.length > 1) {
		// 	let mainModule: string;
		// 	mainModule = arr.shift();
		// 	loadPath = URLConf.moduleLibs + mainModule + "/" + libDirVerStr + arr.join("/");
		// }
		// else
			loadPath = URLConf.moduleLibs + libDirVerStr + uiPath.replace(/\./g, "/");
		url.push(loadPath,libDirVer);
		return url;
	}
	/**模块开始，初始化启动之前，预处理依赖库
	 * @param func 主框架处理完成后的回调
	 * @param thisObj 回调的指向
	 * @param depends 当前允许加入depends参数，加载模块使用的依赖库,[依赖库js文件名称,依赖库js文件名称,依赖库js文件名称]
	 * @param param 模块传入的附加参数
	*/
	public modulePreStart(func: Function = null, thisObj: any = null, depends: Array<any> = null, param: any = null): void {
		let s = this;
		let path: string;
		let flag: boolean;
		let libName:string,libVer:string;
		let tempUrlArr:string[];
		let arr:any[];
		s._callBack = func;
		s._thisObject = thisObj;
		s._param = param;
		s._depends = depends;
		s._dependCounts = 0;
		if (s._depends && s._depends.length > 0) {
			let i: number, len: number;
			len = s._depends.length;
			for (i = 0; i < len; ) {
				libVer = URLConf.getLibVer();
				tempUrlArr = s.getUrl(s._depends[i]);
				arr = tempUrlArr[0].split("/");
				libName = arr[arr.length - 1];
				path = tempUrlArr[0] + libVer;				
				if (GYLite.GYLoader.getDataResByKey(libName).length > 0)
				{
					Log.writeLog("公共库已存在!" + s._depends[i], Log.WARN);
					s._depends.splice(i,1);
					--len;					
					continue;
				}					
				++s._dependCounts;
				s._libList.push(path);
				// GameManager.getInstance().loadData(URLConf.moduleLibs + s._depends[i] + URLConf.getLibVer(), s.dependLoadComp, s);
				flag = true;
				++i;
			}			
			if (flag)
			{
				s.loadNextLib();
				return;
			}				
			// s._dependCounts = 1;
			s.resUncompressComp();
		}
		else
			s.preStartOn();
	}
	private loadNextLib():boolean
	{let s = this;
		let url:string;
		if(s._libList.length > 0)
		{
			url = s._libList.shift();			
			GameManager.getInstance().loadData(url, s.dependLoadComp, s, null, GYLite.GYLoader.TYPE_BINARY, HTTPConf.M_GET,null,true,null,FileType.LIB,FileID.LIB,UIControl.FAIL_RELOAD_COUNT);
			return true;
		}
		return false;			
	}
	private preStartOn(): void {
		let s = this;
		Log.writeLog(MultiLang.str17 + "-" + s._uiData.uiID, Log.IMPORTANT);
		if (s._callBack != null) {
			s._callBack.call(s._thisObject);
		}
	}
	/**模块开始，初始化之后启动之前
	 * @param func 主框架处理完成后的回调
	 * @param thisObj 回调的指向
	 * @param param 模块传入的附加参数
	*/
	public moduleStart(func: Function = null, thisObj: any = null, param: any = null): void {
		let s = this;
		s._callBack = func;
		s._thisObject = thisObj;
		//Bury.getInstance().startTime_2011 = s.startTime = GYLite.CommonUtil.loopTime;
		Log.writeLog(MultiLang.str18 + "-" + s._uiData.uiID, Log.IMPORTANT);
		if (s._callBack != null) {
			s._callBack.call(s._thisObject);
		}
	}

	/**模块结束，模块操作结束之后，结算之前
	 * @param func 主框架处理完成后的回调
	 * @param thisObj 回调的指向
	 * @param param 模块传入的附加参数
	*/
	public moduleEnd(func: Function = null, thisObj: any = null, param: any = null): void {
		let s = this;			
		s._callBack = func;
		s._thisObject = thisObj;
		Log.writeLog(MultiLang.str19 + "-" + s._uiData.uiID, Log.IMPORTANT);
		let curID: string = s._uiData.uiID;
		//清理settimeout
		let arr1 = EgretProto['_timeOut'][curID];
		if (arr1) {
			arr1 = arr1.slice(0, arr1.length);
			for (let key of arr1) {
				egret.clearTimeout(key);
			}
		}
		//清理setInterval
		let arr2 = EgretProto['_timeInterval'][curID];
		if (arr2) {
			arr2 = arr2.slice(0, arr2.length);
			for (let key of arr2) {
				egret.clearInterval(key);
			}
		}
		//清理Timer
		let arr3 = EgretProto['_timerDict'][curID];
		if (arr3) {
			arr3 = arr3.slice(0, arr3.length);
			for (let key of arr3) {
				key.stop();
			}
		}
		if (s._callBack != null) {
			s._callBack.call(s._thisObject);
		}
	}

	/**模块结算
	 * @param func 主框架处理完成后的回调
	 * @param thisObj 回调的指向
	 * @param param 模块传入的附加参数 {type:类型 1普通 2小交互 level:评级}
	*/
	public moduleAccount(func: Function = null, thisObj: any = null, param: any = null): void {
		let s = this;
		s._callBack = func;
		s._thisObject = thisObj;
		if(s._uiData)Log.writeLog(MultiLang.str20 + "-" + s._uiData.uiID + (param?",type:"+param.type+",level:"+param.level:""), Log.IMPORTANT);
		
		
		//统一调出结算
		if (s._callBack != null) {
			s._callBack.call(s._thisObject);
		}
	}

	/**模块退出，调用此方法前，确认模块的内存已经释放，如监听器都被移除了
	 * @param func 主框架处理完成后的回调
	 * @param thisObj 回调的指向
	 * @param param 模块传入的附加参数
	 * @param type 退出模块的类型
	 * @param jobRank 幼儿思维等级
	*/
	public moduleQuit(func: Function = null, thisObj: any = null, param: any = null): void {
		let s = this;		
		s._callBack = func;
		s._thisObject = thisObj;
		s._param = param;		
		s.doModuleQuit();
	}
	private doModuleQuit():void
	{let s = this;		
		if(s._callBack!=null)
			s._callBack.call(s._thisObject, s._param);
	}
	


	private dependLoadComp(l: GYLite.LoadInfo): void {
		let s = this;
		if (l.content == null) {
			// --s._dependCounts;
			Log.writeLog(MultiLang.str3 + l.path, Log.WARN);
			return;
		}
		Log.loadLog(l);
		// GYLite.TimeManager.timeOut(function(res,path):void{
			Main.instance.myLoader.loadGYCompressBytes(l.content.res, s.resUncompressComp, s, null, null, {key:l.path});
		// },s,0,l.content.res,l.path);
		
	}
	private resUncompressComp(l: GYLite.CompressLoadInfo = null): void {
		let s = this;
		let flag: boolean;
		if (l == null || l.resCount == 0) {				
			// --s._dependCounts;
			if(l)Log.uncompressLog(l,l.param.key);
			if (!s.loadNextLib())//没有下一个会返回false，结束流程//s._dependCounts == 0) 
			{
				let i: number, len: number;
				len = s._depends.length;
				for (i = 0; i < len; ++i) {					
					if (!GameManager.getInstance().debug) {
						let res: GYLite.ResObject = GYLite.GYLoader.getDataRes(URLConf.moduleLibsJS.replace(/\*/g, s._depends[i]));
						if (res == null) {
							Log.writeLog(MultiLang.str16 + s._depends[i], Log.WARN);
							flag = true;
						}
						else
						{						
							Log.recordTime();
							eval.call(window, res.res);//注入js
							Log.evalLog(s._depends[i]);
						}
							
					}
				}				
				if (flag)
					return;
				EgretProto.curRunUIID = s._uiData.uiID;
				EgretProto.inject(s._uiData.uiID);//注入覆盖egret的一些方法
				FairyGUIProto.inject();//注入覆盖fairygui的一些方法				
				s.preStartOn();//此处初始化模块，电脑约耗费100毫秒，看模块情况	
			}
			
		}
	}
	/**依赖库加载的百分比*/
	public get dependLoadedPercent(): number {
		let s = this;
		let max: number;
		if(s._dependCounts != s._dependCounts)return 0;
		max = s._depends ? s._depends.length : 0;
		return max == 0 ? 1 : (1 - s._libList.length / max);
	}
	public get depends(): Array<string> {
		return this._depends;
	}
	/**普通交互获取宝石个数
	 * @param wrongCount 错误次数
	 */
	public static getGemCount(wrongCount:number) {
		let gemCount = 1;
		switch(wrongCount){
			case 0:
				gemCount = 5;
				break;
			case 1:
				gemCount = 4;
				break;
			case 2:
				gemCount = 3;
				break;
			case 3:
				gemCount = 2;
				break;
			default:
				gemCount = 1;
				break
		}
		return gemCount;
	}
	/**小交互获取宝石个数
	 * @param time 用时s
	 */
	public static getGemCount2(time:number){
		let gemCount = 1;
		if(time>0&&time<=4){
			gemCount = 3;
		}else if(time>4&&time<10){
			gemCount = 2
		}else{
			gemCount = 1;
		}
		return gemCount;
	}
}