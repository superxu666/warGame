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
        private list: GYLite.GYListV

        private eventSets: any

        constructor() {
            super()
            const s = this

            s.eventSets = {}

            s.width = 800
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

            let line = SkinManager.createScaleImage(s, 0, 140, 'rms_view_line_2_png', URLConf.mainImg + 'd2sheet.png', new GYLite.Scale9GridRect())
            line.width = s.width

            let titAry = ['时间', '描述', '收益']
            for (let i = 0; i < titAry.length; i++) {

                let tit = SkinManager.createText(s, i * s.width / 3 + (s.width / 3 - 160) / 2, 78, titAry[i], 0xffffff, 40, 'center', 160, 40)
            }

            s.list = SkinManager.createListV(s, 0, 160, s.width - 40, 320, BetDetailItem)
            s.list.x = s.width - 760 >> 1
            s.list.canDrag = true
            s.list.scrollerPolicy = 2

            s.bindEvent()
        }

        private bindEvent(): void {
            const s = this

            s.eventSets = {
                close: () => {
                    UtilTool.clickSound()
                    s.hide()
                }
            }

            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(e): void {
            const s = this
            s.eventSets[e.target['eventname']] && s.eventSets[e.target['eventname']](e)
        }

        public setData(d: any): void {
            const s = this
            s.list.dataProvider = d
        }

        public show(): void {

            let s = this

            LayerManager.getInstance().setTopMask(true);
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

            MainModel.getInstance().getMyRecord()
        }

        public hide(): void {

            let s = this
            LayerManager.getInstance().setTopMask(false);
            (s.parent as any).removeElement(s);
        }
    }

    export class BetDetailItem extends GYLite.ItemRender {

        private time: GYLite.GYText
        private desc: GYLite.GYText
        private num: GYLite.GYText
        private icon: GYLite.GYImage

        constructor() {
            super()
            const s = this

            s.width = 760
            s.height = 320 / 10

            s.icon = SkinManager.createImage(s, 0, 0, 'game_cion_gold_small_png', URLConf.mainImg + 'd1sheet.png')
            s.time = SkinManager.createText(s, 0, 0, '', 0xffffff, 14, 'center', s.width / 3, s.height)
            s.desc = SkinManager.createText(s, s.width / 3, 0, '', 0xffffff, 14, 'center', s.width / 3, s.height)
            s.num = SkinManager.createText(s, s.width / 3 * 2 + 140, 0, '', 0xffffff, 14, 'left', s.width / 3, s.height)
            s.time.y = s.desc.y = s.num.y = s.height - 14 >> 1
            s.icon.x = s.width / 3 * 2 + 140 - 32
            s.icon.y = s.height - 22 >> 1
        }

        public setData(d: any): void {
            const s = this
            if (!d) {
                s.visible = false
                return
            }
            s.visible = true

            s.time.text = d.createTime
            s.desc.text = d.remark
            d.num = UtilTool.formatBet(d.num)
            s.num.text = d.inouttype == 2 ? `- ${d.num}` : `+ ${d.num}`
            s.icon.source = Main.instance.getRes(d.type == 1 ? 'game_cion_gold_small_png' : 'game_cion_silver_small_png', URLConf.mainImg + 'd1sheet.png')
        }

    }
}