/**
 * 设置
 */


module main {
    export class SettingDialogView extends GYLite.GYUIComponent {

        private static _instance: SettingDialogView

        public static getInstance(): SettingDialogView {

            return SettingDialogView._instance || (SettingDialogView._instance = new SettingDialogView)
        }

        constructor() {
            super()
            const s = this
        }
    }
}