class MainSocket {

    private ws: WebSocket

    private static _instance: MainSocket

    public static getInstance(): MainSocket {

        return MainSocket._instance || (MainSocket._instance = new MainSocket)
    }

    public connect(url: string, protocols?: string | string[]) {

        let s = this
        url = (url.indexOf('ws:') > -1 ? url : 'ws://' + url)

        s.ws = new WebSocket(url, protocols)
        s.ws.onmessage = (...arg) => {
            s.handleMessage(...arg)
        }
        return s
    }


    private mesCallback: Function
    private mesThisobj: any
    public onmessage(cb: Function, thisobj: any): void {

        let s = this
        s.mesCallback = cb
        s.mesThisobj = thisobj
    }

    private handleMessage(...arg): void {

        let s = this
        if (s.mesCallback) s.mesCallback.call(s.mesThisobj, ...arg)
    }

    public send(msg: any): void {
        if (!this.ws) {
            throw new Error('么有创建websocket对象')
        }
        this.ws.send(msg)
    }


    public close(): void {
        if (this.ws) this.ws.close()
    }


    public get socketInstance(): WebSocket {
        let s = this
        return s.ws
    }
}