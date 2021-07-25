class FilterButtonSkin extends GYLite.ButtonSkin {
	private _filterVec: Array<Array<egret.Filter>>;
	public constructor(skinVec: egret.Texture[], rect: GYLite.Scale9GridRect = null, filterVec: Array<Array<egret.Filter>>) {
		super(skinVec, rect);
		this._filterVec = filterVec;
	}
	public release(): void {
		let s = this;
		s._curSkin.filters = null;
		super.release();
	}
	public drawSkin(state: number): void {
		super.drawSkin(state);
		let s = this;
		// if (!s._hostComponent.touchEnabled && state == GYLite.ButtonBase.STATE_UP) return;
		if (s._hostComponent && s._filterVec)
			s._hostComponent.filters = s._filterVec[state] ? s._filterVec[state] : s._filterVec[0];
	}
	public set filterVec(val: Array<Array<egret.Filter>>) {
		let s = this;
		s._filterVec = val;
	}
	public get filterVec(): Array<Array<egret.Filter>> {
		let s = this;
		return s._filterVec;
	}
	public clone(): GYLite.IGYSkin {
		let s = this;
		var btn: FilterButtonSkin = new FilterButtonSkin(s._stsVec, s._scale9GridRect, s._filterVec);
		return btn;
	}
}

