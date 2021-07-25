class TipUI extends UIBase{
	public back:ScreenBack;
	public tip1:Tip1;
	public tip2:Tip2;
	private _type:number;
	private _tip:string;
	private _endTip:string;
	private _hideEndCall:Function;
	private _hideEndObj:any;
	public constructor() {
		super();
		let s = this;
		s.width = GameManager.getInstance().stardardWidth;
		s.height = GameManager.getInstance().stardardHeight;	
		s.back = new ScreenBack;
		s.addElement(s.back);
		s.back.setBackground(0,0.5);
		s.tip1 = new Tip1(s);
		s.tip1.horizonalCenter = 0;
		s.tip1.y = 250;		
		s.tip2 = new Tip2(s);
		s.tip2.horizonalCenter = 0;
		s.tip2.verticalCenter = 0;
		s.touchEnabled = true;
	}
	/**显示提示
	 * @param pr 父级
	 * @param type 提示展示方式 1 小河马提示 2 数据请求提示
	 * @param tip 执行中的提示文字
	 * @param endTip 结束时候的提示文字
	*/
	public show(pr:GYLite.GYSprite=null,type:number=1,tip:string="",endTip:string=""):void
	{
		super.show(pr == null?LayerManager.getInstance().topLay:pr);
		let s =this;			
		s._tip = tip;
		s._endTip = endTip;
		if(s._type == type)
		{
			if(s._type == 1)
			{
				s.tip1.resetShowTip(s._tip);
			}
			return;
		}
		if(s._type == 1)
		{
			s.tip1.hide();
		}
		else if(s._type == 2)
		{
			s.tip2.hide();
		}
		s._type = type;
		LayerManager.getInstance().fixListen(s.back,0,0,0,0);
		if(type == 1)
		{		
			s.tip1.show(function(){
				if(s._endTip!=null || s._endTip!="")
				{
					s.hide(s._endTip);
				}
			},s,tip);
		}
		else if(type == 2)
		{
			s.tip2.show();	
		}
	}
	public hide(endTip:string="",hideEndCall:Function=null,thisObj:any=null):void
	{			
		let s =this;			
		s._hideEndCall = hideEndCall;
		s._hideEndObj = thisObj;
		LayerManager.getInstance().fixListen(s.back);
		if(s._type == 1)
		{
			if(endTip != "" &&  endTip != null)
			{					
				s.tip1.hide(s.doHide,s,endTip);
			}				
		}
		else if(s._type == 2)
		{
			s.doHide();
		}
	}
	public doHide():void
	{let s =this;
		let type:number;	
		type = s._type;
		s._type = NaN;
		if(type == 1)
		{
			s.tip1.hide();
			super.hide();
		}				
		else if(type == 2)
		{
			s.tip2.hide();
			super.hide();
		}
		if(s._hideEndCall!=null)
		{
			s._hideEndCall.call(s._hideEndObj);
			s._hideEndObj = s._hideEndCall = null;
		}				
	}
	public get type():number
	{
		return this._type;
	}
}
class Tip1 extends GYLite.GYSprite{
	public img:GYLite.GYImage;
	public txt:GYLite.GYText;
	private _tip:string;
	private _hideTip:string;
	private _timeId:number;
	private _count:number;
	private _showTween:GYLite.GYTween;
	private _hideTween:GYLite.GYTween;
	private _hideTween2:GYLite.GYTween;
	private _hideCall:Function;
	private _hideObj:any;
	private _hideId:number;
	private _owner:TipUI;
	public constructor(o:TipUI)
	{
		super();
		let s = this;
		s.width = 604;
		s.height = 456;
		s._owner = o;
		s._timeId = s._hideId = -1;
		s.img = SkinManager.createImage(s,0,0,"saving", URLConf.saveAlias);
		// s.img = SkinManager.createImage(s,0,0,"saveSuccess", URLConf.saveAlias);
		s.txt = SkinManager.createText(s,0,330,"正在为您保存",0x7b7b7d,50,"center");				
	}
	public resetShowTip(tip:string):void
	{let s = this;
		if(s._showTween)
			s.txt.text = tip;
	}
	public show(callBack:Function=null,thisObj:any=null,tip:string=""):void
	{
		let s = this;
		s.clearTime();
		s._count =0;
		s.img.source = Main.instance.getRes("saving",URLConf.saveAlias);
		s._tip = s.txt.text = tip;
		s.txt.x = (s.width - s.txt.width >> 1) - 30;
		s.txt.y = 330;			
		s.txt.color = 0x7b7b7d;
		if(s.parent == null)
			s._owner.addElement(s);
		s._timeId = GYLite.TimeManager.timeInterval(s.loop,s,200);
		s._showTween = GYLite.GYTween.to(s,[GYLite.TweenData.getInstance("alpha",1,0)],500,0,s,function(tar:any):void{	
			if(s._showTween)
			{
				s._showTween.clear();
				s._showTween = null;
			}
			if(callBack!=null)
				callBack.call(thisObj);
		},null,null,true,false);
	}
	private loop():void
	{
		let s = this;
		let key:string;
		key = "......";			
		// s._count = s._count % key.length;
		s.txt.text = s._tip + key.substr(0,s._count % key.length+1);
		++s._count;
		// if(s._count > 20)
		// 	s.hide(null,null,"保存成功");
	}
	/**隐藏
	 * @param callBack 隐藏回调
	 * @param thisObj this指向
	 * @param tip 隐藏播放的提示 不填则直接关闭不播放提示
	*/
	public hide(callBack:Function=null,thisObj:any=null,tip:string=""):void
	{let s = this;			
		s._hideTip = tip;
		if(s._hideTip == "" || s._hideTip == null)
		{
			if(s.parent)
				(<any>s.parent).removeElement(s);
			s.clearTime();
			return;
		}
		s.clearTime();
		s._hideTween = GYLite.GYTween.to(s,[GYLite.TweenData.getInstance("alpha",0,1)],100,0,s,function(tar:any):void{
			s.img.source = Main.instance.getRes("saveSuccess",URLConf.saveAlias);
			s.txt.text = tip;
			s.txt.color = 0xfcff00;				
			s.txt.x = s.width - s.txt.width >> 1;
			s.txt.y = 350;
			s._hideTween2 = GYLite.GYTween.to(s,[GYLite.TweenData.getInstance("alpha",1,0)],100,0,s,function(tar:any):void{									
				s.clearTime();
				s._hideCall = callBack;
				s._hideObj = thisObj;
				s._hideId = GYLite.TimeManager.timeOut(callBack,thisObj,1000);
				// if(callBack!=null)
				// 	callBack.call(thisObj);
			},null,null,true,false);
		},null,null,true,false);			
	}
	private clearTime():void
	{let s = this;
		if(s._timeId > -1)
		{
			GYLite.TimeManager.unTimeInterval(s._timeId,s.loop,s);
			s._timeId = -1;
		}
		if(s._hideId > -1)
		{
			GYLite.TimeManager.unTimeInterval(s._hideId,s._hideCall,s._hideObj);
			s._hideId = -1;
		}		
		if(s._hideTween)
		{
			s._hideTween.clear();
			s._hideTween = null;
		}
		if(s._hideTween2)
		{
			s._hideTween2.clear();
			s._hideTween2 = null;
		}
		if(s._showTween)
		{
			s._showTween.clear();
			s._showTween = null;
		}
	}
}
class Tip2 extends GYLite.GYSprite{
	public circle1:CircleShape;
	public circle2:CircleShape;
	public circle3:CircleShape;
	private _owner:TipUI;
	public constructor(o:TipUI)
	{
		super();
		let s = this;
		s._owner = o;
		s.width = 190;
		s.height = 50;
		s.circle1 = <CircleShape>SkinManager.createImage(s, 0, 0, "loadCircle", URLConf.saveAlias,CircleShape);
		s.circle2 = <CircleShape>SkinManager.createImage(s, 70, 0, "loadCircle", URLConf.saveAlias,CircleShape);
		s.circle3 = <CircleShape>SkinManager.createImage(s, 140, 0, "loadCircle", URLConf.saveAlias,CircleShape);
		s.circle1.archorX = s.circle1.archorY = s.circle2.archorX = s.circle2.archorY = s.circle3.archorX = s.circle3.archorY = 25;
	}
	public show():void
	{let s = this;
		if(s.parent == null)
		{
			s._owner.addElement(s);
			s.circle1.startTween(1,0.5);
			s.circle2.startTween();
			s.circle3.startTween(1,0.5);
		}				
	}
	public hide():void
	{let s = this;
		if(s.parent)
		{
			s._owner.removeElement(s);
			s.circle1.stopTween();
			s.circle2.stopTween();
			s.circle3.stopTween();
		}				
	}
}
class CircleShape extends GYLite.GYImage
{
	private _loopTween:GYLite.GYTween;
	public constructor()
	{
		super();
	}
	public startTween(stVal:number=0.5,endVal:number=1,t:number=1000):void
	{
		let s =this;
		if(s._loopTween)
		return;
		s.scaleX = s.scaleY = 1;
		s._loopTween = GYLite.GYTween.to(s,[
			GYLite.TweenData.getInstance("scaleX",stVal,endVal,TweenUtil.loopEase, 2 * 10000),
			GYLite.TweenData.getInstance("scaleY",stVal,endVal,TweenUtil.loopEase, 2 * 10000)
		],t * 10000,0,null,null,null,null,true,false);
	}
	public stopTween():void
	{let s =this;
		if(s._loopTween)
		{				
			s._loopTween.clear();
			s._loopTween = null;
			s.scaleX = s.scaleY = 1;
		}
	}
}