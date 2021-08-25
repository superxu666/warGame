class URLConf {
	public static MODULE_KEY:string = "moduleRelease";
	public static MODULELIB_KEY:string = "moduleLibRelease";
	public static root:string = "";
	public static modules:string = URLConf.root + URLConf.MODULE_KEY + "/";
	public static moduleLibs:string = URLConf.root + URLConf.MODULE_KEY + "moduleLibRelease/";
	public static videoRoot:string = "";
	public static moduleLibsJS:string = "*/js/*.js";		
	
	public static sketelonAlias:string = "skeleton/";
	public static saveAlias:string = "tipUI.png";
	public static sound:string = "sound/"
	private static _libVer:string;
	private static _moduleVer:string;
	private static _cfgVer:string;
	private static _resVer:string;
	public static scratchVideo:string;	
	public static scratchAudio:string;
	public static loginImg:string = 'login/img/'
	public static gameImg:string = 'game/img/'
	public static gameSke:string = 'game/skeleton/'
	public static mainImg:string = 'main/img/'
	public static mainSke:string = 'main/skeleton/'

	public static resetRoot():void
	{
		let debugDir:string;
		let hostStr:string = UserData.getInstance().getQueryVariable("mdHost");
		if(!GameManager.getInstance().debug && hostStr == null)
		{
			if(UserData.getInstance().isRelease == 2)
				hostStr = "uat";
			else if(UserData.getInstance().isRelease == 1)
				hostStr = "www";
			else
				hostStr = "dev";
		}		
		debugDir = (GameManager.getInstance().debug && hostStr!=null)?"":"";
		if(hostStr == "uat")
		{
			URLConf.root = UserData.getInstance().ossRoot + "/s/platform/interactive/common/interactiveTemplate/wdProj_uat/" + debugDir;
			URLConf.modules = URLConf.root + "moduleRelease/";
			URLConf.moduleLibs = URLConf.root + "moduleLibRelease/";
			URLConf.videoRoot = "";			
		}
		else if(hostStr == "dev")
		{
			//本地测试页指定完整路径
			URLConf.root = "http://" + UserData.getInstance().host + "/";
			URLConf.modules = URLConf.root + "moduleRelease/";
			URLConf.moduleLibs = URLConf.root + "moduleLibRelease/";
			URLConf.videoRoot = "";
		}
		else if(hostStr == "www")
		{
			//本地生产页指定完整路径
			URLConf.root = "http://" + UserData.getInstance().host + "/";//本地页面指定url 生产
			URLConf.modules = URLConf.root + "moduleRelease/";
			URLConf.moduleLibs = URLConf.root + "moduleLibRelease/";
			URLConf.videoRoot = "";
		}
		else
		{
			URLConf.root = GameManager.getInstance().debug?"":(UserData.getInstance().getOrigin() + "/s/platform/interactive/common/interactiveTemplate/wdProj/" + debugDir);			
			URLConf.modules = URLConf.root + "moduleRelease/";			
			URLConf.moduleLibs = URLConf.root + "moduleLibRelease/";
			URLConf.videoRoot = "";
		}
		URLConf.scratchVideo = URLConf.modules + "{fileId}/scratch/video/";
		URLConf.scratchAudio = URLConf.modules + "{fileId}/scratch/sound/";
	}
	/**获取公共库版本
	 * @param w 前置加连接符
	*/
	public static getLibVer(w:string = "?"):string
	{let s = this;
		if(s._libVer == null)
			s._libVer = window["libVersion"]?window["libVersion"]:"";
		return w + s._libVer;
	}
	/**获取模块版本号
	 * @param w 前置加连接符
	*/
	public static getModuleVer(w: string = "?"): string {
		let s = this;
		if (s._moduleVer == null) {
			let v: string = UserData.getInstance().getQueryVariable("mdVer");
			let v2: string
			// if (GameManager.getInstance().debug) 
				v2 = Math.random() + "";
			// else
				// v2 = GameManager.version;//window["moduleVersion"] ? window["moduleVersion"] : "";
			if (v == null)
				v = "";
			if (v2 != "" || v != "")
				v = v + v2;
			s._moduleVer = v;
		}
		return w + (s._moduleVer==""?"":s._moduleVer);
	}
	/**获取主程序配置版本
	 * @param w 前置加连接符
	*/
	public static getCfgVer(w:string = "?"):string
	{let s = this;
		if(s._cfgVer == null)
			s._cfgVer = UserData.getInstance().getQueryVariable("c_v");
		return w + (s._cfgVer?GameManager.version + "_" + s._cfgVer:GameManager.version);
	}
	/**获取主程序资源版本
	 * @param w 前置加连接符
	*/
	public static getResVer(w:string = "?"):string
	{let s = this;
		if(s._resVer == null)
			s._resVer = UserData.getInstance().getQueryVariable("r_v");
		return w + (s._resVer?GameManager.version + "_" + s._resVer:GameManager.version);		
	}
	/**获取模块路径
	 * 通过url参数 mdDirVer指向
	*/
	// public static getModulePath(module:String, mdDirVer:string=""):string
	// {
	// 	if(mdDirVer == null)
	// 		mdDirVer = "";
	// 	if(mdDirVer == "")
	// 	{
	// 		mdDirVer = UserData.getInstance().getQueryVariable("mdDirVer");		
	// 		if(mdDirVer == null)
	// 			mdDirVer = "";
	// 		mdDirVer = mdDirVer == ""?mdDirVer:mdDirVer + "/";
	// 	}
	// 	let arr:Array<any> = module.split(".");
	// 	if(arr.length > 1)
	// 	{
	// 		let mainModule:string;
	// 		mainModule = arr.shift();
	// 		return URLConf.modules + mainModule + "/" + mdDirVer + arr.join(".");
	// 	}	
			
	// 	return URLConf.modules + mdDirVer + module;
	// }
}