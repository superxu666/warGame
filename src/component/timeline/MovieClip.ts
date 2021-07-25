class MovieClip extends Timeline implements IMovie{	
	public static EVENT_TWEENUPDATE:string = "tween_update";
	public static EVENT_CREATED:string = "movie_created";
	public static movieNameCount:number = 0;
	protected _tweens:MovieTween[];	
	protected _initX:number;
	protected _initY:number;
	protected _initScaleX:number;
	protected _initScaleY:number;
	protected _initRotation:number;
	protected _initAlpha:number;
	protected _initVisible:boolean;
	protected _currentTween:MovieTween;
	protected _extendTween:MovieTween;
	protected _currentSound:string;
	protected _movieName:string;
	public constructor() {
		super();
		let s = this;
		s._frameRate = GYLite.GYSprite.stage.frameRate;
		s._frameMinSec = 1 / s._frameRate * 1000;
		s._tweens = [];		
	}	
	public get movieName():string
	{
		return this._movieName;
	}
	public get movieId():number
	{
		return this._config.movieId;
	}	
	public getMovieContainer():GYLite.GYSprite
	{let s = this;
		return s;
	}
	public setConfig(cfg:any):void
	{
		let s = this;
		let arr:Array<any>;		
		let i:number,len:number;
		let j:number,len2:number;
		let obj:any,item:Property;
		let movieTween:TimeTween;
		s._tweens.length = 0;
		s._config = cfg;
		s._movieName = cfg.movieName?cfg.movieName:"instance" + (++MovieClip.movieNameCount);
		s.x = cfg.x|0;
		s.y = cfg.y|0;
		s.rotation = cfg.rotation!=null?cfg.rotation:0;		
		s.scaleX = cfg.scaleX!=null?cfg.scaleX:1;
		s.scaleY = cfg.scaleY!=null?cfg.scaleY:1;
		s.alpha = cfg.alpha!=null?cfg.alpha:1;
		//组装补间数据		
		if(cfg.frames)
		{
			arr = cfg.frames;
			len = arr.length;
			for(i=0;i<len;++i)
			{
				obj = arr[i];
				movieTween = new TimeTween;
				if(obj.propertys)
				{
					len2 = obj.propertys.length;
					for(j=0;j<len2;++j)
					{
						item = s.root.getPropertyCfg(obj.propertys[j]);
						if(item)
							movieTween.propertys.push(item);
					}
				}				
				movieTween.endFlag = obj.endFlag;
				s.addTween(movieTween,obj.startFrame,obj.totalFrame,obj.reserve?obj.reserve:0,obj.scale?obj.scale:1,obj.param);
			}
		}
		s.setInitData(s.x,s.y,s.scaleX,s.scaleY,s.rotation,s.alpha);
		s._root.addMovie(s);
	}
	public get classType():string
	{
		let s = this;
		return s._config.classType;
	}
	public set sound(val:number)
	{let s = this;
		if(s._currentTween.param == null || s._currentTween.param.url == null)
			return;
		if(s._currentSound == s._currentTween.param.url)return;
		s._currentSound = s._currentTween.param.url;
		SoundManager.instance.play(s._currentTween.param.url,0,s._currentTween.param.loop!=null?s._currentTween.param.loop|0:1,null,null,SoundData.BACKGROUND_SOUND);
	}
	public get sound():number
	{
		return 0;
	}
	/**启动时间轴*/
	public run():void
	{let s = this;		
		s._startTime = GYLite.CommonUtil.loopTime;		
		if(s._movieState == Timeline.STATE_NONE)
			s._movieState = Timeline.STATE_INITED;
		s._waitStartTime = s._lastFrame = s._waitTime = s._offsetTime = 0;
		s._created = false;
	}	
	public addTween(t:TimeTween,startFrame:number,totalFrame:number,reserve:number=0,scale:number=1,param:any=null):boolean{
		let s = this;
		let i:number,len:number,pre:number;
		let movieTween:MovieTween;
		let timeTween:TimeTween;		
		len = s._tweens.length;
		movieTween = new MovieTween(t,startFrame,totalFrame,param);
		movieTween.reserve = reserve;
		movieTween.scale = scale;
		if(len == 0)
		{
			s._tweens.push(movieTween);
			return true;
		}		
		for(i=0;i<len;++i)
		{			
			if(startFrame + totalFrame < s._tweens[i].startFrame)
			{
				pre = i - 1;
				if(pre > -1 && s._tweens[pre].startFrame + s._tweens[pre].totalFrame - 1 < startFrame)
				{
					s._tweens.splice(i,0,movieTween);
					return true;
				}				
				return false;
			}			
		}
		pre = i - 1;
		if(s._tweens[pre].startFrame + s._tweens[pre].totalFrame - 1 < startFrame)
		{
			s._tweens.push(movieTween);
			return true;
		}		
		return false;
	}
	public update(currentFrame:number):void
	{
		let s = this;
		let i:number,len:number;
		let myCurrentFrame:number,tempCf:number;
		let myCurrentTween:MovieTween,movieTween:MovieTween;
		let breakFlag:boolean,extendTweenFlag:boolean;
		let isRun:boolean;
		// if(s._lastFrame == currentFrame)return;
		len = s._tweens.length;		
		for(i=0;i<len;++i)
		{
			movieTween = s._tweens[i];
			tempCf = currentFrame - movieTween.startFrame + 1;
			if(tempCf > 0)//帧头已到达
			{
				if(s._lastFrame < 1)
				{
					if(!isRun)
					{
						s.run();
						isRun = true;
					}					
				}
				if(tempCf > movieTween.totalFrame)//超过总帧数
				{
					if(movieTween.timeTween.endFlag == EndFlag.BLANK)//后续是空白帧
					{
						myCurrentFrame = -1;
						extendTweenFlag = false;			
					}
					else if(movieTween.timeTween.endFlag == EndFlag.LOOP)//后续是循环帧
					{
						myCurrentTween = movieTween;
						myCurrentFrame = tempCf % movieTween.totalFrame + 1;//求算出当前帧
						breakFlag = true;
						extendTweenFlag = false;				
					}
					else if(movieTween.timeTween.endFlag == EndFlag.EXTEND)//后续是延长帧
					{
						myCurrentTween = movieTween;
						myCurrentFrame = movieTween.totalFrame;
						extendTweenFlag = true;//执行延长帧
					}
				}
				else
				{
					myCurrentTween = movieTween;
					myCurrentFrame = tempCf;
					breakFlag = true;//正常播放当前帧
					extendTweenFlag = false;			
				}
				if(breakFlag)
					break;
			}
		}
		if(isRun)
			super.foreachMovie(s.currentFrame);
		if(myCurrentFrame > 0)//正在播放myCurrentFrame帧
		{
			s.show();
			s._currentTween = myCurrentTween;
			if(extendTweenFlag)
			{
				if(s._extendTween != s._currentTween)
				{
					s._extendTween = s._currentTween;
					if(s._lastFrame != myCurrentFrame)
					{
						s.calTween(myCurrentTween, myCurrentFrame);
						if(s.hasEventListener(MovieClip.EVENT_TWEENUPDATE))
							s.dispatchEventWith(MovieClip.EVENT_TWEENUPDATE);
					}
						
				}	
			}
			else
			{
				s._extendTween = null;
				if(s._lastFrame != myCurrentFrame)
				{					
					s.calTween(myCurrentTween, myCurrentFrame);
					if(s.hasEventListener(MovieClip.EVENT_TWEENUPDATE))
						s.dispatchEventWith(MovieClip.EVENT_TWEENUPDATE);
				}					
			}
				
		}
		else
		{
			s.hide();
			s._extendTween = s._currentTween = null;
		}
		s._lastFrame = myCurrentFrame;
		if(!s._created)
		{
			if(s.hasEventListener(MovieClip.EVENT_CREATED))
				s.dispatchEventWith(MovieClip.EVENT_CREATED);
			s._created = true;
		}
	}
	public create(toX:number=0, toY:number=0,scaleX:number=1,scaleY:number=1,rotation:number=0,alpha:number=1,visible:boolean=true):void
	{
		let s =this;		
		s.setInitData(toX,toY,scaleX,scaleY,rotation,alpha,visible);
	}
	/**设置初始化默认值*/
	public setInitData(toX:number=0, toY:number=0,scaleX:number=1,scaleY:number=1,rotation:number=0,alpha:number=1,visible:boolean=true):void
	{let s = this;	
		s._initX = toX;
		s._initY = toY;
		s._initAlpha = alpha!=null?alpha:1;
		s._initScaleY = scaleY!=null?scaleY:1;
		s._initScaleX = scaleX!=null?scaleX:1;
		s._initRotation = rotation!=null?rotation:1;
		s._initVisible = visible!=null?visible:true;
	}
	public get initAlpha():number
	{
		return this._initAlpha;
	}
	public set initAlpha(val:number)
	{let s = this;
		s._initAlpha = val;
	}
	public calTween(movieTween:MovieTween,frame:number):void
	{
		let arr:Array<Property>;
		let i:number,len:number;
		let pro:Property;
		let s = this;
		arr = movieTween.timeTween.propertys;
		if(arr)
		{
			len = arr.length;
			for(i=0;i<len;++i)
			{
				pro = arr[i];
				s[pro.propertyName] = Property.getEase(pro.f)(pro,movieTween,frame);
			}
		}
		
	}
	public show():void
	{let s = this;
		if(s.parent != s._initParent && s._initParent)
		{				
			s._initParent.addElement(s);
		}
	}
	public hide():void
	{let s = this;
		if(s._currentSound)
		{
			SoundManager.instance.stop(s._currentSound,SoundData.BACKGROUND_SOUND);
			s._currentSound = null;
		}
		if(s.parent)
		{
			s._initParent = <any>s.parent;
			(<GYLite.GYSprite>s.parent).removeElement(s);				
		}
	}
	/**补间数组*/
	public get tweens():Array<MovieTween>
	{
		return this._tweens;
	}
	/**根时间轴*/
	public get root():ITimeline
	{
		return this._root;
	}
	/**从时间轴上面移除*/
	public removeFromTimeLine():void
	{let s =this;
		if(s.parent)
		{
			(<GYLite.GYSprite>s.parent).removeElement(s);
		}
		s._root.removeMovie(s);
	}
	public output():any
	{let s = this;
		let obj:any = {
			movieId:s.movieId,
			movieName:s.movieName,
			param:null,
			classType:s.classType,
			x:s._initY,
			y:s._initX,
			rotation:s._initRotation,
			alpha:s._initAlpha,
			scaleX:s._initScaleX,
			scaleY:s._initScaleY,
			visible:s._initVisible,		
			frames:[]
		}		
		let i:number,len:number,j:number,len2:number;
		let frameObj:any;
		let movieTween:MovieTween;		
		len = s._tweens.length;
		for(i=0;i<len;++i)
		{
			movieTween = s._tweens[i];
			frameObj = {};
			frameObj.propertys = [];
			len2 = movieTween.timeTween.propertys.length;
			if(len2 > 0)
			{
				frameObj.propertys = [];				
				for(j=0;j<len2;++j)
				{
					frameObj.propertys.push(movieTween.timeTween.propertys[j].propertyId);					
				}
			}			
			frameObj.startFrame = movieTween.startFrame;
			frameObj.totalFrame = movieTween.totalFrame;
			frameObj.endFlag = movieTween.timeTween.endFlag;
			frameObj.param = movieTween.param;
			obj.frames.push(frameObj);
		}
		if(s._movies.length > 0)
		{
			obj.movies = [];
			len = s._movies.length;
			for(i=0;i<len;++i)
			{
				obj.movies.push(s._movies[i].output());
			}
		}
		return obj;
	}
	public dispose(disposeChild:boolean=true, removeChild:boolean = true, forceDispose:boolean=false):void
	{let s =this;
		s.removeFromTimeLine();
		super.dispose(disposeChild, removeChild, forceDispose);		
	}
}
class MovieTween{
	/**补间数据*/public timeTween:TimeTween;
	/**起始帧*/public startFrame:number;
	/**总帧*/public totalFrame:number;
	/**是否反向播放*/public reserve:number;
	/**播放倍速*/public scale:number;
	/**附加参数*/public param:any;
	public constructor(timeTween:TimeTween,startFrame:number,totalFrame:number,param:any=null)
	{
		let s = this;
		s.timeTween = timeTween;
		s.startFrame = startFrame;
		s.totalFrame = totalFrame;
		s.reserve = 0;
		s.scale = 1;
	}
	public clone(startFrame:number=-1,endFrame:number=-1):MovieTween
	{		
		let s = this;
		let timeTween:TimeTween;
		let i:number,len:number;
		let pro:Property;
		let movieTween:MovieTween;		
		timeTween = s.timeTween.clone();		
		len = timeTween.propertys.length;
		for(i=0;i<len;++i)
		{
			pro = timeTween.propertys[i];
			if(startFrame > 0)
				pro.start = Property.getEase(pro.f)(pro,s,startFrame);
			if(endFrame > 0)
				pro.end = Property.getEase(pro.f)(pro,s,endFrame);
		}
		movieTween = new MovieTween(timeTween,startFrame==-1?s.startFrame:startFrame,endFrame==-1?s.totalFrame:endFrame,s.param);
		return movieTween;
	}
}