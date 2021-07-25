class ImageMovie extends MovieClip{
	public constructor() {
		super();
		let s = this;
		s._mySource = new egret.Bitmap;		
		s.addChild(s._mySource);
	}
	protected _mySource:egret.Bitmap;	
	protected _smoothing:boolean;
	private _image:string;
	private _alias:string;
	public set smoothing(val:boolean)
	{var s = this;
		s._smoothing = val;
		s._mySource.smoothing = val;
	}
	public get smoothing():boolean
	{var s = this;
		return s._mySource.smoothing;
	}
	public set source(bmp:egret.Texture)
	{var s = this;
		if(bmp == s._mySource.texture)
			return;
		if(bmp)
		{
			if(s._width == s._width)
				s.scaleX=s._width/bmp.textureWidth;
			if(s._height == s._height)
				s.scaleY=s._height/bmp.textureHeight;
		}
		// s._mySource.$bitmapData=bmp;
		s._mySource.texture = bmp;
		s._mySource.smoothing = s._smoothing;
		s.invalidDisplay();
	}
	/**位图*/		
	public get source():egret.Texture
	{var s = this;
		return s._mySource.texture;
	}	
	public get anchorX():number
	{var s = this;
		return -s._mySource.x;
	}

	public set anchorX(value:number)
	{var s = this;		
		s._mySource.x = -value;
	}

	public get anchorY():number
	{var s = this;
		return -s._mySource.y;
	}

	public set anchorY(value:number)
	{var s = this;		
		s._mySource.y = -value;
	}

	public get bitmap():egret.Bitmap
	{let s = this;
		return s._mySource;
	}
	public setConfig(cfg:any):void
	{
		let s = this;
		super.setConfig(cfg);
		s.anchorX = cfg.anchorX?cfg.anchorX:0;
		s.anchorY = cfg.anchorY?cfg.anchorY:0;
		s._image = cfg.image;
		s._alias = cfg.alias;
		if(s._image)
			s.source = Main.instance.getRes(s._image,s._alias);
	}
	public output():any
	{let s =this;
		let obj:any = super.output();
		obj.anchorX = s.anchorX;
		obj.anchorY = s.anchorY;		
		if(s._image!=null)
		{
			obj.image = s._image;
			obj.alias = s._alias;
		}		
		return obj;
	}
}