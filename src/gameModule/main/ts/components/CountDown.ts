module main {
    export class CountDown extends GYLite.GYUIComponent {

        private numImg_1: GYLite.GYImage
        private numImg_2: GYLite.GYImage
        constructor() {
            super()
            const s = this
            
            
            s.numImg_1 = SkinManager.createImage(s, 0, 0, '0', URLConf.gameSke + 'war_status_font.png')
            s.numImg_2 = SkinManager.createImage(s, 0, 0, '0', URLConf.gameSke + 'war_status_font.png')
            s.numImg_2.x = s.numImg_1.x + s.numImg_1.width
        }

        public setData(num: number): void {
            const s = this

            let strNum = num.toString()
            if (num >= 10) {

                let str1 = strNum.charAt(0)
                let str2 = strNum.charAt(1)
                s.numImg_1.source = Main.instance.getRes(str1, URLConf.gameSke + 'war_status_font.png')
                s.numImg_2.source = Main.instance.getRes(str2, URLConf.gameSke + 'war_status_font.png')
            } else {

                let str1 = strNum.charAt(0)
                s.numImg_1.source = Main.instance.getRes('0', URLConf.gameSke + 'war_status_font.png')
                s.numImg_2.source = Main.instance.getRes(str1, URLConf.gameSke + 'war_status_font.png')
            }

        }
    }
}