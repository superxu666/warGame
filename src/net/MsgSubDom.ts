class MsgSubDom extends MsgBase{
	private static _instance:MsgSubDom;	
	public static getInstance():MsgSubDom
	{
		if(MsgSubDom._instance == null)
			MsgSubDom._instance = new MsgSubDom;
		return MsgSubDom._instance;
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
		var obj:any;
		if(protocol == null)
		{
			obj = data;
		}
		else
		{
			obj = {};
			obj.protocol = protocol;
			obj.data = data;		
		}
		
		Log.writeLog("MSG_" + MultiLang.str12 + JSON.stringify(obj), Log.VERBOSE);
		window.frames[0].postMessage(obj, "*");
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