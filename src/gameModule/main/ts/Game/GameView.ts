module main {
    export class GameView extends GYLite.GYUIComponent {

        private static _instance: GameView

        public static getInstance(): GameView {
            return GameView._instance || (GameView._instance = new GameView)
        }

        private back: GYLite.GYImage
        private gem: GYMovieClip
        private tween: GYLite.GYTween
        private countDown: CountDown
        private status: GYLite.GYImage
        private rank4: Rank4
        private resultListView: ResultListView
        private gameEffect: GameEffect

        private isBet: Boolean = false

        constructor() {
            super()
            const s = this

            s.width = 692
            s.height = 460
            s.back = SkinManager.createImage(s, 0, 0, 'war_tar_bg_png', URLConf.gameImg + 'w1sheet.png')

            s.gem = new GYMovieClip();
            s.gem.setDataPath(URLConf.gameSke + "war_movie_clips.json", URLConf.gameSke + "war_movie_clips.png");
            s.gem.setMovieName("DiamondFlash");
            s.gem.play(-1);
            s.gem.horizonalCenter = 0
            s.addElement(s.gem);

            s.rank4 = Rank4.getInstance()
            s.rank4.width = s.width
            s.rank4.height = s.height
            s.addElement(s.rank4)

            let statusBack = SkinManager.createImage(s, 0, 0, 'war_status_bg_png', URLConf.gameImg + 'w1sheet.png')
            statusBack.horizonalCenter = -3
            statusBack.verticalCenter = -84
            s.status = SkinManager.createImage(s, 0, 0, '')
            s.status.horizonalCenter = -3
            s.status.verticalCenter = -84

            s.countDown = new CountDown()
            s.countDown.horizonalCenter = -2
            s.countDown.verticalCenter = -26
            s.addElement(s.countDown)

            s.resultListView = ResultListView.getInstance()
            s.resultListView.y = 266
            s.resultListView.width = s.width
            s.resultListView.height = 54
            s.addElement(s.resultListView)

            /*动效*/
            s.gameEffect = GameEffect.getInstance()
            s.gameEffect.width = s.width
            s.gameEffect.height = s.height
            s.gameEffect.updateChildPosition()
            s.addElement(s.gameEffect)

            s.touchEnabled = true
            s.bindEvent()
        }

        private bindEvent(): void {
            const s = this

            // s.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

            //     if (!s.tween) {

            //         s.slideUp()
            //     } else {

            //         s.tween.run(!s.tween.isReserve)
            //     }

            // }, s)

        }

        public slideUp(): void {
            const s = this

            if (s.isBet) return
            s.isBet = true
            s.tween = GYLite.GYTween.to(s, [
                GYLite.TweenData.getInstance('top', 0, NaN)
            ], 500, 0, s, null, null, null, true, false)
        }

        public slideDown(): void {
            const s = this

            if (!s.isBet) return
            s.isBet = false
            if (s.tween) s.tween.run(!s.tween.isReserve)
        }

        /*更新倒计时*/
        public updateCountDown(num: number, type: number): void {
            const s = this

            if (type == 1) {
                s.status.source = Main.instance.getRes('war_status_bet_png', URLConf.gameImg + 'w1sheet.png')
            } else if (type == 2) {
                s.status.source = Main.instance.getRes('war_status_locked_png', URLConf.gameImg + 'w1sheet.png')
            }
            s.countDown && s.countDown.setData(num)
        }

        public updateResultList(res): void {
            const s = this
            s.resultListView.updateList(res.data)
        }

    }
}