module main {
    export class ChatView extends GYLite.GYUIComponent {

        private static _instance: ChatView

        public static getInstance(): ChatView {

            return ChatView._instance || (ChatView._instance = new ChatView)
        }


        private input: GYLite.GYTextInput
        private send: GYLite.GYButton
        private vb: VerticalBox
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
            s.vb.height = 346
            s.vb.scroller.verticalPolicy = 0
            s.vb.scrollerViewPort.paddingTop = s.vb.scrollerViewPort.paddingBottom = 5
            s.addElement(s.vb)

            // TemplateTool.setBackGrapics(s.vb)

            const line = SkinManager.createImage(s, -12, s.vb.y + s.vb.height + 10, 'war_chat_line_png', URLConf.gameImg + 'w3sheet.png')
            s.input = TemplateTool.createTextInput(s, 0, line.y + line.height + 2, 160, 30, '', 18, 0x777777, 200)
            s.send = SkinManager.createBtn(s, s.input.x + s.input.width + 14, s.input.y, 'war_send_msg_img_png', null, null, URLConf.gameImg + 'w1sheet.png')

            s.bindEvent()

        }

        private bindEvent(): void {
            let s = this
            s.send.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleSendEvent, s)
            s.trumpet.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleTrumpet, s)
            s.input.addEventListener(egret.Event.FOCUS_IN, s.focusIn, s)
            s.input.addEventListener(egret.Event.FOCUS_OUT, s.focusOut, s)
            BaseWar.getInstance().bind('chatInput', s.handleSendEvent, s)
        }

        private handleSendEvent(e: egret.Event): void {
            const s = this
            s.handleSend(s.input.text)
        }

        public handleSend(text: string): void {

            let s = this
            UtilTool.clickSound()
            if (PersonalModel.getInstance().black == '1') {

                console.log('你被关进小黑屋, 联系管理员');
                return
            }
            if (!text) return
            s.ws.send(s.input.text || text)
            s.input.text = ''
            s.vb.scroller.scrollPosY = s.vb.scroller.scrollBarV.maximum
        }

        private handleTrumpet(): void {
            let s = this
            UtilTool.clickSound()
            TrumpetView.getInstance().show()
        }

        private focusIn(): void {
            const s = this
            EventTranspond.getInstance().curActiveTarget = 'chatInput'
        }
        private focusOut(): void {
            const s = this
            EventTranspond.getInstance().curActiveTarget = null
        }

        public createWebsocket(d: any): void {

            let s = this
            // ws://localhost:8080/chat/{userId}/{grade}/{nickName}
            s.ws = MainSocket.getInstance().connect(UserData.getInstance().host + ':8080/chat/' + d.data.userId + '/' + PersonalModel.getInstance().grade + '/' + d.data.nickName)
            s.ws.onmessage(s.onmessage, s)
        }

        public onmessage(d: any): void {
            let s = this

            if (d && typeof d.data == 'string') {
                const rd = JSON.parse(d.data)
                if (rd.type != '1') {

                    TrumpetTopView.getInstance().updateList(rd)
                    return
                }
                if (!s.vb.dataProvider) {
                    s.vb.dataProvider = [rd]
                } else {
                    s.vb.dataProvider.push(rd)
                    s.vb.validData()
                }
            }


        }

    }

    class ChatItem extends GYLite.ItemRender {


        /*用户名颜色以等级区分*/
        private mes: GYLite.GYText
        private static color: Object

        constructor() {
            super()

            let s = this

            s.width = 210
            s.mes = SkinManager.createText(s, 2, 0, '', 0xffffff, 14)
            s.mes.width = s.width - 4


            s.bindEvent()
        }

        private bindEvent(): void {
            const s = this
            s.touchEnabled = true
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        private handleClick(): void {
            const s = this

            UtilTool.clickSound()
            MainModel.getInstance().getInfoById(s._data.userId)
        }

        public setData(d): void {

            const s = this
            if (!d) {
                s.visible = false
                return
            }
            s.visible = true
            s._data = d

            s.mes.htmlText = `<font color=0x00A8F3>${d.nickName}</font> : <font color=${(NickNameColor.colorSets[d.grade] || NickNameColor.colorSets['6'])}>${d.msg}</font>`
            s.updateState(d)
        }

        /*根据数据重置item的高度和text的宽度*/
        private updateState(d): void {

            let s = this
            s.height = s.mes.contentHeight + 5
        }

    }
}