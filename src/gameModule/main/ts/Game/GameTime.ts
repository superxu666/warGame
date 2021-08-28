module main {

    export class GameTime {

        public preTime: number
        public gameTtime: number
        public betTime: number

        private _timeId: number = 0
        /*锁定时间, 默认锁定不可点击*/
        public timeOut: Boolean

        private static _instance: GameTime
        public static getInstance(): GameTime {
            return GameTime._instance || (GameTime._instance = new GameTime)
        }

        public timeType: string = '1'

        constructor() { }

        public run(): void {
            let s = this;

            const preTime = Date.now()
            GameModel.getInstance().getTime((res) => {

                const endTime = res.data + (Date.now() - preTime)
                // console.log('请求时间占用 - ', (Date.now() - preTime), 'ms');

                /*0-25: 下注*/
                /*27-32: 封注*/
                /*33-59: 滚盘+开奖*/
                let second = (new Date(endTime)).getSeconds()
                // console.log('服务第: ', second + '秒');
                s.gameTtime = second
                s.gameStart()

            }, s)

            /*获取排行榜*/
            GameModel.getInstance().getLastWinRank()
            /*获取开奖历史*/
            GameModel.getInstance().getHistoryLottery()
        }

        public gameStart(): void {

            let s = this
            let second = 0
            if (s.gameTtime <= 25) {
                second = 25 - s.gameTtime
                s.betTime = second
                // console.log('下注时间还剩: ', second);
            }

            s._timeId = GYLite.TimeManager.timeInterval(s.timeStart, s, 1000)
        }

        public timeStart(): void {

            let s = this
            let second = ++s.gameTtime
            s.timeOut = true

            if (0 <= second && second < 26) {

                if (second == 1) {
                    SoundManager.instance.play(Conf.sound + 'rms_round_start.mp3')
                }
                if (second == 23) {
                    SoundManager.instance.play(Conf.sound + 'rms_bet_alarm.mp3', 0, 2, () => {
                        SoundManager.instance.play(Conf.sound + 'rms_bet_end.mp3')
                    })
                }

                s.timeOut = false
                s.betTime = 25 - second
                GameView.getInstance().slideUp()
                GameView.getInstance().updateCountDown(s.betTime, 1)
                /*下注查询*/
                GameModel.getInstance().getBettingTotal()
                /*下注玩家排行*/
                GameModel.getInstance().getBettingRank()

                // console.log('下注时间还剩: ', s.betTime);
            } else if (26 <= second && second < 32) {


                GameView.getInstance().slideDown()
                GameView.getInstance().updateCountDown(31 - second, 2)

                // console.log('锁定时间: ', second);
            } else if (32 <= second && second < 58) {

                if (second == 33) {
                    GameModel.getInstance().getResult((res) => {

                        GameEffect.getInstance().setResult(res.data)
                    }, s)
                }

                // console.log('开奖时间: ', second);

                /*  开奖接口数据结构
                    boxresult: null
                    boxtype: null
                    id: 18360
                    multiple: null
                    result: "h2"
                    timemin: "202108281017"
                    timestamp: 1630117053815
                */

            } else if (58 < second) {

                // 清空下注台
                SideBottomMidView.getInstance().clearBet()
                // console.log('该轮游戏到达59阶段, 可开始请求时间戳, 进入下一轮游戏', second);
                GYLite.TimeManager.unTimeInterval(s._timeId, s.timeStart, s)
                s.run()
            }

        }

        /**
         * 停止计时
         */
        public stop(): void {
            const s = this
            GYLite.TimeManager.unTimeInterval(s._timeId, s.timeStart, s)
            // 清空下注台
            SideBottomMidView.getInstance().clearBet()
        }

    }
}