module main {
    export class ChatView extends GYLite.GYUIComponent {

        private static _instance: ChatView

        public static getInstance(): ChatView {

            return ChatView._instance || (ChatView._instance = new ChatView)
        }


        private input: GYLite.GYTextInput
        private send: GYLite.GYButton
        private vb: VerticalBox
        private arr: any[]
        private ws: MainSocket
        private trumpet: GYLite.GYButton

        constructor() {
            super()
            let s = this

            s.trumpet = SkinManager.createBtn(s, 0, 0, 'rms_war_speaker_png', null, null, URLConf.gameImg + 'w3sheet.png')

            s.vb = new VerticalBox(ChatItem)
            s.vb.x = 0
            s.vb.y = s.trumpet.y + s.trumpet.height + 5
            s.vb.width = 210
            s.vb.height = 350
            s.vb.scroller.verticalPolicy = 0
            s.vb.scrollerViewPort.paddingTop = s.vb.scrollerViewPort.paddingBottom = 5
            s.addElement(s.vb)

            const line = SkinManager.createImage(s, -12, s.vb.y + s.vb.height + 10, 'war_chat_line_png', URLConf.gameImg + 'w3sheet.png')
            s.input = TemplateTool.createTextInput(s, 0, line.y + line.height + 2, 160, 30)
            s.send = SkinManager.createBtn(s, s.input.x + s.input.width + 14, s.input.y, 'war_send_msg_img_png', null, null, URLConf.gameImg + 'w1sheet.png')

            s.bindEvent()

            s.arr = [
                { "msg": "牛逼", "nickName": "小王", "grade": "2", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "小王", "grade": "1", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "小王", "grade": "3", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "小王", "grade": "5", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "小王", "grade": "4", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "阿萨德", "grade": "2", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "小王", "grade": "1", "type": "1", "userId": "1" },
                { "msg": "阿斯顿发文而阿斯顿发文而阿斯顿发文而阿斯顿发文而阿斯顿发文而", "nickName": "小王", "grade": "2", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "小王", "grade": "4", "type": "1", "userId": "1" },
                { "msg": "牛逼", "nickName": "小王", "grade": "2", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "小王", "grade": "2", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "阿萨德", "grade": "3", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "小王", "grade": "4", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "小王", "grade": "2", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "小王", "grade": "6", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "阿萨德", "grade": "2", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "小王", "grade": "7", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "小王", "grade": "5", "type": "1", "userId": "1" },
                { "msg": "暗示法阿的说法", "nickName": "阿萨德", "grade": "2", "type": "1", "userId": "1" }
            ]

            // TemplateTool.openDrag(s)
            // TemplateTool.setBackGrapics(s)
            // TemplateTool.setBackGrapics(s.vb)

            // s.test()
        }

        private bindEvent(): void {
            let s = this
            s.send.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleSend, s)
            s.trumpet.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleTrumpet, s)
            BaseWar.getInstance().bind('keyCode:13', s.handleSend, s)
        }

        private handleSend(): void {

            let s = this
            if (PersonalModel.getInstance().black == '1') {

                console.log('你被关进小黑屋, 联系管理员');
                return
            }
            if (!s.input.text) return
            s.ws.send(s.input.text)
            s.input.text = ''
            s.vb.scroller.scrollPosY = s.vb.scroller.scrollBarV.maximum
        }

        private handleTrumpet(): void {
            let s=this
            TrumpetView.getInstance().show()
        }

        public createWebsocket(d: any): void {

            let s = this
            // ws://localhost:8080/chat/{userId}/{grade}/{nickName}
            s.ws = MainSocket.getInstance().connect(UserData.getInstance().host + ':8080/chat/' + d.data.userId + '/' + PersonalModel.getInstance().grade + '/' + d.data.nickName)
            s.ws.onmessage(s.onmessage, s)
        }

        public onmessage(d: any): void {
            let s = this

            // console.log('mes - ', d);

            if (d && typeof d.data == 'string') {
                const rd = JSON.parse(d.data)

                if (!s.vb.dataProvider) {
                    s.vb.dataProvider = [rd]
                } else {
                    s.vb.dataProvider.push(rd)
                    s.vb.validData()
                }
            }


            // GYLite.TimeManager.timeOut(s.test, s, 500)
        }

        private test(): void {
            let s = this
            s.onmessage(s.arr[Math.floor(Math.random() * s.arr.length)])
        }

    }

    class ChatItem extends GYLite.ItemRender {


        /*用户名颜色以等级区分*/
        private mes: GYLite.GYText
        private color: Object

        constructor() {
            super()

            let s = this

            s.color = {
                '1': 0xFFFFFF,
                '2': 0x3FA5A9,
                '3': 0x3FA5A9,
                '4': 0x9EB45B,
                '5': 0x9EB45B,
                '6': 0xBA5B5B,
            }

            s.width = 210
            s.mes = SkinManager.createText(s, 2, 0, '', 0xffffff, 14)
            s.mes.width = s.width - 4
        }

        public setData(d): void {

            let s = this
            s.mes.text = d.nickName + ' : ' + d.msg
            s.updateState(d)
        }

        /*根据数据重置item的高度和text的宽度*/
        private updateState(d): void {

            let s = this
            s.height = s.mes.contentHeight + 22
            s.mes.color = s.color[d.grade] || s.color['6']
        }

    }
}