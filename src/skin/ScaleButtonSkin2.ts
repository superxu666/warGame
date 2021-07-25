class ScaleButtonSkin2 extends GYLite.ButtonSkin {
	private _tweenDict: GYLite.Dictionary;
	private _state: number = -1;
	public scale:number = 1.1;
	public constructor(skinVec: egret.Texture[], rect: GYLite.Scale9GridRect = null) {
		super(skinVec, rect);
		let s =this;
		s._tweenDict = new GYLite.Dictionary;
	}
	public release(): void {
		let s = this;
		// s._tween.clear();
		// s._tween = null;
		let len:number;
		let display:GYLite.IGYDisplay;
		if(s._hostComponent)
		{
			len = s._hostComponent.numElement;
			while(--len>-1)
			{
				display = s._hostComponent.getElementAt(len);
				if(s._tweenDict.getValue(display) != null)
				{
					s._tweenDict.getValue(display).clear();
				}
			}
		}		
		s._tweenDict = null;
		super.release();
	}
	public drawSkin(state: number): void {
		super.drawSkin(state);
		let s = this;
		// if(!s._hostComponent.touchEnabled && state == GYLite.ButtonBase.STATE_UP)return;		
		// s._curSkin.x = -s._curSkin.width >> 1;
		// s._curSkin.y = -s._curSkin.height >> 1;	
		if (s._hostComponent) {
			if (s._state != state) {				
				
				if (s._state > -1)
				{
					let len:number;
					let display:GYLite.IGYDisplay;
					len = s._hostComponent.numElement;
					while(--len>-1)
					{
						display = s._hostComponent.getElementAt(len);
						if(s._tweenDict.getValue(display) == null)
						{
							s._tweenDict.setValue(display,GYLite.GYTween.to(display, [
								GYLite.TweenData.getInstance("scaleX", s.scale, NaN, GYLite.GYTween.reduceEase),
								GYLite.TweenData.getInstance("scaleY", s.scale, NaN, GYLite.GYTween.reduceEase),
								GYLite.TweenData.getInstance("x", display.x-(display.width*(s.scale-1)>>1), NaN, GYLite.GYTween.reduceEase),
								GYLite.TweenData.getInstance("y", ("textHeight" in display)?display.y-((<GYLite.GYText>display).textHeight*(s.scale-1)>>1):display.y-(display.height*(s.scale-1)>>1), NaN, GYLite.GYTween.reduceEase)
							], 200, 0, s, null, null, null, false, false));					
						}
						s._tweenDict.getValue(display).run(!(state == GYLite.ButtonBase.STATE_OVER));
					}					
				}					
				s._state = state;
			}
		}
	}
	public set hostComponent(val: GYLite.GYSprite) {
		var s = this;
		if (s._hostComponent == val) return;
		if (s._hostComponent) {
			let len:number;
			let display:GYLite.IGYDisplay;
			len = s._hostComponent.numElement;
			while(--len>-1)
			{
				display = s._hostComponent.getElementAt(len);
				if(s._tweenDict.getValue(display) != null)
				{
					s._tweenDict.getValue(display).clear();
				}
			}			
		}
		egret.superSetter(ImageButtonSkin, s, "hostComponent", val);
		// if (s._hostComponent) {
		// 	let s = this;
		// 	s._tween = GYLite.GYTween.to(s._hostComponent, [
		// 		GYLite.TweenData.getInstance("scaleX", s.scale, NaN, GYLite.GYTween.reduceEase),
		// 		GYLite.TweenData.getInstance("scaleY", s.scale, NaN, GYLite.GYTween.reduceEase),
		// 		GYLite.TweenData.getInstance("x", -s._curSkin.width>>1, NaN, GYLite.GYTween.reduceEase),
		// 		GYLite.TweenData.getInstance("y", -s._curSkin.height>>1, NaN, GYLite.GYTween.reduceEase)
		// 	], 200, 0, s, null, null, null, false, false);
		// }
	}
	public get hostComponent(): GYLite.GYSprite {
		var s = this;
		return egret.superGetter(ScaleButtonSkin2, s, "hostComponent");
	}
}
