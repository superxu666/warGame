class Gesture {
	public static DOUBLE:number = 1;
	private tapBeginTime:number;
	public constructor() {
		let s =this;
		GYLite.GYSprite.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,s.touchBegin,s);
		s.tapBeginTime = 0;
	}
	private touchBegin(e:egret.TouchEvent):void
	{
		let s = this;
		let t:number;
		if(!MsgBase.haveMsgHandle())return;
		t = Date.now();
		if(t - s.tapBeginTime < 200)
		{			
			// MsgBase.getMsgHandle().sendMsg(MsgBase.GESTURE, {type:Gesture.DOUBLE});
			s.tapBeginTime = 0;			
		}
		else
			s.tapBeginTime = t;	
	}
}