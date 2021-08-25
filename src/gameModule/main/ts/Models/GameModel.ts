module main {
    export class GameModel {

        private static _instance: GameModel

        public lastWinRank: any[]

        constructor() {
            const s = this
            s.lastWinRank = []
        }

        public static getInstance(): GameModel {
            return GameModel._instance || (GameModel._instance = new GameModel)
        }

        /**
         * 获取服务器时间
         */
        public getTime(callback: Function, thisobj: any): void {
            let s = this;
            BaseHttp.getInstance().sendMsg('/war/game/getTime', {}, HTTPConf.M_GET, callback, thisobj)
        }

        /**
         * 查开奖结果历史
         */
        public getHistoryLottery(callback?: Function, thisobj?: any): void {

            const s = this
            BaseHttp.getInstance().sendMsg('/war/game/getHistoryLottery', {}, HTTPConf.M_GET, (res) => {

                GameView.getInstance().updateResultList(res)
                callback && callback.call(thisobj, res)
            }, s)
        }

        /**
         * 上轮赢家排行
         */
        public getLastWinRank(callback?: Function, thisobj?: any): void {
            const s = this
            BaseHttp.getInstance().sendMsg('/war/game/getLastWinRank', {}, HTTPConf.M_GET, (res) => {

                s.lastWinRank = res.data
                Rank4.getInstance().updateRankView(res.data)
                callback && callback.call(thisobj, res)
            }, s)
        }

        /**
         * 本轮赢家排行
         */
        public getBettingRank(callback?: Function, thisobj?: any): void {
            const s = this
            BaseHttp.getInstance().sendMsg('/war/game/getBettingRank', {}, HTTPConf.M_GET, (res) => {

                BetRankView.getInstance().updateRankList(res.data)
                callback && callback.call(thisobj, res)
            }, s)
        }

        /**
         * 实时总下注情况(包含机器人)
         */
        public getBettingTotal(callback?: Function, thisobj?: any): void {
            const s = this
            BaseHttp.getInstance().sendMsg('/war/game/getBettingTotal', {}, HTTPConf.M_GET, callback, thisobj)
        }

        /**
         * 查当轮开奖结果
         */
        public getResult(callback?: Function, thisobj?: any): void {
            const s = this
            BaseHttp.getInstance().sendMsg('/war/game/getResult', {}, HTTPConf.M_GET, callback, thisobj)
        }

        /**
         * 昨今日金银币榜
         */
        public selectWinRank(params: any, callback?: Function, thisobj?: any): void {
            const s = this
            BaseHttp.getInstance().sendMsg('/war/accountrecord/selectWinRank', params, HTTPConf.M_GET, (res) => {

                RankDialogView.getInstance().updateRankList(res.data)
                callback && callback.call(thisobj, res)
            }, s)
        }

        /**
         * vip排行榜
         */
        public getVipRank(callback?: Function, thisobj?: any): void {

            const s = this
            BaseHttp.getInstance().sendMsg('/war/game/getVipRank', {}, HTTPConf.M_GET, (res) => {

                RankDialogView.getInstance().updateRankList(res.data, 'vip')
                callback && callback.call(thisobj, res)
            }, s)
        }

    }
}