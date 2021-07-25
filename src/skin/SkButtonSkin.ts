class SkButtonSkin extends GYLite.ButtonSkin{
	private _skeActVec:string[];
	private _skeleton:Skeleton;
	public constructor(skinVec: string[], skeName:string, skePath:string, skBoneName:string=null) {
		super([null], null);	
		let s = this;
		s._skeleton = new Skeleton;
		s._skeleton.setDataByName(skeName, skePath, skBoneName);
		s._skeActVec = skinVec;
	}
	public release():void
	{
		super.release();
		let s = this;
		if(s._skeleton)
		{
			s._skeleton.dispose();
			s._skeleton = null;
		}			
	}
	public drawSkin(state: number): void
	{
		super.drawSkin(state);
		let s = this;
		if(s._skeActVec)
		{
			s._skeleton.gotoAndPlay(s._skeActVec[state]?s._skeActVec[state]:s._skeActVec[0]);
			// s._labBitmap.x = s.width - s._imageLabelVec[state].textureWidth >> 1;
			// s._labBitmap.y = s.height - s._imageLabelVec[state].textureHeight >> 1;
		}				
	}
	public set hostComponent(val:GYLite.GYSprite)
	{var s = this;
		if(s._hostComponent == val)return;
		if(s._hostComponent)
		{
			s._skeleton.hide();
		}
		egret.superSetter(ImageButtonSkin,s,"hostComponent", val);
		if(s._hostComponent)
		{
			s._skeleton.show(s._hostComponent);			
		}
	}
	public get hostComponent():GYLite.GYSprite
	{var s = this;
		return egret.superGetter(ImageButtonSkin,s,"hostComponent");
	}
	public set skeActVec(val:string[])
	{let s= this;
		s._skeActVec = val;
	}
	public get skeActVec():string[]
	{let s= this;
		return s._skeActVec;
	}		
}