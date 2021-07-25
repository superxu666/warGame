class GYMovieClip extends GYLite.GYSprite{
	private _mc:egret.MovieClip;
	private _movieData:egret.MovieClipDataFactory;
	private _loopEndFunc:Function;
	private _loopEndObj:any;
	private _movieEndFunc:Function;
	private _movieEndObj:any;
	private _frameLabelFunc:Function;
	private _frameLabelObj:Function;
	public constructor() {
		super();
		let s=this;
		
	}
	/**设置MovieClip数据
	 * @param jsonPath json数据的路径
	 * @param texPath 图集路径
	*/
	public setDataPath(jsonPath:string,texPath:string):void
	{
		let s = this;				
		s.setData(Main.instance.getDataRes(jsonPath),Main.instance.getRes(texPath));
	}
	/**设置MovieClip数据
	 * @param json json数据
	 * @param tex 图集纹理
	*/
	public setData(json:any,tex:egret.Texture):void
	{let s = this;
		s._movieData = new egret.MovieClipDataFactory(json,tex);
	}
	public setMovieName(mcName:string):void
	{let s = this;
		if(s._mc)
		{
			s.removeChild(s._mc);
			s._mc.removeEventListener(egret.Event.LOOP_COMPLETE, s.mcEnd, s);
			s._mc.removeEventListener(egret.Event.COMPLETE, s.mcEnd, s);
			s._mc.removeEventListener(egret.MovieClipEvent.FRAME_LABEL,s.frameLabel,s);
		}
		if(mcName == null)return;
		s._mc = new egret.MovieClip(s._movieData.generateMovieClipData(mcName));		
		s._mc.addEventListener(egret.Event.LOOP_COMPLETE, s.mcEnd, s);
		s._mc.addEventListener(egret.Event.COMPLETE, s.mcEnd, s);
		s._mc.addEventListener(egret.MovieClipEvent.FRAME_LABEL,s.frameLabel,s);
		s.addChild(s._mc);
	}
	private frameLabel(e:egret.Event):void
	{
		let s = this;
		if(s._frameLabelFunc!=null)
			s._frameLabelFunc.call(s._frameLabelObj);
	}
	private loopEnd(e:egret.Event):void
	{
		let s = this;
		if(s._loopEndFunc!=null)
			s._loopEndFunc.call(s._loopEndObj);
	}
	private mcEnd(e:egret.Event):void
	{
		let s = this;
		if(s._movieEndFunc!=null)
			s._movieEndFunc.call(s._movieEndObj);
	}
	/**监听播放结束
	 * @param func 回调方法
	 * @param obj this指向
	*/
	public setPlayEnd(func:Function,obj:any):void
	{
		let s = this;
		s._movieEndFunc = func;
		s._movieEndObj = obj;
	}
	/**监听单次循环播放结束
	 * @param func 回调方法
	 * @param obj this指向
	*/
	public setLoopEnd(func:Function,obj:any):void
	{
		let s = this;
		s._loopEndFunc = func;
		s._loopEndObj = obj;
	}
	/**监听帧标签到达
	 * @param func 回调方法
	 * @param obj this指向
	*/
	public setFrameLabel(func:Function,obj:any):void
	{
		let s = this;
		s._frameLabelFunc = func;
		s._frameLabelObj = obj;
	}
	/**播放
	 * @param playTimes 循环次数,参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数(MovieClip初始播放次数设置为1)
	*/
	public play(playTimes:number=1):void
	{
		let s =this;
		s._mc && s._mc.play(playTimes);		
	}
	/**暂停*/
	public stop():void
	{
		let s =this;
		s._mc && s._mc.stop();		
	}
	/**
	 * 将播放头移到指定帧并播放
	 * @param frame {any} 指定帧的帧号或帧标签
	 * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
	 * @version Egret 2.4
	 * @platform Web,Native
	 */
	public gotoAndPlay(frameLabel:string|number,playTimes:number=1):void
	{
		let s = this;
		s._mc && s._mc.gotoAndPlay(frameLabel,playTimes);
	}
	/**
	 * 将播放头移到指定帧并停止
	 * @param frame {any} 指定帧的帧号或帧标签
	 * @version Egret 2.4
	 * @platform Web,Native
	 */
	public gotoAndStop(frameLabel:string|number):void
	{
		let s = this;
		s._mc && s._mc.gotoAndStop(frameLabel);
	}
	/**
	 * 跳到后一帧并停止
	 * @version Egret 2.4
	 * @platform Web,Native
	 */
	public nextFrame():void
	{
		let s = this;
		s._mc && s._mc.nextFrame();
	}
	/**
	 * 将播放头移到前一帧并停止
	 * @version Egret 2.4
	 * @platform Web,Native
	 */
	public prevFrame():void
	{
		let s = this;
		s._mc && s._mc.prevFrame();
	}
	/**总帧数*/
	public get totalFrames():number
	{
		let s = this;
		return s._mc?s._mc.totalFrames:0;
	}
	/**当前帧*/
	public get currentFrame():number
	{
		let s = this;
		return s._mc?s._mc.currentFrame:0;
	}
	/**
	 * 当前播放的帧对应的标签，如果当前帧没有标签，则currentLabel返回包含标签的先前帧的标签。如果当前帧和先前帧都不包含标签，currentLabel返回null。	 
	 */
	public get currentLabel():string
	{
		let s = this;
		return s._mc?s._mc.currentLabel:null;
	}
	/**
	 * MovieClip 实例当前播放的帧的标签。如果当前帧没有标签，则 currentFrameLabel返回null。         
	 */
	public get currentFrameLabel():string
	{
		let s = this;
		return s._mc?s._mc.currentFrameLabel:null;
	}
	/**是否正在播放*/
	public get isPlaying():boolean
	{
		let s = this;
		return s._mc?s._mc.isPlaying:false;
	}
	public dispose(disposeChild?: boolean, removeChild?: boolean, forceDispose?: boolean):void
	{
		super.dispose(disposeChild, removeChild, forceDispose);
		let s= this;
		s.setMovieName(null);
		s._loopEndFunc = s._loopEndObj = null;
		s._movieEndFunc = s._movieEndObj = null;
		s._frameLabelFunc = s._frameLabelObj = null;
	}
}