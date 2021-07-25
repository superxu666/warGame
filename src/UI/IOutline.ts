interface IOutline extends GYLite.IGYDisplay
{
    /**轮廓数组*/
    readonly outline:number[];
    /**矩形边框轮廓数组*/
    readonly rectOutline:number[];
    /**获取转为全局的轮廓数组*/
    getGlobalOutline():number[];
    /**获取转为全局的rect轮廓数组*/
    getGlobalRectOutline():number[];
    
}
/***IOutline接口定义了轮廓
 * 
*/