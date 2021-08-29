module main {
    export class PersonalView extends GYLite.GYUIComponent {


        private static _instance: PersonalView

        public static getInstance(): PersonalView {

            return PersonalView._instance || (PersonalView._instance = new PersonalView)
        }

        private head: GYLite.GYImage
        private userNickText: GYLite.GYText
        private userIdText: GYLite.GYText
        private userGText: GYLite.GYText
        private userYText: GYLite.GYText

        private userId: string
        private userG: string
        private userY: string

        private data: any = {}

        constructor() {
            super()
            let s = this

            s.width = 240
            s.height = 128

            const headBg = SkinManager.createImage(s, 20, 20, 'war_head_frame_png', URLConf.gameImg + 'w1sheet.png')
            s.head = SkinManager.createImage(s, 25, 25, '')
            s.head['eventname'] = 'head'
            s.head.width = 48
            s.head.height = 48
            TemplateTool.setBorderRadius(s.head)
            s.head.buttonModeForMouse = true;


            const ID = SkinManager.createImage(s, 80, 50, 'war_id_img_png', URLConf.gameImg + 'w1sheet.png')
            const ID_b = SkinManager.createScaleImage(s, ID.x + ID.width, ID.y, 'war_bet_setting_selected_count__bormal_bg_png', URLConf.gameImg + 'w1sheet.png', new GYLite.Scale9GridRect(2, 2, 2, 2))
            ID_b.width = 100
            ID_b.height = 20

            const G_b = SkinManager.createScaleImage(s, 20, 90, 'war_bet_setting_selected_count__bormal_bg_png', URLConf.gameImg + 'w1sheet.png', new GYLite.Scale9GridRect(2, 2, 2, 2))
            G_b.width = 100
            G_b.height = 30
            const G = SkinManager.createImage(s, 20, 90, 'war_gold_img_png', URLConf.gameImg + 'w1sheet.png')

            const Y_b = SkinManager.createScaleImage(s, 140, 90, 'war_bet_setting_selected_count__bormal_bg_png', URLConf.gameImg + 'w1sheet.png', new GYLite.Scale9GridRect(2, 2, 2, 2))
            Y_b.width = 100
            Y_b.height = 30
            const Y = SkinManager.createImage(s, 140, 90, 'war_silver_img_png', URLConf.gameImg + 'w1sheet.png')


            s.userNickText = SkinManager.createText(s, ID.x, 20, '', 0xffffff, 22)
            s.userIdText = SkinManager.createText(s, ID_b.x + 2, ID_b.y + 3, '', 0xffffff, 14)
            s.userGText = SkinManager.createText(s, G.x + G.width + 2, G.y + 8, '', 0xEFCD02, 14)
            s.userYText = SkinManager.createText(s, Y.x + Y.width + 2, Y.y + 8, '', 0xffffff, 14)


            s.bindEvent()

        }

        private bindEvent(): void {
            const s = this
            s.head.touchEnabled = true
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(e: egret.Event): void {
            const s = this

            switch (e.target['eventname']) {
                case 'head':
                    UtilTool.clickSound()
                    PersonalDialogView.getInstance().show(s.data)
                    break
            }
        }

        public setData(d: any): void {

            let s = this
            s.data = d
            s.head.source = Main.instance.getRes(d.avatar, 'main/img/head.png')
            s.userNickText.text = d.nickName
            s.userIdText.text = d.userId
            s.userGText.text = d.gold
            s.userYText.text = d.silver

        }


    }
}