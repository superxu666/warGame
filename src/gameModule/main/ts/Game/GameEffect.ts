module main {
    export class GameEffect extends GYLite.GYUIComponent {


        private static _instance: GameEffect

        public static getInstance(): GameEffect {
            return GameEffect._instance || (GameEffect._instance = new GameEffect)
        }


        private effectAry: any[]
        private effectSets: any

        constructor() {
            super()
            const s = this
            s.effectAry = []
            s.effectSets = {}

            let nameAry = [
                'k', 'h1', 'g1', 'f1', 'e1', 'h2', 'g2', 'f2', 'e2', 'h3', 'g3', 'f3', 'e3',
                'i', 'a3', 'b3', 'c3', 'd3', 'a2', 'b2', 'c2', 'd2', 'a1', 'b1', 'c1', 'd1'
            ]
            for (let i = 0, len = nameAry.length; i < len; i++) {
                // let mc = new GYMovieClip();
                // mc.setDataPath(URLConf.gameSke + "war_movie_clips.json", URLConf.gameSke + "war_movie_clips.png");
                // if (i == 0 || i == 13) {
                //     mc.setMovieName("TableItemBig");
                // } else {
                //     mc.setMovieName("TableItemSmall");
                // }
                // mc.play(-1);
                // mc.visible = false
                // s.addElement(mc);
                // s.effectAry.push(mc)
                // s.effectSets[nameAry[i]] = mc

                if (i == 0 || i == 13) {

                    let mc = new EffectItem('big')
                    s.addElement(mc)
                    s.effectAry.push(mc)
                    s.effectSets[nameAry[i]] = mc

                } else {

                    let mc = new EffectItem()
                    s.addElement(mc)
                    s.effectAry.push(mc)
                    s.effectSets[nameAry[i]] = mc
                }

            }

        }

        public updateChildPosition(): void {
            const s = this

            for (let i = 0; i < 26; i++) {

                let mc = s.effectAry[i]
                if (i == 0) {
                    mc.x = s.width - mc.width >> 1
                    mc.y = 46
                } else if (i <= 4) { // 右上
                    mc.x = (s.width - mc.width) / 2 + 40 + i * 58
                    mc.y = 46
                } else if (5 <= i && i <= 8) { // 右中

                    mc.x = s.width - mc.width - 38
                    mc.y = (i - 3) * 58 - 12

                } else if (9 <= i && i <= 12) { // 右下

                    mc.x = (s.width - mc.width) / 2 + 40 + (13 - i) * 58
                    mc.y = 340
                } else if (i == 13) {

                    mc.x = s.width - mc.width >> 1
                    mc.y = 340
                } else if (14 <= i && i <= 17) { // 左下

                    mc.x = (18 - i) * 58 - 22
                    mc.y = 340
                } else if (18 <= i && i <= 21) { // 左中

                    mc.x = 36
                    mc.y = (22 - i) * 58 + 46

                } else if (22 <= i && i <= 25) { // 左上
                    mc.x = (i - 21) * 58 - 22
                    mc.y = 46
                }

            }

        }

        private round = 1;
        private curIndex = 0
        private timer = 0
        public run() {
            const s = this

            s.effectAry[s.curIndex].show = true
            s.timer = GYLite.TimeManager.timeOut(s.start, s, 60)
        }

        private start() {
            const s = this
            s.effectAry[s.curIndex].show = false
            s.curIndex++
            if (s.curIndex == 26) {
                s.curIndex = 0
                if (s.round > 1) { // 跑完2圈
                    s.round = 1
                    GYLite.TimeManager.unTimeOut(s.timer, s.start, s)
                    return
                }
                s.round++

            }
            s.run()
        }

    }
}