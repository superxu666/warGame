class LogItem extends GYLite.ItemRender{
	private _init:boolean;
	private _text:string;
	private _maxIndex:number;
	public constructor() {
		super();
		let s = this;
		s.width = GameManager.getInstance().stardardWidth * 0.8 - 84;	
		s.height = 70;	
		s._labelDisplay = new GYLite.GYText;
		s._labelDisplay.color = 0xffffff;		
		s._labelDisplay.width = s.width;
		s._labelDisplay.size = 24;
		s._labelDisplay.mouseThrough = true;			
		// s._labelDisplay.height = s.height;	
		s.addElement(s._labelDisplay);
		s.touchEnabled = true;
		s.rectHit = true;
		s.addEventListener(egret.TouchEvent.TOUCH_TAP,s.clkItem,s);
		// s.addEventListener(egret.Event.ADDED_TO_STAGE,s.addToStage,s);
		// s.addEventListener(egret.Event.REMOVED_FROM_STAGE,s.removeFromStage,s);		
	}
	// private addToStage(e:egret.Event):void
	// {let s =this;
	// 	s._labelDisplay.text = s._data?s._data:"";
	// }
	// private removeFromStage(e:egret.Event):void
	// {let s = this;
	// 	s._labelDisplay.text = "";
	// }
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
		s._text = s._data?s._data:"";		
		let max:number;
		s._maxIndex = s._text.length;
		max = 110;//AlgorithmUtil.dichotomy(s._maxIndex,0,s.textHeightCheck, s, -1);		
		// if(!s._init)
		// {
			// s.height = s._labelDisplay.height;
			if(s._data.indexOf("ERROR_") > -1)
				s._labelDisplay.color = 0xff3333;
			else if(s._data.indexOf("WARN_") > -1)
				s._labelDisplay.color = 0xffff00;
			else if(s._data.indexOf("IMPORTANT_") > -1)
				s._labelDisplay.color = 0x339933;
			else
				s._labelDisplay.color = 0xffffff;
		// 	s._init = true;
		// }				
		if(s._text.length > max)
			s._labelDisplay.text = (s._text.substr(0, max - 3) + "...").replace(/\n/g,"<BR>");
		else
			s._labelDisplay.text = s._text;					
		// if(s.stage == null)
		// {
		// 	s._labelDisplay.text = "";
		// }
	}
	private clkItem(e:egret.TouchEvent):void
	{let s = this;
		// Log.logArea.logInput.text = s._text;
		DetailPanel.getInstance().showDetail(LayerManager.getInstance().gameSp,s._text);
	}
	private textHeightCheck(val:number):number
	{let s = this;
		s._labelDisplay.text = s._text.substr(0,val);
		if(s._labelDisplay.textHeight > s.height)
		{
			s._maxIndex = val;
			return -1;
		}			
		if(s._maxIndex - val < 4)
			return 0;
		return 1;		
	}
}