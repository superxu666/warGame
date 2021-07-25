class Log {
	public constructor() {
		
	}
	public static LONG_LOADTIME:number = 100;
	public static LONG_UNCOMPRESSTIME:number = 200;
	public static LONG_EVALTIME:number = 50;
	public static costTicker:number=0;
	public static costRender:number=0;
	private static _startTime:number;
	public static ERROR:number = 1;
	public static WARN:number = (1<<1);
	public static IMPORTANT:number = (1<<2);
	public static INFO:number = (1<<3);
	public static VERBOSE:number = (1<<4);
	public static uploadLevel:number = 1+2+4;
	public static printLevel:number = 1+2+4+8;
	public static userDataInited:boolean;
	private static _date:Date = new Date;
	private static logsArr:string[] = [];
	private static _reportCloseCount:number=0;
	private static _errorCount:number=0;
	private static _reportTime:number;
	private static _debugLog:string[]=[];
	private static _filterLog:string[]=[];
	public static logArea:LogPanel;	
	private static logReporting:boolean;
	public static lastModuleInfo:string[]=[];
	public static init():void
	{
		if(GameManager.getInstance().debug || UserData.getInstance().getQueryVariable("debug") == 1 || egret.nativeRender)
			Log.printLevel = 1+2+4+8+16;
		else
			Log.printLevel = 1+2;
			
		if (!window['vConsole'] && UserData.getInstance().getQueryVariable("vconsole")==null)
		{
			window.onerror = function(message, source, lineno, colno, error):void{
				var str:string = message;
				++Log._errorCount;
				source && (str += source.replace(location.origin, "")),
				(lineno || colno) && (str += ":" + lineno + ":" + colno)
				str += "\n" + (error?error.stack:"no Info!");
				str = "[" + Log._date.toUTCString() + "]" + str;
				str = "ERROR_"+str + "\n";
				Log.addDebugLog(str);
				Log.showLog();
				//后面做堆栈报错上报	
				Log.reportLog(str);
				localStorage.setItem("wdCode","上一次的报错:" + str);
			}
		}			
	}	
	public static filterDebug(key:string):void
	{
		let s = this;
		let i:number,len:number;
		Log._filterLog.length =0;		
		len = Log._debugLog.length;
		for(i=0;i<len;++i)
		{
			if(Log._debugLog[i].indexOf(key) > -1 || "VERBOSE" == key)
				Log._filterLog.push(Log._debugLog[i]);
		}
		s.logArea.logList.invalidData();
	}
	public static addDebugLog(content:string):void
	{
		let isDebug:boolean = GameManager.getInstance().debug || UserData.getInstance().getQueryVariable("debug") == 1 || egret.nativeRender;
		if(isDebug)
		{	
			content = content + "\n";
			if(Log.logArea)			
				Log.logArea.logList.addItem(content);
			else
				Log._debugLog.push(content);
		}
	}
	public static writeLog(content:string, level:number = 8, upload:boolean=false, debugInfo:boolean=false):void
	{		
		Log._date.setTime(Date.now());
		content = "[" + Log._date.toUTCString() + "-" + egret.getTimer() + "-" + Log.costRender + "-" + Log.costTicker +"]" + content;
		if(level == Log.ERROR && (Log.printLevel & level) > 0)
		{	
			Log.addDebugLog("ERROR_"+content);			
			console.error(content);
		}
		else if(level == Log.WARN && (Log.printLevel & level) > 0)
		{			
			Log.addDebugLog("WARN_"+content);
			console.warn(content);
		}
		else if(level == Log.IMPORTANT && (Log.printLevel & level) > 0)
		{
			Log.addDebugLog("IMPORTANT_"+content);
			console.warn(content);
		}
		else if((Log.printLevel & level) > 0)
		{
			Log.addDebugLog(content);	
			console.log(content);
		}		
		//后面做打印信息上报		
		if((Log.uploadLevel & level) > 0 || upload)
		{
			if(!GameManager.getInstance().debug && !UserData.getInstance().getUrlDebug())
			{
				if(level == Log.ERROR)
					Log.reportLog("ERROR_"+content);
				else if(level == Log.WARN)
					Log.reportLog("WARN_"+content);
				else if(level == Log.IMPORTANT)
					Log.reportLog("IMPORTANT_"+content);
			}				
		}		
	}

	private static reportLog(content: string): void {
		let s = this;
		if(Log.userDataInited)
		{
			if (Log.logsArr.length > 0) {
				Log.logsArr.push(content);
				Log._date.setTime(Date.now());				
				let str:string;
				str = "[" + Log._date.toUTCString() + "-" + egret.getTimer() + "]" + (window["logString"]?window["logString"]:"");
				for (let logContent of Log.logsArr) {
					str += logContent + "\n";
				}
				content = str;
				Log.logsArr.length = 0;
			}			
		}
		else
		{
			Log.logsArr.push(content);
			return;
		}

		if(s._reportCloseCount > 12 || Log._errorCount > 4){
			return;
		}
		if(Log.logReporting)return;
		Log.logReporting = true;
		if(Date.now() - s._reportTime < 2000)		
			++s._reportCloseCount;		
		else
			s._reportCloseCount = 0;

		
		//未对接口，暂时注释
		// HttpMsg.getInstance().sendMsg(HTTPConf.BURYINFO,d,HTTPConf.M_POST);

		s._reportTime = Date.now();
		Log.logReporting = false;
	}
	public static readProgressLog(progressInfo:any[]):string
	{
		let i:number,len:number;
		let str:string = "";
		let obj:any;
		len = progressInfo.length;
		for(i=0;i<len;++i)
		{
			obj = progressInfo[i];
			str += "state:" + obj.state + "  status:" + obj.status + "  time:" + obj.time + "\n";
		}
		return str;
	}
	/**打印加载详情*/
	public static loadLog(l:GYLite.LoadInfo):void
	{
		let t:number = Date.now() - l.startTime;
		if(t > Log.LONG_LOADTIME)
		{		
			let str:string;
			str = Log.readProgressLog(l.progressInfo);
			Log.writeLog("TIME_当前加载耗时过长："+l.path+" -> " + t + "ms\n详情："+str, Log.IMPORTANT);
		}
		else
			Log.writeLog("TIME_加载完成："+l.path+" -> "+t+"ms", Log.IMPORTANT);
	}
	public static uncompressLog(l:GYLite.CompressLoadInfo,key:string=""):void
	{
		let t:number = Date.now() - l.startTime;
		let i:number,len:number;
		let str:string;
		let obj:any;
		len = l.progressInfo.length;
		obj = l.progressInfo[0];
		str = "文件数量:" + obj.length + "  版本:" + obj.version + "  大小:" + obj.size + "\n";
		Log.lastModuleInfo.push("url:"+key + " " + str);
		if(Log.lastModuleInfo.length > 10)
			Log.lastModuleInfo.shift();
		if(t > Log.LONG_UNCOMPRESSTIME)
		{			
			for(i=1;i<len;++i)
			{
				obj = l.progressInfo[i];
				str += "compress:" + obj.compress + "  key:" + obj.key + "  time:" + obj.time + "\n";
			}		
			Log.writeLog("TIME_解压耗时过长："+key+" -> "+ t + "ms\n详情："+str, Log.IMPORTANT);
		}
		else
			Log.writeLog("TIME_解压完成："+key+" -> " + t + "ms\n详情：" + str, Log.IMPORTANT);
	}
	public static evalLog(key:string):void
	{
		let t:number = Date.now() - Log._startTime;
		if(t > Log.LONG_EVALTIME)
			Log.writeLog("TIME_解析耗时过长："+key+" -> "+t+"ms", Log.IMPORTANT);
		else
			Log.writeLog("TIME_解析完成："+key+" -> "+t+"ms", Log.IMPORTANT);
	}
	public static recordTime():void
	{
		Log._startTime = Date.now();
	}
	public static showLog(show:boolean=true):void
	{
		let s = this;
		if(Log.logArea == null)
		{
			Log.logArea = new LogPanel;			
			Log.logArea.y = 100;
			let str:string = localStorage.getItem("wdCode");
			if(str)
				Log.addDebugLog(str);
			s.filterDebug("VERBOSE");
			Log.logArea.logList.dataProvider = Log._filterLog;
			Log.logArea.logList.vScroller.position = Log.logArea.logList.vScroller.maximum;
		}
		if(show)
		{
			// if(Log.logArea.parent == null)
				// GYLite.GYSprite.stage.addChild(Log.logArea);
			Log.logArea.show(LayerManager.getInstance().gameSp);
		}		
		else if(Log.logArea.parent)
			Log.logArea.hide();
	}

	public static pathShape:GYLite.GYSprite;
	public static drawTriPath(vertArr:number[],indiceArr:number[]):void
	{
		if(Log.pathShape == null)
		{
			Log.pathShape = new GYLite.GYSprite;
			Log.pathShape.x = 500;
			Log.pathShape.y = 500;
			GYLite.GYSprite.stage.addChild(Log.pathShape);
		}
		let g:egret.Graphics;
		g = Log.pathShape.graphics;
		g.clear();
		// g.beginFill(0xff0000,0.5);
		g.lineStyle(1,0xff0000);
		let i:number,len:number;
		let ind:number;
		len = indiceArr.length;
		for(i=0;i<len;i+=3)
		{
			ind = indiceArr[i]*2;
			g.moveTo(vertArr[ind],vertArr[ind+1]);
			ind = indiceArr[i+1]*2;
			g.lineTo(vertArr[ind],vertArr[ind+1]);
			ind = indiceArr[i+2]*2;
			g.lineTo(vertArr[ind],vertArr[ind+1]);
			ind = indiceArr[i]*2;
			g.lineTo(vertArr[ind],vertArr[ind+1]);
		}		
	}
}