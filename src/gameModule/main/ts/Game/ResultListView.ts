module main {
    export class ResultListView extends GYLite.GYUIComponent {

        private static _instance: ResultListView

        public static getInstance(): ResultListView {
            return ResultListView._instance || (ResultListView._instance = new ResultListView)
        }


        private list: GYLite.GYListH
        private leftBtn: GYLite.GYButton
        private rigthBtn: GYLite.GYButton

        constructor() {
            super()
            const s = this


            s.leftBtn = SkinManager.createBtn(s, 118, 0, 'war_history_btn_png', null, null, URLConf.gameImg + 'w2sheet.png')
            s.leftBtn.verticalCenter = 0
            s.leftBtn.name = 'l'
            s.list = SkinManager.createListH(s, s.leftBtn.x + s.leftBtn.width + 20, 0, 360, 54, ResultItem)
            s.list.scrollerPolicy = 2
            s.rigthBtn = SkinManager.createBtn(s, s.list.x + s.list.width + 20, 0, 'war_history_btn_png', null, null, URLConf.gameImg + 'w2sheet.png')
            s.rigthBtn.name = 'r'
            s.rigthBtn.anchorOffsetX = s.rigthBtn.width
            s.rigthBtn.skewY = 180
            s.rigthBtn.verticalCenter = 0

            s.bindEvent()

        }

        private bindEvent() {
            const s = this

            s.leftBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleScrollList, s)
            s.rigthBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleScrollList, s)
        }

        private handleScrollList(e: egret.Event): void {
            const s = this
            if (e.target.name == 'l') {

                s.list.hScroller.scrollToLeft(360 / 8 * 4)

            } else if (e.target.name == 'r') {

                s.list.hScroller.scrollToRight(360 / 8 * 4)
            }

        }

        public updateList(ary: any[]): void {

            const s = this
            s.list.dataProvider = ary
        }

    }

    export class ResultItem extends GYLite.ItemRender {

        private resultImg: GYLite.GYImage
        private imgSets: Object

        constructor() {
            super()
            const s = this

            s.imgSets = {
                kq: 'war_history_gun_png',
                hc: 'war_history_train_png',
                ts: 'war_history_angle_png',
                kl: 'war_history_all_death_png',
                dj: 'war_history_multiple_png',
                sz: 'war_history_tribal_png',
                rz: 'war_history_union_png',
                a: 'war_history_tribal_orc_png',
                b: 'war_history_tribal_warlock_png',
                c: 'war_history_tribal_minotaur_png',
                d: 'war_history_tribal_chief_png',
                k: 'war_history_balck_dragon_png',
                h: 'war_history_union_king_png',
                g: 'war_history_union_knight_png',
                f: 'war_history_union_master_png',
                e: 'war_history_union_warrior_png'
            }

            s.width = 360 / 8
            s.height = 54
            s.resultImg = SkinManager.createImage(s, 0, 0, '', URLConf.gameImg + 'w2sheet.png')
            s.resultImg.horizonalCenter = 0
        }

        public setData(d: any): void {

            const s = this
            if (!d) {
                s.visible = false;
                return;
            }
            s.visible = true;
            s.resultImg.source = Main.instance.getRes(s.imgSets[d], URLConf.gameImg + 'w2sheet.png')
        }


    }
}