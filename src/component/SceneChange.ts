class SceneChange {
	private static _instance:SceneChange;
	public static getInstance():SceneChange
	{
		if(SceneChange._instance == null)
			SceneChange._instance = new SceneChange;
		return SceneChange._instance;
	}
	public static TYPE_BLACK:number = 1;	
	public sceneMask:ScreenBack;
	private _maskTween:GYLite.GYTween;
	private _changingFunc:Function;
	private _changeObj:any;
	private _changeEndFunc:Function;
	private _changeEndObj:any;
	private _type:number;
	private _ske:Skeleton;
	private _changingTime:number;
	private _changedTime:number;	
	private _isRunning:boolean;
	public param:any;
	
	public constructor() {
		let s = this;
		Dispatcher.getInstance().addEventListener(Dispatcher.GAME_READY, s.gameReady, s);
	}
	private gameReady(e:egret.Event):void
	{
		let s = this;
		s.goHead();
	}
	public change(type:number=0,changingFunc:Function=null,changeObj:any=null,changeEndFunc:Function=null,changeEndObj:any=null,param:any=null,changingTime:number=3000,changedTime:number=100):void
	{let s = this;
		s._type = type;
		s.param = param;	
		LayerManager.getInstance().stageSp.mouseThrough = true;
		if(type == SceneChange.TYPE_BLACK)
		{
			if(s.sceneMask == null)
			{
				s.sceneMask = new ScreenBack;
				// let g:egret.Graphics = s.sceneMask.graphics;
				// g.beginFill(0,1);
				// g.drawRect(0,0,100,100);
				// g.endFill();
				s.sceneMask.setBackground(0,1);
				GYLite.GYSprite.stage.addEventListener(egret.Event.RESIZE,s.resize,s);				
				s._maskTween = GYLite.GYTween.to(s.sceneMask,[GYLite.TweenData.getInstance("alpha",1,0)],500,0,s,s.maskEnd,null,null,false,false);				
			}
			LayerManager.getInstance().topLay.addElement(s.sceneMask);
			s.sceneMask.alpha = 0;
			s._maskTween.delay = 0;
			s._maskTween.run(false);
			s._changingFunc = changingFunc;
			s._changeObj = changeObj;
			s._changeEndFunc = changeEndFunc;
			s._changeEndObj = changeEndObj;
			s.resize();
			s._isRunning = true;
		}
		

	}
	private changing():void
	{
		let s = this;
		Log.writeLog(s._changingTime + "毫秒转场中...",Log.IMPORTANT);
		s.sceneChanging();
		GYLite.TimeManager.timeOut(s.changed,s,s._changedTime);
	}
	private changed():void
	{let s = this;
		Log.writeLog(s._changedTime + "毫秒转场结束...",Log.IMPORTANT);
		s.sceneChangeEnd();
	}
	public goHead():void
	{let s = this;
		if(!s._isRunning)return;		
	}
	private skeChanging():void
	{
		let s = this;
		s._ske.gotoAndPlay("end", 1);
        s._ske.setPlayEnd(s.skeEnd, s);
	}
	private skeEnd():void
	{
		let s = this;
		s._ske.stop();
		s._ske.setPlayEnd(null,null);
		s._isRunning = false;
		LayerManager.getInstance().stageSp.mouseThrough = false;
	}
	private maskEnd(tar:GYLite.GYSprite):void
	{let s = this;
		if(s._maskTween.isReserve)
		{
			LayerManager.getInstance().topLay.removeElement(s.sceneMask);
			s.sceneChangeEnd();
		}
		else
		{
			s.sceneChanging();
			s._maskTween.delay = 500;
			s._maskTween.run(true);			
		}
		
	}
	public sceneChangeEnd():void
	{let s = this;
		if(s._changeEndFunc!=null)
		{
			s._changeEndFunc.call(s._changeEndObj);
			s._changeEndFunc = s._changeEndObj = null;
		}
		s._isRunning = false;
		LayerManager.getInstance().stageSp.mouseThrough = false;
	}
	public sceneChanging():void
	{let s = this;
		if(s._changingFunc!=null)
		{
			s._changingFunc.call(s._changeObj);
			s._changingFunc = s._changeObj = null;
		}
	}
	private resize(e:egret.Event=null):void
	{let s = this;
		if(s._type == SceneChange.TYPE_BLACK)
		{
			// s.sceneMask.scaleX = LayerManager.getInstance().topLay.width / 100;
			// s.sceneMask.scaleY = LayerManager.getInstance().topLay.height / 100;
			s.sceneMask.x = LayerManager.getInstance().frameBound.x;
			s.sceneMask.y = LayerManager.getInstance().frameBound.y;
			s.sceneMask.width = LayerManager.getInstance().frameBound.width;
			s.sceneMask.height = LayerManager.getInstance().frameBound.height;
		}		
		
	}

}