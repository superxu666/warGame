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

        private resounceSets: any

        constructor() {
            super()
            const s = this
            s.effectAry = []
            s.effectSets = {}
            s.resounceSets = {
                a: {
                    sound: 'war_tribal_orc_232a6789',
                    cardUrl: 'war_tribal_card_orc_png',
                    alias: 'w3sheet',
                    starNum: '2',
                    mulit: '6',
                    cardName: '战士'
                },
                b: {
                    sound: 'war_tribal_warlock_c7998282',
                    cardUrl: 'war_tribal_card_warlock_png',
                    alias: 'w2sheet',
                    starNum: '3',
                    mulit: '8',
                    cardName: '牧师'
                },
                c: {
                    sound: 'war_tribal_minotaur_35174750',
                    cardUrl: 'war_tribal_card_monotaur_png',
                    alias: 'w2sheet',
                    starNum: '3',
                    mulit: '8',
                    cardName: '骑士'
                },
                d: {
                    sound: 'war_tribal_chief_ef2d1aa6',
                    cardUrl: 'war_tribal_card_chief_png',
                    alias: 'w2sheet',
                    starNum: '4',
                    mulit: '12',
                    cardName: '酋长'
                },
                h: {
                    sound: 'war_union_king_sound_2161fca8',
                    cardUrl: 'war_union_card_king_png',
                    alias: 'w2sheet',
                    starNum: '4',
                    mulit: '12',
                    cardName: '国王'
                },
                g: {
                    sound: 'war_union_knight_sound_9a3e206c',
                    cardUrl: 'war_union_card_knight_png',
                    alias: 'w3sheet',
                    starNum: '3',
                    mulit: '8',
                    cardName: '骑士'
                },
                f: {
                    sound: 'war_union_master_sound_38753956',
                    cardUrl: 'war_union_card_master_png',
                    alias: 'w3sheet',
                    starNum: '3',
                    mulit: '8',
                    cardName: '牧师'
                },
                e: {
                    sound: 'war_union_warrior_sound_b8b53f6f',
                    cardUrl: 'war_union_card_warrior_png',
                    alias: 'w3sheet',
                    starNum: '2',
                    mulit: '6',
                    cardName: '战士'
                },
                k: 'war_effect_dragon_black_f18fa885'
            }

            s.resultAry = [
                'k', 'h1', 'g1', 'f1', 'e1', 'h2', 'g2', 'f2', 'e2', 'h3', 'g3', 'f3', 'e3',
                'i', 'a3', 'b3', 'c3', 'd3', 'a2', 'b2', 'c2', 'd2', 'a1', 'b1', 'c1', 'd1'
            ]
            for (let i = 0, len = s.resultAry.length; i < len; i++) {

                let param = (i == 0 || i == 13) ? 'big' : 'small'
                let mc = new EffectItem(param)
                s.addElement(mc)
                s.effectAry.push(mc)
                s.effectSets[s.resultAry[i]] = mc

            }


            // 测试
            // let cardR = s.resounceSets['f']
            // CardEffect.getInstance().show(s, {
            //     x: 0,
            //     y: 0,
            //     cardUrl: cardR.cardUrl,
            //     alias: URLConf.gameImg + `${cardR.alias}.png`,
            //     starNum: cardR.starNum,
            //     cardName: cardR.cardName,
            //     mulit: cardR.mulit
            // })

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

            UtilTool.resultSound()
            s.run(2, () => {
                s.findResult(d.result)
            }, s)

        }

        /**
         * 动效开始
         */
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

        /**
         * 动效开始查找结果
         */
        private findResult(res: string, completeFunc?: Function, thisobj?: any) {
            const s = this

            s.resultEffect = s.effectSets[res]
            if (s.effectAry[s.curIndex] === s.effectSets[res]) {
                s.effectSets[res].isResult = 1
                s.effectAry[s.curIndex].show = true
                s.curIndex = 0
                GYLite.TimeManager.timeOut(() => {
                    s.playSound(res)
                }, s, 250)
                return
            }
            s.effectAry[s.curIndex].show = true
            s.curIndex++
            GYLite.TimeManager.timeOut(() => { s.findResult(res, completeFunc, thisobj) }, s, 80)
        }

        public clearEffect(): void {
            const s = this
            if (s.resultEffect) {
                s.resultEffect.isResult = false
                s.resultEffect.alpha = 0

                CardEffect.getInstance().hide()
            }
        }

        /**
         * 播放结果音频
         */
        private playSound(res): void {
            const s = this
            if (res != 'i') {

                res = res.charAt()
                SoundManager.instance.play(Conf.sound + `${s.resounceSets[res].sound}.mp3`, 0, 1, null, null, 300)

                GYLite.TimeManager.timeOut(() => {

                    let cardR = s.resounceSets[res]
                    let card = s.resultEffect
                    CardEffect.getInstance().show(s, {
                        x: card.x,
                        y: card.y,
                        cardUrl: cardR.cardUrl,
                        alias: URLConf.gameImg + `${cardR.alias}.png`,
                        starNum: cardR.starNum,
                        cardName: cardR.cardName,
                        mulit: cardR.mulit
                    })
                    
                }, s, 1000)
            }
        }

    }
}