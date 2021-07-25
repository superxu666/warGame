class Map {
	private _items = {};
	public constructor() {

	}    
    public has(key:any):any
	{let s = this;
        return key in s._items;
    }
    public set(key:any,value:any):void
	{let s= this;
        s._items[key] = value;
    }
    public delete(key:any):boolean
	{let s = this;
        if (this.has(key)) {
            delete s._items[key];
            return true;
        }
        return false;
    }
    public get(key:any):any
	{let s = this;
        return this.has(key)?s._items[key]:undefined;
    }
    public values():Array<any>
	{let s =this;
        var values = [];
        for(var k in s._items){
            if (this.hasOwnProperty(k)) {
                values.push(s._items[k]);
            }
        }
        return values;
    }
    public clear()
	{let s = this;
        s._items = {};
    }
    public size():number
	{let s =this;
		return Object["Keys"](s._items).length;
    }
    public getItems()
	{let s = this;
        return s._items;
    }

}