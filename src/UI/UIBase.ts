class UIBase extends GYLite.GYUIComponent{
	protected _data:any;
	protected _mode:number;
	public constructor() {
		super();
		let s = this;
		s._mode = LayerManager.MODE_COMMON;
	}
	public set mode(val:number)
	{let s =this;
		s._mode = val;
		if(s._mode == LayerManager.MODE_INSCREEN && s.parent != LayerManager.getInstance().stageSp)
			LayerManager.getInstance().stageSp.addElement(s);
	}
	/**设置呈现的模式，参考LayerManager常量*/
	public get mode():number
	{
		return this._mode;
	}
	public show(pr:GYLite.GYSprite=null):void
	{let s = this;
		if(pr == null)
			pr = s._mode == LayerManager.MODE_INSCREEN?LayerManager.getInstance().stageSp:LayerManager.getInstance().uiLay;
		if(s.parent == null)
			GYLite.GYSprite.stage.addEventListener(egret.Event.RESIZE,s.resizeCall,s);
		if(pr != s.parent)
		{
			pr.addElement(s);			
		}		
	}

	public hide():void
	{let s = this;
		if(s.parent)
		{
			(<any>s.parent).removeElement(s);
			GYLite.GYSprite.stage.removeEventListener(egret.Event.RESIZE,s.resizeCall,s);
		}			
	}
	protected resizeCall(e:egret.Event=null):void
	{let s = this;
		let layer:LayerManager = LayerManager.getInstance();
		if(s._mode == LayerManager.MODE_INSCREEN)
			s.resize(GameManager.getInstance().stageWidth,GameManager.getInstance().stageHeight);
		else
			s.resize(layer.winWidth,layer.winHeight);
	}
	public resize(w:number, h:number):void
	{

	}

	public setData(d:any):void
	{
		let s = this;
		s._data = d;
	}
	public getData():any
	{
		return this._data;
	}
}