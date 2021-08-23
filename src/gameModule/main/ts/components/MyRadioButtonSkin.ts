module main {
    export class MyRadioButtonSkin extends GYLite.RadioButtonSkin {

        private back: GYLite.GYImage

        constructor(skin: any[]) {
            super(skin)
        }

        public drawSkin(state: number): void {
            super.drawSkin(state)
            const s = this
            if (state >= 4) {
                s.back.alpha = 1
            } else {
                s.back.alpha = 0
            }

        }

        public set hostComponent(val: GYLite.GYSprite) {

            const s = this
            if (s._hostComponent == val) return;
            if (s._hostComponent) {
                s.back = null
            }
            egret.superSetter(ImageButtonSkin, s, "hostComponent", val)
            if (s._hostComponent) {
                s.back = new GYLite.GYImage
                s.back.alpha = 0
                s.back.source = Main.instance.getRes('rms_top_list_tab_selected_bg_png', URLConf.mainImg + 'd1sheet.png')
                val.addElementAt(s.back, 0)
                s._curSkin.x = s._hostComponent.width - s._curSkin.width >> 1
                s._curSkin.y = s._hostComponent.height - s._curSkin.height >> 1
            }
        }

        public get hostComponent(): GYLite.GYSprite {
            var s = this;
            return egret.superGetter(ImageButtonSkin, s, "hostComponent");
        }

    }
}