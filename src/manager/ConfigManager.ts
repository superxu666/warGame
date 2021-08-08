/**配置类，外部的config配置由此管理*/
class ConfigManager {
	private _config:any;
	public constructor(cfg:any) {
		let s = this;
		s._config = cfg;
	}
	/**屏幕显示的模式*/
	public get screenMode():number
	{let s = this;
		let screenMode:number;
		screenMode = Number(UserData.getInstance().getQueryVariable("screenMode"));
		return screenMode==screenMode?screenMode:(s._config.screenMode?s._config.screenMode:LayerManager.MODE_COMMON);
	}
	/**屏幕的布局模式*/
	public get layoutMode():number
	{let s = this;
		let screenMode:number;
		screenMode = Number(UserData.getInstance().getQueryVariable("layoutMode"));
		return screenMode==screenMode?screenMode:(s._config.screenMode?s._config.screenMode:LayerManager.FIX_WIDTH);
	}
	/**配置指定token*/
	public static getToken():string
	{
		let s = this;
		let tk:string;
		tk = UserData.getInstance().getQueryVariable("tk") || UserData.getInstance().token;
		// return (tk!=null&&tk!="")?tk:(window["token"]?window["token"]:"1311136300736184320");
		return (tk!=null&&tk!="")?tk:(window["token"]?window["token"]:"");
	}
	/**窗口模式的配置宽度*/
	public get winWidth():number
	{let s = this;
		let winWidth:number;
		winWidth = Number(UserData.getInstance().getQueryVariable("winWidth"));
		return winWidth==winWidth?winWidth:(s._config.winWidth?s._config.winWidth:GameManager.WIN_WIDTH);
	}
	/**窗口模式的配置高度*/
	public get winHeight():number
	{let s = this;
		let winHeight:number;
		winHeight = Number(UserData.getInstance().getQueryVariable("winHeight"));
		return winHeight==winHeight?winHeight:(s._config.winHeight?s._config.winHeight:GameManager.WIN_HEIGHT);		
	}
	/**获取配置的模块版本号
	 * @param uiPath 模块名称
	*/
	public getMdDirVer(uiPath:string):string
	{
		let s = this;
		if(s._config.mdDirVer == null)return null;
		return s._config.mdDirVer[uiPath]?s._config.mdDirVer[uiPath].version:null;
	}
	/**获取配置的模块md5
	 * @param uiPath 模块名称
	*/
	public getModuleMD5(uiPath:string):string
	{
		let s = this;
		if(s._config.mdDirVer == null)return null;
		return s._config.mdDirVer[uiPath]?s._config.mdDirVer[uiPath].md5:null;
	}
	/**获取配置的公共库版本号
	 * @param uiPath 模块名称
	*/
	public getLibDirVer(uiPath:string):string
	{
		let s = this;
		if(s._config.libDirVer == null)return null;
		return s._config.libDirVer[uiPath];
	}
	/**公共库md5*/
	public libMD5():string
	{
		let s = this;
		if(s._config.lib_md5 == null)return "9ef1a43b9a26d6a1fa4406fb489fc93f";
		return s._config.lib_md5;
	}
	/**默认进入的模块*/
	public get defaultModule():string
	{let s = this;
		if(s._config.defaultModule == null)return "login";
		return s._config.defaultModule;
	}
	/**获取json配置*/
	public get config():any
	{
		return this._config;
	}	
}