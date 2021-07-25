class MsgMobile extends MsgBase{
	private static _instance:MsgMobile;
	public static getInstance():MsgMobile
	{
		if(MsgMobile._instance == null)
			MsgMobile._instance = new MsgMobile;
		return MsgMobile._instance;
	}	
	public constructor() {
		super();		
		let s= this;
		if(egret.nativeRender)
			egret.ExternalInterface.addCallback("ocCallJs", s.ocCallJs.bind(s));
		else
			window["ocCallJs"] = s.ocCallJs.bind(s);
		
		// if(!window["webkit"])
		// {
		// 	Log.writeLog("MSG_" + MultiLang.str30,Log.WARN);
		// 	return;
		// }
		//window["webkit"].messageHandlers.handleIpadClose.addEventListener("message", s.onRecvMsg.bind(s), false);			
	}	
	public ocCallJs(d:any):void
	{let s = this;		
		s.onRecvMsg(d);
	}
	public sendMsg(protocol:String, data:Object = null):void
	{
		let s = this;
		var obj:any = {};		
		let printStr:string;
		obj.protocol = protocol;
		obj.data = data;		
		var msg:string = JSON.stringify(obj);
		if (Browser.onIOS) {
			if(!window["webkit"])
			{
				Log.writeLog("MSG_" + MultiLang.str30,Log.WARN);
				return;
			}						
			printStr = "MSG_" + MultiLang.str33 + msg;
			window["webkit"].messageHandlers.webCall.postMessage(msg, "*");	
		}
		else if (Browser.onAndroid) {
			if (!window["WebViewJavascriptBridge"]) {
				Log.writeLog("MSG_no android",Log.WARN);
				return;
			}			
			printStr = "MSG_" + MultiLang.str33 + msg;
			window["WebViewJavascriptBridge"].callHandler('webCall', msg);
		}		
		if(printStr!=null)
			Log.writeLog(printStr, Log.VERBOSE);			
	}

	protected onRecvMsg(d:any):void
	{
		// var origin = event.origin;
		// if(origin == null && event.originalEvent &&  event.originalEvent.origin)
		// 	origin = event.originalEvent.origin;
		// if(origin == document.location.origin)return;	
		let isStr:boolean = GYLite.CommonUtil.GYIs(d,String);
		let objData:any = isStr?JSON.parse(d):d;	
		Log.writeLog("MSG_" + MultiLang.str32 + (isStr?d:JSON.stringify(objData)), Log.VERBOSE);		
		super.recvMsg(objData);
	}	
}