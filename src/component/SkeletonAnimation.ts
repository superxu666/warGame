class SkeletonAnimation extends GYLite.GYSprite {
	private static _inited: boolean;
	private static _mTime: number;
	private static _gapTime: number;
	// public static init(): void {
	// 	if (!SkeletonAnimation._inited)
	// 		SkeletonAnimation._mTime = egret.getTimer();
	// 		GYLite.CommonUtil.addStageLoop(SkeletonAnimation.dragonLoop, dragonBones.WorldClock.clock);
	// }
	// private static dragonLoop(currentTime): void {
	// 	SkeletonAnimation._gapTime = currentTime - SkeletonAnimation._mTime;
	// 	SkeletonAnimation._mTime = currentTime;
	// 	dragonBones.WorldClock.clock.advanceTime(SkeletonAnimation._gapTime / 1000);
	// }
	private _display: any;
	private _dragonbonesData: any;
	private _textureData: any;
	private _texture: egret.Texture;
	private _armature: dragonBones.Armature;
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
	private _timeScale:number;

	private _movieClip:egret.MovieClip;
	private _mcData:any;
	private _mcTeX:any;
	private _mcFrameRate:number;

	public constructor() {
		super();
		// SkeletonAnimation.init();
		let s= this;
		s._timeScale = 1;
	}
	public get display():any
	{
		return this._display;
	}
	/**
	 * bName:龙骨文件和帧动画文件前缀名称，导出时要统一命名
	 * skPath:放置龙骨动画文件的文件夹路径
	 * mcPath:放置帧动画文件的文件夹路径
	 * boneName:龙骨动画名称
	 * armatureName:龙骨动画骨架名称
	 * movieClipName:帧动画名称，生成帧动画时需要使用，默认与导出的帧动画文件名前缀一致
	 * movieClipScale:帧动画缩放大小，有些帧动画导出时为了减小贴图大小，会缩放导出比例，显示的时候会比骨骼动画小，所以需要手动放大以达到骨骼动画的大小
	 */
	public setDataByName(bName: string, skPath: string = "", mcPath: string = null, boneName: string = null, armatureName:string = null, movieClipName:string = null, movieClipScale:number=1): void {
		let s = this;
		if (egret.Capabilities.renderMode === "webgl" || egret.Capabilities.runtimeType === egret.RuntimeType.NATIVE) {
			//使用骨骼动画
			s.setData(Main.instance.getDataRes(
				skPath + bName + "_ske.json"), 
				Main.instance.getDataRes(skPath + bName + "_tex.json"), 
				Main.instance.getRes(skPath + bName + "_tex.png"), bName, armatureName
			);
		} 
		else 
		{
			//使用帧动画
			s.setMovieClipData(
				Main.instance.getDataRes(mcPath + bName + "_mc.json"), 
				Main.instance.getRes(mcPath + bName + "_tex.png"), movieClipName? movieClipName:bName, movieClipScale);
		}
	}
	public setMovieClipData(_mcData: any, _mcTexture: any, _mcName: string, _scale:number): void {
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
		s._display.addEventListener(egret.Event.LOOP_COMPLETE, s.skEnd, s);
		s._mcFrameRate = mcData.frameRate;
		s.addElement(s._display);
		// if (readd) {
		// 	s.show(s._parent, s._initX, s._initY);
		// }
	}
	public setData(dragonData: any, textureData: any, tex: egret.Texture, bName: string, armatureName:string): void {
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
		//往龙骨工厂里添加资源
		if (egretFactory.getDragonBonesData(bName) == null)
			egretFactory.parseDragonBonesData(s._dragonbonesData, bName);
		if (egretFactory.getTextureAtlasData(bName) == null)
			egretFactory.parseTextureAtlasData(s._textureData, s._texture, bName);
		s._boneName = bName;
		s._aramtureName = armatureName;
		//不同龙骨文件骨架名称可能会一样，加上龙骨文件名称，避免错误
		s._armature = egretFactory.buildArmature(s._aramtureName, s._boneName)
		s._armature.animation.timeScale = s._timeScale;		
		s._display = s._armature.display;
		s._display.addEventListener(dragonBones.EventObject.LOOP_COMPLETE, s.skEnd, s);
		s.addElement(s._display);
		// dragonBones.WorldClock.clock.add(s._armature);
		// if (readd) {
		// 	s.show(s._parent, s._initX, s._initY);
		// }
	}
	public scale(sx: number, sy: number): void {
		let s = this;
		if (!s._display) return;
		s._display.scaleX = sx;
		s._display.scaleY = sy;
	}
	public set scaleX(val: number) {
		let s = this;
		if (!s._display) return;
		s._display.scaleX = val;
	}
	public get scaleX(): number {
		let s = this;
		return s._display ? s._display.scaleX : 1;
	}
	public set scaleY(val: number) {
		let s = this;
		if (!s._display) return;
		s._display.scaleY = val;
	}
	public get scaleY(): number {
		let s = this;
		return s._display ? s._display.scaleY : 1;
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
	public set x(val:number) {
		let s = this;
		if (!s._display) return;
		s._display.x = val;
	}
	public get x(): number {
		let s = this;
		return s._display? s._display.x:0;
	}
	public set y(val: number) {
		let s = this;
		if (!s._display) return;
		s._display.y = val;
	}
	public get y(): number {
		let s = this;
		return s._display ? s._display.y : 0;
	}
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
	public addAnimationCompleteListener(_fun:Function, obj:any) {
		let s = this;
		s._completeEndFunc = _fun;
		s._completeEndObject = obj;
		if(s._armature) {
			s._armature.display.addEventListener(dragonBones.EventObject.COMPLETE, s.completeEndCall, s);
		} else if(s._movieClip) {
			s._movieClip.addEventListener(egret.Event.COMPLETE, s.completeEndCall, s);
		}
	}
	//移除动画最后一次循环结束时间监听
	public removeAnimationCompleteListener() {
		let s = this;
		if (s._armature) {
			s._armature.display.removeEventListener(dragonBones.EventObject.COMPLETE, s.completeEndCall, s);
		} else if (s._movieClip) {
			s._movieClip.removeEventListener(egret.Event.COMPLETE, s.completeEndCall, s);
		}
	}
	private completeEndCall(e: egret.Event): void {
		let s = this;
		if (s._completeEndFunc != null) {
			s._completeEndFunc.call(s._completeEndObject, this);
		}
	}
	/**调整速度百分比
	 * @param val 速度百分比，默认是1 例如2，就是两倍
	*/
	public setTimeScale(val:number):void
	{
		let s = this;
		if(s._armature)
		{
			s._timeScale = val;
			s._armature.animation.timeScale = s._timeScale;
		} else if(s._movieClip) {
			s._movieClip.frameRate = val * s._mcFrameRate;
		}
	}
	public dispose(): void {
		let s = this;
		s.clear();
		//s._parent = null;
	}
	private clear(): void {
		let s = this;
		// if (s._display && s._display.parent) {
		// 	s._display.parent.removeChild(s._display);
		// 	s._display = null;
		// }
		s.hide();
		if (s._armature) {
			// dragonBones.WorldClock.clock.remove(s._armature);

			s._armature.display.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, s.skEnd, s);
			s._armature.dispose();
		}
		if (s._dragonbonesData) {
			dragonBones.EgretFactory.factory.removeDragonBonesData(s._boneName);
			s._dragonbonesData = null;
		}
		if (s._textureData) {
			dragonBones.EgretFactory.factory.removeTextureAtlasData(s._boneName);
			s._textureData = null;
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
		if(s._movieClip) {
			s._armature.display.removeEventListener(dragonBones.EventObject.LOOP_COMPLETE, s.skEnd, s);
			s._movieClip.stop();
		}
		if(s._mcData) {
			s._mcData = null;
		}
		if(s._mcTeX) {
			s._mcTeX = null;
		}
	}

	public gotoAndPlay(actionName: string, playTimes: number = 1, sound: string = null, endAct: string = null, soundEndCall: Function = null, soundThisObject: any = null): void {
		let s = this;
		s._curActionName = actionName;
		s._sound = sound;
		s._endAct = endAct;
		s._soundEndCallBack = soundEndCall;
		s._soundEndObject = soundThisObject;

		//判断播放骨骼动画还是帧动画
		if(s._armature) {
			s._armature.animation.play(actionName, playTimes);
		} else if(s._movieClip) {
			s._movieClip.gotoAndPlay(actionName, playTimes);
		}

		if (s._sound) {
			SoundManager.instance.play(s._sound, 0, 1, s.soundEnd, s);
		}
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
	public stop(actionName: string): void {
		let s = this;
		if(s._armature) {
			s._armature.animation.stop(actionName)
		} else if(s._movieClip) {
			s._movieClip.stop();
		}
	}

	public show(pr: any, toX: number = 0, toY: number = 0): void {
		// let s = this;
		// if (!s._display) return;
		// s._parent = pr;
		// s._initX = toX;
		// s._initY = toY;
		// pr.addChild(s._display)
		// s._display.x = toX;
		// s._display.y = toY;

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
		// if (s._display && s._display.parent) {
		// 	(<any>s._display.parent).removeChild(this);
		// }
		if (s._display && s._display.parent) {
			if ((<any>s._display.parent).removeElement)
				(<any>s._display.parent).removeElement(this);
			else
				(<any>s._display.parent).removeChild(this);
		}
	}

	public setPlayEnd(func: Function, thisObject: any): void {
		let s = this;
		s._endFunc = func;
		s._endObject = thisObject;
	}
	public clearPlayEnd() {
		let s = this;
		if(s._endFunc) {
			s._endFunc = null;
			s._endObject = null;
		}
	}
}