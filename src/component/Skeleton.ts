class Skeleton extends GYLite.GYSprite {
	private static _inited: boolean;
	private static _mTime: number;
	private static _gapTime: number;
	public static MAIN: string = "main";
	// public static init(): void {
	// 	if (!Skeleton._inited)
	// 		GYLite.CommonUtil.addStageLoop(Skeleton.dragonLoop, dragonBones.WorldClock.clock);
	// }
	// private static dragonLoop(currentTime): void {
	// 	//dragonBones.WorldClock.clock.advanceTime(0.01);
	// 	Skeleton._gapTime = currentTime - Skeleton._mTime;
	// 	Skeleton._mTime = currentTime;
	// 	dragonBones.WorldClock.clock.advanceTime(Skeleton._gapTime / 1000);
	// }
	public static destroyModuleSk(): void {
		let factory: any;
		let dict: any;
		let key: any, data: any;
		let atlasData: dragonBones.TextureAtlasData;
		let i: number, len: number, j: number, len2: number;
		let arr: Array<any>, delArr: Array<any>;
		delArr = [];
		factory = dragonBones.EgretFactory.factory;
		arr = factory.clock._animatebles;
		len = arr.length;
		for (i = 0; i < len; ++i) {
			if (arr[i]) {
				if (arr[i].moduleOwner == Skeleton.MAIN) continue;
				if(arr[i].moduleOwner == null)continue;
				data = UIControl.getInstance().getUIData(arr[i].moduleOwner);
				if (data.loaded == UICtrlData.STATE_UNLOAD)
					arr[i].dispose();
			}
		}

		// arr = (<any>dragonBones.WorldClock.clock)._animatebles;
		// len = arr.length;
		// for (i = 0; i < len; ++i) {

		// 	if (arr[i]) {
		// 		if (arr[i].moduleOwner == Skeleton.MAIN) continue;
		// 		data = UIControl.getInstance().getUIData(arr[i].moduleOwner);
		// 		if (data.loaded == UICtrlData.STATE_UNLOAD)
		// 			if (arr[i].owner) arr[i].owner.dispose();
		// 	}
		// }

		dict = factory._textureAtlasDataMap;
		for (key in dict) {
			if (dict[key].moduleOwner == Skeleton.MAIN) continue;
			if(dict[key].moduleOwner == null)continue;
			data = UIControl.getInstance().getUIData(dict[key].moduleOwner);
			if (data.loaded == UICtrlData.STATE_UNLOAD) {
				delArr.push(key);
			}
		}
		len = delArr.length;
		for (i = 0; i < len; ++i) {
			arr = dict[delArr[i]];
			len2 = arr.length;
			for (j = 0; j < len2; ++j) {
				factory._dragonBones.bufferObject(arr[j]);
			}
			delete dict[delArr[i]];
		}
		delArr.length = 0;
		dict = factory._dragonBonesDataMap;
		for (key in dict) {
			if (dict[key].moduleOwner == Skeleton.MAIN) continue;
			if(dict[key].moduleOwner == null)continue;
			data = UIControl.getInstance().getUIData(dict[key].moduleOwner);
			if (data.loaded == UICtrlData.STATE_UNLOAD) {
				delArr.push(key);
			}
		}
		len = delArr.length;
		for (i = 0; i < len; ++i) {
			factory._dragonBones.bufferObject(dict[delArr[i]]);
			delete dict[delArr[i]];
		}
	}
	private _display: any;
	private _dragonbonesData: any;
	private _boneData: dragonBones.DragonBonesData
	private _atlasData: dragonBones.TextureAtlasData[];
	private _textureData: any;
	private _texture: egret.Texture;
	public _armature: dragonBones.Armature;
	private _boneName: string;
	private _aramtureName: string;
	private _endFunc: Function;
	private _endObject: any;
	private _completeEndFunc: Function;
	private _completeEndObject: any;
	private _sound: string;
	private _endAct: string;
	private _soundEndCallBack: Function;
	private _soundEndObject: any;
	// private _parent: any;
	// private _initX: number;
	// private _initY: number;
	private _curActionName: string;
	private _timeScale: number;
	private _archorX: number;
	private _archorY: number;

	private _movieClip: egret.MovieClip;
	private _mcScale: number = 1;
	private _mcData: any;
	private _mcTeX: any;
	private _mcFrameRate: number;

	public constructor() {
		super();
		// Skeleton.init();
		let s = this;
		s._timeScale = 1;
		s._archorX = s._archorY = 0;
	}
	public get display(): any {
		return this._display;
	}
	public setModuleOwner(val: string): void {
		let s = this;
		if (s._armature)
			s._armature["moduleOwner"] = val;
		if (s._atlasData)
			s._atlasData["moduleOwner"] = val;
		if (s._boneData)
			s._boneData["moduleOwner"] = val;
	}
	// public setDataByName(bName: string, skPath: string = "", boneName: string = null): void {
	// 	let s = this;
	// 	s.setData(Main.instance.getDataRes(skPath + bName + "_ske.json"), Main.instance.getDataRes(skPath + bName + "_tex.json"), Main.instance.getRes(skPath + bName + "_tex.png"), boneName ? boneName : bName);
	// }
	/**
 * bName:龙骨文件和帧动画文件前缀名称，导出时要统一命名
 * skPath:放置龙骨动画文件的文件夹路径
 * boneName:龙骨动画名称
 * armatureName:龙骨动画骨架名称
 * movieClipScale:帧动画缩放大小，有些帧动画导出时为了减小贴图大小，会缩放导出比例，显示的时候会比骨骼动画小，所以需要手动放大以达到骨骼动画的大小
 */
	public setDataByName(bName: string, skPath: string = "", boneName: string = null, armatureName: string = null, movieClipScale: number = 1): void {
		let s = this;
		let forceSk: boolean;
		let pathStr;
		if (GameManager.getInstance().deviceVer != "") {
			pathStr = skPath.replace("skeleton", "framesAnimation");
			forceSk = !Main.instance.hasDataRes(pathStr + bName + "_mc.json");
		}
		if (GameManager.getInstance().deviceVer == "" || forceSk) {
			//使用骨骼动画
			s.setData(Main.instance.getDataRes(
				skPath + bName + "_ske.json"),
				Main.instance.getDataRes(skPath + bName + "_tex.json"),
				Main.instance.getRes(skPath + bName + "_tex.png"), boneName ? boneName : bName, armatureName
			);
		}
		else {
			//使用帧动画			
			s.setMovieClipData(
				Main.instance.getDataRes(pathStr + bName + "_mc.json"),
				Main.instance.getRes(pathStr + bName + "_tex.png"), boneName ? boneName : bName, movieClipScale);
		}
	}
	/**
	 * bName:龙骨名称
	 * armatureName:骨架名称，骨架名称和龙骨名称一致时，可以只传bName
	 */
	public setData(dragonData: any, textureData: any, tex: egret.Texture, bName: string, armatureName: string = null): void {
		let s = this;
		if (dragonData == null || textureData == null || tex == null) {
			console.error("龙骨资源不能为空！");
			return;
		}
		// let readd: boolean = false;
		// if (s._display && s._display.parent) {
		// 	readd = true;
		// }
		s.clear();
		s._dragonbonesData = dragonData;
		s._textureData = textureData;
		s._texture = tex;
		let egretFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
		let curUI: ModuleBase, url: string;
		curUI = UIControl.getInstance().curUI;
		url = curUI ? curUI.url : Skeleton.MAIN;
		//往龙骨工厂里添加资源
		s._boneData = egretFactory.getDragonBonesData(bName);
		if (s._boneData == null) {
			s._boneData = egretFactory.parseDragonBonesData(s._dragonbonesData, bName);
		}
		s._boneData["moduleOwner"] = url;
		s._atlasData = egretFactory.getTextureAtlasData(bName);
		if (s._atlasData == null) {
			egretFactory.parseTextureAtlasData(s._textureData, s._texture, bName);
		}
		s._atlasData = egretFactory.getTextureAtlasData(bName);
		s._atlasData["moduleOwner"] = url;
		s._boneName = bName;
		s._aramtureName = armatureName;
		//不同龙骨文件骨架名称可能会一样，加上龙骨文件名称，避免错误
		if (s._aramtureName) {
			s._display = egretFactory.buildArmatureDisplay(s._aramtureName, s._boneName);
		}
		else {
			//如果不传骨架名称，默认为龙骨名称就是骨架名称
			s._display = egretFactory.buildArmatureDisplay(s._boneName);
			if (!s._armature) {
				Log.writeLog("不存在Aramture名称为：" + s._boneName + "的龙骨动画,需要指定一个正确骨架名称", Log.WARN);
			}
		}
		s._armature = s._display.armature;
		s._armature["moduleOwner"] = url;
		s._armature["owner"] = s;
		s._armature.animation.timeScale = s._timeScale;
		s._armature.eventDispatcher.addDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, s.skEnd, s);
		s._armature.eventDispatcher.addDBEventListener(dragonBones.EventObject.COMPLETE, s.completeEndCall, s);
		s._display = s._armature.display;
		s._display.x = -s._archorX;
		s._display.y = -s._archorY;
		s.addChild(s._display);
		// if (readd) {
		// 	s.show(s._parent, s._initX, s._initY);
		// }
		// dragonBones.WorldClock.clock.add(s._armature);
	}
	public setMovieClipData(_mcData: any, _mcTexture: any, _mcName: string, _scale: number): void {
		let s = this;
		if (_mcData == null || _mcTexture == null) {
			console.error("帧动画数据不能为空！");
			return;
		}
		// let readd: boolean = false;
		// if (s._display && s._display.parent) {
		// 	readd = true;
		// }
		s.clear();
		s._mcData = _mcData;
		s._mcTeX = _mcTexture;
		var mcDataFactory = new egret.MovieClipDataFactory(_mcData, _mcTexture);
		var mcData = mcDataFactory.generateMovieClipData(_mcName);
		var role: egret.MovieClip = new egret.MovieClip(mcData);
		s._display = role;
		s._movieClip = s.display;
		s.scale(_scale, _scale);
		s._mcScale = _scale;
		s._display.addEventListener(egret.Event.LOOP_COMPLETE, s.skEnd, s);
		s._display.addEventListener(egret.Event.COMPLETE, s.completeEndCall, s);
		s._display.x = -s._archorX;
		s._display.y = -s._archorY;
		s._mcFrameRate = mcData.frameRate;
		s.addElement(s._display);
		// if (readd) {
		// 	s.show(s._parent, s._initX, s._initY);
		// }
	}
	public scale(sx: number, sy: number): void {
		let s = this;
		if (!s._display) return;
		if (s._movieClip) {
			sx *= s._mcScale;
			sy *= s._mcScale;
		}
		s._display.scaleX = sx;
		s._display.scaleY = sy;
	}
	public set scaleX(val: number) {
		let s = this;
		if (!s._display) return;
		if (s._movieClip) {
			val *= s._mcScale;
		}
		s._display.scaleX = val;
	}
	public get scaleX(): number {
		let s = this;
		let val = s._display.scaleX;
		if (s._movieClip) {
			val = s._display.scaleX / s._mcScale;
		}
		return val;
	}
	public set scaleY(val: number) {
		let s = this;
		if (!s._display) return;
		if (s._movieClip) {
			val *= s._mcScale;
		}
		s._display.scaleY = val;
	}
	public get scaleY(): number {
		let s = this;
		let val = s._display.scaleY;
		if (s._movieClip) {
			val = s._display.scaleY / s._mcScale;
		}
		return val;
	}
	public set alpha(val: number) {
		let s = this;
		if (!s._display) return;
		s._display.alpha = val;
	}
	public get alpha(): number {
		let s = this;
		return s._display ? s._display.alpha : 1;
	}
	// public set x(val:number) {
	// 	let s = this;
	// 	if (!s._display) return;
	// 	s._display.x = val;
	// }
	// public get x(): number {
	// 	let s = this;
	// 	return s._display? s._display.x:0;
	// }
	// public set y(val: number) {
	// 	let s = this;
	// 	if (!s._display) return;
	// 	s._display.y = val;
	// }
	// public get y(): number {
	// 	let s = this;
	// 	return s._display ? s._display.y : 0;
	// }
	public get boneName(): string {
		return this._boneName;
	}
	public get curActionName(): string {
		return this._curActionName;
	}
	private skEnd(e: egret.Event): void {
		let s = this;
		if (s._endFunc != null) {
			s._endFunc.call(s._endObject, this);
		}
		if (s._sound == null && s._endAct) {
			s.gotoAndPlay(s._endAct, 0);
			s._endAct = null;
		}
	}
	//添加动画最后一次循环结束时间监听
	public addAnimationCompleteListener(_fun: Function, obj: any) {
		let s = this;
		s._completeEndFunc = _fun;
		s._completeEndObject = obj;
	}

	//移除动画最后一次循环结束时间监听
	public removeAnimationCompleteListener() {}
	
	private completeEndCall(e: egret.Event): void {
		let s = this;
		/**在这里派发一个loop_complete事件：帧动画播放最后一次底层是没有派发这个事件的 */
		if (s._movieClip) {
			s._movieClip.dispatchEvent(new egret.Event(dragonBones.EventObject.LOOP_COMPLETE));
		}

		if (s._completeEndFunc != null) {
			let fun = s._completeEndFunc;
			let funObj = s._completeEndObject;
			s._completeEndFunc = null;
			s._completeEndObject = null;
			fun.call(funObj, this);
		}
	}
	/**调整速度百分比
	 * @param val 速度百分比，默认是1 例如2，就是两倍
	*/
	public setTimeScale(val: number): void {
		let s = this;
		if (s._armature) {
			s._timeScale = val;
			s._armature.animation.timeScale = s._timeScale;
		} else if (s._movieClip) {
			s._movieClip.frameRate = val * s._mcFrameRate;
		}
	}
	public dispose(): void {
		let s = this;
		s.clear(true);
		super.dispose(true, false, false);
		// s._parent = null;
	}
	private clear(remove: boolean = false): void {
		let s = this;
		if (s._display && s._display.parent) {
			// if ((<any>s._display.parent).removeElement)
			// 	(<any>s._display.parent).removeElement(s._display);
			// else
				(<any>s._display.parent).removeChild(s._display);
		}
		if (remove)
			s.hide();
		s._display = null;
		if (s._armature) {
			s._armature["moduleOwner"] = s._armature["owner"] = null;
			// dragonBones.WorldClock.clock.remove(s._armature);
			s._armature.eventDispatcher.removeDBEventListener(dragonBones.EventObject.LOOP_COMPLETE, s.skEnd, s);
			s._armature.eventDispatcher.removeDBEventListener(dragonBones.EventObject.COMPLETE, s.completeEndCall, s);
			s._armature.dispose();
			s._armature = null;
		}
		if (s._dragonbonesData) {
			dragonBones.EgretFactory.factory.removeDragonBonesData(s._boneName);
			s._boneData["moduleOwner"] = null;
			s._boneData = s._dragonbonesData = null;
		}
		if (s._textureData) {
			dragonBones.EgretFactory.factory.removeTextureAtlasData(s._boneName);
			s._atlasData["moduleOwner"] = null;
			s._atlasData = s._textureData = null;
		}
		if (s._soundEndCallBack != null) {
			s._soundEndCallBack = null;
			s._soundEndObject = null;
		}
		if (s._sound) {
			SoundManager.instance.stop(s._sound);
		}
		s._textureData = null;
		s._texture = null;

		//清空帧动画数据		
		if (s._movieClip) {
			s._movieClip.removeEventListener(egret.Event.LOOP_COMPLETE, s.skEnd, s);			
			s._movieClip.removeEventListener(egret.Event.COMPLETE, s.completeEndCall, s);
			s._movieClip.stop();
		}
		if (s._mcData) {
			s._mcData = null;
		}
		if (s._mcTeX) {
			s._mcTeX = null;
		}
		s._mcScale = 1.0;
	}

	public gotoAndPlay(actionName: string, playTimes: number = 1, sound: string = null, endAct: string = null, soundEndCall: Function = null, soundThisObject: any = null,soundType:number=1): void {
		let s = this;
		s._curActionName = actionName;
		s._sound = sound;
		s._endAct = endAct;
		s._soundEndCallBack = soundEndCall;
		s._soundEndObject = soundThisObject;

		//判断播放骨骼动画还是帧动画
		if (s._armature) {
			// if (s._armature.clock == null)
			// 	dragonBones.WorldClock.clock.add(s._armature);
			s._armature.animation.play(actionName, playTimes);
		} else if (s._movieClip) {
			s._movieClip.gotoAndPlay(actionName, playTimes);
		}

		if (s._sound) {
			SoundManager.instance.play(s._sound, 0, 1, s.soundEnd, s,soundType);
		}
	}
	private soundEnd(): void {
		let s = this;
		let func:Function,obj:any;
		func = s._soundEndCallBack;
		obj = s._soundEndObject;
		if (s._endAct) {
			s.gotoAndPlay(s._endAct, 0);
			s._endAct = null;
		}
		if (func != null) {
			func.call(obj);			
		}		
	}
	/**停止动画
	 * @param actionName 为null则停止所有动画
	 * @param removeFromClock 是否从绘制时钟里面移除 
	*/
	public stop(actionName: string = null, removeFromClock: boolean = true): void {
		let s = this;
		if (s._armature) {
			s._armature.animation.stop(actionName);
			if (removeFromClock)
				s._armature.clock = null;
		} else if (s._movieClip) {
			s._movieClip.stop();
		}
	}

	public show(pr: any, toX: number = 0, toY: number = 0): void {
		let s = this;		
		if (pr.addElement != null)
			pr.addElement(s);
		else
			pr.addChild(s);
		s.x = toX;
		s.y = toY;
	}
	public hide(): void {
		let s = this;		
		if (s.parent) {
			if ((<any>s.parent).removeElement)
				(<any>s.parent).removeElement(this);
			else
				(<any>s.parent).removeChild(this);
		}
	}

	public setPlayEnd(func: Function, thisObject: any): void {
		let s = this;
		s._endFunc = func;
		s._endObject = thisObject;
	}
	public clearPlayEnd() {
		let s = this;
		if (s._endFunc) {
			s._endFunc = null;
			s._endObject = null;
		}
	}
	public set archorX(val: number) {
		let s = this;
		s._archorX = val;
		if (s._display)
			s._display.x = -s._archorX;
	}
	public set archorY(val: number) {
		let s = this;
		s._archorY = val;
		if (s._display)
			s._display.y = -s._archorY;
	}
	public get archorY(): number {
		return this._archorY;
	}
	public get archorX(): number {
		return this._archorX;
	}
}