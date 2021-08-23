module main {
    export class GameView extends GYLite.GYUIComponent {

        private static _instance: GameView

        public static getInstance(): GameView {
            return GameView._instance || (GameView._instance = new GameView)
        }

        private back: GYLite.GYImage
        private _gem: GYMovieClip
        private _tween: GYLite.GYTween
        private _countDown: CountDown
        private _status: GYLite.GYImage
        private _rank4: Rank4
        private _resultListView: ResultListView

        private isBet: Boolean = false

        constructor() {
            super()
            const s = this

            s.back = SkinManager.createImage(s, 0, 0, 'war_tar_bg_png', URLConf.gameImg + 'w1sheet.png')

            s._gem = new GYMovieClip();
            s._gem.setDataPath(URLConf.gameSke + "war_movie_clips.json", URLConf.gameSke + "war_movie_clips.png");
            s._gem.setMovieName("DiamondFlash");
            s._gem.play(-1);
            s._gem.horizonalCenter = 0
            s.addElement(s._gem);


            // let sdf = new GYMovieClip();
            // sdf.setDataPath(URLConf.gameSke + "war_movie_clips.json", URLConf.gameSke + "war_movie_clips.png");
            // sdf.setMovieName("TableItemSmall");
            // sdf.play(-1);
            // sdf.horizonalCenter = 0
            // s.addElement(sdf);

            s._rank4 = Rank4.getInstance()
            s._rank4.width = s.width
            s._rank4.height = s.height
            s.addElement(s._rank4)

            let statusBack = SkinManager.createImage(s, 0, 0, 'war_status_bg_png', URLConf.gameImg + 'w1sheet.png')
            statusBack.horizonalCenter = -3
            statusBack.verticalCenter = -84
            s._status = SkinManager.createImage(s, 0, 0, '')
            s._status.horizonalCenter = -3
            s._status.verticalCenter = -84

            s._countDown = new CountDown()
            s._countDown.horizonalCenter = -2
            s._countDown.verticalCenter = -26
            s.addElement(s._countDown)


            s._resultListView = ResultListView.getInstance()
            s._resultListView.y = 266
            s._resultListView.width = s.width
            s._resultListView.height = 54
            s.addElement(s._resultListView)

            s.bindEvent()

        }

        private bindEvent(): void {
            const s = this

            // s.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

            //     if (!s._tween) {

            //         s.slideUp()
            //     } else {

            //         s._tween.run(!s._tween.isReserve)
            //     }

            // }, s)

        }

        public slideUp(): void {
            const s = this

            if (s.isBet) return
            s.isBet = true
            s._tween = GYLite.GYTween.to(s, [
                GYLite.TweenData.getInstance('bottom', 436, NaN)
            ], 500, 0, s, null, null, null, true, false)
        }

        public slideDown(): void {
            const s = this

            if (!s.isBet) return
            s.isBet = false
            if (s._tween) s._tween.run(!s._tween.isReserve)
        }

        /*更新倒计时*/
        public updateCountDown(num: number, type: number): void {
            const s = this

            if (type == 1) {
                s._status.source = Main.instance.getRes('war_status_bet_png', URLConf.gameImg + 'w1sheet.png')
            } else if (type == 2) {
                s._status.source = Main.instance.getRes('war_status_locked_png', URLConf.gameImg + 'w1sheet.png')
            }
            s._countDown && s._countDown.setData(num)
        }

        public updateResultList(res): void {
            const s = this
            s._resultListView.updateList(res.data)
        }

    }
}