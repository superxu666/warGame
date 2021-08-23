/**
 * 明细
 */

module main {
    export class BetDetailDialogView extends GYLite.GYUIComponent {

        private static _instance: BetDetailDialogView

        public static getInstance(): BetDetailDialogView {

            return BetDetailDialogView._instance || (BetDetailDialogView._instance = new BetDetailDialogView)
        }

        constructor() {
            super()
            const s = this
        }
    }
}