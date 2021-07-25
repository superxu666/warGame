class EgretProto {
	private static _resGroupDict: any = {};
	private static _dataResGroupDict: any = {};
	private static _fontDict: any = {};
	private static _dataDict: any = {};
	private static _fileDict: any = {};
	private static _timeOut: any = {};
	private static _timeInterval: any = {};
	private static _timerDict: any = {};
	public static curRunUIID:string;
	public constructor() {

	}
	public static inject(uiID: string): void {

		let eui;
		if (window["eui"] == null) {
			window["eui"] = {};
		}
		eui = window["eui"];
		eui.getAssets = function (key: string, callBack: Function, thisObject: any) {
			if (key == null) {
				Log.writeLog("资源key为空 ", Log.WARN);
				return;
			}
			let res: any;
			res = RES.getRes(key);

			if (callBack != null)
				callBack.call(thisObject, res);
		}
		//初始化egret资源字典
		let uiIDKey: string = UIControl.getUIIDPath(uiID);//如Main/login
		if (uiIDKey) {
			EgretProto._resGroupDict[uiIDKey] = GYLite.GYLoader.getResByKey(uiIDKey);
			EgretProto._dataResGroupDict[uiIDKey] = GYLite.GYLoader.getDataResByKey(uiIDKey);
			let res: any = EgretProto.getDataResByKey("default.res.json", uiIDKey);
			let i: number, len: number;
			if (res == null) {
				Log.writeLog(MultiLang.str65, Log.INFO);
			}
			else {
				if (EgretProto._fileDict[uiIDKey] == null)
					EgretProto._fileDict[uiIDKey] = {};
				let fileDict: any = EgretProto._fileDict[uiIDKey];
				let fileData: any;
				let arr: Array<string>;
				len = res.resources.length;
				for (i = 0; i < len; ++i) {
					fileData = res.resources[i];
					arr = fileData.url.split("/");
					fileData.fileName = arr[arr.length - 1];
					arr = fileData.fileName;
					fileData.ext = arr[arr.length - 1];
					fileDict[fileData.name] = fileData;
				}
			}
		}
		else {
			Log.writeLog(MultiLang.str24, Log.WARN);
		}



		egret.Timer.prototype.start = function () {
			if (this._running)
				return;
			let curID = UIControl.getInstance().curUIID;
			if (curID) {
				if (!EgretProto._timerDict[curID]) {
					EgretProto._timerDict[curID] = [];
				}
				EgretProto._timerDict[curID].push(this);
			}
			this.lastCount = this.updateInterval;
			this.lastTimeStamp = egret.getTimer();
			egret.ticker.$startTick(this.$update, this);
			this._running = true;
		};

		egret.Timer.prototype.stop = function () {
			if (!this._running)
				return;
			let curID = UIControl.getInstance().curUIID;
			if (curID) {
				let arr = EgretProto._timerDict[curID];
				if (arr) {
					let index = arr.indexOf(this);
					arr.splice(index, 1);
				}
			}
			egret.stopTick(this.$update, this);
			this._running = false;
		};

		//game.js注入
		var setTimeoutCache = {};
		var setTimeoutIndex = 0;
		var setTimeoutCount = 0;
		var lastTime = 0;
		egret.setTimeout = function (listener, thisObject, delay) {
			var args = [];
			for (var _i = 3; _i < arguments.length; _i++) {
				args[_i - 3] = arguments[_i];
			}
			var data = { listener: listener, thisObject: thisObject, delay: delay, params: args };
			setTimeoutCount++;
			if (setTimeoutCount == 1 && egret.ticker) {
				lastTime = egret.getTimer();
				egret.ticker.$startTick(timeoutUpdate, null);
			}
			setTimeoutIndex++;
			setTimeoutCache[setTimeoutIndex] = data;
			let curID = UIControl.getInstance().curUIID;
			if (curID) {
				if (!EgretProto._timeOut[curID]) {
					EgretProto._timeOut[curID] = [];
				}
				EgretProto._timeOut[curID].push(setTimeoutIndex);
			}
			return setTimeoutIndex;
		}

		function timeoutUpdate(timeStamp) {
			var dt = timeStamp - lastTime;
			lastTime = timeStamp;
			for (var key in setTimeoutCache) {
				var key2 = key;
				var data = setTimeoutCache[key2];
				data.delay -= dt;
				if (data.delay <= 0) {
					clearTimeout(key2);
					data.listener.apply(data.thisObject, data.params);
				}
			}
			return false;
		}
		egret.clearTimeout = clearTimeout;

		function clearTimeout(key) {
			if (setTimeoutCache[key]) {
				setTimeoutCount--;
				let curID = UIControl.getInstance().curUIID;
				if (curID) {
					let arr = EgretProto._timeOut[curID];
					if (arr) {
						let index = arr.indexOf(key);
						arr.splice(index, 1);
					}
				}
				delete setTimeoutCache[key];
				if (setTimeoutCount == 0 && egret.ticker) {
					egret.ticker.$stopTick(timeoutUpdate, null);
				}
			}
		}


		var setIntervalCache = {};
		var setIntervalIndex = 0;
		var setIntervalCount = 0;
		var lastIntervalTime = 0;

		egret.setInterval = function (listener, thisObject, delay) {
			var args = [];
			for (var _i = 3; _i < arguments.length; _i++) {
				args[_i - 3] = arguments[_i];
			}
			var data = { listener: listener, thisObject: thisObject, delay: delay, originDelay: delay, params: args };
			setIntervalCount++;
			if (setIntervalCount == 1) {
				lastIntervalTime = egret.getTimer();
				egret.ticker.$startTick(intervalUpdate, null);
			}
			setIntervalIndex++;
			setIntervalCache[setIntervalIndex] = data;
			let curID = UIControl.getInstance().curUIID;
			if (curID) {
				if (!EgretProto._timeInterval[curID]) {
					EgretProto._timeInterval[curID] = [];
				}
				EgretProto._timeInterval[curID].push(setIntervalIndex);
			}

			return setIntervalIndex;
		}

		egret.clearInterval = function clearInterval(key) {
			if (setIntervalCache[key]) {
				setIntervalCount--;
				let curID = UIControl.getInstance().curUIID;
				if (curID) {
					let arr = EgretProto._timeInterval[curID];
					if (arr) {
						let index = arr.indexOf(key);
						arr.splice(index, 1);
					}
				}
				delete setIntervalCache[key];
				if (setIntervalCount == 0) {
					egret.ticker.$stopTick(intervalUpdate, null);
				}
			}
		}

		function intervalUpdate(timeStamp) {
			var dt = timeStamp - lastIntervalTime;
			lastIntervalTime = timeStamp;
			for (var key in setIntervalCache) {
				var data = setIntervalCache[key];
				data.delay -= dt;
				if (data.delay <= 0) {
					data.delay = data.originDelay;
					data.listener.apply(data.thisObject, data.params);
				}
			}
			return false;
		}
	}
	/**获取数据资源
	 * @param key 数据键名 json则是_json结尾
	 * @param uiID 模块名称，没有则默认为当前模块，包含包路径
	*/
	public static getFileData(key: string, uiID: string = null): any {
		uiID = EgretProto.uiID2UIIDPath(uiID);
		let fileDict: any = EgretProto._fileDict[uiID];
		let s = this;
		if(fileDict == null)
		{
			for(var fileKey in EgretProto._fileDict)
			{
				if(EgretProto._fileDict[fileKey][key])
				{
					return EgretProto._fileDict[fileKey][key];
				}
			}
		}
		return fileDict[key];
	}
	/**获取数据资源
	 * @param key 数据键名 json则是_json结尾
	 * @param uiID 模块名称，没有则默认为当前模块，包含包路径
	 * @param check 检测提示
	*/
	public static getDataResByKey(key: string, uiID: string = null, check: boolean = true): any {
		let arr: Array<GYLite.ResObject>;
		let len: number;
		let res: GYLite.ResObject, dataRes: GYLite.ResObject;
		let ind: number;
		let resKey: string, mainKey: string;
		uiID = EgretProto.uiID2UIIDPath(uiID);
		resKey = uiID + "_" + key;
		if (EgretProto._dataDict[resKey] != null)
			return EgretProto._dataDict[resKey];
		// mainKey = key.replace("_json",".json");
		// mainKey = key.replace("_fui",".fui");
		arr = EgretProto._dataResGroupDict[uiID];
		len = arr.length;
		while (--len > -1) {
			res = arr[len];

			ind = res.pathKey.indexOf("/" + key);
			if (ind > -1) {
				dataRes = GYLite.GYLoader.getDataRes(res.pathKey);
				break;
			}


		}
		if (dataRes == null && check) {
			Log.writeLog("数据不存在 " + key, Log.INFO);
			return null;
		}
		EgretProto._dataDict[resKey] = dataRes.res;
		return dataRes.res;
	}
	/**获取字体资源
	 * @param key 字体键名 _fnt结尾
	 * @param uiID 模块名称，没有则默认为当前模块，包含包路径
	 * @param check 检测提示
	*/
	public static getFontByKey(key: string, uiID: string = null, check: boolean = true): any {
		let arr: Array<GYLite.ResObject>;
		let len: number;
		let res: GYLite.ResObject, pngRes: GYLite.ResObject, jsonRes: GYLite.ResObject;
		let ind: number;
		let fontKey: string;
		uiID = EgretProto.uiID2UIIDPath(uiID);
		fontKey = uiID + "_" + key;
		if (EgretProto._fontDict[fontKey] != null)
			return EgretProto._fontDict[fontKey];
		// pngKey = key.replace("_fnt",".png");
		arr = EgretProto._dataResGroupDict[uiID];
		len = arr.length;
		while (--len > -1) {
			res = arr[len];

			ind = res.pathKey.indexOf("/" + key);
			if (ind > -1) {
				pngRes = GYLite.GYLoader.getRes(res.pathKey.replace(".fnt", ".png"));
				jsonRes = GYLite.GYLoader.getDataRes(res.pathKey);
				break;
			}


		}
		if (pngRes == null && check) {
			if (pngRes == null) {
				Log.writeLog("字体图集不存在 " + key, Log.WARN);
			}
			if (jsonRes == null) {
				Log.writeLog("字体配置不存在 " + key, Log.WARN);
			}
			return null;
		}
		EgretProto._fontDict[fontKey] = new egret.BitmapFont(pngRes.res, jsonRes.res);
		return EgretProto._fontDict[fontKey];
	}
	/**获取图片资源
	 * @param key 图片键名 图集小图只需要名称，不需要后缀名，PS：白鹭的图集小图，只根据名称进行查询，所以此方法内部会根据uiID进行遍历查询
	 * @param alias 图集名称，需要后缀名
	 * @param uiID 模块名称，没有则默认为当前模块，包含包路径
	 * @param check 检测提示
	*/
	public static getResByKey(key: string, alias: string = null, uiID: string = null, check: boolean = true): any {
		let arr: Array<GYLite.ResObject>;
		let len: number;
		let res: GYLite.ResObject, res2: GYLite.ResObject;
		let ind: number;
		uiID = EgretProto.uiID2UIIDPath(uiID);
		arr = EgretProto._resGroupDict[uiID];
		// key = key.replace("_jpg",".jpg");
		// key = key.replace("_png",".png");
		// key = key.replace("_mp3",".mp3");
		// key = key.replace("_wav",".wav");
		len = arr.length;
		while (--len > -1) {
			res = arr[len];

			if (alias == null) {
				ind = res.pathKey.indexOf("/" + key);
				if (ind > -1) {
					res2 = GYLite.GYLoader.getRes(res.pathKey, null);
					break;
				}
			}
			else {
				ind = res.pathKey.indexOf("/" + alias);
				if (ind > -1) {
					res2 = GYLite.GYLoader.getRes(key, res.pathKey);
					break;
				}
			}

		}
		if (res2 == null && check) {
			Log.writeLog("资源不存在 " + key + "-" + alias, Log.WARN);
			return null;
		}
		return res2.res;
	}


	public static deleteResByKey(deleteKey: string): void {
		let ind: number;
		for (var key in EgretProto._resGroupDict) {
			ind = key.indexOf(deleteKey);
			if (ind == 0 || key.indexOf("/" + deleteKey) > -1) {
				delete EgretProto._resGroupDict[key];
				delete EgretProto._dataResGroupDict[key];				
			}
		}
		for (var key in EgretProto._dataDict) {
			ind = key.indexOf(deleteKey);
			if (ind == 0 || key.indexOf("/" + deleteKey) > -1) {
				delete EgretProto._dataDict[key];
			}
		}
		for (var key in EgretProto._fontDict) {
			ind = key.indexOf(deleteKey + "_");
			if (ind == 0) {
				EgretProto._fontDict[key].dispose();
				delete EgretProto._fontDict[key];
			}
		}
		if (EgretProto._fileDict[deleteKey])
			delete EgretProto._fileDict[deleteKey];
	}
	private static uiID2UIIDPath(uiID: string): string {
		if(EgretProto.curRunUIID!=null)
			uiID = EgretProto.curRunUIID;
		if (uiID == null)
			uiID = UIControl.getInstance().curUIIDPath;
		else
			uiID = uiID.replace(/\./g, "/");
		return uiID;
	}
}