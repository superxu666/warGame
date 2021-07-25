class ElementBase extends GYLite.GYSprite implements IOutlines,GYLite.IUpdate,GYLite.IPoolObject{	
	public static getDefaultConfig(skinType:number):any
	{
		let cfg:any = {x:0,y:0};
		if(skinType == SkinType.SPINE)
		{
			cfg.skin = {
				"skinType":skinType,					
				"outlines":[[-121, -227, 121, -227, 121, 0, -121, 0]],
				"rectOutlines":[]
			}
		}
		else if(skinType == SkinType.IMAGE)
		{
			cfg.skin = {
				"skinType":skinType,										
			}
		}
		
		return cfg;
	}			
	public constructor() {
		super();		
		let s = this;
		s.touchEnabled = true;
		s._rectOutlines = [];
		s._outlines = [];
		s._globalOutlines = [];
		s._globalRectOutlines = [];
	}
	public parseConfig(cfg:any):void
	{
		let s= this;
		s._config = cfg;
		s._elementName = cfg.elementName;
		s._skin = s.skin = cfg.skin;
		s.rotation = cfg.rotation?cfg.rotation:0;
		s.scaleX = cfg.scaleX?cfg.scaleX:1;
		s.scaleY = cfg.scaleY?cfg.scaleY:1;
		s.alpha = cfg.alpha?cfg.alpha:1;
		s.x = cfg.x?cfg.x:0;
		s.y = cfg.y?cfg.y:0;
	}
	public get skin():any
	{
		return this._skin;
	}		
	public set skin(skin:any)
	{
		let s = this;		
		s._skin = skin;				
		s.setSkin(skin);
	}
	public setSkin(skin:any):void
	{
		let s = this;		
		let skinType:number;
		skinType = skin.skinType?skin.skinType:0;
		if(skinType == skin.skinType && s._skinPart)//如果类型相同则更换皮肤内容即可，spine除外
		{
			if(skinType == SkinType.SEQ)
			{
				// s._skinPart.source
				return;
			}
			else
			{
				s._skinPart.source = Main.instance.getRes(skin.image,skin.alias);
				return;	
			}
			
		}
		if(s._skinPart)
		{
			if(s._skinPart.dispose)
				s._skinPart.dispose();
			else
				s._skin.removeElement(s._skinPart);
			s._skinPart = null;
		}
		s._skinType = skin.skinType?skin.skinType:0;
		if(skinType == SkinType.SPINE)
		{
			let spine:SpineSkeleton;
			s._skinPart = spine = SpineSkeleton.createSpine(skin.skName,skin.skPath);			
			s._skin.addElement(spine);
			if(skin.actions == null)
			{
				skin.actions = [
					[{action:"C101"},{action:"C201"},{action:"C301"},{action:"C401"},{action:"C501"},{action:"C601"},{action:"C701"},{action:"C801"}],
					[{action:"C202"},{action:"C202"},{action:"C302"},{action:"C402"},{action:"C502"},{action:"C602"},{action:"C702"},{action:"C802"}]
				];
			}			
		}		
		else if(skinType == SkinType.SEQ)
		{
			let seqImg:GYLite.GYSeqImage;
			s._skinPart = seqImg = new GYLite.GYSeqImage;			
			seqImg.intervalTime = 100;			
			s.addElement(seqImg);			
		}
		else
		{
			let img:GYLite.GYImage;
			s._skinPart = img = new GYLite.GYImage;						
			s.addElement(img);
			img.source = Main.instance.getRes(skin.image,skin.alias);			
		}
		if(skin.anchorX)s._skinPart.x = -skin.anchorX;
		if(skin.anchorY)s._skinPart.y = -skin.anchorY;
	}
	public get config():any
	{
		return this._config;
	}
	public get elementName():string
	{
		return this._elementName;
	}

	public set anchorX(val:number)
	{
		let s =this;
		if(s._skinPart)
			s._skinPart.x = -val;
	}
	public set anchorY(val:number)
	{
		let s =this;
		if(s._skinPart)
			s._skinPart.y = -val;
	}

	public get anchorX():number
	{
		let s =this;
		return s._skinPart?-s._skinPart.x:0;
	}
	public get anchorY():number
	{
		let s =this;
		return s._skinPart?-s._skinPart.y:0;
	}
	public get inPool():boolean
	{
		return this._inPool;
	}
	public set inPool(value:boolean)
	{
		this._inPool = value;
	}
	/**角色外轮廓*/
	public get outlines():number[][]
	{
		return this._outlines;
	}
	/**角色rect外轮廓*/
	public get rectOutlines():number[][]
	{
		return this._rectOutlines;
	}
	public getGlobalOutline():number[][]
	{
		let i:number,len:number,j:number,len2:number;
		let p:egret.Point;
		let s = this;
		let arr:number[];
		s._globalOutlines.length = 0;
		len2 = s.outlines.length;
		for(j=0;j<len2;++j)	
		{
			arr = s.outlines[j];
			if(s._globalOutlines[j] == null)
				s._globalOutlines[j] = [];
			len = arr.length;
			for(i=0;i<len;i+=2)	
			{
				p = s._skin.localToGlobal(arr[i],arr[i+1]);
				s._globalOutlines[j][i] = p.x;
				s._globalOutlines[j][i+1] = p.y;
			}
		}			
		return this._globalOutlines;
	}
	public getGlobalRectOutline():number[][]
	{
		let i:number,len:number,j:number,len2:number;
		let p:egret.Point;
		let s = this;
		let arr:number[];	
		s._globalRectOutlines.length = 0;
		len2 = s._rectOutlines.length;
		for(j=0;j<len2;++j)	
		{
			arr = s._rectOutlines[j];
			if(s._globalRectOutlines[j] == null)
				s._globalRectOutlines[j] = [];
			len = arr.length;
			for(i=0;i<len;i+=2)	
			{
				p = s._skin.localToGlobal(arr[i],arr[i+1]);
				s._globalRectOutlines[j][i] = p.x;
				s._globalRectOutlines[j][i+1] = p.y;
			}
		}
		
		return this._globalRectOutlines;
	}
	/**轮廓失效*/
	public invalidOutline():void
	{let s = this;			
		if(s._invalidOutline)return;
		s._invalidOutline = true;
		GYLite.LayoutManager.addRenderFunc(s);			
	}
	public shape:GYLite.GYSprite;
	public validOutline():void
	{let s = this;	
		let minSize:number;
		let outlineArr:number[][];
		let i:number,len:number,j:number,len2:number;
		let p:egret.Point,p2:egret.Point;
		let arr:number[];
		if(s._skin == null)return;
		if(s._skin.outlines && s._skin.outlines.length > 0 && s._skin.outlines[0] && s._skin.outlines[0].length > 0)
		{
			s._outlines.length = 0;
			len = s._skin.outlines.length;
			for(i=0;i<len;++i)
			{
				s._outlines[i] = s._skin.outlines[i].concat();
				s._rectOutlines[i] = (s._skin.rectOutlines[i] && s._skin.rectOutlines[i].length > 0)?s._skin.rectOutlines[i].concat():s._outlines[i].concat();
			}				
		}
		else
		{				
			minSize = Math.min(s._skinPart.width, s._skinPart.height);
			outlineArr = OutlineUtil.getInstance().getDisplayOutLine(s._skinPart,0.08726645,minSize>300?20:(minSize > 80?10:5));			
			s._outlines = [outlineArr[1]];
			s._rectOutlines = [outlineArr[0]];
		}
		s._globalOutlines.length = 0;
		len2 = s._outlines.length;
		if(len2 > 0)
		{				
			for(j=0;j<len2;++j)
			{
				arr = s._outlines[j];
				len = arr.length;
				for(i=0;i<len;i+=2)	
				{
					arr[i] = arr[i] - s._skinPart.x;
					arr[i + 1] = arr[i + 1] - s._skinPart.y;					
				}
				arr = s._rectOutlines[j];
				len = arr.length;
				for(i=0;i<len;i+=2)	
				{
					arr[i] = arr[i] - s._skinPart.x;
					arr[i + 1] = arr[i + 1] - s._skinPart.y;
				}
			}
			//debug外框
			// if(s.shape == null)
			// {
			// 	s.shape = new GYLite.GYSprite;
			// 	s._skin.addChild(s.shape);				
			// }			
			// let g:egret.Graphics = s.shape.graphics;				
			// g.clear();
			// len2 = s._outlines.length;
			// for(j=0;j<len2;++j)
			// {
			// 	arr = s._outlines[j];
			// 	g.lineStyle(1,0x00ff00);
			// 	g.lineTo(arr[0],arr[1]);
			// 	len = arr.length;					
			// 	for(i=2;i<len;i+=2)
			// 	{
			// 		g.lineStyle(1,0x00ff00);
			// 		g.lineTo(arr[i],arr[i+1]);
			// 	}
			// 	if(len > 6)					
			// 		g.lineTo(arr[0],arr[1]);					
			// }
			
		}
	}
	public updateView():void
	{
		let s =this;
		super.updateView();
		if(s._invalidOutline)
		{
			s.validOutline();
			s._invalidOutline = false;
		}
	}
	protected toPool():void
	{let s = this;
		GYLite.PoolUtil.toPool(s, s.constructor);
	}
	protected beforeToPool():void
	{let s = this;				
		s._rectOutlines.length = 0;
		s._outlines.length = 0;
		s._globalOutlines.length = 0;
		s._globalRectOutlines.length = 0;
		// s._hitGrids.length = 0;			
		if(s._skinPart)
		{
			if(s._skinPart.dispose)
				s._skinPart.dispose();
			else
				s._skin.removeElement(s._skinPart);
			s._skinPart = null;
		}
		if(s._skin.parent!=null)
			(<GYLite.GYSprite>s._skin.parent).removeElement(s._skin);
		s.module = null;
	}
	/**清理角色*/
	public clear():void
	{
		let s = this;
		if(s._inPool)return;					
		s.beforeToPool();			
		s.toPool();		
	}		
	public outPoolInit(): void
	{	
		let s = this;		
		s._skinType = -1;	
	}
	public dispose(): void
	{
		let s =this;
		s.clear();
	}	

	protected _config:any;
	protected _skinPart:any;
	protected _skin:any;	
	protected _elementName:string;
	protected _skinType:number;
	protected _outlines:number[][];
	protected _rectOutlines:number[][];
	protected _globalOutlines:number[][];
	protected _globalRectOutlines:number[][];
	protected _invalidOutline:boolean;
	protected _inPool:boolean;
	public module:ModuleBase;
}