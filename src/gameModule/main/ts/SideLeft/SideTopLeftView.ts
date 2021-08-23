module main {
    export class SideTopLeftView extends GYLite.GYUIComponent {

        private static _instance: SideTopLeftView

        public static getInstance(): SideTopLeftView {

            return SideTopLeftView._instance || (SideTopLeftView._instance = new SideTopLeftView)
        }

        private back: GYLite.GYImage
        private personalView: PersonalView
        public chatView: ChatView

        constructor() {
            super()

            let s = this


            s.back = SkinManager.createImage(s, 0, 0, 'war_left_bg_png', URLConf.gameImg + 'w2sheet.png')

            s.personalView = PersonalView.getInstance()
            s.addElement(s.personalView)

            s.chatView = ChatView.getInstance()
            s.chatView.x = 20
            s.chatView.y = 150
            s.addElement(s.chatView)

        }

        public renderPersonvalView(d: any): void {
            let s = this
            s.personalView.render(d)
        }

        public notifyChatView(d: any): void {

            let s=this
            s.chatView.createWebsocket(d)
        }
    }
}