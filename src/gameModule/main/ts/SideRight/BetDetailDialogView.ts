/**
 * 明细
 */

module main {
    export class BetDetailDialogView extends GYLite.GYUIComponent {

        private static _instance: BetDetailDialogView

        public static getInstance(): BetDetailDialogView {

            return BetDetailDialogView._instance || (BetDetailDialogView._instance = new BetDetailDialogView)
        }

        private back: GYLite.GYScaleSprite
        private close: GYLite.GYButton

        private eventSets: any

        constructor() {
            super()
            const s = this

            s.eventSets = {}

            s.width = 1046
            s.height = 536
            s.horizonalCenter = 0
            s.verticalCenter = 0

            s.back = SkinManager.createScaleImage(s, 0, 0, 'rms_view_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(60, 60, 60, 60))
            s.back.width = s.width
            s.back.height = s.height

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close['eventname'] = 'close'
            s.close.top = -20
            s.close.right = -20


            s.bindEvent()
        }

        private bindEvent(): void {
            const s = this

            s.eventSets = {
                close: () => {
                    s.hide()
                }
            }

            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(e): void {
            const s = this
            s.eventSets[e.target['eventname']] && s.eventSets[e.target['eventname']](e)
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