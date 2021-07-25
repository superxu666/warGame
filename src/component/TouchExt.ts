class TouchExt {
	private _owner:GYLite.GYSprite;
	private _longDownTime:number;
	private _continueDownTime:number;
	private _longDownInterval:number;
	private _continueParam:number;
	private _continueDownInterval:number;
	private _inLongDown:boolean;
	private _inContinueDown:boolean;
	/**长按产生阻止点击*/public stopClkInLongDown:boolean;
	/**连按产生阻止点击*/public stopClkInContinueDown:boolean;
	public constructor(o:GYLite.GYSprite) {
		let s =this;
		s._owner = o;
		s._longDownTime=-1;
		s._longDownInterval = 1000;
		s._continueDownTime=-1;
		s._continueDownInterval = 100;
		s._continueParam = 1;
		s._inContinueDown = s._inLongDown = false;
		s.stopClkInContinueDown = s.stopClkInLongDown = true;
		s.addEvent();
	}
	public addEvent():void
	{
		let s =this;
		s._owner.addEventListener(egret.TouchEvent.TOUCH_TAP, s.click,s);
		s._owner.addEventListener(egret.TouchEvent.TOUCH_BEGIN, s.mDown,s);
		s._owner.addEventListener(egret.TouchEvent.TOUCH_END, s.mUp,s);
	}
	public removeEvent():void
	{
		let s =this;
		s._owner.removeEventListener(egret.TouchEvent.TOUCH_TAP, s.click,s);
		s._owner.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, s.mDown,s);
		s._owner.removeEventListener(egret.TouchEvent.TOUCH_END, s.mUp,s);
	}
	protected click(e:egret.TouchEvent):void
	{let s = this;
		if((s.stopClkInContinueDown && s._inContinueDown) || (s.stopClkInContinueDown && s.inLongDown))
			e.stopImmediatePropagation();
		s._inLongDown = false;
		s._inContinueDown = false;
	}
	protected mDown(e:egret.TouchEvent):void
	{let s = this;
		GYLite.GYSprite.addStageDown(s._owner, s.releaseOutside, s);
		if(s._owner.hasEventListener(GYLite.GYTouchEvent.LONG_MOUSEDOWN))
		{				
			s._longDownTime = GYLite.CommonUtil.loopTime;
			GYLite.CommonUtil.addStageLoop(s.longDownLoop,s);
		}
		if(s._owner.hasEventListener(GYLite.GYTouchEvent.CONTINUE_MOUSEDOWN))
		{				
			s._continueDownTime = GYLite.CommonUtil.loopTime;
			GYLite.CommonUtil.addStageLoop(s.continueDownLoop,s);
			s._continueParam = 1;
			s._owner.dispatchEvent(new GYLite.GYTouchEvent(GYLite.GYTouchEvent.CONTINUE_MOUSEDOWN));
		}
	}

	protected mUp(e:egret.TouchEvent):void
	{var s = this;			
		s.clearLongDown();
		s.clearContinueDown();			
	}
	
	protected releaseOutside(e:GYLite.GYTouchEvent):void
	{var s = this;
		s.mUp(null);
		s._inLongDown = false;
		s._inContinueDown = false;
	}
	
	private longDownLoop(t:number):void
	{var s = this;
		if(t - s._longDownTime > s._longDownInterval)
		{
			s.clearLongDown();
			s._inLongDown = true;
			s._owner.dispatchEvent(new GYLite.GYTouchEvent(GYLite.GYTouchEvent.LONG_MOUSEDOWN));
		}
	}
	private clearLongDown():void
	{var s = this;
		s._longDownTime = -1;
		GYLite.CommonUtil.delStageLoop(s.longDownLoop,s);
	}
	private continueDownLoop(t:number):void
	{var s = this;
		if(t - s._continueDownTime > s._continueDownInterval*s._continueParam)
		{
			s._continueParam *= 0.95;
			if(s._continueParam < 0.02)
				s._continueParam = 0.02;
			s._continueDownTime = t;
			s._inContinueDown = true;
			s._owner.dispatchEvent(new GYLite.GYTouchEvent(GYLite.GYTouchEvent.CONTINUE_MOUSEDOWN));
		}
	}
	private clearContinueDown():void
	{var s = this;
		s._continueDownTime = -1;
		GYLite.CommonUtil.delStageLoop(s.continueDownLoop,s);
	}

	/**长按按钮时，经过多长时间触发长按事件(毫秒)*/
	public get longDownInterval():number
	{var s = this;
		return s._longDownInterval;
	}
	public dispose():void
	{
		let s = this;
		s.removeEvent();
		s._owner = null;
	}

	public set longDownInterval(value:number)
	{var s = this;
		s._longDownInterval = value;
	}
	
	/**连按按钮时，经过多长时间触发连续按事件(毫秒)*/
	public get continueDownInterval():number
	{var s = this;
		return s._continueDownInterval;
	}

	public set continueDownInterval(value:number)
	{var s = this;
		s._continueDownInterval = value;
	}
	/**此次点击，是否触发连按*/
	public get inContinueDown():boolean
	{
		return this._inContinueDown;
	}
	/**此次点击，是否触发长按*/
	public get inLongDown():boolean
	{
		return this._inLongDown;
	}
}
