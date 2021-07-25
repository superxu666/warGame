class HorizontalBox extends GYLite.GYScrollGroup{
	private _dataProider:any[];
	private _itemCls:any;
	private _invalidPos:boolean;
	private _invalidData: boolean;
	private _curSelectData:any;
	private _curItem:GYLite.ItemRender;
	private _lastPos: number = 0;
	public constructor(itemCls:any) {
		super();		
		let s= this;
		s.touchEnabled = true;
		s._itemCls = itemCls;
		s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.tap, s);
		s.scroller.horizonPolicy = 2;
		s.scrollerViewPort.canDrag = true;
	}
	private tap(e:egret.TouchEvent):void
	{let s =this;
		if(GYLite.CommonUtil.GYIs(e.target,GYLite.ItemRender))
		{
			let item:GYLite.ItemRender;
			item = (<GYLite.ItemRender>e.target);			
			// if(s._curItem!=item)
			// {
				if(s._curItem)s._curItem.selected = false;
				if(s.hasEventListener(GYLite.GYViewEvent.UNSELECTED))
					s.dispatchEventWith(GYLite.GYViewEvent.UNSELECTED);
				s._curItem = item;
				s._curItem.selected = true;
				s._curSelectData = item.getData();
				if(s.hasEventListener(GYLite.GYViewEvent.SELECTED))
					s.dispatchEventWith(GYLite.GYViewEvent.SELECTED);
			// }
		}
	}
	public get selectedData():any
	{
		return this._curSelectData;
	}
	public get selectedItem():GYLite.ItemRender
	{
		return this._curItem;
	}

	public set selectedItem(item:GYLite.ItemRender)
	{
		this._curItem = item;
	}

	public set dataProvider(val:any[])
	{
		let s = this;			
		s._dataProider = val;
		s.scroller.scrollBarH.position = 0;
		s.validData();		
	}
	public addItem(d: any): void {
		let s = this;
		s._dataProider.push(d);
		let item: any = s.createItem();
		s.resetItem(item, 0, s._lastPos, d, s._dataProider.length - 1);
		s.addElement(item);
		s.lastPosSet();		
	}
	public addItemAt(d: any, ind: number): void {
		let s = this;
		if (ind >= s._dataProider.length) return;
		s._dataProider.splice(ind, 0, d);
		let item: any = s.createItem();
		s.resetItem(item, 0, s._lastPos, d, ind);
		s.validPos();
		s.addElementAt(item, ind);
		s.lastPosSet();
	}
	public removeItem(d: any): void {
		let s = this;
		let ind: number = s._dataProider.indexOf(d);
		if (ind == -1) return;
		s._dataProider.splice(ind, 1);
		s.validPos();
		s.removeElementAt(ind);
		s.lastPosSet();
	}
	public removeItemAt(ind: number): void {
		let s = this;
		if (ind >= s._dataProider.length) return;
		s._dataProider.splice(ind, 1);
		s.validPos();
		s.removeElementAt(ind);
		s.lastPosSet();
	}
	private lastPosSet(): void {
		let s = this;
		let item: any;
		if (s.numElement == 0)
			s._lastPos = 0;
		else {
			item = s.getElementAt(s.numElement - 1);
			s._lastPos = item.x + item.width;
		}
	}
	public invalidData(): void {
		let s = this;
		if(s._invalidData)return;
		s._invalidData = true;
		s.displayChg(s.updateView);
	}
	public validData():void
	{let s = this;
		let i:number,len:number;		
		let h:number;
		let toX:number,toY:number;		
		let gySp:GYLite.GYSprite;	
		let item:GYLite.IItemRender;		
		gySp = <GYLite.GYSprite>s.getElementAt(i);			
		while(s.scrollerViewPort.numElement > 0)
		{			
			gySp = <GYLite.GYSprite>s.scrollerViewPort.getElementAt(0);
			gySp.dispose();
		}
		s._lastPos = i = toX = toY = 0;
		if(s._dataProider && s._dataProider.length > 0)
		{
			while(i < s._dataProider.length)
			{
				item = s.createItem();
				s.resetItem(item, toX, toY, s._dataProider[i], i);
				if (s._dataProider[i].menu_selected)
					s._curItem = (<GYLite.ItemRender>item);
				s.addElement(item);
				s._lastPos = toX = item.x + item.width;
				++i;
			}			
		}
		s.scrollerViewPort.validZIndex();
	}
	private resetItem(item: any, toX: number, toY: number, d: any, i: number) {
		item.y = toY;
		item.x = toX;
		if (GYLite.CommonUtil.GYIs(item, GYLite.ItemRender)) {
			item.itemIndex = i;
			(<GYLite.ItemRender>item).setData(d);
		}
	}
	public get dataProvider():any[]
	{
		return this._dataProider;
	}
	public createItem():GYLite.IItemRender
	{let s =this;
		let item:GYLite.IItemRender = new s._itemCls;		
		return item;
	}
	public validPos():void
	{
		let s = this;
		let i:number,len:number;
		let h:number;
		let toX:number,toY:number;
		let gySp:GYLite.GYSprite;
		i = toX = toY = 0;		
		while(i < s.scrollerViewPort.numElement)
		{
			gySp = <GYLite.GYSprite>s.scrollerViewPort.getElementAt(i);
			++i;
			if (s._itemCls.HasSetY==null || (! s._itemCls.HasSetY()) )
			{
 				gySp.y = toY; 
			}
			gySp.x = toX;
			toX = gySp.x + gySp.width;
		}
	}
	public invalidPos():void
	{
		let s = this;
		if(s._invalidPos)return;
		s._invalidPos = true;
		s.displayChg(s.updateView);
	}
	public updateView():void
	{let s = this;
		super.updateView();
		if(s._invalidPos)
		{
			s.validPos();
			s._invalidPos = false;
		}
	}
	public validZIndex():void
	{
		super.validZIndex();
		let s = this;
		s.validPos();
	}
}