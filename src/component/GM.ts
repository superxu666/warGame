class GM {
	public constructor() {
	}
	public static register(key:string,func:Function,obj:any):void
	{
		window["GM_" +key] = func.bind(obj);
	}
}