class Win7SkinTheme extends GYLite.GYSkinTheme
{
	/**主题名称，唯一标识*/
	public get themeName():string
	{
		return "win7";
	}
	public get themeAlias():string
	{
		return "win7.png";
	}
	public rect_5_5_5_5:GYLite.Scale9GridRect=new GYLite.Scale9GridRect(5,5,5,5);
	public rect_4_4_1_1:GYLite.Scale9GridRect=new GYLite.Scale9GridRect(4,4,2,2);
	/**获得默认的TextFormat*/
	public GetTextTextFormat():GYLite.TextFormat
	{var s = this;
		return new GYLite.TextFormat(egret.nativeRender?"DFPYuanW9.TTF":"DFPYuanW9", 12, 0, false, false, false,null,null,"left", null,null,0,5);
	}
	/**获得默认的窗口皮肤*/
	public GetTextAreaSkin():GYLite.IGYSkin
	{var s = this;
		return new GYLite.TextAreaSkin(s.textAreaBD,s.rect_5_5_5_5);
	}
	/**获得默认的GYTextInput皮肤*/
	public GetTextInputSkin():GYLite.IGYSkin
	{var s = this;
		return new GYLite.TextInputSkin(s.textInputBD,s.rect_5_5_5_5);
	}
	/**获得默认的GYCombo的下拉按钮皮肤*/
	public GetMenuSkin():GYLite.IGYSkin
	{var s = this;
		return new GYLite.MenuSkin(s.menuBackBD,s.rect_5_5_5_5);
	}
	/**获得默认的GYTabButton皮肤*/
	public GetTabButtonSkin():GYLite.IGYSkin
	{
		return new GYLite.ButtonSkin(this.tabBtnSkinVec, this.rect_5_5_5_5);
	}
	public GetSliderSkin():GYLite.IGYSkin
	{var s = this;
		var back:GYLite.GYScaleSprite = new GYLite.GYScaleSprite(s.slider_backBD, s.rect_4_4_1_1);
		var bar:GYLite.GYScaleSprite = new GYLite.GYScaleSprite(s.slider_progBD,s.rect_4_4_1_1);
		var buttonSkin:GYLite.IButtonSkin = new GYLite.ButtonSkin(s.sliderBtnSkinVec);
		return new GYLite.SliderSkin(back, bar, buttonSkin);
	}
	public initRes():void
	{let s = this;
		let alias:string = s.themeName + ".png";		
		if(Main.instance.hasRes("tab_up", alias))
			super.initRes();
	}
	/**快速创建一个主题菜单Menu */
	public GetMenu(w:number = 50,h:number = 92,getItemFunc:Function=null,itemObj:any=null):GYLite.GYMenu
	{var s = this;
		var gyMenu:GYLite.GYMenu;
		gyMenu=new GYLite.GYMenu(null,h,getItemFunc);			
		gyMenu.listV.width = w;			
		gyMenu.listV.paddingLeft = 5;
		gyMenu.listV.paddingTop = 7;
		gyMenu.listV.paddingRight = 4;
		gyMenu.listV.paddingBottom = 5;
		gyMenu.vScroller.right = 10;
		gyMenu.vScroller.height = h;
		return gyMenu;
	}
	/**快速创建一个主题组合输入菜单ComboBox */
	public GetComboBox(w:number = 50,h:number = 92):GYLite.GYComboBox
	{
		let gyMenu:GYLite.GYMenu;
		let gyComboBox:GYLite.GYComboBox;
		gyMenu = this.GetMenu(w,h);
		gyMenu.listV.canSelectNum = 1;
		
		let txt:GYLite.GYTextInput=new GYLite.GYTextInput(null,false);
		txt.paddingLeft = 5;
		txt.width=gyMenu.listV.width + 16;
		txt.height=20;
		txt.textInput.color = 0;
		gyComboBox = new GYLite.GYComboBox();
		gyComboBox.textInput = txt;
		gyComboBox.menu = gyMenu;
		gyComboBox.comboBoxBtn = new GYLite.GYButton(this.GetComboButtonSkin());
		txt.paddingRight = gyComboBox.comboBoxBtn.width;
		return gyComboBox;
	}
	public GetEmptyInputSkin():GYLite.TextInputSkin
	{
		return new GYLite.TextInputSkin(null,null);
	}
	protected setRes():void
	{let s =this;
		let alias:string = s.themeName + ".png";		
		s.tab_upBD = Main.instance.getRes("tab_up", alias);
		s.tab_overBD = Main.instance.getRes("tab_over", alias);
		s.tab_downBD = Main.instance.getRes("tab_down", alias);
		s.tab_selUpBD = s.tab_downBD;
		s.tab_selDownBD = s.tab_selUpBD;
		s.tab_selOverBD = s.tab_selUpBD;
		s.tab_selDisabledBD = s.tab_selUpBD;
	
		s.upArrow_upBD = Main.instance.getRes("upArrow_up", alias);
		s.upArrow_overBD = Main.instance.getRes("upArrow_over", alias);
		s.upArrow_downBD = Main.instance.getRes("upArrow_down", alias);
		s.downArrow_upBD = Main.instance.getRes("downArrow_up", alias);
		s.downArrow_overBD = Main.instance.getRes("downArrow_over", alias);
		s.downArrow_downBD = Main.instance.getRes("downArrow_down", alias);
		s.leftArrow_upBD = Main.instance.getRes("leftArrow_up", alias);
		s.leftArrow_overBD = Main.instance.getRes("leftArrow_over", alias);
		s.leftArrow_downBD = Main.instance.getRes("leftArrow_down", alias);
		s.rightArrow_upBD = Main.instance.getRes("rightArrow_up", alias);
		s.rightArrow_overBD = Main.instance.getRes("rightArrow_over", alias);
		s.rightArrow_downBD = Main.instance.getRes("rightArrow_down", alias);
		s.sliderBtn_upVBD = Main.instance.getRes("sliderBtn_up", alias);
		s.sliderBtn_overVBD = Main.instance.getRes("sliderBtn_over", alias);
		s.sliderBtn_downVBD = Main.instance.getRes("sliderBtn_down", alias);
		s.sliderBtn_upHBD = Main.instance.getRes("sliderBtn_up2", alias);
		s.sliderBtn_overHBD = Main.instance.getRes("sliderBtn_over2", alias);
		s.sliderBtn_downHBD = Main.instance.getRes("sliderBtn_down2", alias);
		s.scrollerBackVBD = Main.instance.getRes("scrollerBack", alias);
		s.scrollerBackHBD = Main.instance.getRes("scrollerBackH", alias);
		s.scaleBtn_upBD = s.commonBtn_upBD = Main.instance.getRes("commonBtn_up", alias);
		s.scaleBtn_overBD = s.commonBtn_overBD = Main.instance.getRes("commonBtn_over", alias);
		s.scaleBtn_downBD = s.commonBtn_downBD = Main.instance.getRes("commonBtn_down", alias);
		s.scaleBtn_disabledBD = s.commonBtn_disabledBD = Main.instance.getRes("commonBtn_disabled", alias);
		s.scaleBtn_selUpBD = s.commonBtn_selUpBD = Main.instance.getRes("commonBtn_selUp", alias);
		s.scaleBtn_selOverBD = s.commonBtn_selOverBD = Main.instance.getRes("commonBtn_selOver", alias);
		s.scaleBtn_selDownBD = s.commonBtn_selDownBD = Main.instance.getRes("commonBtn_selDown", alias);
		s.scaleBtn_selDisabledBD = s.commonBtn_selDisabledBD = Main.instance.getRes("commonBtn_selDisabled", alias);		
		
		s.menuBackBD = s.textInputBD = Main.instance.getRes("textInput", alias);
		s.check_upBD = Main.instance.getRes("check_up", alias);
		s.check_overBD = Main.instance.getRes("check_over", alias);
		s.check_downBD = Main.instance.getRes("check_down", alias);
		s.check_disabledBD = Main.instance.getRes("check_disabled", alias);
		s.check_selUpBD = Main.instance.getRes("check_selUp", alias);
		s.check_selOverBD = Main.instance.getRes("check_selOver", alias);
		s.check_selDownBD = Main.instance.getRes("check_selDown", alias);
		s.check_selDisabledBD = Main.instance.getRes("check_selDisabled", alias);		
		s.radio_upBD = Main.instance.getRes("radio_up", alias);
		s.radio_overBD = Main.instance.getRes("radio_over", alias);
		s.radio_downBD = Main.instance.getRes("radio_down", alias);
		s.radio_disabledBD = Main.instance.getRes("radio_disabled", alias);
		s.radio_selUpBD = Main.instance.getRes("radio_selUp", alias);
		s.radio_selOverBD = Main.instance.getRes("radio_selOver", alias);
		s.radio_selDownBD = Main.instance.getRes("radio_selDown", alias);
		s.radio_selDisabledBD = Main.instance.getRes("radio_selDisabled", alias);
		s.progress_backBD = Main.instance.getRes("slider_over", alias);
		s.progressBD = Main.instance.getRes("progress", alias);
	
	
		s.slider_backBD = Main.instance.getRes("slider_back", alias);
		s.slider_progBD = Main.instance.getRes("slider_prog", alias);
		s.slider_upBD = Main.instance.getRes("slider_up", alias);
		s.slider_overBD = Main.instance.getRes("slider_over", alias);
		s.slider_downBD = Main.instance.getRes("slider_up", alias);		
		s.closeBtn_upBD = Main.instance.getRes("closeBtn_up", alias);
		s.closeBtn_overBD = Main.instance.getRes("closeBtn_over", alias);
		s.closeBtn_downBD = Main.instance.getRes("closeBtn_up", alias);
		s.closeBtn_disabledBD = Main.instance.getRes("closeBtn_up", alias);
		s.windowBackBD = Main.instance.getRes("ui", alias);
		s.textAreaBD = s.textInputBD;
		
		s.linkBtnSkinVec.length = 0;
		s.linkBtnSkinVec.push(new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0,false,null,false,null,null,"center"),
			new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0x499251,false,null,false,null,null,"center"),
			new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0x927249,false,null,false,null,null,"center"),
			new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0x666666,false,null,false,null,null,"center"),
			new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0,false,null,true,null,null,"center"),
			new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0x499251,false,null,true,null,null,"center"),
			new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0x927249,false,null,true,null,null,"center"));
		s.barTextFormat=new GYLite.TextFormat(GYLite.GYText.defualtSysFont,12,0xff,true,null,null,null,null,"center");
		
		// GYLite.GYText.defualtSysFont = (egret.Capabilities.manufacturer.toLowerCase().indexOf("google") == - 1) ? "Microsoft YaHei" : "微软雅黑";		
		GYLite.GYText.defualtSysFont = egret.nativeRender?"DFPYuanW9.TTF":"DFPYuanW9";//egret.nativeRender?"DFPYuanW9.TTF":(navigator.userAgent.toLowerCase().indexOf("chrome") == - 1) ? "Microsoft YaHei" : "微软雅黑";			
		GYLite.GYTextInput.promptFormat=new GYLite.TextFormat(GYLite.GYText.defualtSysFont, 12, 0xcccccc, false, false, false,null,null,"left", null,null,0,5);
		GYLite.GYGroup.default_easeMoveMax = 500;		
		GYLite.GYGroup.default_dragEaseMax = 500;				
		GYLite.GYGroup.default_dragEaseValue = 2500;
	}
	
}
