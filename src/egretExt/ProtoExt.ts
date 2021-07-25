class ProtoExt {
    public static initAudioContext:Function;
	public constructor() {
	}
    public static resumeAudioContext():void
    {
        let web = egret["web"];
        if (web.WebAudioDecode.ctx) {
            try {
                web.WebAudioDecode.ctx.close();
            }
            catch (e) {
            }
        }
        web.WebAudioDecode.ctx = new (window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"])();
    }
	// private static _armatureVec:Array<dragonBones.Armature>;
	public static inject():void
	{
		let p:any;
        if(window["FormData"] == null)
        {
            Log.writeLog("FormData is null");
            window["FormData"] = (function(){
                function FormData(){}
                FormData.prototype.append = function(key, value){
                    this[key] = value;
                } 
                return FormData;
            }
            )();
        }                       
        p = dragonBones.EgretFactory.prototype;
		p._buildArmature = function (dataPackage) {
            var armature = dragonBones.BaseObject.borrowObject(dragonBones.Armature);
            var armatureDisplay = new dragonBones.EgretArmatureDisplay();
            (<any>armature).init(dataPackage.armature, armatureDisplay, armatureDisplay, this._dragonBones);
			armature["moduleOwner"] = UIControl.getInstance().curURL?UIControl.getInstance().curURL:"main";
            return armature;
        };
		p.addTextureAtlasData = function (data, name) {
            if (name === void 0) { name = null; }
            name = name !== null ? name : data.name;
            var textureAtlasList = (name in this._textureAtlasDataMap) ? this._textureAtlasDataMap[name] : (this._textureAtlasDataMap[name] = []);
            if (textureAtlasList.indexOf(data) < 0) {
                textureAtlasList.push(data);
            }
			textureAtlasList["moduleOwner"] = UIControl.getInstance().curURL?UIControl.getInstance().curURL:"main";
        };
		p.addDragonBonesData = function (data, name) {
            if (name === void 0) { name = null; }
            name = name !== null ? name : data.name;
            if (name in this._dragonBonesDataMap) {
                if (this._dragonBonesDataMap[name] === data) {
                    return;
                }
                console.warn("Can not add same name data: " + name);
                return;
            }
            this._dragonBonesDataMap[name] = data;
			data["moduleOwner"] = UIControl.getInstance().curURL?UIControl.getInstance().curURL:"main";
        };
        // p = <any>GYLite.GYSprite.prototype;
        // p.$hitTest = function (stageX, stageY) {
        //     let self = this;
        //     if(self["outlineHit"])//GYLite 判断是否使用轮廓判断
        //     {                        
        //         if(GYLite.PositionUtil.isPointInShape(stageX,stageY,(<IOutline><any>self).getGlobalOutline()))
        //         {
        //             return true;
        //         } 
        //         return false;         
        //     }
        //     var target = egret.DisplayObjectContainer.prototype.$hitTest.call(this, stageX, stageY);
        //     return target;            
        // };       
        
        p = egret.Sprite.prototype;
        p.$hitTest = function (stageX, stageY) {
            //GYLite 增加穿透判断，优化掉完全不需要碰撞检测的对象
            if (!this.$visible || this.mouseThrough) {
                return null;
            }            
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            if(this["outlineHit"])//GYLite 判断是否使用轮廓判断
            {               
                if(GYLite.PositionUtil.isPointInShape(localX,localY,(<IOutline><any>this).outline))
                {
                    return this;
                } 
                return null;         
            }
            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;            
            //GYLite 加上矩形标志
            var tempTarget;
            if (rect) {
                if (!rect.contains(localX, localY))
                    return null;
                else if (this.rectHit)
                    tempTarget = this;
            }
            else if (this.rectHit) {
                if (!(localX < 0 || localX > this.width || localY < 0 || localY > this.height))
                    tempTarget = this;
            }
            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            var children = this.$children;
            var found = false;
            var target = null;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            if (tempTarget)
                target = tempTarget;
            else {
                target = egret.DisplayObject.prototype.$hitTest.call(this, stageX, stageY);
                if (target) {
                    target = this.$graphics.$hitTest(stageX, stageY);
                }
            }
            return target;
        }; 

        //获取帧频耗费时间
        p = egret.sys.SystemTicker.prototype;
        p.render = function (triggerByFrame, costTicker) {
			var playerList = this.playerList;
			var length = playerList.length;
			var t;
			if (length == 0) {
				return;
			}
			t = Date.now();
			this.callLaters();
			if (egret.sys.$invalidateRenderFlag) {
				this.broadcastRender();
				egret.sys.$invalidateRenderFlag = false;
			}
			for (var i = 0; i < length; i++) {
				playerList[i].$render(triggerByFrame, costTicker);
			}
			egret.sys.$requestRenderingFlag = false;
			Log.costRender = Date.now() - t;
            Log.costTicker = costTicker;
		};       
	}
}