module main {
    export class LayerIndex {
        public static curIndex: number = -1
        public static addIndex(): void {
            const s = this
            ++s.curIndex
        }
        public static getIndex(): number {
            const s = this
            return s.curIndex
        }
        public static subIndex(): void {
            const s = this
            --s.curIndex
        }
    }
}