class FairyGUIProto {
	public constructor() {
	}
	public static inject():void
	{
		let fair:any;
		if(window["fairygui"]==null)return;		
		fair = window["fairygui"];
		fair.GRoot.prototype["__winResize"] = function():void{
			this.setSize(this._displayObject.width == 0?LayerManager.getInstance().frameBound.width:this._displayObject.width, this._displayObject.height == 0?LayerManager.getInstance().frameBound.height:this._displayObject.height);
		}
		fair.TweenManager.killAllTweens = function () {                        
            var cnt = fair.TweenManager._totalActiveTweens;            
            for (var i = 0; i < cnt; i++) {
                var tweener = fair.TweenManager._activeTweens[i];
                if (tweener != null && !tweener._killed) {
                    tweener.kill();                    
                }
            }            
        };
	}
	/**清空fairgui资源包*/
	public static disposePkg():void
	{
		let fair:any;
		if(window["fairygui"]==null)return;		
		fair = window["fairygui"];
		fair.UIPackage._instById = {};
        fair.UIPackage._instByName = {};
        fair.UIPackage._constructing = 0;        
        fair.UIPackage._vars = {};
	}
}