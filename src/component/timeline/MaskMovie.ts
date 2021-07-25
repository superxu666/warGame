class MaskMovie extends MovieClip{
	private _shapes:number[][];
	public constructor() {
		super();
	}
	public get toMaskId():number
	{
		return this._config.toMaskId;
	}
	public setConfig(cfg:any):void
	{
		let s = this;
		super.setConfig(cfg);
		let g:egret.Graphics = s.graphics;
		let i:number,len:number;
		if(s._config.shapes)
		{
			s._shapes = s._config.shapes;
			len = s._shapes.length;
			for(i=0;i<len;++i)
			{
				s.drawShape(s._config.shapes[i]);
			}
		}		
	}
	private drawShape(arr:Array<number>):void
	{let s = this;
		let g:egret.Graphics = s.graphics;
		let i:number,len:number;
		len = arr.length;
		if(len > 6)
		{
			g.beginFill(0,1);
			g.lineStyle(null);
			g.moveTo(arr[i],arr[i+1]);
			for(i=2;i<len;i+=2)
			{				
				g.lineTo(arr[i],arr[i+1]);				
			}
			g.endFill();
		}
		
	}
	public output():any
	{let s =this;
		let obj:any = super.output();
		obj.shapes = s._shapes;		
		return obj;
	}
}