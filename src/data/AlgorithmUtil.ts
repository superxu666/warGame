class AlgorithmUtil {
	public constructor() {
	}
	/**二分查找
	 * @param max 最大值
	 * @param min 最小值
	 * @param func 判定函数，返回1在下半区，返回-1，在上半区，返回0，符合要求
	 * @param thisObject
	 * @param intFlag 取整标志，-1向下取整 1向上取整 0不取整
	 * @param closeInterval 是否闭区间，闭区间包括max和min两个端点的判定
	*/
	public static dichotomy(max:number,min:number,func:(number)=>number,thisObject:any,intFlag:number=-1,closeInterval:boolean=true):number
	{
		let val:number;
		let result:number;
		if(closeInterval)
		{
			result = func.call(thisObject,max);
			if(result == 0)
				return max;
			result = func.call(thisObject,min);
			if(result == 0)
				return min;
		}
		val = (max + min) / 2;
		if(intFlag == -1)
			val = val | 0;
		else if(intFlag == 1)
		{
			let intVal:number;
			intVal = val | 0;
			val = intVal < val?intVal + (intVal > 0?1:-1):val;
		}			
		result = func.call(thisObject,val);
		if(result == 1)
			return AlgorithmUtil.dichotomy(max, val, func, thisObject, intFlag, false);
		else if(result == -1)
			return AlgorithmUtil.dichotomy(val, min, func, thisObject, intFlag, false);
		else
			return val;
	}
}