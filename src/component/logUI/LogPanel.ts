class LogPanel extends UIBase implements GYLite.IKeyBoardObject{
	public back:GYLite.GYScaleSprite;
	public closeBtn:GYLite.GYButton;
	public logList:GYLite.GYListV;
	public logProList:GYLite.GYListV;
	public logInput:GYLite.GYTextInput;
	public logProListBack:GYLite.GYScaleSprite;
	public logExBtn:GYLite.GYButton;
	public refreshBtn:GYLite.GYButton;
	public infoBtn:GYLite.GYButton;
	public clearBtn:GYLite.GYButton;
	private fpsTxt:GYLite.GYText;
	private _lastVar:string;
	private _historyCommand:string[] = [];
	private _historyIndex:number =0 ;
	private _cost:number;
	private _fpsCount:number;
	private _frameMs:number;
	public comboBox:GYLite.GYComboBox;
	public constructor() {
		super();
		let s = this;
		s._historyCommand = [];
		s.touchEnabled = true;
		s.width = GameManager.getInstance().stardardWidth * 0.8;
		s.height = GameManager.getInstance().stardardHeight * 0.8;
		// s.propertyList = SkinManager.createListV(s,0,0,400,400,PropertyItem);
		let theme:Win7SkinTheme = <Win7SkinTheme>GYLite.GYSprite.skinTheme;
		s.back = SkinManager.createScaleImage(s,0,0,"ui",theme.themeAlias, theme.sizeRect20_20_50_20);
		s.back.touchEnabled = true;
		s.back.width = s.width;
		s.back.height = s.height;
		s.closeBtn = SkinManager.createBtn2(s,s.width - 100,1,["closeBtn_up","closeBtn_over","closeBtn_over"],theme.themeAlias);
		s.closeBtn.width = 60;
		s.closeBtn.height = 28;
		let listV:GYLite.GYListV = new GYLite.GYListV(365,function():GYLite.IItemRender{
			let item:LogItem = new LogItem;			
			return item;
		}, null);
		listV.rectHit = true;
		listV.canDrag = true;
		listV.touchEnabled = true;
		listV.dataProvider = [];
		// listV.virtual_layout = false;
		// let listV:VerticalBox = new VerticalBox(LogItem);
		listV.width = s.width - 64;
		// listV.height = 365;
		// listV.touchEnabled = true;
		// listV.dataProvider = [];	
		// listV.scrollerViewPort.canDrag = true;
		listV.x = 10;
		listV.y = 75;					
		s.addElement(listV);		
		s.logList = listV;
		s.closeBtn.setOnClick(s.close, s);		
		s.logInput = new GYLite.GYTextInput;
		s.logInput.width = s.width - listV.x * 2 - 108;
		s.logInput.height = 38;
		s.logInput.y = s.height - s.logInput.height - 10;
		s.logInput.x = listV.x;
		s.logInput.textInput.size = 24;
		s.logInput.paddingTop = 10;
		s.logInput.paddingLeft = 5;
		s.logInput.addEventListener(egret.Event.CHANGE,s.logInputChange,s);
		s.addElement(s.logInput);
		s.logProList = SkinManager.createListV(s,s.logList.x+5,s.logList.y + s.logList.height + 10, s.logList.width - 90, s.height - listV.height - listV.y - s.logInput.height - 30, LogProItem);
		s.logProList.addEventListener(GYLite.GYViewEvent.SELECTED, s.selectedPro,s);
		s.logProList.canSelectNum = 1;		
		s.logProListBack = SkinManager.createScaleImage(s,s.logProList.x - 5,s.logProList.y - 5,"textInput",theme.themeAlias,new GYLite.Scale9GridRect(5,5,5,5));
		s.logProListBack.width = s.logProList.width + 26;
		s.logProListBack.height = s.logProList.height + 10;
		s.addElement(s.logProList);
		s.clearBtn = s.createBtn("清空");
		s.clearBtn.height = (s.logProListBack.height + s.logInput.height) / 4 - 10;		
		s.clearBtn.x = s.logInput.x + s.logInput.width + 10;
		s.clearBtn.y = s.logProListBack.y;		
		s.clearBtn.setOnClick(s.clearLog,s);
		s.refreshBtn = s.createBtn("刷新");
		s.refreshBtn.height = s.clearBtn.height;
		s.refreshBtn.x = s.clearBtn.x;
		s.refreshBtn.y = s.clearBtn.y + s.clearBtn.height + 12;
		s.refreshBtn.setOnClick(s.refresh,s);
		s.infoBtn = s.createBtn("信息");
		s.infoBtn.height = s.clearBtn.height;
		s.infoBtn.x = s.clearBtn.x;
		s.infoBtn.y = s.refreshBtn.y + s.refreshBtn.height + 12;
		s.infoBtn.setOnClick(s.infoShow,s);
		s.logExBtn = s.createBtn("执行");		
		s.logExBtn.height = s.clearBtn.height;
		s.logExBtn.x = s.clearBtn.x;
		s.logExBtn.y = s.infoBtn.y + s.infoBtn.height + 12;		
		
		s.logExBtn.setOnClick(s.excCommand,s);
		s.comboBox = (<Win7SkinTheme>GYLite.GYSprite.skinTheme).GetComboBox(100,100);
		s.comboBox.x = 10;
		s.comboBox.y = 30;
		s.comboBox.textInput.paddingTop = 5;
		s.comboBox.scaleX = s.comboBox.scaleY = 2;
		s.comboBox.menu.scaleX = s.comboBox.menu.scaleY = 2;		
		s.comboBox.menu.dataProvider = [
			{index:0,label:"VERBOSE"},
			{index:1,label:"INFO"},
			{index:2,label:"IMPORTANT"},
			{index:3,label:"WARN"},
			{index:4,label:"ERROR"},
			{index:5,label:"NET"},
			{index:6,label:"MSG"},
			{index:7,label:"TIME"},
		];		
		s.comboBox.menu.listV.addEventListener(GYLite.GYViewEvent.SELECTED,s.selectedItem,s);		
		s.addElement(s.comboBox);
		s.fpsTxt = SkinManager.createText(s,s.comboBox.x + 270,s.comboBox.y + 5,"60", 0xffff00,24);
		s.comboBox.textInput.text = "VERBOSE";
		let command:string =localStorage.getItem("wcCode_debug_command");
		if(command)
		{
			s.logInput.text = command;
		}
		s._frameMs = (1000 / GYLite.GYSprite.stage.frameRate);
	}
	private createBtn(label:string):GYLite.GYButton
	{
		let s = this;
		let btn:GYLite.GYButton;
		btn = new GYLite.GYButton;
		btn.label = label;
		btn.width = 60;
		btn.height = 60;
		btn.labelDisplay.size = 24;
		s.addElement(btn);
		return btn;
	}
	private refresh(e:egret.TouchEvent):void
	{
		let uiID:string = UIControl.getInstance().curUIID;
		let fileType:number = UIControl.getInstance().curFileType;
		let fileID:string = UIControl.getInstance().curFileID;
		UIControl.getInstance().disposeCurUI();
		UIControl.getInstance().openUI(uiID,null,Math.random()+"",null,true,fileType,fileID);
	}
	private infoShow(e:egret.TouchEvent):void
	{
		var str:string;
		str = GameManager.version + "_" + (window["release"]?"":"debug:true") + "-" + location.href + "\n" + Browser.userAgent + "\n";
		str += "屏幕宽高:w-" + GYLite.GYSprite.stage.stageWidth + ",h-" + GYLite.GYSprite.stage.stageHeight;		
		if(Log.lastModuleInfo.length > 0)
		{
			var i:number,len:number;
			len = Log.lastModuleInfo.length;
			for(i=0;i<len;++i)			
				str += Log.lastModuleInfo[i] + "\n";
		}
		DetailPanel.getInstance().showDetail(LayerManager.getInstance().gameSp,str);
	}
	private fpsLoop():void
	{let s = this;		
		let val:number,val2:number;
		++s._fpsCount;
		val = (Log.costRender + Log.costTicker);
		s._cost += val < s._frameMs?s._frameMs:val;
		if(s._fpsCount == 60)
		{
			val2 = s._frameMs * 60;
			if(s._cost < val2)
				s.fpsTxt.text = "fps:60";
			else
				s.fpsTxt.text = "fps:" + ((val2 / s._cost) * 60 | 0);
			s._cost = 0;
			s._fpsCount = 0;
		}		
	}
	private selectedItem(e:GYLite.GYViewEvent):void
	{
		let s = this;
		let d:any = s.comboBox.menu.listV.selectedData;
		Log.filterDebug(d.label);
	}
	private clearLog(e:egret.TouchEvent):void
	{let s = this;
		s.logList.dataProvider = [];
	}
	private excCommand(e:egret.TouchEvent):void
	{let s = this;
		s.exc(s.logInput.text);
	}
	private exc(command:string):void
	{let s = this;				
		s._historyCommand.push(command);
		s._historyIndex = s._historyCommand.length - 1;
		s.doExc(command);
	}
	private doExc(command:string):void
	{let s = this;
		if(!command)return;
		Log.addDebugLog(command);
		let arr:string[] =command.split(":");
		if(arr.length > 1)
		{
			if(arr[0]=="gameStart")
			{
				UserData.getInstance().setQueryVariable("module",arr[1]);
				GameManager.getInstance().gameStart();
			}
			else if(arr[0]=="openUI")
			{
				arr.shift();
				UIControl.getInstance().openUI.call(UIControl.getInstance(), arr[0], null, Math.random(), {mask: true}, true);
			}
			else if(arr[0]=="lesson")
			{
				// let chartIndex: string, position: string;
				// chartIndex = UserData.getInstance().getQueryChartIndex();
				// if (chartIndex == null) chartIndex = "0";
				// position = UserData.getInstance().getQueryPosition();
				// LessonMgr.getInstance().setLessonData(UserData.getInstance().pageData);
				// LessonMgr.getInstance().enterChartByIndex(Number(chartIndex),position == null?Number(position):NaN);	
				UIControl.getInstance().openUI("lesson", null, null, {
					// chartIndex: Number(chartIndex),
					// position: position == null ? Number(position) : NaN,
					pageData: UserData.getInstance().pageData
				}, true,FileType.LESSON,arr[1]);
			}
		}
		else if(arr.length == 1)
		{	
			let output = eval(arr[0]);
			if(output)
				Log.addDebugLog(output);
		}
		s.logInput.text = "";
		s.logProList.dataProvider = [];
		localStorage.setItem("wcCode_debug_command",command);
	}
	private selectedPro(e:GYLite.GYViewEvent):void
	{let s = this;
		let replaceVar:string;
		let inputStr:string;
		inputStr = s.logInput.text;
		replaceVar = s.logProList.selectedData;
		if(s._lastVar == null || s._lastVar == "")
			s.logInput.text = inputStr + replaceVar;
		else
		{
			s.logInput.text = inputStr.substring(0,inputStr.length - s._lastVar.length) + replaceVar;
		}
		s.logInput.textInput.setFocus();
	}	
	private logInputChange(e:egret.TouchEvent):void
	{
		let s = this;
		let str:string;
		let arr:string[];
		let proArr:string[];
		let obj:any;
		let key2:string;		
		str = s.logInput.text;
		if(str == "")
		{
			s.logProList.dataProvider = [];
			s._lastVar = "";
			return;
		}
		///[a-zA-Z0-9_]+|[><\+\-\*\/%\[\]\&\|\"\'\(\)\[\]\{\}~!\^\?:,]|<<|>>|>>>|<<<|&&|\|\||>=|<=/g
		// arr = str.match(/[a-zA-Z0-9_]+|\+\+|--|<<<|>>>|>>|<<|&&|\|\||>=|<=|[^a-zA-Z0-9_]/g);
		obj = ExpressAnalyse.getVarObj(str);
		if(obj == null)obj = window;
		proArr = [];	
		s._lastVar = ExpressAnalyse.lastVar;		
		key2 = ExpressAnalyse.lastVar.toLocaleUpperCase();			
		if(!GYLite.CommonUtil.GYIs(obj,Number) && !GYLite.CommonUtil.GYIs(obj,String))
		{
			//属性筛查
			for(var key in obj)
			{
				if(key2 == "." || key.toLocaleUpperCase().indexOf(key2) == 0)
					proArr.push(key);
			}
		}		
		if(proArr.length > 0)
		{
			//变量排序
			proArr.sort((a,b)=>{
				// if(a.length < b.length)
				// 	return -1;
				// else if(a.length > b.length)
				// 	return 1;
				return a < b?-1:1;
			});				
		}
		s.logProList.dataProvider = proArr;
		s.logProList.vScroller.position = 0;
	}
	public show(pr:GYLite.GYSprite= null):void
	{
		super.show(pr?pr:LayerManager.getInstance().topLay);
		let s= this;
		GYLite.DraggerHandle.getInstance(s.back).addBind(s.dragLoop,s);
		GYLite.GYKeyboard.getInstance().addKeyListener(s);
		GYLite.CommonUtil.addStageLoop(s.fpsLoop, s);
		s._cost = s._fpsCount = 0;
	}
	public hide():void
	{
		super.hide();
		let s = this;
		GYLite.DraggerHandle.getInstance(s.back).clear();
		GYLite.GYKeyboard.getInstance().removeKeyListener(s);
		GYLite.CommonUtil.delStageLoop(s.fpsLoop, s);
	}
	private dragLoop(d:GYLite.DraggerHandle):void
	{
		let s =this;
		s.x = (<any>s.parent).mouseX - d.dragMouseX;
		s.y = (<any>s.parent).mouseY - d.dragMouseY;
	}
	public close(e:egret.TouchEvent):void
	{
		this.hide();
	}
	public keyFocus(): boolean
	{
		return false;
	}
    public kDown(keyCode: number): void
	{
		
	}
    public kUp(keyCode: number): void
	{let s =this;
		if(keyCode == GYLite.Keyboard.ENTER)
		{
			let str:string = s.logInput.text;
			s.doExc(str);
		}
		else if(keyCode == GYLite.Keyboard.UP)
		{
			if(s._historyIndex == 0)
			{
				s.logInput.text = s._historyCommand[0];
				return;
			}
			--s._historyIndex;
			s.logInput.text = s._historyCommand[s._historyIndex];
		}
		else if(keyCode == GYLite.Keyboard.DOWN)
		{
			if(s._historyIndex == s._historyCommand.length - 1)
			{
				s.logInput.text = s._historyCommand[s._historyCommand.length - 1];
				return;
			}
			++s._historyIndex;
			s.logInput.text = s._historyCommand[s._historyIndex];
		}
	}
}