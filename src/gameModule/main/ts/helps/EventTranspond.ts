module main {
    export class EventTranspond {

        private static _instance: EventTranspond

        public static getInstance(): EventTranspond {
            return EventTranspond._instance || (EventTranspond._instance = new EventTranspond)
        }

        public curActiveTarget: any
        constructor() { }

        public transpond(): void {
            const s = this
            s.curActiveTarget && BaseWar.getInstance().trigger(s.curActiveTarget)
        }

    }
}