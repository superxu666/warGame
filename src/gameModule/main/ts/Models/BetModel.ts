module main {
    export class BetModel {

        private static _instance: BetModel

        public static getInstance(): BetModel {
            return BetModel._instance || (BetModel._instance = new BetModel)
        }

        public betType: number = 1
        public betNum: number = 1

        public lastSum: any[]
        public betSets: Object

        public betNumObj: Object


        constructor() {

            const s = this
            s.lastSum = []
            s.betSets = {}
            s.betNumObj = {
                g: 0,
                y: 0
            }
        }

        public setData(type?: number, num?: number): void {
            const s = this
            if (type) s.betType = type
            if (num) s.betNum = num
        }

        /*下注映射*/
        public setBetSets(d: any): any {

            const s = this

            let ary = []
            let item = {
                type: s.betType,
                num: s.betNum
            }
            ary.push({
                role: d,
                infos: [item]
            })

            s.bet(ary)
            return item
        }

        public setLastRoundSum(lastSum: any[]): void {
            const s = this
            if (lastSum.length > 0) {
                s.lastSum = lastSum
            }
        }

        /*统计该轮游戏的总额*/
        public setCurrentRoundSum(g: number, y: number): void {

            const s = this
            CurrentRoundSumView.getInstance().render({ g, y })
        }


        /*下注接口*/
        public bet(params: any): void {
            const s = this

            BaseHttp.getInstance().sendMsg('/war/game/bet', params, HTTPConf.M_POST, (res) => {

                // 更新左上角显示的游戏币
                PersonalModel.getInstance().getMyInfo()
            }, s)

        }

    }
}