module main {
    export class TrumpetView extends GYLite.GYUIComponent {

        private static _instance: TrumpetView

        public static getInstance(): TrumpetView {

            return TrumpetView._instance || (TrumpetView._instance = new TrumpetView)
        }

        private back: GYLite.GYScaleSprite
        private close: GYLite.GYButton
        private child: any[]

        constructor() {
            super()
            let s = this
            s.horizonalCenter = 0
            s.verticalCenter = 0

            s.back = SkinManager.createScaleImage(s, 0, 0, 'rms_view_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(60, 60, 60, 60))
            s.back.width = 600
            s.back.height = 400

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close.top = -20
            s.close.right = -20

            

            const bg1 = SkinManager.createScaleImage(s, 0, 0, 'rms_login_bg_1_png', URLConf.mainImg + 'd2sheet.png', new GYLite.Scale9GridRect(48, 50, 26, 46))
            bg1.left = 20
            bg1.bottom = 20
            bg1.width = s.width - 40
            bg1.height = s.height / 2 - 30

            const line = SkinManager.createScaleImage(s, 20, 200, 'rms_view_line_2_png', URLConf.mainImg + 'd2sheet.png', new GYLite.Scale9GridRect(50, 50, 2, 2))
            line.width = s.width - 40


            s.bindEvent()

        }

        private bindEvent(): void {
            let s = this

            s.close.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClose, s)
        }

        private handleClose(): void {

            let s = this
            s.hide()
        }

        public addEl(cb: Function): void {
            cb && cb(this)
        }
        public pushEl(el: any): void {
            let s = this
            if (!el) return
            if (!s.child) s.child = []
            s.child.push(el)
        }
        public clearEl(): void {
            let s = this
            if (!s.child) return
            let len = s.child.length
            while (--len < -1) {
                s.removeElement(s.child[len])
            }
            s.child = []
        }


        public show(): void {

            let s = this

            LayerManager.getInstance().setTopMask(true);
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

        }

        public hide(): void {

            let s = this
            LayerManager.getInstance().setTopMask(false);
            (s.parent as any).removeElement(s);

        }
    }
}