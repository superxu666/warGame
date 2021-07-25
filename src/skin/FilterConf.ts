class FilterConf {
	private static _whiteGlow:egret.GlowFilter;
	private static _yellowGlow:egret.GlowFilter;
	private static _greenGlow:egret.GlowFilter;
	private static _gray:egret.ColorMatrixFilter;
	private static _colorDict:any={};
	private static _colorTextDict:any = {};
	public static getGrayMatrix():egret.ColorMatrixFilter
	{
		if(FilterConf._gray == null)
		{
			FilterConf._gray = new egret.ColorMatrixFilter([
				0.3,0.6,0,0,0,
				0.3,0.6,0,0,0,
				0.3,0.6,0,0,0,
				0,0,0,1,0
			]);
		}
		return FilterConf._gray;
	}
	public static getGrayFilter():Array<any>
	{
		return [FilterConf.getGrayMatrix()];
	}
	public static getColorGlow(color:number):egret.GlowFilter
	{let s = this;
		if(s._colorDict[color] == null)
		{
			s._colorDict[color] = new egret.GlowFilter(color,0.8,35,35,5,egret.BitmapFilterQuality.HIGH);
		}
		return s._colorDict[color];
	}
	public static getColorTextGlow(color:number):egret.GlowFilter
	{let s = this;
		if(s._colorTextDict[color] == null)
		{
			s._colorTextDict[color] = new egret.GlowFilter(color,0.8,5,5,5,egret.BitmapFilterQuality.HIGH);
		}
		return s._colorTextDict[color];
	}
	public static getColorGlowFilter(color:number):Array<any>
	{let s = this;
		return [FilterConf.getColorGlow(color)];
	}
	public static getColorTextGlowFilter(color:number):Array<any>
	{let s = this;
		return [FilterConf.getColorTextGlow(color)];
	}
	public static get whiteGlow():egret.GlowFilter
	{		
		if(FilterConf._whiteGlow == null)
		{
			FilterConf._whiteGlow = new egret.GlowFilter(0xffffff,0.8,35,35,5,egret.BitmapFilterQuality.HIGH);			
		}
			
		return FilterConf._whiteGlow;
	}
	public static getWhiteFilter():Array<any>
	{
		return [FilterConf.whiteGlow];
	}
	public static get yellowGlow():egret.GlowFilter
	{		
		if(FilterConf._yellowGlow == null)
		{
			FilterConf._yellowGlow = new egret.GlowFilter(0xffff00,0.8,35,35,5,egret.BitmapFilterQuality.HIGH);			
		}
			
		return FilterConf._yellowGlow;
	}
	public static getYellowFilter():Array<any>
	{
		return [FilterConf.yellowGlow];
	}
	public static get greenGlow():egret.GlowFilter
	{		
		if(FilterConf._greenGlow == null)
		{
			FilterConf._greenGlow = new egret.GlowFilter(0x00ff00,0.8,35,35,5,egret.BitmapFilterQuality.HIGH);			
		}
			
		return FilterConf._greenGlow;
	}
	public static getGreenFilter():Array<any>
	{
		return [FilterConf.greenGlow];
	}
	public constructor() {
	}
}