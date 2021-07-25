class LoadingBtnSkin extends GYLite.GYSkin implements GYLite.IButtonSkin
{
	protected _stsVec:string[];
	protected _curSkin:any;
	protected _text:GYLite.GYText;
	protected _hasLabel:boolean;	
	
	/**按钮皮肤，自定义需实现接口IButtonSkin
	 * 皮肤数组，包括8个状态的Texture
	 * */
	public constructor(skinVec:string[])
	{
		super();
		var s = this;			
		s._stsVec=skinVec;
		if(s._stsVec.length > 8 || s._stsVec.length == 0)
			throw new Error("按钮皮肤参数不对！#" + s._stsVec.length);
		s._curSkin=new GYLite.GYLoadImage;
		if(s._stsVec[0])			
			s._curSkin.source = s._stsVec[0];		
	}	
	public release():void
	{var s = this;
		super.release();
		s._curSkin.texture = null;
	}
	public drawSkin(state:number):void
	{var s = this;
		s._curSkin.source = (state<s._stsVec.length && s._stsVec[state])? s._stsVec[state] : s._stsVec[0];
	}
	public set hostComponent(val:GYLite.GYSprite)
	{var s = this;
		if(val==s._hostComponent)
			return;
		if(s._hostComponent)
		{
			if(s._curSkin.parent)
				s._hostComponent.removeElement(s._curSkin);
			if(s._hasLabel)
				s._hostComponent.removeElement(s._text);
		}
		s._hostComponent=val;
		if(s._hostComponent)
		{
			s._hostComponent.addElementAt(s._curSkin, 0);
			if(!isNaN(s._hostComponent.settingWidth))
			{					
				s._curSkin.width = s._hostComponent.width;
			}
			if(!isNaN(s._hostComponent.settingHeight))
			{					
				s._curSkin.height = s._hostComponent.height;				
			}				
			if(s._hasLabel)
			{
				s._hostComponent.addElement(s._text);
				s._text.width=isNaN(s._hostComponent.settingHeight)?s._curSkin.width:s._hostComponent.width;
			}
		}
	}
	public get hostComponent():GYLite.GYSprite
	{var s = this;
		return s._hostComponent;
	}
	public get width():number
	{
		return this._curSkin.width;
	}
	public get height():number
	{
		return this._curSkin.height;
	}
	public set width(value:number) 
	{var s = this;
		if(s._hasLabel)
			s._text.width = value;
		s._curSkin.width = value;
	}		
	public set height(value:number) 
	{var s = this;
		s._curSkin.height = value;
	}	
	
	/**当s.label被赋值的时候自动产生Mytext文本(在此之前不存在s.labelDisplay)，在s.label为null时，文本对象不会被清除* */
	public set label(val:string)
	{var s = this;
		if(val == null)
		{
			if(s._hasLabel)
			{
				s._hasLabel=false;
				if(s._hostComponent)
					s._hostComponent.removeElement(s._text);
			}
			return;
		}
		
		if(s._text==null)
		{
			s._text=new GYLite.GYText;				
			s._text.align="center";
			// s._text.selectable=false;
//				s._text.color = 0x555555;
			s._text.verticalCenter = 0;
			if(s._hostComponent)
			{
				s._hostComponent.addElement(s._text);
				s._text.width=isNaN(s._hostComponent.settingWidth)?s._curSkin.width:s._hostComponent.width;
			}
		}
		s._hasLabel=true;
		s._text.text=val;
	}
	public get label():string
	{var s = this;
		if(s._hasLabel)
			return s._text.text;
		return "";
	}
	public get labelDisplay():GYLite.GYText
	{var s = this;
		if(s._hasLabel)
			return s._text;
		return null;
	}
	public set labelDisplay(val:GYLite.GYText)
	{var s = this;
		if(s._text && s._text.parent)
			s._hostComponent.removeElement(s._text);
		s._text = val;
		if(s._text)
		{
			s._hasLabel = true;
			if(s._hostComponent)
			{
				s._hostComponent.addElement(s._text);
				s._text.width=s._hostComponent.width;
				s._text.verticalCenter = 0;
			}
		}
	}
	/**此函数只复制s.labelDisplay的textFormat部分属性 和复制布局*/
	public cloneLabel():GYLite.GYText
	{var s = this;
		if(s._hasLabel)
		{
			var newText:GYLite.GYText=new GYLite.GYText;
			var newFormat:GYLite.TextFormat = new GYLite.TextFormat;
			var f:GYLite.TextFormat = s._text.textFormat;
			newFormat.align = f.align;
			newFormat.bold = f.bold;
			newFormat.color = f.color;
			newFormat.size = f.size;
			newFormat.font = f.font;
			newFormat.italic = f.italic;
			newFormat.underline = f.underline;
			newFormat.leading = f.leading;
			newText.textFormat = newFormat;
			newText.layoutMode = s._text.layoutMode.clone();
			newText.x = s._text.x;
			newText.y = s._text.y;
			newText.text = s._text.text;
			return newText;
		}
		return null;
	}
	/**此函数复制皮肤属性 如s.label等除按钮本身的其他属性（目前只有Label）*/
	public copy(skin:GYLite.IGYSkin)
	{
		if(skin == null)
			return;
		var s = this;
		s.labelDisplay = (skin as GYLite.IButtonSkin).cloneLabel();
	}
	/**此函数不克隆s.labelDisplay*/
	public clone():GYLite.IGYSkin
	{var s = this;
		var buttonSkin:LoadingBtnSkin=new LoadingBtnSkin(s._stsVec);
		return buttonSkin;
	}
	public get curSkin():GYLite.GYLoadImage
	{
		return this._curSkin;
	}
	public set imgVec(val:string[])
	{let s= this;
		s._stsVec = val;
		(<GYLite.GYButton>s._hostComponent).invalidState();
	}
	public get imgVec():string[]
	{let s= this;
		return s._stsVec;
	}
}