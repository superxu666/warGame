module main {
    export class GameView extends GYLite.GYUIComponent {

        private static _instance: GameView

        public static getInstance(): GameView {
            return GameView._instance || (GameView._instance = new GameView)
        }

        private back: GYLite.GYImage
        private _gem: GYMovieClip
        private _tween: GYLite.GYTween

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

            s.touchEnabled = true


            s.bindEvent()

        }

        private bindEvent(): void {
            const s = this


            s.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {

                // SideBottomMidView.getInstance().bet([
                // 	{
                // 		role: 'h',
                // 		g: 10,
                // 		y: 100
                // 	},
                // 	{
                // 		role: 'j',
                // 		g: 120,
                // 		y: 20309
                // 	}
                // ])

                if (!s._tween) {

                    s.slideUp()
                } else {

                    s._tween.run(!s._tween.isReserve)
                }

            }, s)

        }

        public slideUp(): void {
            const s = this

            if (s.isBet) return
            s.isBet = true
            s._tween = GYLite.GYTween.to(s, [
                GYLite.TweenData.getInstance('bottom', 440, NaN)
            ], 500, 0, s, null, null, null, true, false)
        }

        public slideDown(): void {
            const s = this

            if (!s.isBet) return
            s.isBet = false
            if (s._tween) s._tween.run(!s._tween.isReserve)
        }

    }
}