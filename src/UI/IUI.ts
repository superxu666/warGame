interface IUI
{
    /**ui所属的链接库，主程序用main表示，如ui1Lib公共库就用ui1Lib*/
    readonly libType:string;
    /**关闭函数*/
    hide():void;
}
/***IUI接口定义了链接库类型，关闭函数，便于让主框架统一关闭所有模块弹出到topLay的窗口，主框架判断非main的其他IUI则进行统一关闭
 * 
*/