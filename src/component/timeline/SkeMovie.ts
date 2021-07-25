class SkeMovie extends MovieClip{
	private skin:Skeleton;
	private _curIndex:number;
	private _actArr:Array<any>;
	private _skName:string;
	private _skPath:string;
	private _boneName:string;
	private _armatureName:string;
	public constructor() {
		super();
		let s = this;
		s._curIndex = -1;
	}
	public get anchorX():number
	{var s = this;
		return -s.skin.x;
	}

	public set anchorX(value:number)
	{var s = this;		
		s.skin.x = -value;
	}

	public get anchorY():number
	{var s = this;
		return -s.skin.y;
	}

	public set anchorY(value:number)
	{var s = this;		
		s.skin.y = -value;
	}
	public setConfig(cfg:any):void
	{
		super.setConfig(cfg);
		let s = this;
		s._skName = cfg.skName;
		s._skPath = cfg.skPath;
		s._boneName = cfg.boneName;
		s._armatureName = cfg.armatureName;
		s.skin = new Skeleton;
		s.skin.setDataByName(s._skName,s._skPath,s._boneName,s._armatureName);
		s.addElement(s.skin);
		s.anchorX = cfg.anchorX?cfg.anchorX:0;
		s.anchorY = cfg.anchorY?cfg.anchorY:0;
		s._actArr = cfg.actions;
		// s.skin.gotoAndPlay(s._actArr[RoleAction.STAND].action,0);
	}
	public dispose(disposeChild: boolean=true, removeChild: boolean=true, forceDispose: boolean=false):void
	{
		let s = this;
		s.clearTimeline();
		super.dispose(disposeChild, removeChild, forceDispose);
	}
	public get actionIndex():number
	{
		let s = this;
		return s._curIndex;
	}
	public set actionIndex(val:number)
	{let s = this;
		if(s._curIndex == val)return;
		s._curIndex = val;
		let actionArr:Array<any> = s._currentTween.param;
		s.skin.gotoAndPlay(actionArr[s._curIndex].action,actionArr[s._curIndex].loop?actionArr[s._curIndex].loop:0);
	}
	public hide():void
	{
		super.hide();
		let s = this;
		s.skin.stop();
		s._curIndex = -1;
	}
	public output():any
	{let s =this;
		let obj:any = super.output();
		obj.anchorX = s.anchorX;
		obj.anchorY = s.anchorY;		
		obj.skName = s._skName;
		obj.skPath = s._skPath;
		if(s._boneName!=null)obj.boneName = s._boneName;
		if(s._armatureName!=null)obj.armatureName = s._armatureName;
		obj.actions = s._actArr;
		return obj;
	}
}