class SpineSkeleton extends spine.SkeletonAnimation implements spine.AnimationListener{
	private _loopEndFunc: Function;
	private _loopEndObject: any;
	private _completeEndFunc: Function;
	private _completeEndObject: any;	

	public playStart?: () => void;
    public playEnd?: () => void;
    public loopStart?: () => void;
    public loopEnd?: () => void;
    public interrupt?: () => void;
    public custom?: (event: spine.Event) => void;

	private _sound: string;
	private _endAct: string;
	private _soundEndCallBack: Function;
	private _soundEndObject: any;
	private _curActionName: string;	
	
	/**创建spine动画
	 * @param spineName spine动画json文件的名称
	 * @param resPath 资源文件的路径
	 * @param skName 动画，动画图集的名称，不填则用spineName代替
	 * @param 继承spineSkeleton的类
	*/
	public static createSpine(spineName:string,resPath:string="",skName:string=null,cls:any=null):SpineSkeleton
	{
		let obj:any, resObj:any;
		if(skName == null)
			skName = spineName;		
		resObj = {};
		resObj[spineName + ".png"] = Main.instance.getRes(resPath + spineName + ".png");
		let path:string;
		let json;
		let texAtlas:spine.TextureAtlas;			
		json = Main.instance.getDataRes(resPath + spineName + ".json");
		texAtlas = spine.createTextureAtlas(Main.instance.getDataRes(resPath + skName + ".atlas"), resObj);
		let skelData: spine.SkeletonData = spine.createSkeletonData(JSON.stringify(json[skName]?json[skName]:json), texAtlas);
		return cls?new cls(skelData):new SpineSkeleton(skelData);
		
	}
	public constructor(skeletonData: spine.SkeletonData) {
		super(skeletonData);
		let s =this;		
		s.playEnd = function():void{
			let s = this;			
			if (s._completeEndFunc != null) {
				s._completeEndFunc.call(s._completeEndObject,s);
			}
			if (s._sound == null && s._endAct) {
				s.gotoAndPlay(s._endAct, 0);
				s._endAct = null;
			}
		}
		s.loopEnd = function():void{
			let s = this;
			if(s._loopEndFunc!=null)
			{
				s._loopEndFunc.call(s._loopEndObject,s);
			}
		}
	}
	/**停止动画
	 * @param track 轨道序号 默认NaN，清理所有轨道
	 * @param removeFromClock 是否重绘制时钟移除，true则不会重置动画内容
	*/
	public stop(track: number = NaN, removeFromClock:boolean=true): void {
		if(track == track)
			super.stop(track);
		else
			this.stopAll(!removeFromClock)
	}
	public dispose(disposeChild?: boolean, removeChild?: boolean, forceDispose?: boolean):void
	{
		let s = this;
		s.stopAll(false);
		super.dispose(disposeChild, removeChild, forceDispose);
	}
	public get curActionName(): string {
		return this._curActionName;
	}
	public play(anim: string, loop:number = 0, trackID:number = 0): spine.Track {
		let s = this;
		return s.start(trackID).add(anim, loop, s);
	}
	/**播放某个动作，gotoAndPlay和play只能选择一个使用
	 * @param anim 动作名称
	 * @param loop 循环次数
	 * @param endAct 结束后回到的待机循环动作
	 * @param soundEndCall 声音停止回调
	 * @param soundThisObject 声音停止回调this
	 * @param trackID 监听器id
	*/
	public gotoAndPlay(anim: string, loop: number = 1, sound: string = null, endAct: string = null, soundEndCall: Function = null, soundThisObject: any = null,trackID:number=0,soundType:number=1): spine.Track {
		let s = this;
		s._curActionName = anim;
		s._sound = sound;
		s._endAct = endAct;
		s._soundEndCallBack = soundEndCall;
		s._soundEndObject = soundThisObject;

		if (s._sound) {
			SoundManager.instance.play(s._sound, 0, 1, s.soundEnd, s,soundType);
		}
		return s.start(trackID).add(anim, loop, s);
	}
	private soundEnd(): void {
		let s = this;
		if (s._soundEndCallBack != null) {
			s._soundEndCallBack.call(s._soundEndObject);
			s._soundEndCallBack = null;
			s._soundEndObject = null;
		}
		if (s._endAct) {
			s.gotoAndPlay(s._endAct, 0);
			s._endAct = null;
		}
	}
	/**监听单次循环的播放结束*/
	public setLoopEnd(func: Function, thisObject: any): void {
		let s = this;
		s._loopEndFunc = func;
		s._loopEndObject = thisObject;
	}
	public clearLoopEnd() {
		let s = this;
		if(s._loopEndFunc) {
			s._loopEndFunc = null;
			s._loopEndObject = null;
		}
	}
	/**监听播放结束*/
	public setPlayEnd(func: Function, thisObject: any): void {
		let s = this;
		s._completeEndFunc = func;
		s._completeEndObject = thisObject;
	}
	public clearPlayEnd() {
		let s = this;
		if(s._completeEndFunc) {
			s._completeEndFunc = null;
			s._completeEndObject = null;
		}
	}
	 
}
/**demo
 * 
 * let ske:spine.SkeletonAnimation = SpineSkeleton.createSpine("tuzi",URLConf.sketelonAlias);
			ske.x = 500;
			ske.y =500;
			ske.play("standby");
			s.addElement(ske);
 * 
*/