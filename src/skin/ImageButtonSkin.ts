class ImageButtonSkin extends GYLite.ButtonSkin{
	private _imageLabelVec:egret.Texture[];
	private _labBitmap:GYLite.GYScaleSprite;
	public constructor(skinVec: egret.Texture[], rect: GYLite.Scale9GridRect=null) {
		super(skinVec, rect);			
		let s = this;
		s._labBitmap = new GYLite.GYScaleSprite;
		s._labBitmap.horizonalCenter = 0;
		s._labBitmap.verticalCenter = 0;
	}
	public release():void
	{
		super.release();
		let s = this;
		if(s._labBitmap)
			s._labBitmap.bitmapData = null;
	}
	public drawSkin(state: number): void
	{
		super.drawSkin(state);
		let s = this;
		if(s._imageLabelVec)
		{			
			s._labBitmap.bitmapData = s._imageLabelVec[state]?s._imageLabelVec[state]:s._imageLabelVec[0];				
			// s._labBitmap.x = s.width - s._imageLabelVec[state].textureWidth >> 1;
			// s._labBitmap.y = s.height - s._imageLabelVec[state].textureHeight >> 1;
		}				
	}
	public set hostComponent(val:GYLite.GYSprite)
	{var s = this;
		if(s._hostComponent == val)return;
		if(s._hostComponent)
		{
			if(s._labBitmap.parent)			
				s._hostComponent.removeElement(s._labBitmap);
		}
		egret.superSetter(ImageButtonSkin,s,"hostComponent", val);
		if(s._hostComponent)
		{					
			s._hostComponent.addElement(s._labBitmap);
			if(!isNaN(s._hostComponent.settingWidth))
			{					
				s._labBitmap.x = s.width - s._labBitmap.bitmapData.textureWidth >> 1;
			}
			if(!isNaN(s._hostComponent.settingHeight))
			{					
				s._labBitmap.y = s.height - s._labBitmap.bitmapData.textureHeight >> 1;
			}				
		}
	}
	public get hostComponent():GYLite.GYSprite
	{var s = this;
		return egret.superGetter(ImageButtonSkin,s,"hostComponent");
	}
	public set imageLabelVec(val:egret.Texture[])
	{let s= this;
		s._imageLabelVec = val;
	}
	public get imageLabelVec():egret.Texture[]
	{let s= this;
		return s._imageLabelVec;
	}
	public get labBitmap():GYLite.GYScaleSprite
	{
		return this._labBitmap;
	}
}