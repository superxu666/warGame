module main {
    export class MovieClipEffect extends GYLite.GYUIComponent {

        private static _instance: MovieClipEffect

        public static getInstance(): MovieClipEffect {
            return MovieClipEffect._instance || (MovieClipEffect._instance = new MovieClipEffect)
        }

        private movieClip: GYMovieClip
        private skeleton: Skeleton
        private k1: Skeleton

        private resultData: any

        constructor() {
            super()
            const s = this

            s.width = LayerManager.getInstance().topLay.width
            s.height = LayerManager.getInstance().topLay.height

            s.movieClip = new GYMovieClip();
            s.movieClip.setDataPath(URLConf.gameSke + "war_fire_clips.json", URLConf.gameSke + "war_fire_clips.png");
            s.movieClip.setMovieName("fire");
            s.movieClip.x = s.width - s.movieClip.width >> 1;
            s.movieClip.y = -30;
            s.addElement(s.movieClip);

            TemplateTool.openDrag(s)

            s.skeleton = new Skeleton
            s.skeleton.show(s, s.width >> 1, s.height >> 1)

            s.k1 = new Skeleton
            s.k1.show(s, s.width >> 1, s.height >> 1)
        }


        public play(d: any): void {
            const s = this

            s.resultData = d

            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

            switch (d.boxtype) {
                case 'kq':
                    s.playKq()
                    break
                case 'hc':
                    s.playHc()
                    break
                case 'ts':
                    s.playTs()
                    break
                case 'kl':
                    s.playKl()
                    break
                case 'dj':
                    s.playDj()
                    break
                case 'sz':
                    s.playSz()
                    break
                case 'rz':
                    s.playRz()
                    break
            }
        }

        public hide(): void {
            const s = this;

            if (s.parent) {
                (s.parent as any).removeElement(s);
                s.movieClip.visible = false
            }
        }


        /*播放龙*/
        public playK(): void {
            const s = this

            let pr = LayerManager.getInstance().topLay;
            pr.addElement(s);

            SoundManager.instance.play(Conf.sound + `war_effect_dragon_black_f18fa885.mp3`, 0, 1, null, null, 300)

            s.skeleton.setDataByName('war_effect_dragon', URLConf.gameSke, 'armatureName')
            s.skeleton.gotoAndPlay('Animation_BlackDragon', 0)

            s.k1.setDataByName('war_effect_gold', URLConf.gameSke, 'MovieClip')
            s.k1.gotoAndPlay('GoldLight', 0)

            s.movieClip.visible = true
            s.movieClip.play(-1);
        }

        /*火车*/
        private playHc(): void {

            const s = this

            s.skeleton.setDataByName('war_effect_train', URLConf.gameSke, 'Movie_Train')
            s.skeleton.gotoAndPlay('Loop', 0)
        }

        /*骷髅*/
        private playKl(): void {

            const s = this

            s.skeleton.setDataByName('war_effect_all_death', URLConf.gameSke, 'Movie_Death')
            s.skeleton.gotoAndPlay('Loop', 0)
        }

        /*天使*/
        private playTs(): void {

            const s = this

            SoundManager.instance.play(Conf.sound + `war_effect_angel_7dd66daa.mp3`, 0, 1, null, null, 300)
            s.skeleton.setDataByName('war_effect_angle', URLConf.gameSke, 'Armature')
            s.skeleton.gotoAndPlay('Angle', 0)
        }


        /*电机*/
        private playDj(): void {

            const s = this
            s.skeleton.setDataByName('war_effect_angle', URLConf.gameSke, 'Armature')
            s.skeleton.gotoAndPlay('Angle', 0)
        }
        /*开枪*/
        private playKq(): void {

            const s = this
            s.skeleton.setDataByName('war_effect_gun', URLConf.gameSke, 'Movie_GunFire')
            s.skeleton.gotoAndPlay('Fire', 1, Conf.sound + 'war_effect_gun_eff9465e.mp3')
        }
        /*人族*/
        private playRz(): void {

            const s = this
            s.skeleton.setDataByName('war_effect_sixi_1', URLConf.gameSke, 'Armature')
            s.skeleton.gotoAndPlay('Angle', 0)
        }
        /*兽族*/
        private playSz(): void {

            const s = this
            s.skeleton.setDataByName('war_effect_angle', URLConf.gameSke, 'Armature')
            s.skeleton.gotoAndPlay('Angle', 0)
        }

    }
}