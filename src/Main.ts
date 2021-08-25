class Main extends egret.DisplayObjectContainer {

		private _myLoader:GYLite.GYLoader;
		private _resCount:number=0;
		private _resMax:number=0;
		private _soundArr:Array<string>;
		public mainUI:GYLite.GYSprite;
		public static instance:Main;
		private _dragLock:boolean;
		private _preloadVec:UICtrlData[]=[];
		private _resName:string;
		private _loadCount:number=0;
		private _root:string;
		private _version:string;
    	public constructor()
		{
			super();				
			Log.init();
			Log.writeLog(MultiLang.str11 + "_" + GameManager.version + "_" + (window["release"]?"":"debug:true") + "-" + location.href + "\n" + Browser.userAgent, Log.WARN);			
			Browser.browswerInit();
			var s = this;
			GameManager.game = s;
			s._myLoader = GYLite.GYLoader.getDefaultLoader();
			if(s.stage)
				s.projInit();
			else
				s.addEventListener(egret.Event.ADDED_TO_STAGE, s.addToStage,s);
		}
		private addToStage(e:egret.Event):void
		{	
			this.projInit();
		}
		private projInit():void
		{
			if(!Browser.onMobile)
				this.dragLock(true);			
			var s = this;
			Main.instance = s;			
			Log.writeLog("屏幕宽高:w-" + s.stage.stageWidth + ",h-" + s.stage.stageHeight, Log.WARN);
			let frameFlag:string = localStorage.getItem("wdCode_noEngoughPower");
			if(frameFlag)
			{
				Log.writeLog("显卡不支持，降低帧率!", Log.WARN);
				s.stage.frameRate = 30;
			}
			s.removeEventListener(egret.Event.ADDED_TO_STAGE, s.addToStage, s);
			// s.stage.scaleMode = egret.StageScaleMode.NO_SCALE;	
			// s.stage.orientation = egret.OrientationMode.LANDSCAPE;
			s._root = window["proj_root"]?window["proj_root"]:"";
			s._version = window["game_version"]?window["game_version"]:"";
			GYLite.GYSprite.Init(s.stage, new Win7SkinTheme);
			ProtoExt.inject();										
			GYLite.GYLoader.defCompressSound = MySound;
			GameManager.getInstance().engineInited();
			s.loadCfg();
			// GYLite.LoadUI.getInstance().show(s.stage);
		}
		public loadCfg():void
		{
			let s = this;
			Log.writeLog(MultiLang.str8, Log.IMPORTANT);
			let rt:string,ver:string;
			if(UserData.getInstance().isRelease == 3 || UserData.getInstance().isRelease == 1)
				rt = (egret.nativeRender?("http://" + UserData.getInstance().host + "/" + s._version + "/"):s._root);
			else
				rt = (egret.nativeRender?("http://" + UserData.getInstance().host + "/" + (UserData.getInstance().isRelease == 2?"_uat":"") + "/wdCode/" + s._version + "/"):s._root);
			ver = URLConf.getCfgVer("");
			GameManager.getInstance().loadData(rt + "configs/"+UserData.getInstance().getPlatform()+"_config.json" + (ver.length > 0?"?" + ver:""), s.configLoaded,s,null,GYLite.GYLoader.TYPE_JSON,HTTPConf.M_GET,null,!egret.nativeRender);		
		}
		public get myLoader():GYLite.GYLoader
		{var s = this;
			return s._myLoader;
		}
		private configLoaded(loadInfo:GYLite.LoadInfo):void
		{let s = this;
			if(loadInfo.content == null)
			{				
				GYLite.TimeManager.timeOut(s.loadCfg,s,2000);
				return;
			}			
			let cfg:any;			
			cfg = loadInfo.content.res;			
			GameManager.getInstance().setConfig(cfg);			
			if(cfg.res!=null)
				s._resName = cfg.res;
			else
				s._resName = UserData.getInstance().getPlatform() + "_res";			
			let ver:string;
			ver = URLConf.getResVer("");
			GameManager.getInstance().loadData(s._root + s._resName + (ver.length > 0?"?" + ver:""),s.resLoadComp,s,null,GYLite.GYLoader.TYPE_BINARY,HTTPConf.M_GET,null,true,{save:false},FileType.FRAME,FileID.FRAME,UIControl.FAIL_RELOAD_COUNT);
			Log.loadLog(loadInfo);
		}
		private resProg(e:egret.Event):void{
			let l:GYLite.SeqURLLoader = e.currentTarget;			
			// GYLite.LoadUI.getInstance().setProg(l.progressData.loaded, l.progressData.total);
		}       
		private resLoadComp(loadInfo:GYLite.LoadInfo):void
		{var s = this;			
			if(loadInfo.content == null)
			{
				++s._loadCount;
				if(s._loadCount == 3)
				{
					s._loadCount = 0;	
					Log.writeLog(MultiLang.str62 + "," + s._resName + "!" + loadInfo.msg,Log.WARN);
					return;
				}							
				GYLite.TimeManager.timeOut(function():void{		
					let ver:string;
					ver = URLConf.getResVer("");							
					GameManager.getInstance().loadData(s._root + s._resName + (ver.length > 0?"?" + ver:"") + Math.random(),s.resLoadComp,s,null,GYLite.GYLoader.TYPE_BINARY,HTTPConf.M_GET,null,true,{save:false});
				},s,1000);				
				Log.writeLog(MultiLang.str60 + loadInfo.msg,Log.WARN);
				// s.initUI();
				return;
			}
			Log.loadLog(loadInfo);
			// Log.writeLog(MultiLang.str9, Log.IMPORTANT);
			// console.log(egret.Base64Util.encode(loadInfo.content.res));
			s._loadCount = 0;
			let l:GYLite.CompressLoadInfo = s._myLoader.loadGYCompressBytes(loadInfo.content.res,s.resUncompressComp,s,null,s.resUncompressPorg);			
			Log.writeLog(MultiLang.str66 + "-length:" + l.progressInfo[0].length + "-version:"+l.progressInfo[0].version+"-size:"+l.progressInfo[0].size,Log.VERBOSE);
		}	
		public setLoadPercent(val:number,lab:string):void
		{
			if(window["loadPercent"]!=null)
				window["loadPercent"](val,lab);
		}
		private resUncompressPorg(l:GYLite.CompressLoadInfo):void
		{
			// GYLite.LoadUI.getInstance().setProg(l.resMax - l.resCount, l.resMax, "解压中...");
			// Log.writeLog(MultiLang.str66 + (l.resMax - l.resCount) + "/" + l.resMax + "-" + l.progressInfo[l.progressInfo.length - 1].key,Log.VERBOSE);			
			let s =this;
			s.setLoadPercent(0.5+0.5 * ((l.resMax - l.resCount)/ l.resMax), "解压中...");
		}
		private resUncompressComp(l:GYLite.CompressLoadInfo):void
		{let s = this;
			// GYLite.LoadUI.getInstance().setProg(l.resMax - l.resCount, l.resMax, "解压中...");
			if(l.errorCode > 0)
			{			
				++s._loadCount;
				if(s._loadCount == 3)
				{
					s._loadCount = 0;
					Log.writeLog(MultiLang.str62 + "," + s._resName + "!" + l.msg,Log.WARN);
					return;
				}			
				Log.writeLog(MultiLang.str60 + l.msg,Log.WARN);
				GYLite.TimeManager.timeOut(function():void{									
					GameManager.getInstance().loadData(s._root + s._resName + URLConf.getResVer() + Math.random(),s.resLoadComp,s,null,GYLite.GYLoader.TYPE_BINARY,HTTPConf.M_GET,null,!egret.nativeRender,{save:false});
				},s,2000);
				return;
			}			
			if(l.resCount == 0)
			{
				Log.uncompressLog(l, s._resName);
        		Log.writeLog(MultiLang.str10, Log.IMPORTANT);
				// GYLite.LoadUI.getInstance().hide();
				// GYLite.GYSprite.skinTheme = new GYLite.SanGuoTheme;				
				if(!MsgBase.haveMsgHandle() || !UserData.getInstance().isReqModule())//非iframe或运行时直接进入界面
				{					
					UserData.getInstance().ossRoot = UserData.getInstance().getOssOrigin();
					URLConf.resetRoot();
					if(!MsgBase.haveMsgHandle())
					{
						Log.writeLog(MultiLang.str27, Log.IMPORTANT);
					}						
					else if(!UserData.getInstance().isReqModule())
						Log.writeLog(MultiLang.str28, Log.IMPORTANT);										
					s.initUI();
				}					
				else
				{	
					MsgBase.getMsgHandle().regMsg(MsgBase.GET_USERDATA, s.userDataBack, s);//获取用户数据
					MsgBase.getMsgHandle().sendMsg(MsgBase.GET_USERDATA, null);					
				}
			}
		}
		private userDataBack(d:any):void
		{let s = this;
			MsgBase.getMsgHandle().unregMsg(MsgBase.GET_USERDATA, s.userDataBack, s);
			if(d == null)return;
			if(d.data)
			{
				let userData:UserData = UserData.getInstance();
				userData.setUserData(d.data);
				Log.userDataInited = true;
				MsgBase.getMsgHandle().regMsg(MsgBase.GET_PAGEDATA, s.pageDataBack, s);//获取页面数据
				MsgBase.getMsgHandle().sendMsg(MsgBase.GET_PAGEDATA, null);				
			}
		}
		private pageDataBack(d:any):void
		{let s = this;
			MsgBase.getMsgHandle().unregMsg(MsgBase.GET_PAGEDATA, s.pageDataBack, s);
			if(d == null)return;
			// if(d.data)
			// {				
				let userData:UserData = UserData.getInstance();
				userData.setPageData(d.data);				
				s.initUI();
			// }
		}
		private initUI():void
		{var s = this;            			
			// GYLite.GYSprite.skinTheme.initRes();
			GYLite.GYSprite.skinTheme = new Win7SkinTheme;			
			GameManager.getInstance().gameInit();	
			if(UserData.getInstance().whiteUserIndex == 2)
				UserData.getInstance().setQueryVariable("debugData",1);
			if(UserData.getInstance().isRelease != 1)
			{
				GYLite.GYSprite.stage.addEventListener(egret.TouchEvent.TOUCH_TAP,function(e:egret.TouchEvent):void{						
					if(GYLite.GYSprite.stageX < 50 && GYLite.GYSprite.stageY < 50)
					Log.showLog(Log.logArea && !Log.logArea.parent);
				},s);
			}
			GYLite.TimeManager.timeOut(s.doInitUI,s, 0);
			// egret.registerFontMapping("DFPYuanW9","DFPYuanW9.TTF");//自定义字体
		}
		private doInitUI():void
		{var s = this;  
			GYLite.GYSprite.player.canvas.addEventListener("webglcontextlost", function():void{
				localStorage.setItem("wdCode_noEngoughPower", "30");
				Log.writeLog("webgl丢失!",Log.WARN);
			}, false);
            GYLite.GYSprite.player.canvas.addEventListener("webglcontextrestored", function():void{
				Log.writeLog("webgl恢复!",Log.WARN);
			}, false);
			s.stage.addEventListener(egret.Event.RESIZE, s.resize,s);			
            LayerManager.getInstance().initLayer(s.stage);			
            // GYLite.CommonUtil.addStageLoop(s.loop,s);
			GameManager.getInstance().resize(s.stage.stageWidth,s.stage.stageHeight);
			// Log.showLog();
			s.preloadModules();					
		}
		private preloadModules():void
		{
			let arr:string[] = GameManager.getInstance().preloads;
			let i:number,len:number;
			let obj:any;
			let uiCfg:UICtrlData;
			let s = this;			
			if(arr && arr.length > 0)
			{			
				len = arr.length;	
				for(i=0;i<len;++i)
				{
					obj = arr[i];
					uiCfg = UIControl.getInstance().preloadUI(obj.module, "", obj.mdVer);
					Log.writeLog(MultiLang.str59 + (i + 1) + "/" + len + "..." + obj.module + "?" + obj.mdVer, Log.IMPORTANT);
					if(uiCfg)
						s._preloadVec.push(uiCfg);
				}
				GYLite.CommonUtil.addStageLoop(s.preloadProg,s);
			}
			else
			{				
				GameManager.getInstance().gameStart();
			}				
		}
		private preloadProg(t:number):void
		{let s = this;
			let i:number,len:number;
			let percent:number = 0;
			let uiCfg:UICtrlData;
			let obj:any;
			let arr:string[] = GameManager.getInstance().preloads;			
			len = s._preloadVec.length;			
			for(i=0;i<len;++i)
			{
				uiCfg = s._preloadVec[i];
				obj = arr[i];
				if(uiCfg.loadPercent >= 1)
				{
					if(obj.open == 1)
					{
						UIControl.getInstance().openUI(uiCfg.uiPath,"",obj.mdVer,null,obj.mutual);
					}
				}
				percent += uiCfg.loadPercent;
			}
			percent = percent / len;			
			if(percent >= 1)
			{
				GYLite.CommonUtil.delStageLoop(s.preloadProg,s);
				s._preloadVec.length = 0;
				//预加载成功
				GameManager.getInstance().gameStart();
			}
		}				
        private resize(e:egret.Event):void
        {let s = this;
			if(s.stage == null)return;
			GameManager.getInstance().resize(s.stage.stageWidth,s.stage.stageHeight);
        }
        private loop():void
        {

        }
        private spriteSheepDict:GYLite.Dictionary = new GYLite.Dictionary;
		//是否有资源
		public hasRes(key:string, aliasKey:string):boolean
		{
			return !!GYLite.GYLoader.getRes(key, aliasKey);
		}
		//是否有数据资源
		public hasDataRes(key:string):boolean
		{
			return !!GYLite.GYLoader.getDataRes(key);
		}
        public getRes(key:string,aliasKey:string = null):any
        {
            var res:GYLite.ResObject;            
			if(aliasKey == "")aliasKey = null;
            res = GYLite.GYLoader.getRes(key, aliasKey);
			if(res == null)
			{
				let arr:string[] = key.split("$");
				if(arr.length > 1)				
					res = GYLite.GYLoader.getRes(arr[1], arr[0]);				
			}
            if(res == null)
            {
                Log.writeLog("资源不存在 " + key + "-" + aliasKey, Log.WARN);                
				return GameManager.getInstance().errorTexture;
            }
            return res.res;
        }
        public getDataRes(key:string):any
        {
            var res:GYLite.ResObject;            
            res = GYLite.GYLoader.getDataRes(key);
            if(!res)
            {
                Log.writeLog("数据资源不存在 " + key, Log.WARN);                
                return null;
            }
            return res.res;
        }
        /**销毁资源
         * @param 销毁关于key指定的路径资源
        */
        public disposeRes(key:string):void
        {
			FairyGUIProto.disposePkg();
			EgretProto.deleteResByKey(key);
            GYLite.GYLoader.deleteResByKey(key);
        }
		/**获取exml文本
		 * @param path exml路径
		*/
		public getEXML(path:string,uiID:string=null):string
		{
			let s = this;
			uiID = uiID == null?(EgretProto.curRunUIID!=null?UIControl.getUIIDPath(EgretProto.curRunUIID):UIControl.getInstance().curUIIDPath):UIControl.getUIIDPath(uiID);
			path = uiID +"/"+path;
			let str:string = s.getDataRes(path);
			if(str == null)
			{
				Log.writeLog(MultiLang.str23 + path, Log.WARN);
			}
			return str;
		}

		public dragLock(val:boolean):void
		{let s = this;
			if(s._dragLock == val)return;
			s._dragLock = val;
			if(val)
				document.addEventListener("dragstart",s.dragFunc);
			else
				document.removeEventListener("dragstart",s.dragFunc);
		}
		private dragFunc(event):void
		{
			event.preventDefault();
		}		
}