module main {
    export class TrumpetView extends GYLite.GYUIComponent {

        private static _instance: TrumpetView

        public static getInstance(): TrumpetView {

            return TrumpetView._instance || (TrumpetView._instance = new TrumpetView)
        }

        private back: GYLite.GYScaleSprite
        private close: GYLite.GYButton
        private handlers: Object

        private trumpet_b: GYLite.GYTextInput
        private trumpet_s: GYLite.GYTextInput
        private send_b: GYLite.GYButton
        private send_s: GYLite.GYButton

        constructor() {
            super()
            let s = this
            s.horizonalCenter = 0
            s.verticalCenter = 0

            s.back = SkinManager.createScaleImage(s, 0, 0, 'rms_view_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(60, 60, 60, 60))
            s.back.width = 800
            s.back.height = 300

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close['eventname'] = 'close'
            s.close.top = -20
            s.close.right = -20

            const dlb = SkinManager.createImage(s, 0, 40, 'rms_trumpet_title_bg_png', URLConf.mainImg + 'd2sheet.png')
            dlb.horizonalCenter = 0
            const dlb_t = SkinManager.createImage(s, 0, 0, 'rms_trumpet_title_big_png', URLConf.mainImg + 'd2sheet.png')
            dlb_t.y = (dlb.height - dlb_t.height >> 1) + dlb.y
            dlb_t.horizonalCenter = 0

            s.trumpet_b = TemplateTool.createTextInput(s, 30, dlb.y + dlb.height + 30, 600, 40, '请输入大喇叭内容...', 24, 0xffffff, 100)

            s.send_b = SkinManager.createBtn2(s, s.trumpet_b.x + s.trumpet_b.width + 10, s.trumpet_b.y, ['rms_btn_bg_1_png'], URLConf.mainImg + 'd2sheet.png')
            s.send_b['eventname'] = 'sendb'
            s.send_b.label = '发送'
            s.send_b.labelDisplay.color = 0xffffff
            s.send_b.labelDisplay.size = 24
            s.trumpet_b.height = s.send_b.height

            const tip = SkinManager.createText(s, 0, 0, '')
            tip.htmlText = '提示: 每条喇叭消耗<font color=0xEFCD02> 20 </font>金币, 消息在全频道滚动播放'
            tip.horizonalCenter = 0
            tip.bottom = 40

            s.bindEvent()

            // TemplateTool.openDrag(s)

        }

        private bindEvent(): void {
            let s = this
            s.handlers = {
                'close': () => {

                    UtilTool.clickSound()
                    s.hide()
                },
                'sendb': () => {

                    UtilTool.clickSound()
                    if (!s.trumpet_b.text) return

                    /*调用大喇叭接口*/
                    MainModel.getInstance().addNotice(s.trumpet_b.text)
                    /*发送socke信息*/
                    ChatView.getInstance().handleSend(s.trumpet_b.text)
                    s.trumpet_b.text = ''

                },
            }
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handle, s)

        }

        private handle(e: Event): void {

            const s = this
            s.handlers[e.target['eventname']] && s.handlers[e.target['eventname']]()
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