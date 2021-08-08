class HttpMsg {

	private static _instance:HttpMsg;	
	public static getInstance():HttpMsg
	{
		if(HttpMsg._instance == null)
			HttpMsg._instance = new HttpMsg;
		return HttpMsg._instance;
	}
	private _http:GYLite.GYLoader;
	private _header:Array<any>;
	private _contentType:string;
	private _c:number = 0;
	private _nativeDict:any={};
	private _cacheDict:any={};
	private _nativeIDCount:number;
	public constructor() {
		let s = this;
		s._http = new GYLite.GYLoader(0,5);
		s._contentType = "application/json;charset=UTF-8";
		s._nativeIDCount = 0;
		MsgBase.getMsgHandle().regMsg(MsgBase.TOKEN_EXPIRED,s.tokenHttpBack,s);
	}
	public get header():Array<any>
	{let s = this;		
		// if(s._header)return s._header;
		if(MsgBase.haveMsgHandle())
		{
			s._header = [
					{key:"token",value:UserData.getInstance().token}					
				];
		}
		else
		{
			s._header = [
					{key:"Authorization",value:UserData.getInstance().token},
				];
		}			
		
		return s._header;
	}


	//##  更新讲次学习状态
	//code:1001, uri:"/v1/app/section/updateSectionStatus"
	//##  更新环节学习状态
	//code:1002, uri:"/v1/app/section/updateLinkStatus"

	// ## 更新用户当前课程下该班期中的讲次定位
	// code :1003,  uri:"/v1/app/course/learnerSectionLocation"

	// ## 更新用户当前课程下该班期中的环节定位
	// code :1004,  uri:"/v1/learnerLinkLogs/learnerLinkLocation"
	private codeDic = {"section/updateSectionStatus":1001,
						"section/updateLinkStatus":1002,
						"course/learnerSectionLocation":1003,
						"learnerLink/learnerLinkLocation":1004,
						"classroom/score":1005,
						}
	public getCodeByURL(URL)
	{
		let s  = this;
		let keyArr = URL.split("/v1/app/")
		if(keyArr && keyArr.length>1)
		{
			let keyArr2 = keyArr[1].split("?")
			return s.codeDic[keyArr2[0]];
		}
		return null
	}

	public getIsInDic(URL)
	{
		let s = this;
		if(URL!="")
		{
			for(let k in s._cacheDict)
			{
				if(URL.indexOf(k)!=-1)
				{
					return true;
				}
			}
		}
		return false
	}
	public setHeaderTime(time:number):void
	{
		let s = this;
		let len:number;
		len = s.header.length;
		while(--len>-1)
		{
			if("klzz_ol_home_time" == s.header[len].key)
			{
				s.header[len].value = time;
				break;
			}
				

		}		
	}

	/**添加缓存的http接口，当发送失败会进行缓存，下次进入程序时重新发送*/
	public addCacheHttp(url:string):void
	{
		let s = this;
		s._cacheDict[url] = url;
	}
	/**移除缓存的http接口，*/
	public removeCacheHttp(url:string):void
	{
		let s = this;
		delete s._cacheDict[url];
	}
	
	/**发送http请求
	 * @param url 请求接口
	 * @param data 发送的数据
	 * @param callBack 返回的回调
	 * @param thisObj 回调指向
	 * @param contentType 参数格式
	 * @param param 参数，不能传大数据，只能传小json
	 * @param randomParam 是否加随机数
	*/
	public sendMsg(url:string, data:any, method:string = "POST", callBack:Function=null, thisObj:any=null,contentType:string=null,param:any = null,randomParam:boolean=false):void
	{
		let s = this;
		let str:any;
		let newData:any;
		// s.setHeaderTime(Date.now()/1000|0);
		if(contentType == null)
			contentType = s._contentType;
		if(randomParam)
		{
			if(url.indexOf("?") > -1)
				url += "rrr=" + (++s._c);
			else
				url += "?rrr=" + (++s._c);
		}
		url = url.indexOf("http")==0?url:(UserData.getInstance().root + url);
		
		if(method.toLocaleUpperCase() == HTTPConf.M_GET && data)
		{
			str = HttpMsg.Json2Query(data);
			url += "?" + str;
		}
		else if(contentType == HTTPConf.MULTIPART)
		{			
			contentType = "";			
			str = HttpMsg.Json2FormData(data);
		}
		else if(GYLite.CommonUtil.GYIs(data, GYLite.URLVariables) || GYLite.CommonUtil.GYIs(data, FormData))
		{
			GYLite.CommonUtil.GYIs(data, FormData)				
			str = data;
		}
		else
			str = JSON.stringify(data);		
		newData = str;
		
		Log.writeLog("NET_" + MultiLang.str14 + url + "\ndata:" + str, Log.VERBOSE);
		let t = s.header
		s._http.httpSend(url, s.recvMsg, s, GYLite.GYLoader.TYPE_TEXT, method, s.header, newData, contentType, {func:callBack,thisObject:thisObj,param:param});

	}
	public recvMsg(l:GYLite.LoadInfo):void
	{
		let d:any;
		let dt:number = Date.now() - l.startTime;
		if(dt > 2000)
		{
			let str:string = Log.readProgressLog(l.progressInfo);
			Log.writeLog("NET_time_cause longTime:"+ dt + "ms-" + l.path + "\n详情：" + str,Log.WARN);
		}
		if(l.content)
		{
			if(GYLite.CommonUtil.GYIs(l.content.res, String))
				d = l.content.res == ""?{}:JSON.parse(l.content.res);
			else
				d = l.content.res;
			let errorCode = d.code;
			if(errorCode && (errorCode + "").search(/1000014/) != -1){
				Log.writeLog("NET_" + MultiLang.str33 + MsgBase.TOKEN_EXPIRED + "-" + d.errorCode + "-" + UserData.getInstance().token, Log.WARN);				
				
				MsgBase.getMsgHandle().sendMsg(MsgBase.TOKEN_EXPIRED);
			}  
		}
		let s= this;		
		Log.writeLog("NET_" + MultiLang.str15 + l.path + "\ndata:"+ (d?JSON.stringify(d):null) + "#" + l.msg, Log.VERBOSE);
		if(l.param.func!=null)
		{
			if((<Function>l.param.func).length == 2)
				l.param.func.call(l.param.thisObject, d,l.param.param);
			else	
				l.param.func.call(l.param.thisObject, d);
		}
			
	}
	public static Json2FormData(d:any):FormData
	{
		let str:string = "";
		let formData:FormData = new FormData;
		for(var key in d)
		{
			formData.append(key, d[key]);			
		}
		return formData;
	}
	
	public static Json2URLVariables(d:any):GYLite.URLVariables
	{
		let str:string = "";
		for(var key in d)
		{
			str += key + "=" + d[key] + "&";
		}
		str = str.substr(0, str.length - 1);
		return new GYLite.URLVariables(str);
	}
	public static Json2Query(d:any):string
	{
		let str:string = "";
		for(var key in d)
		{
			str += key + "=" + d[key] + "&";
		}
		str = str.substr(0, str.length - 1);
		return str;
	}
	public static query2Json(str:string):any
	{
		let arr:Array<string> = str.split("&");
		let i:number,len:number;
		let arr2:Array<any>;
		let obj:any = {};
		len = arr.length;
		for(i=0;i<len;++i)
		{
			arr2 = arr[i].split("=");
			obj[arr2[0]] = arr2[1];
		}
		return obj;
	}
	/**base64转Blob*/
	public static dataURLtoBlob(base64:string):Blob {
        let arr:string[] = base64.split(',');
        let mime:string = arr[0].match(/:(.*?);/)[1];
        let bstr:string = atob(arr[1]);
        let n:number = bstr.length;
        let u8arr:Uint8Array = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
	/**base64转字节数组*/
	public static base64ToArrayBuffer(base64:string):ArrayBuffer
	{		
		let bstr:string;
		let n:number;		
		bstr = atob(base64);
		n = bstr.length;
		let u8arr:Uint8Array = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return u8arr;
	}
	/**数据检验
	 * @param d 数据
	 * @return 返回是否报错
	*/
	public static errorCheck(d:any):boolean
	{let s = this;
		if(d && d.errorCode == "00") 
		{
			return false;
		}
		Log.writeLog("NET_" + (d?"error:"+ d.errorCode + "-" + d.errorMessage:"error:null"),Log.WARN);
		return true;
	}

	private tokenHttpBack(d:any):void
	{let s =this;
			if(d == null)return;
			if(d.data)
			{
				let data:any = d.data;
				s._header = null;
				UserData.getInstance().token = data.token;
				Log.writeLog(("tokenHttpBack:" + d.data.token),Log.IMPORTANT);
			}	
		// Log.writeLog(("tokenHttpBack:" + d.data),Log.IMPORTANT);
	}
}