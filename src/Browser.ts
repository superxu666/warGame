class Browser {
	public static userAgent = window.navigator.userAgent;
	public static u= Browser.userAgent;
	public static onIOS= !!Browser.u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/);
	public static onMobile= Browser.u.indexOf("Mobile")>-1;
	public static onIPhone= Browser.u.indexOf("iPhone")>-1;
	public static onMac= Browser.u.indexOf("Mac OS X")>-1;
	public static onIPad= Browser.u.indexOf("iPad")>-1;
	public static onAndroid= Browser.u.indexOf('Android')>-1 || Browser.u.indexOf('Adr')>-1;
	public static onWP= Browser.u.indexOf("Windows Phone")>-1;
	public static onQQBrowser= Browser.u.indexOf("QQBrowser")>-1;
	public static onMQQBrowser= Browser.u.indexOf("MQQBrowser")>-1 || (Browser.u.indexOf("Mobile")>-1 && Browser.u.indexOf("QQ")>-1);
	public static onIE= !!window["ActiveXObject"] || "ActiveXObject" in window;
	public static onWeiXin= Browser.u.indexOf('MicroMessenger')>-1;
	public static onPC= !Browser.onMobile;
	public static onSafari= Browser.u.indexOf("Safari")>-1;
	public static onFirefox= Browser.u.indexOf('Firefox')>-1;
	public static onEdge= Browser.u.indexOf('Edge')>-1;
	public static onMiniGame= Browser.u.indexOf('MiniGame')>-1;
	public static onBDMiniGame= Browser.u.indexOf('SwanGame')>-1;
	public static onLimixiu= Browser.u.indexOf('limixiu')>-1;
	public static onWinXP = Browser.u.indexOf("Windows NT 5.1") > -1 || Browser.u.indexOf("Windows XP") > -1;
	public static httpProtocol= window.location.protocol=="http:";
	private static _iosVer:number=NaN;
	/**浏览器初始化*/
	public static browswerInit():void
	{		
	}
	/**获取ios系统版本*/
	public static getIOSVer():number
	{
		let s = this;
		if(s._iosVer == s._iosVer)
			return s._iosVer;
		var arr:Array<any> = Browser.userAgent.match(/ OS [0-9_]+? /g);
		if (arr==null || arr.length == 0) return 0;
		var str:String = arr[0];
		arr = str.split(" ");
		s._iosVer = arr[2].split("_")[0] | 0;
		return s._iosVer;
	}
	/**主动抛出一个鼠标事件
	 * @param obj 抛出事件的dom对象
	*/
	public static dispatch_click(obj) {
		var ev = document.createEvent("MouseEvents");
		ev.initMouseEvent(
			"click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null
		);
		obj.dispatchEvent(ev);
	}
	/**下载文件 ,调用方法 download("save.txt","内容");
	 * @param obj 抛出事件的dom对象
	 * @param data ArrayBuffer 或者 Blob
	 * @param type mimeType {type:"image/png"}等
	*/
	public static download(name, data, type:any = null) {
		var urlObject = window.URL || window["webkitURL"] || window;

		var downloadData = GYLite.CommonUtil.GYIs(data,Blob)?data:new Blob(GYLite.CommonUtil.GYIs(data,Array)?data:[data],type);

		var save_link:any = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
		save_link.href = urlObject.createObjectURL(downloadData);
		save_link.download = name;
		Browser.dispatch_click(save_link);
	}
	/**上传文件
	 * @param callBack 选择文件之后的回调，返回参数blob，function(blob:Blob):void{},multi为true的情况，参数为数组[blob,blob……]
	 * @param thisObj 域
	 * @param accept 接受的文件类型 如png图片 "image/png",任意类型图片"image/*"
	 * @param param 附件回调的参数
	 * @param multi 是否上传多个文件
	*/
	public static upload(callBack:Function,thisObj:any,accept:string="image/png",param:any=null,multi:boolean=false):void
	{
		var upload_link:any = document.createElementNS("http://www.w3.org/1999/xhtml", "input")
		upload_link.type = "file";
		upload_link.id = "file";
		upload_link.accept=accept;
		upload_link.param = param;
		if(multi)upload_link.multiple="multiple";
		upload_link.onchange = function(e):void{
			if(callBack!=null)
			{
				if(multi)
					callBack.call(thisObj,e.target.files,e.target.param);
				else
					callBack.call(thisObj,e.target.files[0],e.target.param);
			}
				
		};		
		upload_link.style = "filter:alpha(opacity=0);opacity:0;width: 0;height: 0;";		
		Browser.dispatch_click(upload_link);
	}
}