module login {
    export class LoginLayout {

        public static _instance: LoginLayout

        public static getInstance(): LoginLayout 
        {
            return LoginLayout._instance ? LoginLayout._instance : (LoginLayout._instance = new LoginLayout)
        }

        public layout(ui: Module): void 
        {

            let s = this;

            ui.iframe = SkinManager.createScaleImage(ui, 100, 200, 'header_png', 'd1sheet.png', new GYLite.Scale9GridRect(100,100,100,100))
            ui.iframe.width = 680
            ui.iframe.height = 430
			ui.iframe.horizonalCenter = 0
            

            let t = LoginLayout.createScrollGroup(ui, 0, 0, ui.width, 620, true, 1, 50);
			t.horizonalCenter = 0;
			t.verticalCenter = 20;
			ui.addElement(t);
            
            let f = (<any>GYLite.GYLoader)._resDataDict['d1sheet.json']['res']['frames']
            let x=0
            for (var key in f) 
            {
                let img = SkinManager.createImage(t, 0, 0, key, 'd1sheet.png')
                img.x = x
                x += img.width
                img['imgname'] = key
            }

            s.openDrag(t)

        }

        public static createScrollGroup(pr: GYLite.GYSprite = null, x: number, y: number, w: number, h: number, canDrag: boolean = false, /**滚动条 1显示 0不显示*/scrollBar: number = 0, /**滚动默认距离:5 */step: number = 5) {

            let scrollG = new GYLite.GYScrollGroup;
            scrollG.x = x;
            scrollG.y = y;
            scrollG.width = w;
            scrollG.height = h;
            scrollG.scrollerViewPort.canDrag = canDrag;
            scrollG.scroller.scrollBarH.alpha = scrollBar;
            scrollG.scroller.scrollBarV.alpha = scrollBar;
            scrollG.scroller.wheelScrollStep = step;

            scrollG.touchEnabled = true;
            let scrollBack = new GYLite.GYSprite;
            let g: egret.Graphics;
            g = scrollBack.graphics;
            g.beginFill(0, 0);
            g.drawRect(0, 0, scrollG.width, 100);
            g.endFill();
            scrollBack.touchEnabled = true;
            scrollG.addElement(scrollBack);

            if (pr)
                pr.addElement(scrollG);
            return scrollG;

        }
        
		private openDrag(ui: GYLite.GYSprite): void {
			let s = this;
			let len: number;
			len = ui.numElement;
			while (--len > -1) {
				let sp: GYLite.GYSprite = <any>ui.getElementAt(len);
				sp.touchEnabled = true;
				GYLite.DraggerHandle.getInstance(sp).addBind(function (d: GYLite.DraggerHandle): void {
					d.handle.x = (<any>d.handle.parent).mouseX - d.dragMouseX;
					d.handle.y = (<any>d.handle.parent).mouseY - d.dragMouseY;
				}, s);
			}
            ui.addEventListener(egret.TouchEvent.TOUCH_END, function (e: any) {

				console.log(e.target.imgname);
			}, ui);
		}
    }
}