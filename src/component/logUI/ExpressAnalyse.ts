class ExpressAnalyse {
	public static lastVar:string;
	public constructor() {
	}
	public static getVarObj(code:string):any
	{
		let i:number,len:number;
		let expressObj:ExpressObject;
		let obj:any,obj2:any;		
		let arr:string[];
		let s = this;
		obj2 = window;
		arr = code.match(/[a-zA-Z0-9_]+|\+\+|--|<<<|>>>|>>|<<|&&|\|\||>=|<=|[^a-zA-Z0-9_]/g);
		if(arr == null || arr.length == 0)return obj2;
		s.lastVar = arr[(arr.length - 1)];		
		expressObj = new ExpressObject();
		len = arr.length;
		for(i=0;i<len;++i)
		{
			code = arr[i];
			expressObj.input(code);
		}
		return expressObj.getLastExpress().expressReturn();		
	}
}
class ExpressObject{
	/**当前解析对象*/public curObj:any;
	/**当前操作类型 0无操作 1 函数参数输入 2 函数执行 3 下级属性读取*/public operType:number;
	private _codes:string[];
	private _obj:any;
	private _parent:ExpressObject;
	private _childExpress:ExpressObject;
	private _childs:ExpressObject[];
	private _params:any[];
	private _preObj:any;
	public constructor(code:string=null,parent:ExpressObject=null)
	{
		let s = this;
		s._codes = code?[code]:[];
		s._obj = code?window[code]:window;
		s._parent = parent;
		s._params = [];
		s._childs = [];
	}
	private funcSet(code:string):void
	{let s =this;		
		s._codes.push(code);
		if(s._obj == null || s._obj[code] == null)return;
		s._preObj = s._obj;
		s._obj = s._obj[code];
	}
	/**表达式返回*/
	public expressReturn():any
	{
		let obj:any;
		let s = this;		
		obj = s.getVar();
		if(obj && s.operType == 2)
			return obj.apply(s._preObj,s._params);
		return obj;
	}
	public inputParam(expObj:ExpressObject):void
	{
		let s = this;
		if(s.operType == 1)
		{
			let obj:any = expObj.expressReturn();
			if(obj == null || obj == window)
			{
				let code:string = expObj.getLastCode();
				if(code != "")
					s._params.push(code);
			}				
			else
				s._params.push(obj);
		}
			
	}	
	public getVar():any
	{let s =this;
		return s._obj;
	}
	public getLastCode():string
	{let s =this;
		return s._codes.length>0?s._codes[s._codes.length - 1]:"";
	}
	public getLastExpress():ExpressObject
	{let s = this;
		return s._childExpress?s._childExpress.getLastExpress():s;
	}
	/**输入表达式
	 * @param code 表达式字符串
	 * @return ExpressObject 有返回表示表达式结束
	*/
	public input(code:string):ExpressObject
	{
		let s = this;
		let outputExpress:ExpressObject;
		if(s._childExpress)
		{			
			outputExpress = s._childExpress.input(code);
			if(outputExpress)
				return outputExpress;
		}
		//表达式结束
		if(code == ",")
		{			
			if(s._parent)
			{
				s._parent.inputParam(s);
				s._parent._childExpress = null;
			}				
		}
		//函数执行
		if(s.operType == 1 && code == ")")
		{
			if(s._childExpress)
			{
				s.inputParam(s._childExpress);
				s._childExpress = null;
			}				
			s.operType = 2;
			return s;
		}			
		//函数开始
		if(code == "(")
		{			
			s.operType = 1;			
		}		
		if(code == ".")
		{	
			return s;
		}		
		
		if(code.match(/[a-zA-Z0-9_]+/g) == null)
		{	
			if(s._childExpress == null)		
				s._childExpress = new ExpressObject(null,s);
			return null;//不符合表达式规则，忽略
		}
		
		s.funcSet(code);
		return null;
	}
}