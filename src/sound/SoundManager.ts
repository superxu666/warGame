class SoundManager {
	private static _instance:SoundManager;	
	public soundDict:any;
	public static get instance():SoundManager
	{
		if(SoundManager._instance == null)
			SoundManager._instance = new SoundManager;
		return SoundManager._instance;
	}

	private _loaddingDict:Object = {};
	private _curBGM:string;	
	private _paused:boolean;
	public constructor() {
		SoundManager._instance = this;
		let s = this;		
		s.soundDict = {};		
	}
	private nativeAudioEnd(d:any):void
	{let s = this;		
		if (d && d.data) {
			let url:string;
			let soundType:number;
			let soundObj:SoundData;
			url = d.data.url;
			soundType = d.data.soundType;
			for(let key in s.soundDict)
			{
				soundObj = s.soundDict[key];				
				if(soundObj.soundType == soundType && url == key)
				{
					soundObj.soundComplete();
				}
			}
		}
	}
	public getDefaultBgm():string
	{
		return URLConf.sound + UserData.getInstance().getPlatform() + "_BGM.mp3";
	}
	public playBGM(url:string):void
	{
		let s = this;
		if(s._curBGM == url)return;
		s._curBGM = url;
		s.play(s._curBGM,0,0,null,null,SoundData.BACKGROUND_SOUND);
	}
	public closeBGM():void
	{
		let s = this;
		if(s._curBGM!=null)
		{
			s.stop(s._curBGM,SoundData.BACKGROUND_SOUND);
			s._curBGM = null;
		}
	}
	/**播放声音
	 * @param url 声音路径
	 * @param startTime 起始时间
	 * @param loops 循环次数 0为永久循环
	 * @param compF 播放完成的回调
	 * @param thisObject 回调指向
	 * @param type 声音类型 参考SoundData 常量
	 * @param fileType 文件分类
	 * @param fileID 文件ID
	*/
	public play(url:string,startTime:number = 0, loops:number = 1, compF:Function=null, thisObject:any=null,type:number = 0, fileType:number=NaN, fileID:string = null):void
	{let s = this;
		if(url == null)
		{
			Log.writeLog(MultiLang.str2 + ":" + url, Log.WARN);
			return;
		}
		
		if(type == SoundData.COMMON_SOUND)
			s.stop();
		
		if(s.soundDict[url] == null)
		{
			if((url.indexOf("http") == 0) && GYLite.GYLoader.getRes(url) == null)
			{
				let obj:any = {url:url,startTime:startTime,loops:loops,compF:compF,thisObject:thisObject,type:type};
				s._loaddingDict[url] = obj;				
				GameManager.getInstance().loadData(url,s.loadSoundComp,s,null,GYLite.GYLoader.TYPE_BINARY,"get",obj,false,{save:false});
				return;
			}
			let res:GYLite.ResObject = GYLite.GYLoader.getRes(url);
			if(res)
			{
				s.soundDict[url] = GYLite.PoolUtil.fromPool(SoundData);
				s.soundDict[url].sound = res.res;
			}				
			if(s.soundDict[url] == null)
			{
				if(compF!=null)
					compF.call(thisObject);
				Log.writeLog(MultiLang.str1 + ":" + url, Log.WARN);
				return;
			}
		}		
				
		let soundObj:SoundData = s.soundDict[url];				
		soundObj.url = url;
		soundObj.soundType = type;		
		//功能还没联调，先注释，勿删除
		soundObj.fileType = fileType == fileType?fileType:UIControl.getInstance().curFileType;
		if(soundObj.fileType == FileType.LESSON)
			soundObj.fileID = fileID?fileID:UIControl.getInstance().curFileID;		
		else
			soundObj.fileID = null;
		soundObj.filePath = soundObj.fileID?soundObj.fileID + "/res/" + url:url;
		s.playBySoundData(soundObj, startTime, loops, compF, thisObject);
	}
	private loadSoundComp(l:GYLite.LoadInfo):void
	{let s = this;
		if(l.content == null)
		{
			if(s._loaddingDict[l.param.url].compF!=null)
				s._loaddingDict[l.param.url].compF.call(s._loaddingDict[l.param.url].thisObject);
			delete s._loaddingDict[l.param.url];
			Log.writeLog(MultiLang.str1 + ":" + l.param.url, Log.WARN);
			return;
		}
		if(s._loaddingDict[l.param.url] == null)return;
		let loadInfo:GYLite.LoadInfo = Main.instance.myLoader.loadBytes(l.content.res, s.bytesLoaded,s,GYLite.GYLoader.TYPE_SOUND,GYLite.GYLoader.getMimeType(GYLite.GYLoader.TYPE_SOUND),l.param);
		loadInfo.path = l.param.url;
	}
	private bytesLoaded(l:GYLite.LoadInfo):void
	{let s = this;
		if(s._loaddingDict[l.param.url] == null)return;
		delete s._loaddingDict[l.param.url];
		s.play(l.param.url,l.param.startTime,l.param.loops,l.param.compF,l.param.thisObject,l.param.type);
	}
	/**播放字节流声音
	 * @param bytes 字节数组ArrayBuffer
	 * @param startTime 开始时间
	 * @param loops 循环次数 0 永久循环
	 * @param compF 结束回调函数
	 * @param thisObject this指向
	 * @param type 声音类型
	 * @param url 声音地址 
	*/
	public playBytes(bytes:ArrayBuffer,startTime:number = 0, loops:number = 1, compF:Function=null, thisObject:any=null,type:number = 0,url:string=null):void
	{
		let s = this;
		let obj:any = {url:url,startTime:startTime,loops:loops,compF:compF,thisObject:thisObject,type:type};
		let loadInfo:GYLite.LoadInfo = Main.instance.myLoader.loadBytes(bytes, s.bytesSoundLoaded,s,GYLite.GYLoader.TYPE_SOUND,GYLite.GYLoader.getMimeType(GYLite.GYLoader.TYPE_SOUND,url),obj);		
	}
	private bytesSoundLoaded(l:GYLite.LoadInfo):void
	{let s = this;
		if(l.content == null)
		{			
			Log.writeLog(MultiLang.str1 + ":" + l.param.url, Log.WARN);
			return;
		}		
		let url:string = l.content.res.url;
		s.soundDict[url] = GYLite.PoolUtil.fromPool(SoundData);
		s.soundDict[url].sound = l.content.res;
		let soundObj:SoundData = s.soundDict[url];
		soundObj.url = url;
		soundObj.soundType = l.param.type;
		s.playBySoundData(soundObj,l.param.startTime,l.param.loops,l.param.compF,l.param.thisObject);		
	}
	public playBySoundData(soundObj:SoundData,startTime:number = 0, loops:number = 1, compF:Function=null, thisObject:any=null):void
	{
		let s = this;
		let sound:egret.Sound = soundObj.sound;		
		soundObj.compFunc = compF;
		soundObj.thisObject = thisObject;
		soundObj.position = 0;
		soundObj.loops = loops;		
		if(!s._paused)
		{			
			soundObj.channel = soundObj.sound.play(0,loops);
			if(loops!==0 && !GYLite.CommonUtil.GYIs(soundObj.sound, MySound))
			{				
				if(compF!=null && soundObj.sound && soundObj.sound.length > 0 && soundObj.sound.length < 300 && (soundObj.channel == null || soundObj.channel["bufferSource"] && soundObj.channel["bufferSource"].context.state != "!running"))
				{					
					soundObj.timeId = GYLite.TimeManager.timeOut(soundObj.soundComplete,soundObj,soundObj.sound.length * 1000 * soundObj.loops);
				}
					
			}
		}	
	}
	/**停止声音，清除字典缓存
	 * @param url 声音的url，为null则是停止所有
	 * @param soundType 声音类型 -1所有种类的声音
	 * @param disposeSrc 销毁声音源数据
	*/
	public stop(url:string = null,soundType:number = 0,disposeSrc:boolean=false):void
	{let s = this;
		let soundObj:SoundData;
		let arr:Array<any>,arr2:Array<any>;
		if(url == null)
		{
			arr = [];
			for(let key in s.soundDict)
			{				
				soundObj = s.soundDict[key];
				if(soundObj.soundType == soundType || soundType == -1)
				{
					arr.push(soundObj);					
					if(disposeSrc)
						soundObj.dispose();
					else
						soundObj.clear();					
				}				
			}
			arr2 = [];
			for(let key in s._loaddingDict)
			{				
				soundObj = s._loaddingDict[key];
				if(soundObj.soundType == soundType || soundType == -1)
				{
					arr2.push(soundObj);					
					if(disposeSrc)
						soundObj.dispose();
					else
						soundObj.clear();					
				}				
			}
			let len:number;			
			len = arr2.length;
			while(--len>-1)
			{				
				delete s._loaddingDict[arr2[len].url];				
			}		
			return;
		}
		soundObj = s.soundDict[url];
		if(soundObj)
		{
			if(s._loaddingDict[url])							
				delete s._loaddingDict[url];							
			if(disposeSrc)
				soundObj.dispose();
			else
				soundObj.clear();
			delete s.soundDict[url];			
		}
	}
	/**暂停所有声音*/
	public pause():void
	{let s = this;
		let soundObj:SoundData;
		let arr:Array<any>;
		if(s._paused)return;
		s._paused = true;		
		for(let key in s.soundDict)
		{
			soundObj = s.soundDict[key];
			if (soundObj.channel) {
				soundObj.position = soundObj.channel.position;
				soundObj.paused = true;						
				soundObj.channel = null;
				if(GYLite.CommonUtil.GYIs(soundObj.sound, MySound))
				{
					let mySound:MySound = (<MySound>soundObj.sound);
					mySound.clearCheck();
				}
			} else {
				soundObj.paused = false;
			}			
		}
	}
	/**恢复所有声音*/
	public resume():void
	{let s = this;
		let soundObj:SoundData;
		let arr:Array<any>;
		if(!s._paused)return;
		s._paused = false;		
		for(let key in s.soundDict)
		{				
			soundObj = s.soundDict[key];			
			if (soundObj.paused) {
				if (soundObj.loops == 0) {
					soundObj.position = 0;
				}				
				soundObj.channel = soundObj.sound.play(soundObj.position, soundObj.loops);
				if(soundObj.loops > 0 && !GYLite.CommonUtil.GYIs(soundObj.sound, MySound) && (soundObj.channel == null || soundObj.channel["bufferSource"] && soundObj.channel["bufferSource"].context.state != "running"))
				{
					if(soundObj.compFunc!=null && soundObj.sound && soundObj.sound.length > 0 && soundObj.sound.length < 300)
						soundObj.timeId = GYLite.TimeManager.timeOut(soundObj.soundComplete,soundObj,soundObj.sound.length * 1000 * soundObj.loops);
				}
			}
		}
	}
	/*销毁对声音的引用
	* @param url 声音url null表示销毁全部
	* @param disposeSrc 是否销毁声音元数据
	**/
	public dispose(url:string=null,disposeSrc:boolean=false):void
	{
		let s = this;
		s.stop(url,0,disposeSrc);
	}
	public get paused():boolean
	{
		return this._paused;
	}
	// public set volume(val:number)
	// {let s = this;
	// 	if(s._curChannel == null)return;
	// 	s._curChannel.volume = val;
	// }
	// public get volume():number
	// {let s = this;
	// 	return s._curChannel?s._curChannel.volume:0;
	// }
	// public get position():number
	// {let s = this;
	// 	return s._curChannel?s._curChannel.position:0;
	// }
	// public set position(val:number)
	// {let s = this;
	// 	if(s._curChannel == null)return;
	// 	s._curChannel.position = val;
	// }
	/**对已经被销毁的对象的声音进行垃圾回收*/
	public static gc():void
	{
		let dict = SoundManager.instance.soundDict;
		let soundObj:SoundData;
		let arr:SoundData[]=[],arr2:SoundData[]=[];
		for(let key in dict)
		{
			soundObj = dict[key];
			if(soundObj.thisObject && soundObj.thisObject.disposed)
			{
				arr.push(soundObj);					
				soundObj.dispose();				
			}		
		}		
		dict = SoundManager.instance._loaddingDict;
		for(let key in dict)
		{				
			soundObj = dict[key];
			if(soundObj.thisObject && soundObj.thisObject.disposed)
			{
				arr2.push(soundObj);									
				soundObj.dispose();				
			}				
		}
		let len:number;
		len = arr.length;
		while(--len>-1)
		{				
			delete SoundManager.instance.soundDict[arr[len].url];			
		}
		len = arr2.length;
		while(--len>-1)
		{				
			delete SoundManager.instance._loaddingDict[arr2[len].url];				
		}		
	}
}
class SoundData implements GYLite.IPoolObject
{
	public sound:any;
	public compFunc:any;
	public thisObject:any;
	private _channel:egret.SoundChannel;
	private _tempChannels:egret.SoundChannel[]=[];
	public timeId:number = -1;
	public soundType:number = 0;
	public position:number;
	public loops:number;
	public url:string;
	public paused:boolean = false;
	/**模块文件分类*/public fileType:number;
	/**模块文件ID*/public fileID:string;
	/**音频文件相对路径*/public filePath:string;
	/**音频文件的base64字符串，用于桥接播放*/public fileData:string;
	public static COMMON_SOUND:number = 0;
	public static BACKGROUND_SOUND:number = 1;
	public soundComplete(e:egret.Event=null):void
	{
		let s = this;		
		s.channel = null;
		if(s.compFunc != null)
		{
			if(s.compFunc.length == 1)
				s.compFunc.call(s.thisObject,s);
			else
				s.compFunc.call(s.thisObject);
		}		
		if(GYLite.CommonUtil.GYIs(s.sound, MySound) && e == null)
		{
			let mySound:MySound = (<MySound>s.sound);
			if(mySound.originChannel && mySound.originChannel.hasEventListener(egret.Event.SOUND_COMPLETE))
				(<any>mySound.originChannel).dispatchEventWith(egret.Event.SOUND_COMPLETE);
		}
	}
	public get channel():egret.SoundChannel
	{
		return this._channel;
	}
	public set channel(val:egret.SoundChannel)
	{let s = this;
		if(s._channel == val)return;
		if(s._channel)
		{
			s._channel.stop();
			s._channel.removeEventListener(egret.Event.SOUND_COMPLETE,s.soundComplete,s);
			s._channel = null;
			let len:number;
			len = s._tempChannels.length;
			while(--len>-1)		
				s._tempChannels[len].stop();		
			s._tempChannels.length = 0;
		}
		if(val == null)
		{
			if(s.timeId > -1)
			{
				GYLite.TimeManager.unTimeOut(s.timeId,s.soundComplete,s);
				s.timeId = -1;
			}
			if(GYLite.CommonUtil.GYIs(s.sound, MySound))
			{
				let mySound:MySound = (<MySound>s.sound);
				mySound.clearCheck();
			}
		}		
		s._channel = val;
		if(s._channel)
			s._channel.addEventListener(egret.Event.SOUND_COMPLETE,s.soundComplete,s);
	}

	public clear(): void
	{let s = this;
		if(s.inPool)return;				
		s.soundType = 0;
		s.fileData = null;
		s.fileID = null;
		s.fileType = NaN;
		if(s.timeId > -1)
		{			
			GYLite.TimeManager.unTimeOut(s.timeId,s.compFunc,s);
			s.timeId = -1;
		}			
		if(s.compFunc!=null)
		{			
			s.compFunc = null;
			s.thisObject = null;
		}		
		s.channel = null;
		if(GYLite.CommonUtil.GYIs(s.sound, MySound))
		{
			(<MySound>s.sound).stop();
		}
		s.sound = null;		
		GYLite.PoolUtil.toPool(this, SoundData);
	}
    public inPool: boolean;
    public outPoolInit(): void
	{	
		let s = this;
		s.fileType = NaN;
		s.fileID = null;
	}
	/**销毁声音，会把声音源数据销毁*/
	public dispose():void
	{
		let s = this;		
		GYLite.GYLoader.deleteResByKey(s.url);
		s.clear();		
	}
}