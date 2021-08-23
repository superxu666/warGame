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

        constructor() {
            super()
            let s = this

            // const headBg = SkinManager.createImage(s, 0, 0, 'user_head_bg_84_76_png', URLConf.mainImg + 'd1sheet.png')
            s.head = SkinManager.createImage(s, 20, 20, 'q', 'main/img/head.png')
            s.head.scaleX = 0.5
            s.head.scaleY = 0.5
            let mask = new GYLite.GYSprite;
            mask.x = s.head.x;
            mask.y = s.head.y;
            mask.width = mask.height = 50;
            let g: egret.Graphics = mask.graphics;
            g.beginFill(0, 1);
            g.drawRoundRect(0, 0, 50, 50, 50);
            g.endFill();
            s.head.mask = mask;
            s.addElement(mask)


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

        }

        public render(d: any): void {

            let s = this
            if (d.data.avatar) s.head.source = Main.instance.getRes(d.data.avatar, 'main/img/head.png')
            if (d.data.nickName) s.userNickText.text = d.data.nickName
            if (d.data.userId) s.userIdText.text = d.data.userId
            if (d.data.gold) s.userGText.text = d.data.gold
            if (d.data.silver) s.userYText.text = d.data.silver
        }

    }
}