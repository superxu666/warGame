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

        constructor() {
            super()
            let s = this

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

            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)


            s._state[arr[0]] = () => {
                console.log('0');
            }
            s._state[arr[1]] = () => {
                console.log('1');
            }
            s._state[arr[2]] = () => {
                console.log('2');
            }
            s._state[arr[3]] = () => {
                console.log('登出');
                s.loginoutcb && s.loginoutcb.call(s.loginoutthisobj)
            }

        }


        private handleClick(e: egret.Event): void {

            let s = this
            if (e.target['imgname']) {
                s._state[e.target['imgname']] && s._state[e.target['imgname']]()
            }
        }

        private loginoutcb: Function
        private loginoutthisobj: any
        public bindLoginOut(callback: Function, thisobj: any): void {
            let s = this
            s.loginoutcb = callback
            s.loginoutthisobj = thisobj
        }


    }
}