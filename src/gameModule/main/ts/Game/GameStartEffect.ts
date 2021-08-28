
module main {
    export class GameStartEffect extends GYLite.GYUIComponent {

        private static _instance: GameStartEffect

        public static getInstance(): GameStartEffect {
            return GameStartEffect._instance || (GameStartEffect._instance = new GameStartEffect)
        }

        private startTweenLeftImg: GYLite.GYScaleSprite
        private startTweenRightImg: GYLite.GYScaleSprite
        private tipImg: GYLite.GYImage

        private lTween: GYLite.GYTween
        private rTween: GYLite.GYTween
        private tTween: GYLite.GYTween

        constructor() {
            super()
            const s = this

            s.width = LayerManager.getInstance().topLay.width
            s.height = LayerManager.getInstance().topLay.height

            s.startTweenLeftImg = SkinManager.createScaleImage(s, 0, 0, 'war_start_bg_png', URLConf.gameImg + 'w1sheet.png', new GYLite.Scale9GridRect(25, 326))
            s.startTweenRightImg = SkinManager.createScaleImage(s, 0, 0, 'war_start_bg_png', URLConf.gameImg + 'w1sheet.png', new GYLite.Scale9GridRect(25, 326))
            s.startTweenLeftImg.width = s.startTweenRightImg.width = s.width
            s.startTweenLeftImg.anchorOffsetX = s.startTweenLeftImg.width
            s.startTweenRightImg.anchorOffsetX = s.startTweenRightImg.width
            s.startTweenRightImg.skewY = 180
            s.startTweenLeftImg.x = 0
            s.startTweenRightImg.x = s.width
            s.startTweenLeftImg.y = s.startTweenRightImg.y = s.height - s.startTweenLeftImg.height >> 1

            s.tipImg = SkinManager.createImage(s, 0, 0, 'war_start_img_png', URLConf.gameImg + 'w1sheet.png')
            s.tipImg.anchorOffsetX = s.tipImg.width / 2
            s.tipImg.anchorOffsetY = s.tipImg.height / 2
            s.tipImg.x = s.width >> 1
            s.tipImg.y = s.height >> 1
            s.tipImg.scaleX = 0
            s.tipImg.scaleY = 0



            let duration = 250
            s.lTween = GYLite.GYTween.to(s.startTweenLeftImg, [
                GYLite.TweenData.getInstance('x', s.width / 2 + 60, 0)
            ], duration, null, null, null, null, null, false, false)

            s.rTween = GYLite.GYTween.to(s.startTweenRightImg, [
                GYLite.TweenData.getInstance('x', s.width / 2 - 60, s.width)
            ], duration, null, null, null, null, null, false, false)

            s.tTween = GYLite.GYTween.to(s.tipImg, [
                GYLite.TweenData.getInstance('scaleX', 1, 0),
                GYLite.TweenData.getInstance('scaleY', 1, 0)
            ], duration, null, null, null, null, null, false, false)

        }


        private run(): void {
            const s = this

            s.lTween.run()
            s.rTween.run()
            s.tTween.run()

            GYLite.TimeManager.timeOut(() => {
                s.lTween.run(!s.lTween.isReserve)
                s.rTween.run(!s.rTween.isReserve)
                s.tTween.run(!s.tTween.isReserve)
                GYLite.TimeManager.timeOut(() => {
                    s.hide()
                }, s, 250)
            }, s, 1000)
        }

        public show(): void {

            const s = this
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

            s.run()
        }

        public hide(): void {

            const s = this;
            (<any>s.parent).removeElement(s)
        }

    }
}
