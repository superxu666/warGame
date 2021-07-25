class Timeline extends GYLite.GYSprite implements ITimeline{
	/**创建影片剪辑
	 * @param cfg 影片剪辑配置
	 * @param injectMovie 外部注入影片剪辑的方法
	*/
	public static createMovie(cfg:any,injectMovie:(cfg:any)=>IMovie):IMovie
	{
		let movie:IMovie;
		if(cfg.classType == MovieType.DISPLAY)
		{
			movie = new MovieClip;
		}
		else if(cfg.classType == MovieType.IMAGE)
		{
			movie = new ImageMovie;
		}
		else if(cfg.classType == MovieType.SKELETON)
		{
			movie = new SkeMovie;
		}
		else if(cfg.classType == MovieType.MASK)
		{
			movie = new MaskMovie;
		}
		else
		{
			movie = injectMovie(cfg);
		}
		return movie;
	}
	public static STATE_NONE:number = 0;
	public static STATE_INITED:number = 1;
	public static STATE_PLAY:number = 2;
	public static STATE_STOP:number = 3;
	public injectMovie:(cfg:any)=>IMovie;
	protected _startTime:number;
	protected _movies:Array<IMovie>;
	protected _movieState:number;
	protected _created:boolean;
	protected _offsetTime:number;
	protected _waitTime:number;
	protected _waitStartTime:number;
	protected _frameRate:number;
	protected _frameMinSec:number;
	protected _totalFrame:number;
	protected _lastFrame:number;
	protected _initParent:GYLite.GYSprite;
	protected _root:ITimeline;
	protected _config:any;
	protected _enterFrameFunc:Function;
	protected _enterFrameThis:any;

	private _propertyItems:Property[];
	private _scripts:Array<string>;
	public constructor(stg:GYLite.GYSprite = null) {		
		super();
		let s = this;
		s._frameRate = GYLite.GYSprite.stage.frameRate;
		s._frameMinSec = 1 / s._frameRate * 1000;
		s._frameMinSec = GYLite.NumberUtil.accuracyInt(s._frameMinSec);
		s._initParent = stg?stg:s;
		s._root = s;
		s._waitStartTime = s._lastFrame = s._movieState = s._startTime = s._waitTime = s._offsetTime = 0;
		s._scripts = [];
		s._movies = [];		
		s._propertyItems = [];
	}
	public resetRoot(val:GYLite.GYSprite, r:ITimeline=null):void
	{
		let s =this;
		s._initParent = val?val:s;
		s._root = r?r:s;
	}
	public setFrameCall(func:Function, thisObj:any)
	{
		let s = this;
		s._enterFrameFunc = func;
		s._enterFrameThis = thisObj;
	}
	/**获取影片剪辑父级*/
	public getMovieContainer():GYLite.GYSprite
	{let s = this;
		return s._initParent;
	}	
	public get config():any{
		return this._config;
	}
	/**获取影片剪辑根部*/
	public get root():ITimeline
	{let s = this;
		return s._root;
	}
	public input(data:any):void
	{
		let s = this;
		
		let movie:IMovie;
		s._config = data;
		let arr:Array<any>;
		arr = s._config.propertyItems;
		s.inputPropertyItems(arr);
		arr = s._config.movies;
		s.inputMovies(arr);
	}
	public inputPropertyItems(arr:any[]):Property[]
	{let s = this;
		let i:number,len:number;
		let propertyCfg:any;
		let propertys:Property[]=[];
		let property:Property;
		len = arr.length;
		for(i=0;i<len;++i)
		{
			propertyCfg = arr[i];
			property = new Property(propertyCfg.pId,propertyCfg.propertyName,propertyCfg.start,propertyCfg.end,propertyCfg.f, propertyCfg.descName);
			propertys.push(property)
			s._propertyItems.push(property);
		}
		return propertys;
	}
	/**导入影片数据(不会清除之前导入的数据)
	 * @param arr 影片剪辑配置数组
	 * @return 返回生成的影片剪辑数组
	*/
	public inputMovies(arr:Array<any>):IMovie[]
	{
		let s = this;
		let i:number,len:number,j:number,len2:number;
		let movie:IMovie,maskMovie:MaskMovie;
		let pr:GYLite.GYSprite;
		let obj:any;
		let maskArr:Array<IMovie> = [];		
		pr = s.getMovieContainer();
		if(arr == null || arr.length == 0)return;
		let movies:IMovie[];		
		movies = [];
		len = arr.length;
		for(i=0;i<len;++i)
		{
			obj = arr[i];
			movie = Timeline.createMovie(obj,s.injectMovie);
			movies.push(movie);
			movie.resetRoot(pr,s.root);
			movie.setConfig(obj);		
			if(movie.classType == MovieType.MASK)			
				maskArr.push(movie);
			movie.create(movie.x,movie.y,movie.scaleX,movie.scaleY,movie.rotation,movie.alpha);			
			movie.inputMovies(obj.movies);
		}		
		len = maskArr.length;
		for(i=0;i<len;++i)
		{
			maskMovie = <MaskMovie>maskArr[i];
			len2 = s._movies.length;
			for(j=0;j<len2;++j)
			{
				if(s._movies[j].classType == MovieType.MASK)continue;
				if(s._movies[j].movieId == maskMovie.toMaskId)
				{
					(<MovieClip>s._movies[j]).mask = maskMovie;
					break;
				}
			}			
		}
		return movies;
	}
	public getPropertyCfg(pId:number):any
	{let s =this;
		let len:number;
		let arr:Array<any>;
		arr = s._propertyItems;
		len = arr.length;
		while(--len>-1)
		{
			if(arr[len].propertyId == pId)
				return arr[len];
		}
		Log.writeLog(MultiLang.str56 + pId,Log.WARN);
		return null;
	}
	public clearTimeline():void
	{let s = this;
		let len:number;
		len = s._movies.length;
		while(--len > -1)
		{			
			s._movies[len].dispose();			
		}
		s._waitStartTime = s._lastFrame = s._movieState = s._startTime = s._waitTime = s._offsetTime = 0;
		s._scripts.length =0 ;
		s._movies.length = 0;
		s._propertyItems.length = 0;
	}
	/**添加影片剪辑*/
	public addMovie(m:IMovie):void
	{
		let s = this;
		if(s._movies.indexOf(m) == -1)
		{			
			s._movies.push(m);
		}			
	}
	/**移除影片剪辑*/
	public removeMovie(m:IMovie):void
	{let s = this;
		let ind:number;
		ind = s._movies.indexOf(m);
		if(ind > -1)
		{			
			s._movies.splice(ind, 1);
		}
	}
	/**启动时间轴*/
	public run():void
	{let s = this;
		GYLite.CommonUtil.addStageLoop(s.update,s);
		s._startTime = GYLite.CommonUtil.loopTime;		
		if(s._movieState == Timeline.STATE_NONE)
			s._movieState = Timeline.STATE_INITED;
		s._waitStartTime = s._lastFrame = s._waitTime = s._offsetTime = 0;		
		s._created = false;
	}	
	public update(t:number):void
	{let s = this;
		let i:number,len:number;
		let frame:number;
		frame = s.currentFrame;
		// if(s._lastFrame == frame)
		// {
		// 	if(s._enterFrameFunc!=null)
		// 	s._enterFrameFunc.call(s._enterFrameThis,frame);
		// 	return;
		// }
		len = frame;
		if(s._lastFrame == 0)
			s._lastFrame = frame - 1;
		// else
			// i = s._lastFrame + 1;
			
		for(i = s._lastFrame + 1;i<=len;++i)
		{			
			if(s._enterFrameFunc!=null)
			s._enterFrameFunc.call(s._enterFrameThis,i);
		}		
		s.foreachMovie(frame);
		s._lastFrame = frame;
		if(!s._created)
		{
			if(s.hasEventListener(MovieClip.EVENT_CREATED))
				s.dispatchEventWith(MovieClip.EVENT_CREATED);
			s._created = true;
		}		
	}
	protected foreachMovie(frame:number):void
	{let s = this;
		let i:number,len:number;
		len = s._movies.length;
		for(i=0;i<len;++i)
		{
			s._movies[i].update(frame);
		}
	}
	/**获取影片剪辑列表*/
	public get movies():IMovie[]
	{
		return this._movies;
	}
	public get propertyItems():any[]
	{
		return this._propertyItems;
	}
	/**当前时间轴状态*/
	public get movieState():number
	{
		return this._movieState;
	}
	/**总帧数(此处遍历计算，勿重复读取)*/
	public get totalFrame():number
	{let s = this;
		let len:number,len2:number;
		let arr:MovieTween[];
		let maxFrame:number;
		maxFrame = 0;
		len = s._movies.length;
		while(--len > -1)
		{
			arr = s._movies[len].tweens;
			len2 = arr.length;
			while(--len2 > -1)
			{
				maxFrame = Math.max(maxFrame,arr[len2].startFrame + arr[len2].totalFrame - 1);
			}
		}
		return maxFrame;
	}
	/**当前帧*/
	public get currentFrame():number
	{
		let s = this;
		let t:number,wt:number;
		if(s._movieState == Timeline.STATE_STOP)
			wt = s._waitTime + GYLite.CommonUtil.loopTime - s._waitStartTime;
		else
			wt = s._waitTime;
		t = GYLite.NumberUtil.accuracyInt(GYLite.CommonUtil.loopTime - wt + s._offsetTime - s._startTime);		
		return t / s._frameMinSec | 0;
	}
	/**在当前帧播放*/
	public play():void
	{
		let s = this;		
		s._movieState = Timeline.STATE_PLAY;
		if(s._waitStartTime > 0)
		{
			s._waitTime += GYLite.CommonUtil.loopTime - s._waitStartTime;
			s._waitStartTime = 0;
		}		
	}
	/**停止在当前帧*/
	public stop():void
	{
		let s = this;		
		s._movieState = Timeline.STATE_STOP;
		if(s._waitStartTime == 0)
		{
			s._waitStartTime = GYLite.CommonUtil.loopTime;			
		}		
	}
	/**在frame帧播放*/
	public gotoAndPlay(frame:number):void
	{
		let s = this;		
		if(frame < 1)
		{
			Log.writeLog("帧数不能小于1",Log.ERROR);
			return;
		}
		s._offsetTime += (frame - s.currentFrame) * s._frameMinSec;
		s._lastFrame = s.currentFrame - 1;
		s.play();
	}
	/**停止在frame帧*/
	public gotoAndStop(frame:number):void
	{
		let s = this;
		if(frame < 1)
		{
			Log.writeLog("帧数不能小于1",Log.ERROR);
			return;
		}
		s._offsetTime += (frame - s.currentFrame) * s._frameMinSec;	
		s._offsetTime = GYLite.NumberUtil.accuracyInt(s._offsetTime);
		s._lastFrame = s.currentFrame - 1;
		s.stop();
	}
	public addFrameScript(frame:number,scriptStr:string):void
	{
		let s = this;
		if(frame < 1)
		{
			Log.writeLog("帧数不能小于1",Log.ERROR);
			return;
		}
		s._scripts[frame] = scriptStr;
	}
	public excFrameScript(frame:number):void
	{let s = this;
		if(frame < 1)
		{
			Log.writeLog("帧数不能小于1",Log.ERROR);
			return;
		}
		eval(s._scripts[frame]);
	}
	public output():string
	{let s =this;
		let cfg:any = {
			propertyItems: [],
			movies:[]
		};
		let i:number,len:number;
		len = s._propertyItems.length;
		for(i=0;i<len;++i)
		{
			cfg.propertyItems.push(s._propertyItems[i].output());
		}
		len = s._movies.length;
		for(i=0;i<len;++i)
		{
			cfg.movies.push(s._movies[i].output());
		}
		return JSON.stringify(cfg);
	}
	public dispose(disposeChild: boolean=true, removeChild: boolean=true, forceDispose: boolean=false):void
	{
		let s = this;
		s.clearTimeline();
		s.setFrameCall(null,null);
		super.dispose();
	}
}
enum EndFlag{
	EXTEND,
	LOOP,
	BLANK
}
/**时间轴补间数据，按先后顺序排列*/
class TimeTween{
	public propertys:Array<Property>;
	public endFlag:number;//0 延长帧 1 循环帧 2 空白帧
	public constructor()
	{
		let s =this;
		s.propertys = [];
		s.endFlag = 0;
	}	
	public clone():TimeTween
	{
		let timeTween:TimeTween;
		let i:number,len:number;
		let pro:Property;
		let s = this;
		timeTween = new TimeTween;
		timeTween.endFlag = s.endFlag;
		len = s.propertys.length;
		for(i=0;i<len;++i)
		{
			pro = s.propertys[i].clone();				
			timeTween.propertys.push(pro);
		}
		return timeTween;
	}
}
/**单个属性补间数据*/
class Property{
	/**自定义缓动函数*/
	public static getDefEase:(f:number)=>(property:Property,movieTween:MovieTween,frame:number)=>number;
	/**获取缓动函数*/
	public static getEase(f:number):(property:Property,movieTween:MovieTween,frame:number)=>number
	{
		if(f == 0)
			return Property.commonEase;
		if(f == 1)
			return Property.addEase;
		if(f == 2)
			return Property.reduceEase;
		if(f == 3)
			return Property.noneEase;
		if(f == 99 && Property.getDefEase!=null)
			return Property.getDefEase(f);
		Log.writeLog(MultiLang.str57,Log.WARN);
		return null;
	}
	public static noneEase(property:Property,movieTween:MovieTween,frame:number):number
	{
		let per:number = frame / movieTween.totalFrame;
		if(per > 1)
		per = 1;
		else if(per < 0)per = 0;		
		return per == 1?property.end:property.start;
	}
	public static commonEase(property:Property,movieTween:MovieTween,frame:number):number
	{
		let per:number = frame / movieTween.totalFrame;
		if(per > 1)per = 1;
		else if(per < 0)per = 0;
		if(movieTween.reserve == 1)
			return property.end + (property.start - property.end) * per;
		return property.start + (property.end - property.start) * per;
	}
	public static addEase(property:Property,movieTween:MovieTween,frame:number):number
	{
		let per:number = frame / movieTween.totalFrame;
		per *= per;
		if(per > 1)per = 1;
		else if(per < 0)per = 0;
		if(movieTween.reserve == 1)
			return property.end + (property.start - property.end) * per;
		return property.start + (property.end - property.start) * per;
	}
	public static reduceEase(property:Property,movieTween:MovieTween,frame:number):number
	{
		let per:number = frame / movieTween.totalFrame;
		per *= per;
		per = 1 - per;
		if(per > 1)per = 1;
		else if(per < 0)per = 0;
		if(movieTween.reserve == 1)
			return property.end + (property.start - property.end) * per;
		return property.start + (property.end - property.start) * per;
	}
	/**属性*/public propertyName:string;
	/**附加参数*/public param:any;
	/**起点值*/public start:number;
	/**终点值*/public end:number;
	/**缓动类型*/public f:number;
	/**描述名称*/public descName:string;
	private _propertyId:number;
	public constructor(pId:number,propertyName:string, start:number, end:number, f:number=0, descName:string=null)
	{
		let s = this;
		s._propertyId = pId;
		s.propertyName = propertyName;
		s.start = start;
		s.end = end;
		s.f = f;	
		s.descName = descName;	
	}
	public get propertyId():number
	{
		return this._propertyId;
	}
	public clone():Property
	{let s =this;
		return new Property(s._propertyId, s.propertyName, s.start, s.end, s.f, "副本_" + s.descName);
	}
	public output():any
	{let s = this;
		return { 
			pId: s.propertyId, 
			propertyName: s.propertyName, 
			param: s.param, 
			start: s.start,
			end: s.end,
			f: s.f
		};
	}
}
interface ITimeline extends GYLite.IGYContainer{	
	update(t:number):void;
	resetRoot(val:GYLite.GYSprite,r?:ITimeline);
	inputMovies(arr:Array<any>);
	addMovie(m:IMovie):void;
	removeMovie(m:IMovie):void;
	getPropertyCfg(pId:number):any;
	dispose(disposeChild?:boolean, removeChild?:boolean, forceDispose?:boolean);
	getMovieContainer():GYLite.GYSprite;
	readonly currentFrame:number;
	readonly totalFrame:number;
	readonly root:ITimeline;
	readonly config:any;	
	
}
interface IMovie extends ITimeline{	
	/**计算补间
	 * @param movieTween 补间数据
	 * @param frame 播放帧
	*/
	calTween(movieTween:MovieTween,frame:number):void
	/**添加补间动画，按照时间顺序排*/
	addTween(t:TimeTween,startFrame:number,totalFrame:number,reserve?:number,scale?:number,param?:any):boolean;
	/**创建影片剪辑到时间轴*/
	create(toX?:number, toY?:number,scaleX?:number,scaleY?:number,rotation?:number,alpha?:number):void
	setInitData(toX?:number, toY?:number,scaleX?:number,scaleY?:number,rotation?:number,alpha?:number)
	removeFromTimeLine():void;	
	setConfig(cfg:any);
	output();
	show():void;
	hide():void;
	readonly classType:string;	
	readonly tweens:Array<MovieTween>;
	readonly scaleX:number;
	readonly scaleY:number;	
	readonly alpha:number;
	readonly movieId:number;
	
}

/***时间轴配置
 
{
	propertyItems:[
		{
			id:1,
			propertyName:属性名称,
			param:附加参数,
			start:起点,
			end:终点,
			f:缓动类型,
			descName:描述名称
		},
		{……},{……}
	]
	movies:[
		{
			movieId:影片剪辑id,
			movieName:影片名称,
			param:附加参数,
			classType:MovieType.DISPLAY,
			x:起始坐标x,
			y:起始坐标y,
			rotation:起始角度,
			alpha:起始透明度,
			scaleX:起始缩放x,
			scaleY:起始缩放y,
			anchorX:起始中心点X,
			anchorY:起始中心点Y,			
			//-----显示对象
			image:图片名称,
			alias:图集名称,
			//-----龙骨
			skName:龙骨文件和帧动画文件前缀名称,
			skPath:龙骨路径,
			boneName:骨骼动画名称(一般跟skName一样，不用填),
			armatureName:龙骨骨架名称(一般不填),
			actions:动作列表[{action:动作名称},{……},{……}],
			frames:[
				//-----显示对象
				{propertys:[1,2,3……],startFrame:当前帧数,totalFrame:总帧数,endFlag:帧结束模式,param:null},
				//-----龙骨,控制龙骨播放动作，请使用属性actionIndex
				{propertys:[1,2,3……],startFrame:当前帧数,totalFrame:总帧数,endFlag:帧结束模式,param:null},
				//-----声音,播放声音
				{propertys:[1,2,3……],startFrame:当前帧数,totalFrame:总帧数,endFlag:帧结束模式,param:{url:声音路径,loop:是否循环}},
			],
		}
	]
}
*****/