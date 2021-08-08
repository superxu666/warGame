class UserData {
	private static _instance:UserData;	
	public static getInstance():UserData
	{
		if(UserData._instance == null)
			UserData._instance = new UserData;
		return UserData._instance;
	}


	public token: string = ''
	public whiteUserIndex:number=-1;
	public userId:string="0";
	public userNickName:string;
	public academicName:string="";
	public sex:string;
	public studentNumber:string;
	public age:string;
	public openId:string;
	public host: string="localhost:8080"
	public root:string="https://wx.wit-learn.com";
	public ossRoot:string="https://oss.wit-learn.com";//本地页面指定url
	// public ossRoot:string="https://oss.iandcode.com/";//本地页面指定url
	public grade:string;
	public headPortrait:string;
	public isFormalStudent:any;
	public personalIntegral:any;
	public pageData:any;
	public Couselist:any
	public nowselectindex:number
	public nowselect_sectionId:number
	public now_clickx:number
	public isRelease:number=0;//1 生产 0 开发 2 测试 3 灰度
	public klzz_ol_home_uid:number;
	public klzz_ol_home_time:number;
	public klzz_ol_home_token:string;
	public learnerId:number=-1;

	public constructor() {
						
		
	}
	public setUserData(d:any):void
	{let s = this;
		s.token = d.token;
		s.userId = d.userId
		s.userNickName = d.userNickName;
		s.academicName = d.academicName;
		s.sex = d.sex;
		s.studentNumber = d.studentNumber;
		s.age = d.age;
		s.openId = d.openId;
		if(d.root)s.root = d.root;
		s.grade = d.grade;
		if(d.ossRoot)s.ossRoot = d.ossRoot;
		s.isFormalStudent = d.isFormalStudent;
		s.personalIntegral = d.personalIntegral;
		let paramIsRelease:number = s.getQueryVariable("isRelease") | 0;
		s.isRelease = paramIsRelease > 0?paramIsRelease:d.isRelease;
		if(s.isRelease == 1 || s.isRelease == 3)
		{
			s.ossRoot = "https://oss.iandcode.com";
			s.root = "https://wx.iandcode.com";
		}		
		else
		{
			s.ossRoot = "https://oss.wit-learn.com";
			s.root = "https://wx.wit-learn.com";
		}		
		
		s.headPortrait = d.headPortrait!=null?d.headPortrait:d.root+"/s/images/userAvatar.png";		
		s.klzz_ol_home_uid = d.klzz_ol_home_uid;
        s.klzz_ol_home_time = d.klzz_ol_home_time;
        s.klzz_ol_home_token = d.klzz_ol_home_token;
		if(GameManager.getInstance().debug || this._webData["debug"] == "1")
		{
			let s = this;

			s.root = "http://" + s.host;

			s.headPortrait = "https://www.iandcode.com/s/images/userAvatar.png";
		}
		s.whiteUserIndex = s.getWhiteUserIndex();
		Log.writeLog(MultiLang.str69 + s.isRelease + "-" + MultiLang.str70 + s.whiteUserIndex,Log.WARN);
		URLConf.resetRoot();
		HTTPConf.resetRoot();
	}	
	public setPageData(d:any):void
	{let s = this;
		s.pageData = d;		
	}
	private _webData:any = window["gy_webData"]?window["gy_webData"]:{};
	private _tempWebData:any = {};	
	private _originData:any = {};//初始url参数
	public getHostData(url:string):void{
		let arr:Array<string> = url.split("?");
		let i:number,len:number;
		let arr2:Array<string>;
		let s = this;
		if(arr.length > 1)
		{
			arr = arr[1].split("&");
			len = arr.length;
			for(i=0;i<len;++i)
			{
				arr2 = arr[i].split("=");
				s._webData[arr2[0]] = arr2[1];
			}
		}
		s._originData = s._webData;
		if(GameManager.getInstance().debug || this._webData["debug"] == "1")
		{
			let s = this;
			s.token = ConfigManager.getToken();
			s.headPortrait = "https://www.iandcode.com/s/images/userAvatar.png";
			s.root = 'http://localhost:8080'
		}
		if(s._webData.isRelease != null)
			s.isRelease = s._webData.isRelease;
		URLConf.resetRoot();
		HTTPConf.resetRoot();	
	}
	/**清理缓存的url参数*/
	public clearTempQuery():void
	{
		let key:string;
		let s = this;
		for(key in s._tempWebData)
		{			
			delete s._webData[key];
		}
		s._tempWebData = {};
		s.resetOriginData();
		URLConf.resetRoot();
	}
	/**重置初始url参数*/
	public resetOriginData():void
	{
		let key:string;
		let s = this;
		for(key in s._originData)
		{			
			s._webData[key] = s._originData[key];
		}
	}
	/**设置url参数，通过json键值
	 * @param data json键值
	 * @param temporary 是否临时(销毁模块后将被清理)
	*/
	public setQueryByJson(data:any, temporary:boolean):void
	{
		let key:string;
		let s = this;
		for(key in data)
		{
			if(temporary)
				s._tempWebData[key] = data[key];
			s._webData[key] = data[key];
		}
		URLConf.resetRoot();
	}
	/**设置url参数*/
	public setQueryVariable(key:string,data:any):void
	{
		this._webData[key] = data;
	}
	/**获取url参数*/
	public getQueryVariable(key:string):any
	{
		return this._webData[key];
	}
	/**获取url参数 module名*/
	public getQueryModuleName():string
	{
		return this._webData["module"];
	}
	/**获取url参数 chartIndex环节索引*/
	public getQueryChartIndex():string
	{
		return this._webData["chartIndex"];
	}
	/**获取url参数 videoPos视频位置*/
	public getQueryPosition():string
	{
		return this._webData["videoPos"];
	}
	public getPlatform():string
	{		
		return this._webData["platform"]?this._webData["platform"]:"warGame";
	}
	public isReqModule():boolean
	{
		return true;//this._webData["module"] == "exercise";
	}
	/**获取url参数 appVersion app传过来的app版本号*/
	public getQueryAppVersion():string
	{
		return this._webData["appVersion"];
	}
	/**当前APP版本是否大于或等于1.6.0*/
	public isVersionGreater160():boolean {
		return VersionCompUtil.compare(UserData.getInstance().getQueryAppVersion(), "1.6.0");
	}
	/**是否测试环境*/
	public isDebugOrigin():boolean
	{
		return !(window.location.origin.indexOf("www.iandcode.com") > -1);
	}
	public getOrigin():string
	{
		let s = this;
		return s.isDebugOrigin()?"https://wx.wit-learn.com":"https://www.iandcode.com";
	}
	public getOssOrigin():string
	{
		let s = this;
		return s.isDebugOrigin()?"https://oss.wit-learn.com":"https://oss.iandcode.com";
	}
	/**是否url参数debug*/
	public getUrlDebug():boolean
	{let s =this;
		return s._webData["debug"] == 1;
	}
	/**所属的白名单用户组索引，不是白名单返回-1*/
	public getWhiteUserIndex():number
	{
		let arr:string[][];
		let i:number,j:number,len:number,len2:number;
		let userId:string;
		let s = this;
		userId = s.userId;
		if(UserData.getInstance().isRelease == 0)
			arr = [[],[],["219824188"]];
		else
			arr = [];
		//[[],[本地zip声音],[跳过按钮加快, debugData数据]]
		len = arr.length;
		for(i=0;i<len;++i)
		{
			len2 = arr[i].length;
			for(j=0;j<len2;++j)
			{
				if(arr[i][j] == userId)
				{					
					return i;
				}
			}	
		}
		return -1;
	}
}