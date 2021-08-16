module main {
    export class SideBottomMidView extends GYLite.GYUIComponent {

        private static _instance: SideBottomMidView

        public static getInstance(): SideBottomMidView {

            return SideBottomMidView._instance || (SideBottomMidView._instance = new SideBottomMidView)
        }

        constructor() {
            super()
            const s = this

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
                s.addElement(betItem)
                if (!firstItme) {
                    firstItme = betItem
                }
                betItem.x = i * firstItme.width
                betItem.setData(itemArr[i])
            }

            // TemplateTool.setBackGrapics(s)
        }

    }

    export class BottomMidViewItem extends GYLite.GYUIComponent {


        private back: GYLite.GYImage
        private itemImg: GYLite.GYImage
        constructor() {
            super()
            const s = this
            s.back = SkinManager.createImage(s, 0, 0, 'war_bet_item_bg_png', URLConf.gameImg + 'w1sheet.png')
        }

        public setData(d: any): void {
            const s = this
            s.itemImg = SkinManager.createImage(s, 0, 0, d.source, URLConf.gameImg + 'w1sheet.png')
        }

    }
}