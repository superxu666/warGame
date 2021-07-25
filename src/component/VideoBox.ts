class VideoBox extends GYLite.GYSprite {
	public static ON_TIME_UPDATE: string = "ontimeupdate";
	public static CANPLAY: string = "canplay";
	public static ENDED: string = "ended";
	/**普清*/public static QUALITY_CD: string = "";
	/**高清*/public static QUALITY_SD: string = "sd";
	/**超清*/public static QUALITY_HD: string = "hd";
	/**蓝光*/public static QUALITY_BD: string = "bd";

	/**普清*/public static QUALITY_OLD_CD: string = "high";
	/**高清*/public static QUALITY_OLD_SD: string = "super";
	/**超清*/public static QUALITY_OLD_HD: string = "super";
	/**蓝光*/public static QUALITY_OLD_BD: string = "super";

	private _url: string = null;
	private _lastUrl: string;
	private _video: any;
	private _videoVisible: boolean;
	private _canplayThis: any;
	private _canplayFunc: Function;
	private _endThis: any;
	private _endFunc: Function;
	private _waitingThis: any;
	private _waitingFunc: Function;
	private _ended: boolean;
	private _updateThis: any;
	private _updateFunc: Function;
	private _seek: number;
	private _invalidPosAndSize: boolean;
	private _leftBufferTime: number;
	private _bufferTime: number;
	private _cutCompFunc: Function;
	private _cutCompThis: any;
	private _completeHide: boolean;
	private _playbackRate: number;
	private _defaultPlaybackRate: number;
	private _rect: egret.Rectangle;
	private _bitmapData: egret.BitmapData;
	private _inshortCut: boolean;
	private _shortClear: boolean;
	private _autoPlay: boolean;
	private _replayFlag: boolean;
	private _fit: number;
	/**视频总时长(秒)*/private _nativeDuration: number;
	private _nativeLayerIndex: number;
	private _nativePaused: boolean;
	/**视频当前播放时间(毫秒)*/private _nativeCurrentTime: number;
	private _nativeTimeTick: number;
	private _nativeTimeSpeed:number;
	private _nativeShortCutTex: egret.Texture;
	private _nativeState: number;//0 停止 1 播放 2暂停
	private _nativeReady: boolean;
	private _nativeVolume: number;
	private _nativeUrl: string = null;
	private _shortcutClose:boolean = true;
	public nativeWaitUpdate: boolean;
	public fileID: string = "";
	public fileType: number = 1;
	public uid: number = NaN;
	public urlUId: number = NaN;
	public isInScratch:boolean = false;

	public  _videoControl:number = 0;
	public fitMode:number = 1;
	
	


	public constructor(x: number = 0, y: number = 0, w: number = 1280, h: number = 720) {
		super();
		let s = this;
		s.uid = ++GameManager.getInstance().uidCount;
		s._nativeDuration = NaN;
		s._autoPlay = true;
		s._nativeVolume = 1;
		s._nativePaused = true;
		s._nativeTimeTick = NaN;
		s._url = null;
		s.width = w;
		s.height = h;
		s.x = x;
		s.y = y;
		s.createVideo(x, y, w, h, null);
		s.visible = false;
		s._nativeState = s._nativeCurrentTime = s._nativeLayerIndex = s._seek = 0;
		s._bufferTime = s._leftBufferTime = 0;
		s.$renderNode = new egret.sys.BitmapNode();
		GYLite.GYSprite.stage.addEventListener(egret.Event.RESIZE, s.resize, s);
		s.addEventListener(egret.Event.ADDED_TO_STAGE, s.addToStage, s);
		s._shortClear = true;
		s._playbackRate = 1;
		// s._shortcutTex = new egret.RenderTexture;		
	}
	private addToStage(e: egret.Event): void {
		let s = this;
		s.addEventListener(egret.Event.REMOVED_FROM_STAGE, s.removeFromStage, s);
		
	}
	private removeFromStage(e: egret.Event): void {
		let s = this;
		s.stop();
		s.removeEventListener(egret.Event.REMOVED_FROM_STAGE, s.removeFromStage, s);		
	}
	public $updateRenderNode() {
		let s = this;
		if (!s._bitmapData) return;
		if (s._shortClear) return;		
		let node: any = s.$renderNode;
		node.image = s._bitmapData;
		node.imageWidth = s._video.videoWidth;
		node.imageHeight = s._video.videoHeight;
		egret.WebGLUtils.deleteWebGLTexture(s._bitmapData.webGLTexture);
		s._bitmapData.webGLTexture = null;
		if (s._video.style.objectFit == "cover")
			node.drawImage(0, 0, s._video.videoWidth, s._video.videoHeight, 0, 0, s.width, s.height);
		else {
			let tx: number, ty: number;
			let sclX: number, sclY: number, scl: number;
			let w: number, h: number, vW: number, vH: number;
			vW = s._video.videoWidth;
			vH = s._video.videoHeight;
			sclX = s.width / vW;
			sclY = s.height / vH;
			scl = sclX < sclY ? sclX : sclY;
			w = vW * scl;
			h = vH * scl;
			tx = s.width - vW >> 1;
			ty = s.height - vH >> 1;
			node.drawImage(0, 0, vW, vH, tx, ty, w, h);
		}
	}
	private resize(e: egret.Event): void {
		let s = this;
		s.invalidPosAndSize();
	}
	public set autoPlay(val: boolean) {
		let s = this;
		s._autoPlay = val;		
		if (s._autoPlay) {
			s._video.setAttribute("autoplay", "autoplay");
			s._video.autoplay = true;
		}
		else {
			s._video.autoplay = false;
			s._video.removeAttribute("autoplay");
		}

	}
	/**是否就绪后自动播放*/
	public get autoPlay(): boolean {
		return this._autoPlay;
	}
	public get controls(): string {
		let s = this;
		return s._video ? s._video.control : null;
	}
	public set controls(val: string) {
		let s = this;
		
		if (s._video) {
			s._video.style.pointerEvents = "auto";
			s._video.controls = val;
		}
		else
			s._video.style.pointerEvents = "none";
	}
	public set position(val: number) {
		let s = this;		
		if (s._video)
			s._video.currentTime = s.duration > 0 ? Math.min(s.duration, val) : val;
	}
	/**视频播放单位，毫秒 */
	public get position(): number {
		let s = this;		
		return s._video ? s._video.currentTime : 0;
	}
	/**剩余缓冲区时间*/
	public get leftBufferTime(): number {
		let s = this;
		return s._leftBufferTime;
	}
	/**缓冲区当前时间*/
	public get bufferTime(): number {
		let s = this;
		return s._bufferTime;
	}
	public get duration(): number {
		let s = this;		
		return s._video ? (s._video.duration > 0 ? s._video.duration : 0) : 0;
	}
	public set seek(val: number) {
		let s = this;
		s._seek = val;
		if (s._seek >= 0)
			s.position = s._seek;
	}
	/**定位时间*/
	public get seek(): number {
		let s = this;
		return s._seek;
	}
	public set width(val: number) {
		let s = this;
		egret.superSetter(VideoBox, this, "width", val);
		s.invalidPosAndSize();
	}
	public get width(): number {
		return egret.superGetter(VideoBox, this, "width");
	}
	public set height(val: number) {
		let s = this;
		egret.superSetter(VideoBox, this, "height", val);
		s.invalidPosAndSize();
	}
	public get height(): number {
		return egret.superGetter(VideoBox, this, "height");
	}
	public set x(val: number) {
		let s = this;
		egret.superSetter(VideoBox, this, "x", val);
		s.invalidPosAndSize();
	}
	public get x(): number {
		return egret.superGetter(VideoBox, this, "x");
	}
	public set y(val: number) {
		let s = this;
		egret.superSetter(VideoBox, this, "y", val);
		s.invalidPosAndSize();
	}
	public get y(): number {
		return egret.superGetter(VideoBox, this, "y");
	}
	public get paused(): boolean {
		let s = this;		
		return s._video ? s._video.paused : true;
	}
	public shortcut(completeHide: boolean = false, cutCompFunc: Function = null, cutCompThis: any = null): void {
		let s = this;
		s._completeHide = completeHide;
		s._cutCompFunc = cutCompFunc;
		s._cutCompThis = cutCompThis;
		if (s._inshortCut) return;
		if (s._shortcutClose || s._url == null) {
			s.shortCutLoaded();
			return;
		}
		// s._shortcutTry = 0;
		s._inshortCut = true;		

		if (completeHide) s.pause();
		var ver: number = Browser.getIOSVer();
		if (ver <= 10) {
			Log.writeLog("VIDEO_(目前版本：" + ver + ")ios版本10(包括10)以下跨域截图可能失败:" + s._url, Log.VERBOSE);
		}

		s.lateShortCut();
	}
	private lateShortCut(): void {
		let s = this;

		if (s._disposed) return;
		Log.writeLog("VIDEO_开始截图!" + s._url, Log.VERBOSE);
		if (s._url && (s._url.indexOf("http") > -1 && (window.location.host == "" || s._url.indexOf(window.location.host) == -1))) {
			Log.writeLog("VIDEO_不同域截图失败!" + s._url + "-" + window.location.host, Log.VERBOSE);
			s._completeHide = false;
			s.shortCutLoaded();
			return;
		}
		if (s._bitmapData == null) {
			s._bitmapData = new egret.BitmapData(s._video);
			s._bitmapData.$deleteSource = false;

		}
		s._shortClear = false;

		s.makeDirty();
		GYLite.TimeManager.timeOut(s.shortCutLoaded, s, 100);
	}
	private shortCutLoaded(): void {
		let s = this;
		if(!s._shortcutClose)
			Log.writeLog("VIDEO_截图结束!" + s._url, Log.VERBOSE);
		s._inshortCut = false;
		s._shortClear = true;
		if (s._completeHide) {			
			s.visible = false;			
		}
		if (s._cutCompFunc != null) {
			s._cutCompFunc.call(s._cutCompThis);
		}
	}
	public set playbackRate(val: number) {
		let s = this;
		if (s._playbackRate == val) return;
		s._playbackRate = val;		
		if (s._video)
			s._video.playbackRate = val;
	}
	/**当前播放速率*/
	public get playbackRate(): number {
		return this._playbackRate;
	}
	public set defaultPlaybackRate(val: number) {
		let s = this;
		if (s._defaultPlaybackRate == val) return;
		s._defaultPlaybackRate = val;		
		if (s._video)
			s._video.defaultPlaybackRate = val;
	}
	/**默认播放速率*/
	public get defaultPlaybackRate(): number {
		return this._defaultPlaybackRate;
	}
	/**清除视频截图*/
	public clearShortcut(): void {
		let s = this;		
		// if(s._shortClear)return;
		s._shortClear = true;
		s.makeDirty();
	}
	/**是否截图中*/
	public get inshortCut(): boolean {
		return this._inshortCut;
	}
	/**截图是否已经清理*/
	public get shortClear(): boolean {
		return this._shortClear;
	}
	/**尺寸位置失效*/
	public invalidPosAndSize(): void {
		let s = this;
		if (s._invalidPosAndSize) return;
		s._invalidPosAndSize = true;
		s.displayChg(s.updateView);
	}
	/**刷新尺寸位置*/
	public validPosAndSize(): void {
		let s = this;
		let rect: egret.Rectangle;		
		s._rect = rect = LayerManager.getInstance().localRectToGlobal(s, new egret.Rectangle(0, 0, s._width, s._height));		
		let devicePixelRatio: number = (egret.nativeRender && Browser.onAndroid) ? window.devicePixelRatio : 1;
		s._rect.x = s._rect.x * devicePixelRatio | 0;
		s._rect.y = s._rect.y * devicePixelRatio | 0;
		s._rect.width = s._rect.width * devicePixelRatio | 0;
		s._rect.height = s._rect.height * devicePixelRatio | 0;		
		s._video.style.width = rect.width + "px";
		s._video.style.height = rect.height + "px";
		if (GYLite.GYSprite.player.webTouchHandler.rotation == 90) {
			s._video.style.transform = "rotate(" + 90 + "deg)";
			s._video.style.left = (GYLite.GYSprite.stage.stageHeight - rect.bottom + (rect.height - rect.width >> 1)) + "px";
			s._video.style.top = (rect.x + (rect.width - rect.height >> 1)) + "px";
		}
		else {
			s._video.style.transform = "";
			s._video.style.left = rect.x + "px";
			s._video.style.top = rect.y + "px";
		}

	}
	public updateView(): void {
		super.updateView();
		let s = this;
		if (s._invalidPosAndSize) {
			s._invalidPosAndSize = false;
			s.validPosAndSize();
		}
	}
	public setUrlByFileID(val: string, fileID: string, fileType: number = 1): void {
		let s = this;
		let oldFileID: string;
		let oldFileType: number;
		oldFileID = s.fileID;
		oldFileType = s.fileType;
		s.fileID = fileID;
		s.fileType = fileType;
		s.url = val;
		s.fileID = oldFileID;
		s.fileType = oldFileType;
	}
	public get url(): string {
		return this._url;
	}
	public set url(val: string) {
		let s = this;
		if (s._url == val) return;
		if(val)
			s._lastUrl = val;
		if(!s._ended)
		{
			s._url = null;
			s.urlSet(null);
		}
		s._ended = val == null;
		s._nativeReady = false;
		s._nativeDuration = s._nativeState = 0;
		s._nativePaused = true;
		s._nativeTimeTick = NaN;		
		s._url = val;
		s.urlSet(val);
	}
	private urlSet(val: string): void {
		let s = this;		
		s._nativeUrl = val&&Browser.onIOS?val.replace("file:///",""):val;				
		if (s._video) {
			s._bufferTime = s._leftBufferTime = 0;
			s._seek = 0;
			s._video.src = val;
			if (s._autoPlay)
				s.visible = true;
			s.invalidPosAndSize();
		}
	}
	private nativeUrlCall(d: any): void {
		let s = this;
		if (s.urlUId != d.data.uid) return;
		if (d) {
			if (d.error) {
				Log.writeLog("VIDEO_无10117协议：" + s._url, Log.WARN);
			}
			else if (d.data) {
				if (d.data.fileData) {
					let t: number = Date.now();
					Log.writeLog("VIDEO_" + s._url + "耗时：" + (Date.now() - t) + "-base64长度：" + d.data.fileData.length, Log.WARN);
				}
				else {
					Log.writeLog("VIDEO_10117,urlUId:" + s.urlUId + ",video：old-" + s._url + "\nnew-" + d.data.url, Log.IMPORTANT);
					s.urlSet(d.data.url);
				}
			}
		}
	}

	public get visible(): boolean {
		let s = this;
		return s._videoVisible;
	}

	public set visible(value: boolean) {
		let s = this;
		if (s._disposed) return;
		if (s._videoVisible == value) return;		
		egret.superSetter(VideoBox, s, "visible", value);
		s._videoVisible = value;
		if (value) {
			if (s._video.parentNode == null)
				document.body.appendChild(s._video);
		}
		else {
			if (!s.paused)
				s.pause();
			if (s._video.parentNode)
				document.body.removeChild(s._video);
		}	
	}
	public set volume(val: number) {
		let s = this;		
		if (s._video)
			s._video.volume = val;
	}
	public get volume(): number {
		let s = this;		
		return s._video ? s._video.volume : 0;
	}
	/**视频视频方案0 等比 1 拉伸 2 裁切铺满*/
	public get fit(): number {
		let s = this;
		return s._fit;
	}
	public set fit(val: number) {
		let s = this;
		if (s._fit == val) return;
		s._fit = val;		
		if (s._fit == 1)
			s._video.style.objectFit = "fill";
		else if (s._fit == 2)
			s._video.style.objectFit = "cover";
		else
			s._video.style.objectFit = "none";
	}
	public play(): void {
		let s = this;
		s._ended = false;
		s.visible = true;		
		if (s._video) {
			if (s.duration <= 0) return;
			s._video.play();
		}
	}
	public replay(): void {
		let s = this;
		s._replayFlag = true;		
		if (Browser.onMobile) {
			let url: string;
			url = s._url;
			s.shortcut(true);
			// s.stop();
			s.url = url;
		}
		else {
			s.position = 0;
			s.play();
		}

	}
	public pause(): void {
		let s = this;		
		if (s._nativeTimeTick == s._nativeTimeTick) {
			s._nativeCurrentTime += Date.now() - s._nativeTimeTick;
			s._nativeTimeTick = NaN;
		}		
		if (s._video) {
			if (s.duration <= 0) return;
			s._video.pause();
		}
	}
	private makeDirty(t: number = 0): boolean {
		let s = this;
		s.$renderDirty = true;
		return true;
	}
	public stop(): void {
		let s = this;
		s.url = null;
		s.visible = false;		
		if (s._video) {
			if (s.duration > 0)
				s._video.pause();
			s._video.src = "";
		}
	}

	private createVideo(x, y, w, h, url) {
		var video;
		let s = this;		
		s._video = video = document.createElement("video");
		video.controls = null;

		if (url)
			video.src = url;
		video.setAttribute("autoplay", "autoplay");
		video.setAttribute("webkit-playsinline", "true");
		video.setAttribute("playsinline", "true");
		if (!Browser.onWinXP)
			video.setAttribute("muted", "false");
		video.setAttribute('crossorigin', 'anonymous');
		video.muted = false;

		video.style.position = "absolute";
		video.style.zIndex = "100000";
		video.style.pointerEvents = "none";

		video.owner = s;
		//video.style.objectFit = "cover";
		s.invalidPosAndSize();
		document.body.appendChild(video);
		s._video.addEventListener("ended", s.videoEnd);
		s._video.addEventListener("canplay", s.videoCanPlay);
		s._video.addEventListener("timeupdate", s.videoUpdate);
		s._video.addEventListener('progress', s.progress);
		s._video.addEventListener("waiting", s.videoWating);


		// s.validPosAndSize();		
	}

	private disposeVideo(): void {
		let s = this;
		s.url = null;
		if (s._video && s._video.parentNode) {
			s._video.pause();
			document.body.removeChild(s._video);
			s._video.removeEventListener("ended", s.videoEnd);
			s._video.removeEventListener("canplay", s.videoCanPlay);
			s._video.removeEventListener("timeupdate", s.videoUpdate);
			s._video.removeEventListener('progress', s.progress);
			s._video.removeEventListener("waiting", s.videoWating);
			s._video.owner = null;
		}
	}
	private progress(e: Event): void {
		let owner: VideoBox = e.currentTarget["owner"];
		owner.validBufferTime();
	}
	private validBufferTime(): void {
		let duration;
		let ind: number;
		let start: number, end: number;
		let owner: VideoBox = this;		
		duration = owner.duration; // 视频总长度
		if (duration > 0) {
			for (var i = 0; i < owner._video.buffered.length; i++) {
				ind = owner._video.buffered.length - 1 - i;
				// 寻找当前时间之后最近的点
				start = owner._video.buffered.start(ind);
				end = owner._video.buffered.end(ind);
				if (start <= owner._video.currentTime) {
					owner._leftBufferTime = end - owner._video.currentTime;
					owner._bufferTime = end;
					// let bufferedLength = (s._video.buffered.end(ind) / duration) * 100 + "%";
					// console.log("缓冲时间：",owner._leftBufferTime);
					break;
				}
			}
		}
	}
	private videoUpdate(e: Event): void {
		let owner: VideoBox = e.currentTarget["owner"];
		if (owner._updateFunc != null) {
			owner._updateFunc.call(owner._updateThis);
		}
	}
	private videoCanPlay(e: Event): void {
		let s = this;
		let owner: VideoBox = e.currentTarget["owner"];
		if (owner._autoPlay || owner._replayFlag) {
			owner._replayFlag = false;
			owner.play();
			if (owner._canplayFunc != null) {
				owner._canplayFunc.call(owner._canplayThis);
			}
		}
		else
			owner.shortcut(false, owner._canplayFunc, owner._canplayThis);
		owner.validBufferTime();
		Log.writeLog(MultiLang.str25 + owner.url, Log.VERBOSE);
	}	
	public listenCanplay(func: Function, obj: any): void {
		let s = this;
		s._canplayFunc = func;
		s._canplayThis = obj;
	}
	public listenEnd(func: Function, obj: any): void {
		let s = this;
		s._endFunc = func;
		s._endThis = obj;
	}
	public listenUpdate(func: Function, obj: any): void {
		let s = this;
		s._updateFunc = func;
		s._updateThis = obj;		
	}
	private nativeUpdateLoop(t: number): void {
		let s = this;
		if (s.nativeWaitUpdate) return;
		if (s._nativePaused) return;
		if (!s._nativeReady) return;
		if (s._ended) return;
		if (s._updateFunc != null) {
			s._updateFunc.call(s._updateThis);
		}
	}
	public listenWaiting(func: Function, obj: any): void {
		let s = this;
		s._waitingFunc = func;
		s._waitingThis = obj;
	}
	private videoEnd(e: Event): void {
		let owner: VideoBox = e.currentTarget["owner"];
		owner.pause();
		owner._ended = true;		
		if (owner._endFunc != null) {
			owner._endFunc.call(owner._endThis);
		}
	}
	private videoWating(e: Event): void {
		let owner: VideoBox = e.currentTarget["owner"];
		if (owner._waitingFunc != null) {
			owner._waitingFunc.call(owner._waitingThis);
		}
	}
	private base64ToImage(e): void {
		let s = this;
		if (s._nativeShortCutTex)
			s._nativeShortCutTex.dispose();
		s._nativeShortCutTex = new egret.Texture;
		s._nativeShortCutTex.bitmapData = new egret.BitmapData(e.currentTarget);
		if (s._completeHide) {
			s.stop();
			s._completeHide = false;
		}
		if (s._cutCompFunc != null) {
			s._cutCompFunc.call(s._cutCompThis);
		}
	}
	public getNativeShortCut(): egret.Texture {
		return this._nativeShortCutTex;
	}
	private videoVolumeCall(d): void {
		let s = this;
		if (d && d.data) {
			let type: number = d.data.operType;
			if (type == 3 || type == 2) {
				s._nativeVolume = d.data.volume;
			}
		}
	}

	private videoNativeOperCall(d: any): void {
		let s = this;
		if (d && d.data) {
			Log.writeLog("VIDEO_收到操作通知：" + d.data.uid + "-" + s.uid + "-" + d.data.operType);
			if (s.uid != d.data.uid) return;
			let type: number = d.data.operType;
			if (type == 4) {//截屏返回
				s.shortCutLoaded();
			}
			else if (type == 2) {//暂停
				s._nativeCurrentTime = d.data.seek;
			}
		}
	}
	private videoNativeCall(d: any): void {
		let s = this;
		if (d && d.data) {
			// if(s.uid != d.data.uid)return;
			let type: number = d.data.callType;
			let url: string = d.data.url;
			if (s._nativeUrl == null || s._nativeUrl.indexOf(url)==-1) return;
			if (!GameManager.getInstance().showView) return;
			if (type == 2) {//进度更新				
				if (s._ended) return;
				if (s._seek > 0) {
					if (Math.abs(d.data.currentTime - s._seek * 1000) > 1000) return;
					s._seek = 0;
				}
				if(Browser.onIOS)//ios在暂停的情况下拖动进度会自动播放，所以状态不能是停止，android不会，状态可以保持停止，并且要主动调一下更新进度，因为android有bug只会偶尔触发一次进度更新
					s._nativePaused = false;
				else
				{
					if(s._nativePaused)
					{
						if (s._updateFunc != null) {
							s._updateFunc.call(s._updateThis);
						}
					}
				}
				
				s.nativeWaitUpdate = false;
				let dis:number;
				let curTime:number;
				curTime = s.position * 1000;
				dis = curTime - d.data.currentTime;
				if(dis > 0 && dis < 3000)
				{					
					if(s._nativeTimeTick == s._nativeTimeTick)
						s._nativeCurrentTime = curTime;
					s._nativeTimeSpeed = 0.625 - dis * 0.000125;
				}					
				else
				{
					s._nativeTimeSpeed = 1;
					s._nativeCurrentTime = d.data.currentTime;					
				}
				s._nativeTimeTick = Date.now();
				s._nativeDuration = d.data.duration / 1000;
				
				Log.writeLog("VIDEO_进度更新：currentTime:" + d.data.currentTime + ",duration:" + d.data.duration + ",timeSpeed:" + s._nativeTimeSpeed + "position:"+s.position);
				if (!s._nativeReady) {// && s._nativeCurrentTime > 1000
					s._nativeReady = true;
					if (s._nativeState == 1)//播放
					{
						s._nativeState = 0;
						s.play();
					}
					else if (s._nativeState == 2 || !s._autoPlay)//暂停
					{
						s._nativeState = 0;
						s.pause();
					}
					Log.writeLog("VIDEO_视频就绪!duration:" + s._nativeDuration);
					if (s._canplayFunc != null) {
						s._canplayFunc.call(s._canplayThis);
					}
				}

			}
			else if (type == 3) {//播放结束
				Log.writeLog("VIDEO_播放完成：duration," + d.data.duration);
				s._ended = true;
				s._url = null;
				s.urlSet(null);
				if (s._endFunc != null) {
					s._endFunc.call(s._endThis);
				}
				s._nativePaused = true;
			}
			else if (type == 4) {//缓冲等待
				if (s._waitingFunc != null) {
					s._waitingFunc.call(s._waitingThis);
				}
				s._nativePaused = true;
				s.nativeWaitUpdate = true;
				Log.writeLog("VIDEO_缓冲等待：currentTime," + d.data.currentTime);
			}
		}
	}

	public dispose(): void {
		super.dispose();
		let s = this;
		GYLite.GYSprite.stage.removeEventListener(egret.Event.RESIZE, s.resize, s);
		s.removeEventListener(egret.Event.ADDED_TO_STAGE, s.addToStage, s);
		s.listenEnd(null, null);
		s.listenCanplay(null, null);
		s.listenUpdate(null, null);
		s.disposeVideo();
	}
}