class LogMenuItem extends GYLite.GYLinkButton implements GYLite.IItemRender{
	protected _data:any;
	protected _owner:GYLite.IList;
	protected _itemIndex:number;
	public constructor(skin:any=null)
	{
		super(skin);
		var s= this;
		s._data = null;
		s._owner = null;
		s._itemIndex = -1;
		s.label = "";
		s.labelDisplay.verticalCenter = 2;		
		s.height = 40;
	}
	/**设置数据*/
	public setData(val:any):void
	{var s = this;
		s._data=val;
		if(s._data==null)
		{
			s.visible = false;
			return;
		}
		s.visible = true;
		this.label = s._data.label;
	}
	/**获得数据*/
	public getData():any
	{var s = this;
		return s._data;
	}
	/**提取数据*/
	public toString():string
	{var s = this;
		if(s._data == null)
			return super.toString();
		return s._data.label;
	}
	public get owner():GYLite.IList
	{var s = this;
		return s._owner;
	}
	public set owner(val:GYLite.IList)
	{var s = this;
		s._owner = val;
	}
	public get itemIndex():number
	{var s = this;
		return s._itemIndex;
	}
	
	public set itemIndex(value:number)
	{var s = this;
		s._itemIndex = value;
	}
	public get col():number
	{var s = this;
		return 0;
	}
	public set col(value:number)
	{var s = this;
	}
	public get row():number
	{var s = this;
		return 0;
	}
	public set row(value:number)
	{var s = this;
	}
}