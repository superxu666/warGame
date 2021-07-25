class DetailPanel extends UIBase{
	private static _instance:DetailPanel;
	public static getInstance():DetailPanel
	{
		if(DetailPanel._instance == null)
			DetailPanel._instance = new DetailPanel;
		return DetailPanel._instance;
	}
	public back:GYLite.GYScaleSprite;
	public logTxt:GYLite.GYTextArea;
	public closeBtn:GYLite.GYButton;
	public constructor() {
		super();
		let s = this;
		s.x = 0;
		s.y = 100;
		s.width = GameManager.getInstance().stardardWidth * 0.8;
		s.height = GameManager.getInstance().stardardHeight * 0.8;
		let theme:Win7SkinTheme = <Win7SkinTheme>GYLite.GYSprite.skinTheme;
		s.back = SkinManager.createScaleImage(s,0,0,"ui",theme.themeAlias, theme.sizeRect20_20_50_20);
		s.back.touchEnabled = true;
		s.back.width = s.width;
		s.back.height = s.height;
		s.closeBtn = SkinManager.createBtn2(s,s.width - 100,1,["closeBtn_up","closeBtn_over","closeBtn_over"],theme.themeAlias);
		s.closeBtn.width = 60;
		s.closeBtn.height = 28;
		s.logTxt = SkinManager.createTextArea(s, 10, 30, s.width - 20, s.height - 40, 24, 0);
		// s.logTxt.editable = false;
		s.logTxt.textGrp.canDrag = true;
		s.closeBtn.setOnClick(s.close, s);	
	}
	public close(e:egret.TouchEvent):void
	{
		this.hide();
	}
	public showDetail(pr:GYLite.GYSprite=null,detail:string=""):void
	{		
		let s = this;
		s.show(pr);
		s.logTxt.text = detail;
	}
	public show(pr:GYLite.GYSprite= null):void
	{
		super.show(pr?pr:LayerManager.getInstance().topLay);
		let s= this;
		GYLite.DraggerHandle.getInstance(s.back).addBind(s.dragLoop,s);		
	}
	public hide():void
	{
		super.hide();
		let s = this;
		GYLite.DraggerHandle.getInstance(s.back).clear();
		s.logTxt.text = "";
	}
	private dragLoop(d:GYLite.DraggerHandle):void
	{
		let s =this;
		s.x = (<any>s.parent).mouseX - d.dragMouseX;
		s.y = (<any>s.parent).mouseY - d.dragMouseY;
	}
}