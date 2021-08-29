module main {
    export class UtilTool {
        public static getGrade(x) {
            if (x <= 500) {
                return '1'
            } else if (x > 500 && x <= 1000) {
                return '2'
            } else if (x > 1000 && x <= 3000) {
                return '3'
            } else if (x > 3000 && x <= 5000) {
                return '4'
            } else if (x > 5000 && x <= 10000) {
                return '5'
            } else {
                return '6'
            }
        }

        public static getCurExpTotal(x) {

            let exp = ''
            switch (x) {
                case '1':
                    exp = '500'
                    break
                case '2':
                    exp = '1000'
                    break
                case '3':
                    exp = '3000'
                    break
                case '4':
                    exp = '5000'
                    break
                case '5':
                case '6':
                    exp = '10000'
                    break
            }

            return exp
        }

        public static formatBet(num: number): string {
            const s = this
            let sum = '-'
            if (num >= 10000) {
                sum = (num / 10000).toString() + 'W'
            } else if (0 <= num && num < 10000) {
                sum = num.toString()
            }
            return sum
        }

        public static clickSound(): void {

            SoundManager.instance.play(Conf.sound + 'rms_button_clicked.mp3', 0, 1, null, null, 1)
        }

        public static bgmSound(url?: string): void {
            SoundManager.instance.closeBGM()
            SoundManager.instance.playBGM(url || (Conf.sound + 'gamebgm.mp3'))
        }

        public static resultSound(): void {
            SoundManager.instance.closeBGM()
            SoundManager.instance.play(Conf.sound + 'war_bg_show_result_aab45285.mp3', 0, 1, null, null, 200)
        }

        public static effectSound(index?: number): void {
            SoundManager.instance.play(Conf.sound + 'war_turn_sound_c9acef1.mp3', 0, 1, null, null, 100)
        }
    }
}