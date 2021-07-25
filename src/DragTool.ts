class DragTool implements GYLite.IKeyBoardObject{
	private static _instance:DragTool;
	public static getInstance():DragTool
	{
		if(DragTool._instance == null)
			DragTool._instance = new DragTool;
		return DragTool._instance;
	}
	public constructor() {
		let s = this;
		s.dragers = new GYLite.Dictionary;
	}
	private dragers:GYLite.Dictionary;
	public curDisplay:GYLite.GYSprite;
	public toggleDrag(pr:GYLite.GYSprite)
	{
		let len:number;
		let elements:GYLite.IGYDisplay[];
		let s = this;
		let dragger:GYLite.DraggerHandle;
		let drags:GYLite.DraggerHandle[];
		if(s.dragers.getValue(pr))
		{
			drags = s.dragers.getValue(pr);
			len = drags.length;
			while(--len > -1)
			{					
				drags[len].clear();
			}
			drags.length = 0;
			s.dragers.deleteKey(pr);
			GYLite.GYKeyboard.getInstance().removeKeyListener(s);
		}
		else
		{
			drags = [];
			s.dragers.setValue(pr, drags);
			elements = pr.getElementList();
			len = elements.length;
			while(--len > -1)
			{
				elements[len].touchEnabled = true;
				dragger = GYLite.DraggerHandle.getInstance(elements[len]);
				dragger.addBind(s.dragLoop,s);
				drags.push(dragger);
			}
			GYLite.GYKeyboard.getInstance().addKeyListener(s);			
		}		
	}
	private dragLoop(d:GYLite.DraggerHandle):void
	{
		d.handle.x = (<any>d.handle.parent).mouseX - d.dragMouseX | 0;
		d.handle.y = (<any>d.handle.parent).mouseY - d.dragMouseY | 0;
		let s = this;
		s.curDisplay = <GYLite.GYSprite>d.handle;
		s.curDisplay.toolTipString = s.curDisplay.x + "," + s.curDisplay.y;
		s.curDisplay.isTipFollow = true;
		s.curDisplay.toolTipOffsetY = -30;
		s.curDisplay.showTip(true,s.curDisplay);
	}
	public output():string
	{
		return "";
	}
	public keyFocus(): boolean
	{
		return true;
	}
	public kDown(keyCode: number): void
	{let s =this;
		let step:number;		
		step = GYLite.GYKeyboard.getInstance().isShiftDown()?10:1;
		if(!s.curDisplay)return;
		if(keyCode == GYLite.Keyboard.LEFT)
		{			
			s.curDisplay.x = s.curDisplay.x - step | 0;
		}				
		else if(keyCode == GYLite.Keyboard.RIGHT)
		{			
			s.curDisplay.x = s.curDisplay.x + step | 0;
		}				
		else if(keyCode == GYLite.Keyboard.UP)
		{			
			s.curDisplay.y = s.curDisplay.y - step | 0;
		}				
		else if(keyCode == GYLite.Keyboard.DOWN)
		{			
			s.curDisplay.y = s.curDisplay.y + step | 0;
		}
		s.curDisplay.toolTipString = s.curDisplay.x + "," + s.curDisplay.y;
		s.curDisplay.toolTipOffsetY = -s.curDisplay.height;
		s.curDisplay.isTipFollow = true;
		s.curDisplay.showTip(true,s.curDisplay);		
				
	}
	public kUp(keyCode: number): void
	{

	}
}