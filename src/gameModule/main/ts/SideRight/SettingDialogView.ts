/**
 * 设置
 */
module main {
    export class SettingDialogView extends GYLite.GYUIComponent {

        private static _instance: SettingDialogView

        public static getInstance(): SettingDialogView {

            return SettingDialogView._instance || (SettingDialogView._instance = new SettingDialogView)
        }

        private back: GYLite.GYScaleSprite
        private close: GYLite.GYButton
        private signOutBtn: GYLite.GYButton
        private slide: GYLite.GYSlider
        private switchBtn: SwitchButton

        private eventSets: any

        constructor() {
            super()
            const s = this

            s.eventSets = {}

            s.width = 780
            s.height = 350
            s.horizonalCenter = 0
            s.verticalCenter = 0

            s.back = SkinManager.createScaleImage(s, 0, 0, 'rms_view_bg_png', URLConf.mainImg + 'd1sheet.png', new GYLite.Scale9GridRect(60, 60, 60, 60))
            s.back.width = s.width
            s.back.height = s.height

            s.close = SkinManager.createBtn2(s, 0, 0, ['rms_view_close_btn_png'], URLConf.mainImg + 'd1sheet.png', null, null, ScaleButtonSkin2)
            s.close['eventname'] = 'close'
            s.close.top = -20
            s.close.right = -20


            let topBg = SkinManager.createImage(s, 0, 0, 'rms_view_title_bg_png', URLConf.mainImg + 'd1sheet.png')
            topBg.x = s.width - topBg.width >> 1
            topBg.y = -topBg.height / 2
            let topTit = SkinManager.createImage(s, 0, 0, 'rms_setting_title_png', URLConf.mainImg + 'd2sheet.png')
            topTit.x = s.width - topTit.width >> 1
            topTit.y = -topTit.height / 2

            let slideBg1 = SkinManager.createImage(s, 0, 64, 'rms_setting_base_item_bg_png', URLConf.mainImg + 'd2sheet.png')
            slideBg1.x = s.width - slideBg1.width >> 1
            let slideBg2 = SkinManager.createImage(s, 0, slideBg1.y + slideBg1.height + 30, 'rms_setting_base_item_bg_png', URLConf.mainImg + 'd2sheet.png')
            slideBg2.x = slideBg1.x

            let privacy = SkinManager.createText(s, slideBg1.x + 26, slideBg1.y + 18, '隐私开关', 0xffffff, 30, 'center', 188, 52)
            let sound = SkinManager.createText(s, privacy.x, slideBg2.y + 18, '音量调节', 0xffffff, 30, 'center', 188, 52)

            s.switchBtn = new SwitchButton
            s.switchBtn.x = 350
            s.switchBtn.y = 64
            s.addElement(s.switchBtn)

            var back: GYLite.GYScaleSprite = new GYLite.GYScaleSprite()
            var bar: GYLite.GYScaleSprite = new GYLite.GYScaleSprite(Main.instance.getRes('rms_setting_slider_bg_png', URLConf.mainImg + 'd2sheet.png'));
            var buttonSkin: GYLite.IButtonSkin = new GYLite.ButtonSkin([Main.instance.getRes('rms_setting_slider_trum_png', URLConf.mainImg + 'd2sheet.png')]);
            s.slide = SkinManager.createSlider(s, 350, 158, 350, 60, new GYLite.SliderSkin(back, bar, buttonSkin))
            s.slide.setValueByPos(350)

            s.signOutBtn = SkinManager.createBtn2(s, 0, slideBg2.y + slideBg2.height + 20, ['rms_btn_bg_2_png'], URLConf.mainImg + 'd2sheet.png')
            s.signOutBtn['eventname'] = 'signOut'
            s.signOutBtn.x = s.width - s.signOutBtn.width >> 1
            s.signOutBtn.label = '退出登录'
            s.signOutBtn.labelDisplay.color = 0xffffff
            s.signOutBtn.labelDisplay.size = 24

            s.bindEvent()

        }

        private bindEvent(): void {
            const s = this

            s.eventSets = {
                close: () => {
                    UtilTool.clickSound()
                    s.hide()
                },
                signOut: () => {
                    UtilTool.clickSound()
                    PersonalModel.getInstance().logout(() => {
                        s.hide()
                    }, s)
                },
                slide: () => {


                    for (let key in SoundManager.instance.soundDict) {
                        let soundData: SoundData = SoundManager.instance.soundDict[key]
                        if (soundData && soundData.channel) {
                            soundData.channel.volume = Number(s.slide.sliderBtn.toolTipString) / 100
                        }
                    }

                },
                switch: (isOpen: boolean) => {
                    UtilTool.clickSound()
                    PersonalModel.getInstance().updatePrivacy(isOpen ? 1 : 0)
                }

            }

            s.addEventListener(egret.TouchEvent.TOUCH_TAP, s.handleClick, s)
            s.switchBtn.bindClick(s.eventSets.switch, s)
            s.slide.addEventListener(GYLite.GYViewEvent.VALUE_COMMIT, s.eventSets.slide, s)

        }

        public setData(d: any): void {
            const s = this
            s.switchBtn.isOpen = d.privacy == '0' ? false : true
        }

        private handleClick(e: any): void {
            const s = this
            s.eventSets[e.target['eventname']] && s.eventSets[e.target['eventname']](e)
        }

        public show(): void {

            let s = this

            LayerManager.getInstance().setTopMask(true);
            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);
        }

        public hide(): void {

            let s = this
            LayerManager.getInstance().setTopMask(false);
            (s.parent as any).removeElement(s);
        }

    }
}