var __reflect=this&&this.__reflect||function(t,e,n){t.__class__=e,n?n.push(e):n=[e],t.__types__=t.__types__?n.concat(t.__types__):n},__extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);n.prototype=e.prototype,t.prototype=new n},login;!function(t){var e=function(){function t(){}return t.sound="login/sound/",t.atlas="login/img/ui.png",t.skeleton="login/skeleton/",t.img="login/img/",t.fireClip="login/img/war_fire_clips.png",t}();t.Conf=e,__reflect(e.prototype,"login.Conf")}(login||(login={}));var login;!function(t){var e=function(e){function n(){return e.call(this)||this}return __extends(n,e),n.prototype.modulePreStart=function(){var n=this;e.prototype.modulePreStart.call(this),n.back=SkinManager.createImage(n,0,0,t.Conf.img+"rms_login_bg.jpg"),n.back.left=n.back.right=n.back.top=n.back.bottom=0,n.leftTopBtn=SkinManager.createBtn2(n,0,0,["rms_btn_bg_3"],t.Conf.atlas),n.leftTopBtn.y=-LayerManager.getInstance().gameSpriteTop,n.leftTopBtn.x=-LayerManager.getInstance().gameSpriteLeft,n.leftTopBtn.label="y:"+n.leftTopBtn.y,n.rightTopBtn=SkinManager.createBtn2(n,0,0,["rms_btn_bg_3"],t.Conf.atlas),n.rightTopBtn.y=-LayerManager.getInstance().gameSpriteTop,n.rightTopBtn.x=n.width+LayerManager.getInstance().gameSpriteLeft-n.rightTopBtn.width,n.rightTopBtn.label="y:"+n.rightTopBtn.y,n.leftBottomBtn=SkinManager.createBtn2(n,0,0,["rms_btn_bg_3"],t.Conf.atlas),n.leftBottomBtn.y=n.height+LayerManager.getInstance().gameSpriteTop-n.leftBottomBtn.height,n.leftBottomBtn.x=-LayerManager.getInstance().gameSpriteLeft,n.leftBottomBtn.label="y:"+n.leftBottomBtn.y,n.rightBottomBtn=SkinManager.createBtn2(n,0,0,["rms_btn_bg_3"],t.Conf.atlas),n.rightBottomBtn.y=n.height+LayerManager.getInstance().gameSpriteTop-n.rightBottomBtn.height,n.rightBottomBtn.x=n.width+LayerManager.getInstance().gameSpriteLeft-n.rightBottomBtn.width,n.rightBottomBtn.label="y:"+n.rightBottomBtn.y;var o=new egret.MovieClipDataFactory(Main.instance.getDataRes(t.Conf.img+"war_fire_clips.json"),Main.instance.getRes("war_fire_clips",t.Conf.fireClip));n.fireClip=new egret.MovieClip(o.generateMovieClipData("fire")),n.addChild(n.fireClip)},n.prototype.start=function(){},n.prototype.ready=function(){},n}(ModuleBase);t.Module=e,__reflect(e.prototype,"login.Module")}(login||(login={}));