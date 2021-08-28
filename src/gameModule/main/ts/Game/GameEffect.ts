module main {
    export class GameEffect extends GYLite.GYUIComponent {


        private static _instance: GameEffect

        public static getInstance(): GameEffect {
            return GameEffect._instance || (GameEffect._instance = new GameEffect)
        }


        private effectAry: any[]
        private effectSets: any
        private resultAry: any[]
        private result: any = null
        private resultEffect: EffectItem
        // 当前mc
        private curIndex = 0
        // 当前滚动到第几圈
        private round = 0

        constructor() {
            super()
            const s = this
            s.effectAry = []
            s.effectSets = {}

            s.resultAry = [
                'k', 'h1', 'g1', 'f1', 'e1', 'h2', 'g2', 'f2', 'e2', 'h3', 'g3', 'f3', 'e3',
                'i', 'a3', 'b3', 'c3', 'd3', 'a2', 'b2', 'c2', 'd2', 'a1', 'b1', 'c1', 'd1'
            ]
            for (let i = 0, len = s.resultAry.length; i < len; i++) {

                if (i == 0 || i == 13) {

                    let mc = new EffectItem('big')
                    s.addElement(mc)
                    s.effectAry.push(mc)
                    s.effectSets[s.resultAry[i]] = mc

                } else {

                    let mc = new EffectItem()
                    s.addElement(mc)
                    s.effectAry.push(mc)
                    s.effectSets[s.resultAry[i]] = mc
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


        public setResult(d: any): void {
            const s = this
            s.result = d
            console.log('开奖结果: ', d);

            s.clearEffect()
            s.run(2, () => {
                // let index = Math.floor(Math.random() * s.resultAry.length)
                // console.log('开奖结果: ', s.resultAry[index]);
                s.findResult(d.result)
            }, s)

            // let index = Math.floor(Math.random() * s.resultAry.length)
            // console.log('开奖结果: ', s.resultAry[index]);
            // s.findResult(s.resultAry[index])
        }

        public run(round: number = 2, completeFunc?: Function, thisobj?: any) {
            const s = this

            s.effectAry[s.curIndex].show = true
            if (s.curIndex == s.effectAry.length - 1) {
                s.curIndex = 0
                if (++s.round == round) { // 默认跑2轮
                    completeFunc && completeFunc(thisobj)
                    s.round = 0
                    return
                }
                s.run(round, completeFunc, thisobj)
                return
            }
            s.curIndex++
            GYLite.TimeManager.timeOut(() => { s.run(round, completeFunc, thisobj) }, s, 80)

        }


        private findResult(res: string, completeFunc?: Function, thisobj?: any) {
            const s = this

            s.resultEffect = s.effectSets[res]
            s.effectSets[res].isResult = true
            s.effectAry[s.curIndex].show = true
            if (s.effectAry[s.curIndex] === s.effectSets[res]) {
                s.curIndex = 0
                SoundManager.instance.play(Conf.sound + 'war_tribal_minotaur_35174750.mp3', 0, 1, null, null, 123)
                return
            }
            s.curIndex++
            GYLite.TimeManager.timeOut(() => { s.findResult(res, completeFunc, thisobj) }, s, 80)
        }

        public clearEffect(): void {
            const s = this
            if (s.resultEffect) {
                s.resultEffect.isResult = false
                s.resultEffect.alpha = 0
            }
        }

    }
}