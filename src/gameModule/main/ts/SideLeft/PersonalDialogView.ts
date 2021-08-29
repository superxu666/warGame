module main {
    export class PersonalDialogView extends GYLite.GYUIComponent {

        private static _instance: PersonalDialogView

        public static getInstance(): PersonalDialogView {

            return PersonalDialogView._instance || (PersonalDialogView._instance = new PersonalDialogView)
        }

        private close: GYLite.GYButton
        private nickname: GYLite.GYText
        private userid: GYLite.GYText
        private head: GYLite.GYImage
        private exp: GYLite.GYText
        private expScale: GYLite.GYScaleSprite
        private level: GYLite.GYText

        private gtext: GYLite.GYText
        private ytext: GYLite.GYText

        private eventSets: any

        constructor() {
            super()
            const s = this

            s.eventSets = {}

            s.width = 635
            s.height = 290

            s.horizonalCenter = 0
            s.verticalCenter = 0

            let back = SkinManager.createScaleImage(s, 0, 0, 'rms_view_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(60, 60, 60, 60))
            back.width = s.width
            back.height = s.height

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close['eventname'] = 'close'
            s.close.top = -20
            s.close.right = -20


            let expbg = SkinManager.createImage(s, 156, 60, 'rms_usercenter_exp_bg_png', URLConf.mainImg + 'd2sheet.png')
            s.expScale = SkinManager.createScaleImage(s, expbg.x + 5, expbg.y + 3, 'rms_usercenter_exp_img_png', URLConf.mainImg + 'd2sheet.png')
            s.expScale.mode = 1
            s.expScale.width = 0

            let headbg = SkinManager.createImage(s, 118, 46, 'rms_user_head_bg_png', URLConf.mainImg + 'd2sheet.png');
            s.head = SkinManager.createImage(s, headbg.x + 21, headbg.y + 16, '')
            s.head.width = 60
            s.head.height = 60
            TemplateTool.setBorderRadius(s.head)


            let line = SkinManager.createScaleImage(s, 0, 168, 'rms_view_line_2_png', URLConf.mainImg + 'd2sheet.png', new GYLite.Scale9GridRect(30, 30))
            line.width = s.width

            s.nickname = SkinManager.createText(s, 230, 60, '', 0xffffff, 16, 'left', 110, 25)
            s.userid = SkinManager.createText(s, 230, s.nickname.y + s.nickname.height, 'ID 5648456', 0xC88C4C, 14, 'left', 110, 25)
            s.level = SkinManager.createText(s, 380, 76, '', 0x60A7D8, 18, 'left', 110, 25)
            s.level.bold = true
            s.exp = SkinManager.createText(s, 230, 110, '', 0xffffff, 14)


            let gbg = SkinManager.createScaleImage(s, 142, 175, 'rms_sysmsg_item_title_bg_png', URLConf.mainImg + 'd2sheet.png')
            let ybg = SkinManager.createScaleImage(s, 142, 229, 'rms_sysmsg_item_title_bg_png', URLConf.mainImg + 'd2sheet.png')
            gbg.width = ybg.width = s.width / 2


            SkinManager.createImage(s, 150, 180, 'game_cion_gold_big_png', URLConf.mainImg + 'd1sheet.png')
            SkinManager.createImage(s, 150, 230, 'game_cion_silver_big_png', URLConf.mainImg + 'd1sheet.png')

            s.gtext = SkinManager.createText(s, 210, 192, '')
            s.ytext = SkinManager.createText(s, 210, 240, '')


            TemplateTool.openDrag(s)
            s.bindEvent()
        }

        private bindEvent(): void {

            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)

            s.eventSets = {
                close: () => {
                    UtilTool.clickSound()
                    s.hide()
                },
            }
        }

        private handleClick(e: egret.Event): void {
            const s = this

            s.eventSets[e.target.eventname] && s.eventSets[e.target.eventname]()
        }


        public show(d: any): void {

            const s = this
            LayerManager.getInstance().setTopMask(true);
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

            s.head.source = Main.instance.getRes(d.avatar, Conf.img + 'head.png')
            s.nickname.text = d.nickName
            s.gtext.text = d.gold
            s.ytext.text = d.silver
            let level = UtilTool.getGrade(d.exp)
            s.level.text = `LV ${level}`
            s.userid.text = `ID ${d.userId}`
            s.exp.text = `${d.exp}/${UtilTool.getCurExpTotal(level)}`
            s.expScale.width = (d.exp / Number(UtilTool.getCurExpTotal(level))) * 353

        }

        public hide(): void {

            const s = this
            LayerManager.getInstance().setTopMask(false);
            (s.parent as any).removeElement(s);
        }

    }
}