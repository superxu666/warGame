class ScaleButtonSkin extends GYLite.ButtonSkin {
	private _tween: GYLite.GYTween;
	private _state: number = -1;
	public scale:number = 1.2;
	public constructor(skinVec: egret.Texture[], rect: GYLite.Scale9GridRect = null) {
		super(skinVec, rect);
	}
	public release(): void {
		let s = this;
		s._tween.clear();
		s._tween = null;
		super.release();
	}
	public drawSkin(state: number): void {
		super.drawSkin(state);
		let s = this;
		// if(!s._hostComponent.touchEnabled && state == GYLite.ButtonBase.STATE_UP)return;		
		s._curSkin.x = -s._curSkin.width >> 1;
		s._curSkin.y = -s._curSkin.height >> 1;
		if (s._hostComponent) {
			if (s._state != state) {
				if (s._state > -1)
					s._tween.run(!(state == GYLite.ButtonBase.STATE_OVER));
				s._state = state;
			}
		}
	}
	public set hostComponent(val: GYLite.GYSprite) {
		var s = this;
		if (s._hostComponent == val) return;
		if (s._hostComponent) {
			s._tween.clear();
			s._tween = null;
		}
		egret.superSetter(ImageButtonSkin, s, "hostComponent", val);
		if (s._hostComponent) {
			let s = this;
			s._tween = GYLite.GYTween.to(s._hostComponent, [
				GYLite.TweenData.getInstance("scaleX", s.scale, NaN, GYLite.GYTween.reduceEase),
				GYLite.TweenData.getInstance("scaleY", s.scale, NaN, GYLite.GYTween.reduceEase)
			], 200, 0, s, null, null, null, false, false);
		}
	}
	public get hostComponent(): GYLite.GYSprite {
		var s = this;
		return egret.superGetter(ImageButtonSkin, s, "hostComponent");
	}
}
