module main {
    export class TabButton extends GYLite.GYUIComponent {

        private back: GYLite.GYImage
        public type: number = 1

        constructor() {
            super()
            const s = this

            s.back = SkinManager.createImage(s, 0, 0, 'war_top_title_bg_png', URLConf.gameImg + 'w1sheet.png')
            s.back.anchorOffsetX = s.back.width
            s.back.skewY = 180
            s.touchEnabled = true

            let tit_l = SkinManager.createImage(s, s.back.x + 16, s.back.y + 8, 'war_top_bet_selected_png', URLConf.gameImg + 'w1sheet.png')
            let tit_r = SkinManager.createImage(s, tit_l.x + tit_l.width + 36, tit_l.y, 'war_top_winner_selected_png', URLConf.gameImg + 'w1sheet.png')

            s.bindEvent()
        }

        private bindEvent() {
            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick() {
            const s = this

            if (s.type == 1) {
                s.type = 2
                s.back.anchorOffsetX = 0
                s.back.skewY = 0
            } else {
                s.type = 1
                s.back.anchorOffsetX = s.back.width
                s.back.skewY = 180
            }

            s.clickCallback && s.clickCallback.call(s.clickThisobj, s.type)
        }


        private clickCallback: Function
        private clickThisobj: any
        public bindClick(callback: Function, thisobj: any): void {
            const s = this
            s.clickCallback = callback
            s.clickThisobj = thisobj
        }
    }
}