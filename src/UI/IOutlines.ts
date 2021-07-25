interface IOutlines
{
    /**轮廓数组(二维数组，多个轮廓)*/
	readonly outlines:number[][];
    /**矩形边框轮廓数组(二维数组，多个边框)*/
	readonly rectOutlines:number[][];
    /**获取转为全局的轮廓数组*/
    getGlobalOutline():number[][];
    /**获取转为全局的rect轮廓数组*/
    getGlobalRectOutline():number[][];
    
}