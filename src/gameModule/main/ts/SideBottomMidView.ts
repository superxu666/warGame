module main {
    export class SideBottomMidView extends GYLite.GYUIComponent {

        private static _instance: SideBottomMidView

        public static getInstance(): SideBottomMidView {

            return SideBottomMidView._instance || (SideBottomMidView._instance = new SideBottomMidView)
        }

        constructor() {
            super()
            let s = this
        }

    }
}