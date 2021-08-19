module main {
    export class BetButton extends GYLite.GYUIComponent {

        public selectionGroup: SelectionGroup
        private _back: GYLite.GYImage
        private _selectedImg: GYLite.GYImage
        private _sourceImg: GYLite.GYImage

        /*1:金子, 2:银子*/
        public type: number = 1

        constructor() {
            super()
            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        public setData(conf: any): void {

            const s = this
            s._back = SkinManager.createImage(s, 0, 0, conf.background, conf.alias)
            s._selectedImg = SkinManager.createImage(s, 0, 0, conf.select, conf.alias)
            s._sourceImg = SkinManager.createImage(s, 0, 0, conf.source, conf.alias)
            s._back.width = s._selectedImg.width = s._sourceImg.width + 20
            s._back.height = s._selectedImg.height = s._sourceImg.height + 10
            s._sourceImg.x = s._back.width - s._sourceImg.width >> 1
            s._sourceImg.y = s._back.height - s._sourceImg.height >> 1

            s._selectedImg.visible = false
            s.invalidLayout()
        }

        private handleClick(): void {
            const s = this
            if (s.selectionGroup) {

                let selectedBtn = s.selectionGroup.curSelection
                selectedBtn.selected = false

                s.selected = true
                s.selectionGroup.curSelection = s
            } else {

                s.selected = !s.selected
            }
        }

        public invalidLayout(): void {
            const s = this

            if (s.selectionGroup) {
                let selectedBtn = s.selectionGroup.curSelection
                selectedBtn.selected = true
            }
        }

        public set selected(isSel: boolean) {
            const s = this
            s._selectedImg.visible = isSel
        }

        public get selected() {
            const s = this
            return s._selectedImg.visible
        }

    }
}