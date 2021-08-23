module main {
    export class CurrentRoundSumView extends GYLite.GYUIComponent {

        private static _instance: CurrentRoundSumView

        public static getInstance(): CurrentRoundSumView {

            return CurrentRoundSumView._instance || (CurrentRoundSumView._instance = new CurrentRoundSumView)
        }

        private userGText: GYLite.GYText
        private userYText: GYLite.GYText

        constructor() {
            super()
            const s = this

            const G_b = SkinManager.createScaleImage(s, 100, 592, 'war_bet_setting_selected_count__bormal_bg_png', URLConf.gameImg + 'w1sheet.png', new GYLite.Scale9GridRect(2, 2, 2, 2))
            G_b.width = 100
            G_b.height = 30
            const G = SkinManager.createImage(s, 100, 592, 'war_gold_img_png', URLConf.gameImg + 'w1sheet.png')


            const Y_b = SkinManager.createScaleImage(s, 100, G_b.y + G_b.height + 5, 'war_bet_setting_selected_count__bormal_bg_png', URLConf.gameImg + 'w1sheet.png', new GYLite.Scale9GridRect(2, 2, 2, 2))
            Y_b.width = 100
            Y_b.height = 30
            const Y = SkinManager.createImage(s, 100, G_b.y + G_b.height + 5, 'war_silver_img_png', URLConf.gameImg + 'w1sheet.png')

            s.userGText = SkinManager.createText(s, G.x + G.width + 2, G.y + 8, '0', 0xEFCD02, 14)
            s.userYText = SkinManager.createText(s, Y.x + Y.width + 2, Y.y + 8, '0', 0xffffff, 14)
        }

        public render(d: any): void {
            const s = this
            s.userGText.text = d.g
            s.userYText.text = d.y
        }
    }
}