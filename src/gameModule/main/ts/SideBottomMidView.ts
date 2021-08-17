module main {
    export class SideBottomMidView extends GYLite.GYUIComponent {

        private static _instance: SideBottomMidView

        public static getInstance(): SideBottomMidView {

            return SideBottomMidView._instance || (SideBottomMidView._instance = new SideBottomMidView)
        }

        private items: Object

        constructor() {
            super()
            const s = this

            s.height = 128
            s.items = {}

            //i  a  b  c  d  k  h  g  f  e  j
            const itemArr = [
                { itemName: 'i', source: 'war_bet_item_tribal_png', multiple: 'war_bet_mutiple_2_png' },
                { itemName: 'a', source: 'war_bet_item_orc_png', multiple: 'war_bet_mutiple_6_png' },
                { itemName: 'b', source: 'war_bet_item_warlock_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'c', source: 'war_bet_item_minotaur_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'd', source: 'war_bet_item_chief_png', multiple: 'war_bet_mutiple_12_png' },
                { itemName: 'k', source: 'war_bet_item_dragon_png', multiple: 'war_bet_mutiple_24_99_png' },
                { itemName: 'h', source: 'war_bet_item_king_png', multiple: 'war_bet_mutiple_12_png' },
                { itemName: 'g', source: 'war_bet_item_knight_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'f', source: 'war_bet_item_master_png', multiple: 'war_bet_mutiple_8_png' },
                { itemName: 'e', source: 'war_bet_item_warrior_png', multiple: 'war_bet_mutiple_6_png' },
                { itemName: 'j', source: 'war_bet_item_union_png', multiple: 'war_bet_mutiple_2_png' },
            ]

            let firstItme: BottomMidViewItem = null
            for (let i = 0, len = itemArr.length; i < len; i++) {

                const betItem = new BottomMidViewItem
                s.items[itemArr[i].itemName] = betItem
                s.addElement(betItem)
                if (!firstItme) {
                    firstItme = betItem
                }
                betItem.x = i * firstItme.width
                betItem.setData(itemArr[i])
            }

            // TemplateTool.setBackGrapics(s)
        }

        public bet(d: any): void {
            const s = this

            if (!d) return
            if (!Array.isArray(d)) return

            let len = d.length
            for (let i = 0; i < len; i++) {
                let s_i = d[i]
                let item: BottomMidViewItem = s.items[s_i.role]
                item.handleClick()
                item.add(s_i.g, s_i.y)
            }

        }

    }

    export class BottomMidViewItem extends GYLite.GYUIComponent {


        private back: GYLite.GYImage
        private itemImg: GYLite.GYImage
        private G: GYLite.GYText
        private Y: GYLite.GYText
        private itemName: string
        private multiple: GYLite.GYImage
        private subItem: GYLite.GYUIComponent

        constructor() {
            super()
            const s = this
            s.width = 74
            s.height = 128

            s.back = SkinManager.createImage(s, 0, 0, 'war_bet_item_coin_bg_png', URLConf.gameImg + 'w1sheet.png')
            s.back.horizonalCenter = 0

            s.G = SkinManager.createText(s, 0, 60 + 24, '0', 0xEFCD02, 12)
            s.Y = SkinManager.createText(s, 0, s.G.y + s.G.height + 5, '0', 0xffffff, 12)
            s.G.horizonalCenter = s.Y.horizonalCenter = 0

            s.subItem = new GYLite.GYUIComponent
            s.subItem.x = 2
            s.subItem.y = 60
            s.addElement(s.subItem)

            s.itemImg = new GYLite.GYImage
            s.itemImg.x = 0
            s.itemImg.y = 0
            s.subItem.addElement(s.itemImg)

            s.multiple = new GYLite.GYImage
            s.multiple.horizonalCenter = 0
            s.multiple.bottom = 10
            s.subItem.addElement(s.multiple)


            // TemplateTool.setBackGrapics(s)
            s.bindEvent()
        }

        private bindEvent(): void {

            const s = this
            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
        }

        public handleClick(): void {
            const s = this
            s.subItem.y = 0
            console.log('当前下注: ', s.itemName);
        }

        public handleReset(): void {
            const s = this
            s.subItem.y = 60
            s.G.text = '0'
            s.Y.text = '0'
        }

        public add(g: number, y: number): void {

            const s = this
            s.G.text = g.toString()
            s.Y.text = y.toString()
        }


        public setData(d: any): void {
            const s = this
            s.itemName = d.itemName
            s.itemImg.source = Main.instance.getRes(d.source, URLConf.gameImg + 'w1sheet.png')
            s.multiple.source = Main.instance.getRes(d.multiple, URLConf.gameImg + 'w1sheet.png')
            let len = s.numElement
            while (--len > -1) {
                let child = s.getElementAt(len)
                child.touchEnabled = true
            }
        }

    }
}