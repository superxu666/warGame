class StringUtil {
	public constructor() {
	}
	private static numArr:number[] = [1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000];
	/**转化数字为中文数字*/
	public static upperNumber(val:number):string
	{
		let n:number;
		let str:string = "";
		let arr:number[] = StringUtil.numArr;
		let i:number,len:number;
		let zeroIn:boolean=false;
		val |= 0;
		len = val.toString().length;
		if(len == 1)
			return MultiLang.strNumber[val];
		if(len > arr.length)Log.writeLog("位数超出十亿的限制!" + val,Log.ERROR);
		++len;
		for(i=1;i<len;++i)
		{
			n = val % arr[i];
			n = n / arr[i-1] | 0;
			if(n == 0)
			{
				if(!zeroIn)
					continue;
				zeroIn = false;
				str = MultiLang.strNumber[0] + str;	
			}
			else
			{
				zeroIn = true;
				str = MultiLang.strNumber[n] + MultiLang.unitStr[i-1] + str;	
			}
		}		
		return str;
	}
}