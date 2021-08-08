class MainSocket {

    private ws: WebSocket

    private static _instance: MainSocket

    public static getInstance(): MainSocket {

        return MainSocket._instance || (MainSocket._instance = new MainSocket)
    }

    public connect(url: string, protocols?: string | string[]) {

        url = (url.indexOf('ws:') > -1 ? url : 'ws://' + url)

        this.ws = new WebSocket(url, protocols)

        return this
    }

    public send(msg: any): void {
        if (!this.ws) {
            throw new Error('么有创建websocket对象')
        }
        this.ws.send(msg)
    }
}