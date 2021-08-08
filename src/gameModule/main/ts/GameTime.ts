module main {

    export class GameTime {

        public preTime: number
        public gameTtime: number

        private _timeId: number

        private static _instance: GameTime

        public static getInstance(): GameTime {
            return GameTime._instance || (GameTime._instance = new GameTime)
        }

        constructor() {

            let s = this
            s._timeId = -1;
        }

        public run(): void {
            let s = this;
            s.preTime = Date.now()
            // console.log('preTime - ', s.preTime);
            GameModel.getInstance().getTime((res) => {
                // s.gameTtime = res - s.preTime
                // console.log('gameTtime - ', s.gameTtime);

                s.gameTtime = 59 - (new Date(res)).getSeconds()
                s._timeId = GYLite.TimeManager.timeInterval(s.countDown, s, 1000)

            }, s)
        }


        public countDown(): void {

            let s = this
            let second = --s.gameTtime
            console.log(second);

            /*59-35 34-30 29-25 24-20*/

            
            if (second >= 35) { /*下注时间*/

                console.log('玩家下注时间');
                
            } else if (second >= 30) { /*锁定*/

                console.log('锁定时间, 不可操作');

            } else if (second >= 25) { /*轮盘滚动*/

                console.log('滚盘动画, 不可操作');
            } else {

                console.log('出奖动画, 不可操作');
                
            }

            if (second == 0) {

                console.log('该轮游戏结束');
                GYLite.TimeManager.unTimeInterval(s._timeId, s.countDown, s)
            }

        }


    }
}