module main {
    export class GiveGoldDialogView extends GYLite.GYUIComponent {

        private static _instance: GiveGoldDialogView

        public static getInstance(): GiveGoldDialogView {

            return GiveGoldDialogView._instance || (GiveGoldDialogView._instance = new GiveGoldDialogView)
        }

        private sendBtn: GYLite.GYButton
        private close: GYLite.GYButton
        private input: GYLite.GYTextInput
        private gText: GYLite.GYText
        private yText: GYLite.GYText
        private type: number = 1

        private eventSets: any
        private userData: any

        constructor() {
            super()
            const s = this

            s.eventSets = {}
            s.userData = {}

            s.width = 635
            s.height = 350

            s.horizonalCenter = 0
            s.verticalCenter = 0

            let back = SkinManager.createScaleImage(s, 0, 0, 'rms_view_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(60, 60, 60, 60))
            back.width = s.width
            back.height = s.height

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close['eventname'] = 'close'
            s.close.top = -20
            s.close.right = -20

            s.input = new GYLite.GYTextInput(new GYLite.TextInputSkin(Main.instance.getRes('rms_input_bg_png', URLConf.mainImg + 'd2sheet.png'), new GYLite.Scale9GridRect(54, 2)))
            s.input.width = 400
            s.input.height = 62
            s.input.x = 50
            s.input.y = 180
            s.input.textInput.color = 0xffffff
            s.input.textInput.size = 30
            s.input.textInput.width = s.input.width - 45
            s.input.textInput.height = s.input.height
            s.input.textInput.paddingTop = 45
            s.input.textInput.paddingLeft = 40
            s.addElement(s.input)

            s.gText = SkinManager.createText(s, 70, 90, '赠送金币', 0xffffff, 30, 'center', 130, 56)
            s.gText['eventname'] = 'gtext'
            s.gText.touchEnabled = true
            s.yText = SkinManager.createText(s, s.gText.x + s.gText.width + 50, 90, '赠送银币', 0x999999, 30, 'center', 130, 56)
            s.yText['eventname'] = 'ytext'
            s.yText.touchEnabled = true


            s.sendBtn = SkinManager.createBtn2(s, s.input.x + s.input.width, s.input.y + 2, ['rms_btn_bg_1_png'], URLConf.mainImg + 'd2sheet.png')
            s.sendBtn['eventname'] = 'send'
            s.sendBtn.label = '赠送'
            s.sendBtn.labelDisplay.color = 0xffffff
            s.sendBtn.labelDisplay.size = 30

            s.bindEvent()
        }

        public updateState(): void {
            const s = this
            s.input.text = ''
        }

        private bindEvent(): void {

            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
            s.input.addEventListener(egret.Event.CHANGE, s.handleInputChange, s)

            s.eventSets = {
                close: () => {
                    UtilTool.clickSound()
                    s.hide()
                },
                gtext: () => {
                    UtilTool.clickSound()
                    s.gText.color = 0xffffff
                    s.yText.color = 0x999999
                    s.type = 1
                },
                ytext: () => {
                    UtilTool.clickSound()
                    s.gText.color = 0x999999
                    s.yText.color = 0xffffff
                    s.type = 2
                },
                send: () => {
                    UtilTool.clickSound()
                    MainModel.getInstance().giveGift({
                        userId: s.userData.userId,
                        type: s.type,
                        num: s.input.text,
                        name: '币'
                    }, () => {
                        s.updateState()
                    }, s)
                }
            }
        }

        private handleInputChange(e: egret.Event): void {

            const s = this
            if (isNaN(Number(e.target.text))) {
                e.target.text = ''
            } else {
                let reg = new RegExp(/^[1-9]{1}\d*$/g)
                let flag = reg.test(e.target.text)
                if (!flag) e.target.text = ''
            }
        }

        private handleClick(e: egret.Event): void {
            const s = this

            s.eventSets[e.target.eventname] && s.eventSets[e.target.eventname]()
        }


        public show(d: any): void {

            let s = this

            LayerManager.getInstance().setTopMask(true, 0.5, 2);
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);
            s.userData = d

        }

        public hide(): void {

            let s = this
            LayerManager.getInstance().setTopMask(true, 0.5, 1);
            (s.parent as any).removeElement(s);

        }

    }
}