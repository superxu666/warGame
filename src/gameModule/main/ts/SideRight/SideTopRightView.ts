module main {
    export class SideTopRightView extends GYLite.GYUIComponent {

        private static _instance: SideTopRightView

        public static getInstance(): SideTopRightView {

            return SideTopRightView._instance || (SideTopRightView._instance = new SideTopRightView)
        }

        private back: GYLite.GYImage
        public rank: GYLite.GYImage
        public account: GYLite.GYImage
        public setting: GYLite.GYImage
        public close: GYLite.GYImage

        private _imgArr: any[]
        private _state: any

        private _currentRoundSumView: CurrentRoundSumView
        private _betRankView: BetRankView

        constructor() {
            super()
            let s = this
            s.width = 304
            s.height = 680
            s.back = SkinManager.createImage(s, 0, 0, 'war_right_bg_png', URLConf.gameImg + 'w1sheet.png')

            s._imgArr = []
            let arr = ['war_top_list_btn_png', 'war_account_btn_png', 'war_setting_btn_png', 'war_close_btn_png']
            s._state = {}
            for (let i = 0; i < arr.length; i++) {

                let img = SkinManager.createImage(s, 70 + (i * (40 + 14)), 20, arr[i], 'game/img/w1sheet.png')
                img['imgname'] = arr[i]
                img.touchEnabled = true
                img.buttonModeForMouse = true
                s._imgArr.push(img)
            }
            
            // RankDialogView.getInstance().show()
            s._state[arr[0]] = () => {
                console.log('打开排行');
                RankDialogView.getInstance().show()
            }
            s._state[arr[1]] = () => {
                console.log('打开明细');
                BetDetailDialogView.getInstance().show()
            }
            s._state[arr[2]] = () => {
                console.log('设置');
                SettingDialogView.getInstance().show()
            }
            s._state[arr[3]] = () => {
                console.log('登出');
                PersonalModel.getInstance().logout()
            }


            s._betRankView = BetRankView.getInstance()
            s._betRankView.width = s.width
            s._betRankView.height = s.height
            s.addElement(s._betRankView)

            s._currentRoundSumView = CurrentRoundSumView.getInstance()
            s.addElement(s._currentRoundSumView)

            s.bindEvent()

        }

        private bindEvent(): void {
            const s = this

            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(e: egret.Event): void {

            let s = this
            if (e.target['imgname']) {
                UtilTool.clickSound()
                s._state[e.target['imgname']] && s._state[e.target['imgname']]()
            }
        }


    }
}