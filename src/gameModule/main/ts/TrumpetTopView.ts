module main {
    export class TrumpetTopView extends GYLite.GYUIComponent {

        private static _instance: TrumpetTopView

        public static getInstance(): TrumpetTopView {

            return TrumpetTopView._instance || (TrumpetTopView._instance = new TrumpetTopView)
        }

        private back: GYLite.GYImage
        private text: GYLite.GYText
        private nickName: GYLite.GYText

        private textQueue: any[]
        private _timeId: number = 0
        private _delay: number = 1000 * 5

        constructor() {
            super()
            const s = this
            s.visible = false
            s.textQueue = []
            s.back = SkinManager.createImage(s, 0, 0, 'rms_toast_bg_png', URLConf.mainImg + 'd2sheet.png')
            s.back.height = s.back.height >> 1

            s.nickName = SkinManager.createText(s, 0, 0, '', 0xffffff, 18)
            s.text = SkinManager.createText(s, 0, 0, '', 0xffffff, 18)

        }

        private countEnd(): void {
            const s = this

            GYLite.TimeManager.unTimeOut(s._timeId, s.countEnd, s)
            s._timeId = 0
            // console.log('当前大喇叭消息结束播放, ', s._timeId);
            s.visible = false
        }

        /*前端消息队列弃用*/
        private start(): void {
            const s = this
            if (s._timeId) return
            s._timeId = GYLite.TimeManager.timeOut(s.countEnd, s, s._delay)

            const d = s.textQueue.shift()
            s.nickName.text = d.nickName ? d.nickName + ' : ' : '无 : '
            s.nickName.color = NickNameColor.colorSets[d.grade]
            s.text.text = d.msg

            s.nickName.x = s.width - (s.nickName.width + s.text.width) >> 1
            s.text.x = s.nickName.x + s.nickName.width + 10
        }

        public updateList(d?: any): void {

            const s = this

            // s.textQueue.push(d)
            // s.start()
            // console.log('当前大喇叭消息有: ' + s.textQueue.length + '条');

            s.nickName.text = d.nickName ? d.nickName + ' : ' : '无 : '
            s.nickName.color = NickNameColor.colorSets[d.grade]
            s.text.text = d.msg
            s.nickName.x = s.width - (s.nickName.width + s.text.width) >> 1
            s.text.x = s.nickName.x + s.nickName.width + 10
            s.nickName.y = s.text.y = s.back.height - s.nickName.height >> 1

            if (s._timeId) s.countEnd()
            s._timeId = GYLite.TimeManager.timeOut(s.countEnd, s, s._delay)
            
            s.visible = true
        }

    }
}