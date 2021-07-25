 class TweenUtil {
	public constructor() {
	}
	/**循环缓动*/
	public static loopEase(data:GYLite.TweenData, tweenObj:any):void
	{
		var per = (GYLite.CommonUtil.loopTime - tweenObj.startTime) / tweenObj.duration;
		let dis:number = data.to - data.from;            
		let n:number,n2:number,i_n2:number;let newP:number=0;
		n2 = data.param?data.param:2;//2等于一来一回，循环一次		
		i_n2 = 1/n2;
		if(per > 1)
			per = 0;
		else
		{
			n = per / i_n2 | 0;
			newP = (n % 2 == 0)?(per - n*i_n2) * n2:(i_n2-(per - n*i_n2)) * n2;			
			if(newP < 0)
				newP = 0;
			else if(newP > 1)
				newP = 1;
		}				
		tweenObj.target[data.propertyName] = data.from + dis * newP;
	}
	public static jumpEase(data:GYLite.TweenData, tweenObj:any):void
	{
		var per = (GYLite.CommonUtil.loopTime - tweenObj.startTime) / tweenObj.duration;
		let dis:number = data.to - data.from;            
		let n:number,n2:number,i_n2:number;		
		let param:any = data.param;
		n2 = param && param.times!=null?param.times:2;//2等于一来一回，循环一次		
		i_n2 = 1/n2;
		if(per > 1)
			per = 0;
		else
		{
			n = per / i_n2 | 0;
			per = (n % 2 == 0)?(per - n*i_n2) * n2:(i_n2-(per - n*i_n2)) * n2;
			if(param)
			{
				if(param.ease == "reduce")
				{
					per = (1-per);
					per *= per;					
					per = 1-per;	
				}
				else if(param.ease == "add")
				{
					per *= per;
				}
			}			
			if(per < 0)
				per = 0;
			else if(per > 1)
				per = 1;
		}		
		tweenObj.target[data.propertyName] = data.from + dis * per;
	}
	
	/**播放一段配置的动画
	 * @param objArr {[{tweenKey:[{x:1920 / 2,ease:0,1,2}, {y:540,ease:0,1,2}], delay:0, time: 2000}, {tweenKey:[{x:1920},{y:540}],delay:2000, time: 2000}]}
	 * @param display 需要控制的显示对象
	 * @param 第一次进入为true 不需要设置
	*/
	public static tweenAct(objArr, display, flag:boolean=true, completeFunc?: Function) {
		let s = this;
		let arr:any;
		let aniCfg:any;
		let tweenArr:GYLite.TweenData[];
		let easeFunc:Function;
		let i:number,len:number;
		let obj:any;
		let easeKey:string,value:number;
		arr = flag ? objArr.concat() : objArr;
		aniCfg = arr.shift();
		tweenArr = [];
		len = aniCfg.tweenKey.length;
		for(i=0;i<len;++i)
		{
			obj = aniCfg.tweenKey[i];
			easeFunc = GYLite.GYTween.commonEase;
			for(var key in obj)
			{
				if(key == "ease")
				{
					if(obj[key] == 0)
						easeFunc = GYLite.GYTween.commonEase;
					else if(obj[key] == 1)
						easeFunc = GYLite.GYTween.addEase;
					else if(obj[key] == 2)
						easeFunc = GYLite.GYTween.reduceEase;			
				}
				else
				{
					easeKey = key;
					value = obj[key];
				}
			}			
			tweenArr.push(GYLite.TweenData.getInstance(easeKey, value,NaN,easeFunc))			
		}           
		GYLite.GYTween.to(display, tweenArr, aniCfg.time, aniCfg.delay, s, () => {                
				if(arr.length > 0) {
					s.tweenAct(arr, display, false, completeFunc);
				}else {
					if (completeFunc) {
						completeFunc();
					}
				}
		});
	}
}