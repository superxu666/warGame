module main {
    export class SwitchButton extends GYLite.GYUIComponent {


        private slideButton: GYLite.GYImage
        private openText: GYLite.GYImage
        private offText: GYLite.GYImage
        private _isOpen: boolean = true

        constructor() {
            super()
            const s = this

            s.width = 350
            s.height = 60
            s.slideButton = SkinManager.createImage(s, 0, 0, 'rms_setting_toggle_selected_bg_png', URLConf.mainImg + 'd2sheet.png')
            s.slideButton.y = s.height - s.slideButton.height >> 1
            s.openText = SkinManager.createImage(s, 0, 0, 'rms_setting_toggle_open_selected_png', URLConf.mainImg + 'd2sheet.png')
            s.openText.x = (s.width / 2 - s.openText.width) / 2
            s.openText.y = s.height - s.openText.height >> 1
            s.offText = SkinManager.createImage(s, 0, 0, 'rms_setting_toggle_close_normal_png', URLConf.mainImg + 'd2sheet.png')
            s.offText.x = s.width / 2 + (s.width / 2 - s.offText.width) / 2
            s.offText.y = s.height - s.offText.height >> 1
            s.touchEnabled = true
            TemplateTool.setBackGrapics(s, 0, 0)

            s.bindeEvent()
        }

        public set isOpen(val) {
            const s = this
            s._isOpen = val
            s.updateState()
        }

        public get isOpen() {
            const s = this
            return s._isOpen
        }

        private bindeEvent(): void {

            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(e: egret.Event): void {

            const s = this
            s.isOpen = !s.isOpen
            s.cb && s.cb.call(s.to, s.isOpen)
        }

        private updateState(): void {
            const s = this
            if (!s.isOpen) {
                s.slideButton.x = s.width / 2
                s.openText.source = Main.instance.getRes('rms_setting_toggle_open_normal_png', URLConf.mainImg + 'd2sheet.png')
                s.offText.source = Main.instance.getRes('rms_setting_toggle_close_selected_png', URLConf.mainImg + 'd2sheet.png')
            } else {
                s.slideButton.x = 0
                s.openText.source = Main.instance.getRes('rms_setting_toggle_open_selected_png', URLConf.mainImg + 'd2sheet.png')
                s.offText.source = Main.instance.getRes('rms_setting_toggle_close_normal_png', URLConf.mainImg + 'd2sheet.png')
            }
        }

        private cb: Function
        private to: any
        public bindClick(cb: Function, to: any): void {
            const s = this
            s.cb = cb
            s.to = to
        }

    }
}