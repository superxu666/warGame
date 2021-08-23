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

        public static formatBet(num: number): string {
            const s = this
            let sum = '-'
            if (num >= 10000) {
                sum = (num / 10000).toString() + 'W'
            } else if (0 < num && num < 10000) {
                sum = num.toString()
            }
            return sum
        }
    }
}