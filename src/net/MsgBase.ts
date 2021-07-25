class MsgBase {
	protected _dict: GYLite.Dictionary;
	private _runProtocol: string;
	private _waitUnReg: Array<any>;
	private static _curMsg: MsgBase;
	private static _defaultMsg: MsgBase = new MsgBase;
	public constructor() {
		let s = this;
		s._dict = new GYLite.Dictionary;
		s._waitUnReg = [];
	}
	/**离开页面*/
	public static quitPage(openUI: string): void {
		if (MsgBase.haveMsgHandle())
			MsgBase.getMsgHandle().sendMsg(MsgBase.QUIT_PAGE);
		else {			
			UIControl.getInstance().disposeCurUI();
			if (openUI)
				UIControl.getInstance().openUI(openUI);
		}
	}
	/**是否存在父级通讯*/
	public static haveMsgHandle(): boolean {
		MsgBase.getMsgHandle();
		return MsgBase._curMsg != null;
	}
	/**获取当前的父级通讯对象*/
	public static getMsgHandle(): MsgBase {
		if (MsgBase._curMsg == null)
		{
			let isPCDebug:boolean = (UserData.getInstance().getQueryVariable("device") == "PCDebug");			
			if(isPCDebug)
				MsgBase._curMsg = null;
			else if(egret.nativeRender)
				MsgBase._curMsg = (Browser.onMobile || Browser.onAndroid ? MsgMobile.getInstance() : null)
			else 
				MsgBase._curMsg = (window != window.parent || UserData.getInstance().getQueryVariable("device") == "PC") ? MsgDom.getInstance() : (Browser.onMobile || Browser.onAndroid ? MsgMobile.getInstance() : null);
		}			
		if (MsgBase._curMsg == null)
			return MsgBase._defaultMsg;
		return MsgBase._curMsg;
	}
	/**注册协议监听*/
	public regMsg(protocol, func: Function, thisObj: any): void {
		let s = this;
		if (s._dict[protocol] == null)
			s._dict[protocol] = [];
		let arr: Array<any> = s._dict[protocol];
		let len: number;
		let obj: any;
		len = arr.length;
		while (--len > -1) {
			obj = arr[len];
			if (obj.msgCallBack == func && obj.thisObject == thisObj) {
				return;
			}
		}
		obj = { msgCallBack: func, thisObject: thisObj };
		arr.push(obj);
	}
	public sendMsg(protocol: string, data: Object = null): void {
	}
	protected recvMsg(data: any): void {
		let s = this;
		if (data.protocol) {
			let len: number;
			s._runProtocol = data.protocol;
			let arr: Array<any> = s._dict[data.protocol];
			if (arr) {
				len = arr.length;
				while (--len > -1) {
					arr[len].msgCallBack.call(arr[len].thisObject, data)
				}
			}
			//防止非异步的数据通知产生，延时到遍历结束后进行反注册
			if (s._waitUnReg.length > 0) {
				arr = s._dict[s._runProtocol];
				if (arr) {
					len = s._waitUnReg.length;
					while (--len > -1) {
						arr.splice(s._waitUnReg[len], 1);
					}
				}
				s._waitUnReg.length = 0;
			}
			s._runProtocol = null;
		}
	}
	/**注销协议监听*/
	public unregMsg(protocol, func: Function, thisObj: any): void {
		let s = this;
		let arr: Array<any> = s._dict[protocol];
		if (arr) {
			let len: number;
			let obj: any;
			len = arr.length;
			while (--len > -1) {
				obj = arr[len];
				if (obj.msgCallBack == func && obj.thisObject == thisObj) {
					if (s._runProtocol == protocol)
						s._waitUnReg.unshift(len);
					else
						arr.splice(len, 1);
					return;
				}
			}
		}
	}	

	/**获取用户数据*/public static GET_USERDATA: string = "100001";
	/**获取页面数据*/public static GET_PAGEDATA: string = "100002";	
	/**token过期*/public static TOKEN_EXPIRED: string = "100145";
	/**离开页面*/public static QUIT_PAGE: string = "100101";
	/**手势通知*/public static GESTURE: string = "100108";
	/**切换前后台*/public static FRONT_BACK_CHANGE: string = "100109";
	/**交互状态变更*/public static INTERATION_STATE_CHANGE: string = "100105";
	/**通知进入交互*/public static INTERATION_ENTER: string = "100106";
	/**外部端通知进入交互*/public static CALL_IN: string = "100113";	
	/**请求缓存URL*/public static CACHE_URL: string = "100117";
	/**下载资源通知*/public static DOWNLOAD_CALL: string = "100133";
	/**tips通知*/public static TIPS_CALL:string = "100141";
}