class BaseWar implements IEventsBus {

    private _callbacks: Object
    constructor() {
    }

    /**绑定事件 */
    bind(ev: string, callback: Function, thisObject: any) {

        let calls = this._callbacks || (this._callbacks = {})
        if (!calls[ev]) {
            calls[ev] = []
        }
        calls[ev].push({ callback, thisObject })
        return this
    }

    /**触发 */
    trigger(...param: any[]) {
        let args: any[] = 1 <= arguments.length ? [].slice.call(arguments, 0) : []
        let ev: string = args.shift()
        let list: any[] = (this._callbacks[ev] != null) ? this._callbacks[ev] : void 0
        if (!list) return
        for (let i = 0, len = list.length; i < len; i++) {
            let callback: Function = list[i].callback;
            let thisObject: any = list[i].thisObject;

            if (callback.apply(thisObject, args) == false) {
                break
            }
        }
        return true

    }

    /**解绑事件 */
    unbind(ev: string, callback: Function) {
        if (arguments.length === 0) return this
        if (!ev) return this

        let list: any[] = (this._callbacks != null) ? this._callbacks[ev] : void 0
        if (!list) return this
        if (!callback) {
            delete this._callbacks[ev]
            return this
        }

        for (let i = 0, len = list.length; i < len; i++) {

            let cb = list[i]
            if (!(cb === list[i])) {
                continue
            }
            list = list.slice()
            list.splice(i, 1)
            this._callbacks[ev] = list
            break
        }

        return this

    }

}