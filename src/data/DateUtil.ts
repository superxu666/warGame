class DateUtil {
	public constructor() {
	}
	public static date:Date = new Date;
	public static date2:Date = new Date;
	/**y/M/d/ h:m:s*/
	public static formatDate(d:Date,format:string)
	{
		var z = {
			y:d.getFullYear(),
			M:d.getMonth()+1,
			d:d.getDate(),
			h:d.getHours(),
			m:d.getMinutes(),
			s:d.getSeconds()
		};
		return format.replace(/(y+|M+|d+|h+|m+|s+)/g, 
			function(v) {
				return ((v.length>1?"0":"")+z[v.slice(-1)]).slice(-(v.length>2?v.length:2))
			}
		);
	}
	/**转时间戳 年月日 时分秒
	 * @param t 时间戳
	 * @param zero 是否不满双位数在前面补0
	*/
	public static formatTime(t:number,zero:boolean=true,year:boolean=true,month:boolean=true,date:boolean=true,hour:boolean=true,min:boolean=true,sec:boolean=true):string
	{
		let d:Date;
		d = DateUtil.date;
		d.setTime(t);
		var z = {
			y:d.getFullYear(),
			M:d.getMonth()+1,
			d:d.getDate(),
			h:d.getHours(),
			m:d.getMinutes(),
			s:d.getSeconds()
		};
		let str:string = "";
		if(year)
			str += (z.y > 9?z.y:"0"+z.y) + "年";
		if(month)
			str += (z.M > 9?z.M:"0"+z.M) + "月";
		if(date)
			str += (z.d > 9?z.d:"0"+z.d) + "日";
		if(str!="")
			str += " ";
		if(hour)
			str += (z.h > 9?z.h:"0"+z.h) + "时";
		if(min)
			str += (z.m > 9?z.m:"0"+z.m) + "分";
		if(sec)
			str += (z.s > 9?z.s:"0"+z.s) + "秒";
		return str;
	}
	/**转倒计时返回 年月日 时分秒
	 * @param st 开始时间戳
	 * @param et 结束时间戳
	 * @param zero 是否不满双位数在前面补0
	*/
	public static formatCountTime(st:number,et:number,zero:boolean=true,year:boolean=true,month:boolean=true,date:boolean=true,hour:boolean=true,min:boolean=true,sec:boolean=true):string
	{		
		DateUtil.date.setTime(0);
		DateUtil.date2.setTime(et - st);
		var z = {
			y:DateUtil.date2.getFullYear() - DateUtil.date.getFullYear(),
			M:DateUtil.date2.getMonth() - DateUtil.date.getMonth(),
			d:DateUtil.date2.getDate() - DateUtil.date.getDate(),
			h:DateUtil.date2.getHours() - DateUtil.date.getHours(),
			m:DateUtil.date2.getMinutes() - DateUtil.date.getMinutes(),
			s:DateUtil.date2.getSeconds() - DateUtil.date.getSeconds(),
		};
		if(z.y < 0)z.y = 0;
		if(z.M < 0)z.M = 0;
		if(z.d < 0)z.d = 0;
		if(z.y < 0)z.h = 0;
		if(z.m < 0)z.m = 0;
		if(z.s < 0)z.s = 0;
		
		let str:string = "";
		if(year)
		{			
			if(z.y > 0 || str != "")
				str += (z.y > 9?z.y:"0"+z.y) + "年";
		}
		if(month)
		{
			if(z.M > 0 || str != "")
				str += (z.M > 9?z.M:"0"+z.M) + "月";
		}
		if(date)
		{
			if(z.d > 0 || str != "")
				str += (z.d > 9?z.d:"0"+z.d) + "日";
		}
		if(str!="")
			str += " ";
		if(hour)
		{
			if(z.h > 0 || str != "")
				str += (z.h > 9?z.h:"0"+z.h) + "时";
		}
		if(min)
		{
			if(z.m > 0 || str != "")
				str += (z.m > 9?z.m:"0"+z.m) + "分";
		}
		if(sec)
		{
			if(z.s > 0 || str != "")
				str += (z.s > 9?z.s:"0"+z.s) + "秒";
		}
		return str;
	}
}