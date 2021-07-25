class LogProItem extends GYLite.ItemRender{
	public constructor() {
		super();
		let s = this;
		s.width = 800;	
		s.height = 38;	
		s._labelDisplay = new GYLite.GYText;
		s._labelDisplay.color = 0x339933;
		s._labelDisplay.size = 24;
		s._labelDisplay.width = s.width;	
		s._labelDisplay.height = s.height;
		s._labelDisplay.y = 5;
		s.addElement(s._labelDisplay);
		s.touchEnabled = true;
		s.rectHit = true;
	}
	public setData(d:any):void
	{
		let s = this;
		s._data = d;
		if(!d)
		{
			s.visible = false;
			return;
		}
		s.visible = true;
		s._labelDisplay.text = s._data?s._data:"";		
	}
}