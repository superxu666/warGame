class MySound implements GYLite.ISound{
	private _channel:MyChannel;
	private _originChannel:egret.SoundChannel;
	private _originSound:egret.Sound;
	private _tempChannels:egret.SoundChannel[];
	private _startTime:number;
	private _loops:number;
	private _checkId:number;
	public bytes:ArrayBuffer;
	public mimeType:string;
	public compress:string;
	public path:string;
	public constructor() {
		// super();
		let s = this;
		s._channel = new MyChannel(s);
		s._startTime = NaN;
		s._loops = 0;
		s._checkId =-1;
		s._tempChannels = [];
	}
	public play(startTime:number = 0, loops:number = 0):egret.SoundChannel
	{
		let s = this;
		s._startTime = startTime;
		s._loops = loops;
		if(s._originSound == null)
			s.loadBytes(s.bytes,startTime, loops);
		else
		{
			if(s._originChannel)
				s._tempChannels.push(s._originChannel);
			s._originChannel = s._originSound.play(startTime,loops);
			if(loops > 0 && (s._originChannel == null || s._originChannel["bufferSource"] && s._originChannel["bufferSource"].context.state != "running"))
				s.endCheck();
		}			
		return <egret.SoundChannel>s._channel;
	}
	/**播放字节流声音
	 * @param bytes 字节数组ArrayBuffer
	 * @param startTime 开始时间
	 * @param loops 循环次数 0 不循环	 
	*/
	private loadBytes(bytes:ArrayBuffer,startTime:number = 0, loops:number = 1):void
	{
		let s = this;
		let loadInfo:GYLite.LoadInfo;
		loadInfo = Main.instance.myLoader.loadBytes(bytes, s.bytesSoundLoaded,s,GYLite.GYLoader.TYPE_SOUND,GYLite.GYLoader.getMimeType(GYLite.GYLoader.TYPE_SOUND,s.path));				
	}
	private bytesSoundLoaded(l:GYLite.LoadInfo):void
	{let s = this;
		if(l.content == null)
		{			
			Log.writeLog(MultiLang.str1 + ":" + l.param.url, Log.WARN);
			return;
		}
		s._originSound = l.content.res;
		if(s._startTime == s._startTime)
		{
			s._originChannel = s._originSound.play(s._startTime,s._loops);
			if(s._loops > 0 && (s._originChannel == null || s._originChannel["bufferSource"] && s._originChannel["bufferSource"].context.state != "running"))
				s.endCheck()
			if(s._channel.settingPosition == s._channel.settingPosition)
				s._originChannel.position = s._channel.settingPosition;

			if(s._channel.volume == s._channel.volume)
				s._originChannel.volume = s._channel.volume;

			let listenerObj = s._channel.listenerObj;
			let obj:any;
			for(var key in listenerObj) {
				obj = listenerObj[key];
				s.originChannel.once(obj.type, obj.listener, obj.thisObject, obj.useCapture, obj.priority);
			}
			s._channel.listenerObj = {};
			listenerObj = s._channel.addListenerObj;
			for(var key in listenerObj) {
				obj = listenerObj[key];
				s.originChannel.addEventListener(obj.type, obj.listener, obj.thisObject, obj.useCapture, obj.priority);
			}
						
		}			
	}
	private endCheck():void
	{
		let s =this;
		s.clearCheck();
		if(s._startTime == s._startTime)
		{
			if(s.length > 0 && s.length < 300)
			{
				s._checkId = GYLite.TimeManager.timeOut(s.doCheck,s,s.length * 1000 * s._loops);
			}
		}			
	}
	private doCheck():void{
		let s = this;
		if(s._originChannel)
			(<any>s._originChannel).dispatchEventWith(egret.Event.SOUND_COMPLETE);
	}
	public clearCheck():void
	{
		let s = this;
		if(s._checkId > -1)
		{
			GYLite.TimeManager.unTimeOut(s._checkId,s.doCheck,s);
			s._checkId = -1;
		}
	}
	public get channel():MyChannel
	{
		return this._channel;
	}
	public get originChannel():egret.SoundChannel
	{
		return this._originChannel;
	}
	public setOriginChannel(val:egret.SoundChannel)
	{
	// 	let s =this;
	// 	s._originChannel = val;
	// 	if(s._channel.volume == s._channel.volume)s._originChannel.volume = s._channel.volume;
	// 	// s._originChannel.position = s._channel.position == s._channel.position?s._channel.position:0;
	}
	public stop():void
	{
		let s = this;
		s.clearCheck();
		if(s._originChannel)
		{
			s._originChannel.stop();
			s._originChannel = null;
		}
		let len:number;
		len = s._tempChannels.length;
		while(--len>-1)		
			s._tempChannels[len].stop();		
		s._tempChannels.length = 0;
		s._startTime = NaN;
		s._loops = 0;
		s._channel.clear();		
	}
	public close(): void
	{let s =this;		
		if(s._originSound)
		{
			if(s._originSound["url"])
				GYLite.GYLoader.deleteResByKey(s._originSound["url"]);
			s._originSound.close();
			s.bytes = null;
		}
			
	}
	public get length():number
	{let s =this;
		if(s._originSound)
			return s._originSound.length;
		return 0;
	}
	public get type(): string
	{let s =this;
		if(s._originSound)
			return s._originSound.type;
	}
	public load(url: string): void
	{let s =this;
		if(s._originSound)
			s._originSound.load(url);
	}	
}
class MyChannel extends egret.EventDispatcher implements egret.SoundChannel
{
	private _volume:number;
	private _position:number;
	private _sound:MySound;
	private _listenerObj:any = {};
	private _addListenerObj:any = {};
	public constructor(sound:MySound) {
		super();
		let s = this;
		s._volume = NaN;
		s._position = NaN;
		s._sound = sound;
		s._addListenerObj = {};
	}
	public get volume():number
	{
		return this._volume;
	}
	public set volume(val:number)
	{
		let s= this;
		s._volume = val;		
		if(s._sound.originChannel)
			s._sound.originChannel.volume = val;
	}
	public get position(): number
	{let s = this;
		if(s._sound.originChannel)
			return s._sound.originChannel.position;
		return 0;
	}
	public set position(val: number)
	{
		let s= this;
		s._position = val;
		if(s._sound.originChannel)
			s._sound.originChannel.position = val;
	}
	public get settingPosition():number
	{
		return this._position;
	}
	public set listenerObj(val) {
		this._listenerObj = val;
	}
	public get listenerObj():any {
		return this._listenerObj;
	}
	public get addListenerObj():any{
		return this._addListenerObj;
	}
	public stop():void
	{
		let s = this;		
		s._sound.stop();
	}	
	public clear():void
	{
		let s = this;
		s._position = 0;
		s._volume = NaN;
	}

	public once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number) {
		let s = this;
		if (s._sound.originChannel) {
			s._sound.originChannel.once(type, listener, thisObject, useCapture, priority);
		} else {
			s._listenerObj[type] = { type:type, listener:listener, thisObject:thisObject, useCapture:useCapture, priority:priority };
		}
	}
	public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number):void{
		let s = this;
		if (s._sound.originChannel) {
			s._sound.originChannel.addEventListener(type, listener, thisObject, useCapture, priority);
		} else {
			s._addListenerObj[type] = { type:type, listener:listener, thisObject:thisObject, useCapture:useCapture, priority:priority };
		}
	}

	public hasEventListener(type: string): boolean {
		let s = this;
		if (s._sound.originChannel) {
			return s._sound.originChannel.hasEventListener(type);
		} else {
			if(s._listenerObj[type] || s._addListenerObj[type]) {
				return true;
			}
		}
		return false;
	}

	public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void {
		let s = this;
		if (s._sound.originChannel) {
			s._sound.originChannel.removeEventListener(type, listener, thisObject, useCapture);
		} 
		if (s._listenerObj[type]) {
			delete s._listenerObj[type];
		}
		if (s._addListenerObj[type]) {
			delete s._addListenerObj[type];
		}
	}
}