class RES {
	public constructor() {
	}
	public static VersionController:any;
	public static vcs:any;
	public static getVirtualUrl(url:string):string
	{		
		return RES.vcs?RES.getVirtualUrl(url):url;
	}
	public static getRes(key:string,uiID:string=null):any
	{
		if(key == null)
		{
			Log.writeLog(MultiLang.str31, Log.ERROR);
			return;
		}
		let res:any;
		let arr:Array<string> = key.split(".");
		let mainKey:string;
		let fileData:any;
		mainKey = arr[0];
		fileData = EgretProto.getFileData(mainKey,uiID);
		if(fileData == null)
		{
			Log.writeLog(MultiLang.str26 + ":mainKey", Log.INFO);
			return null;
		}
		if(fileData.type == "sheet")
		{
			mainKey = mainKey.replace("_json","");			
			res = EgretProto.getResByKey(arr[1],fileData.fileName.replace(".json",".png"));
		}				
		else
		{			
			if(fileData.type == "font")
			{
				res = EgretProto.getFontByKey(fileData.fileName);
			}				
			else if(fileData.type == "image")
			{				
				res = EgretProto.getResByKey(fileData.fileName);
			}
			else if(fileData.type == "bin")
			{
				res = EgretProto.getDataResByKey(fileData.fileName);
			}
			else if(fileData.type == "sound")
			{					
				res = EgretProto.getResByKey(fileData.fileName);
			}
			else
			{
				res = EgretProto.getDataResByKey(fileData.fileName);
			}
		}
		return res;
	}
	public static getResAsync(key:string, callBack:Function = null, thisObject:any = null):Promise<any>
	{
		let res:any;
		let mainKey:string;
		if(key == null)
		{
			Log.writeLog(MultiLang.str31, Log.ERROR);
			return;
		}
		res = RES.getRes(key);
		if(res == null)
		{
			let arr:Array<string> = key.split(".");
			mainKey = arr[0];
			if(arr.length == 2)
			{				
				arr[0] = mainKey = mainKey.replace("_json","");					
				Main.instance.myLoader.loadData(mainKey + ".json",function(l:GYLite.LoadInfo):void{
					Main.instance.myLoader.loadPath(mainKey + ".png",function(l:GYLite.LoadInfo):void{
						if(l.param.json == null || l.content == null)
						{
							Log.writeLog("资源不存在 " + arr[0] + "-" + arr[1], Log.WARN);
							if(l.param.callBack!=null)
								l.param.callBack.call(l.param.thisObject, null, l.param.paramKey);
						}
						else if(l.param.callBack!=null)
							l.param.callBack.call(l.param.thisObject, EgretProto.getResByKey(arr[1], arr[0] + ".png"), l.param.paramKey);
					},null,GYLite.GYLoader.TYPE_IMAGE,{json:l.content.res,paramKey:arr,callBack:callBack,thisObject:thisObject});
				},null,null,GYLite.GYLoader.TYPE_JSON,"get",{paramKey:arr,callBack:callBack,thisObject:thisObject});
			}				
			else
			{
				if(mainKey.indexOf("_fnt") > -1)
				{					
					Main.instance.myLoader.loadData(mainKey.replace("_fnt",".fnt"),function(l:GYLite.LoadInfo):void{
						Main.instance.myLoader.loadPath(mainKey.replace("_fnt",".png"),function(l:GYLite.LoadInfo):void{
							if(l.param.json == null || l.content == null)
							{
								Log.writeLog("字体不存在 " + l.param.paramKey, Log.WARN);
								if(l.param.callBack!=null)
									l.param.callBack.call(l.param.thisObject, null, l.param.paramKey);
							}
							else if(l.param.callBack!=null)
								l.param.callBack.call(l.param.thisObject, EgretProto.getFontByKey(mainKey));
						},null,GYLite.GYLoader.TYPE_IMAGE,{json:l.content.res,paramKey:mainKey,callBack:callBack,thisObject:thisObject});
					},null,null,GYLite.GYLoader.TYPE_JSON,"get",{paramKey:mainKey,callBack:callBack,thisObject:thisObject});
					
				}
				else if(mainKey.indexOf("_json") > -1)
				{
					Main.instance.myLoader.loadData(mainKey,function(l:GYLite.LoadInfo):void{
						if(l.param.json == null || l.content == null)
						{
							Log.writeLog("json数据不存在 " + l.param.paramKey, Log.WARN);
							if(l.param.callBack!=null)
								l.param.callBack.call(l.param.thisObject, null, l.param.paramKey);
						}
						else if(l.param.callBack!=null)
							l.param.callBack.call(l.param.thisObject, EgretProto.getDataResByKey(mainKey), l.param.paramKey);
					},null,null,GYLite.GYLoader.TYPE_JSON,"get",{paramKey:mainKey,callBack:callBack,thisObject:thisObject});					
				}
				else
				{
					mainKey = mainKey.replace("_jpg",".jpg");
					mainKey = mainKey.replace("_png",".png");
					Main.instance.myLoader.loadPath(mainKey,function(l:GYLite.LoadInfo):void{
						if(l.param.json == null || l.content == null)
						{
							Log.writeLog("图片不存在 " + l.param.paramKey, Log.WARN);
							if(l.param.callBack!=null)
								l.param.callBack.call(l.param.thisObject, null, l.param.paramKey);
						}
						else if(l.param.callBack!=null)
							l.param.callBack.call(l.param.thisObject, EgretProto.getResByKey(mainKey), l.param.paramKey);
					},null,GYLite.GYLoader.TYPE_IMAGE,{parmaKey:mainKey,callBack:callBack,thisObject:thisObject});					
				}				
			}
		}
		return Promise.resolve(res);
	}

	public static loadGroup(name, priority, reporter):void
	{
		Log.writeLog("暂时不支持组加载", Log.ERROR);
	}
	public static createGroup(name, keys, override):void
	{
		Log.writeLog("暂时不支持组", Log.ERROR);
	}
	public static getResByUrl(url: string, compFunc?: Function, thisObject?: any, type?: string): Promise<any>
	{
		Log.writeLog("暂时不支持getResByUrl", Log.ERROR);
		return Promise.reject(null);
	}
}
class NativeVersionController{
	public versionInfo:any;
	public init() {
		this.versionInfo = this.getLocalData("all.manifest");
		return Promise.resolve();
	}
	public getVirtualUrl(url) {
		return url;
	};
	public getLocalData(filePath) {
		if (egret_native.readUpdateFileSync && egret_native.readResourceFileSync) {
			//先取更新目录
			var content = egret_native.readUpdateFileSync(filePath);
			if (content != null) {
				return JSON.parse(content);
			}
			//再取资源目录
			content = egret_native.readResourceFileSync(filePath);
			if (content != null) {
				return JSON.parse(content);
			}
		}
		return null;
	}	
}