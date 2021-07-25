class MsgDom extends MsgBase{
	private static _instance:MsgDom;	
	public static getInstance():MsgDom
	{
		if(MsgDom._instance == null)
			MsgDom._instance = new MsgDom;
		return MsgDom._instance;
	}	
	public constructor() {
		super();
		let s= this;		
		window.addEventListener("message", s.onRecvMsg.bind(s), false);			
	}	

	public sendMsg(protocol:string, data:Object = null):void
	{
		if(window.parent == window)
		{
			Log.writeLog("MSG_" + MultiLang.str22,Log.WARN);
			return;
		}		
		var obj:any = {};
		obj.protocol = protocol;
		obj.data = data;		
		var jsonStr:string = JSON.stringify(obj);
		Log.writeLog("MSG_" + MultiLang.str12 + jsonStr, Log.VERBOSE);
		window.parent.postMessage(jsonStr, "*");
	}

	protected onRecvMsg(event:any):void
	{
		var origin = event.origin;
		// if(origin == null && event.originalEvent &&  event.originalEvent.origin)
		// 	origin = event.originalEvent.origin;
		// if(origin == document.location.origin)return;		
		let objData:any = event.data;
		if(GYLite.CommonUtil.GYIs(objData, String))
		{
			Log.writeLog("MSG_" + MultiLang.str13 + objData, Log.VERBOSE);
			objData = JSON.parse(objData);
		}
		else
			Log.writeLog("MSG_" + MultiLang.str13 + JSON.stringify(objData), Log.VERBOSE);
		super.recvMsg(objData);		
	}
	
}