module main {
    export class SocketModel {

        private ws: WebSocket

        public connect(url: string, protocols: string = '') {
            this.ws = new WebSocket(url, protocols)
        }

        public send(msg: any): void {
            if (!this.ws) {
                throw new Error('么有创建websocket对象')
            }
            this.ws.send(msg)
        }
    }
}