module main {
    export class EffectItem extends GYLite.GYUIComponent {


        private tween: GYLite.GYTween
        constructor(type = 'small') {
            super()
            const s = this

            let mc = new GYMovieClip();
            mc.setDataPath(URLConf.gameSke + "war_movie_clips.json", URLConf.gameSke + "war_movie_clips.png");
            mc.setMovieName(type == 'small' ? 'TableItemSmall' : 'TableItemBig')
            mc.play(-1);
            s.addElement(mc);
            s.width = mc.width
            s.height = mc.height
            s.alpha = 0
            s.tween = GYLite.GYTween.to(s, [
                GYLite.TweenData.getInstance('alpha', 1, null)
            ], 500, 0, s, null, null, null, false, false)
        }

        public set show(val) {
            const s = this
            if (val) {
                // UtilTool.effectSound()
                s.tween.run()
            } else {
                s.tween.run(!s.tween.isReserve)
            }
        }

        public get show() {
            const s = this
            return !!s.alpha
        }

    }
}