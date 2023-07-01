export enum PluginHookOccasion {
    before = "before",
    after = "after"
}

export class PluginHookEvent<T> {
    /**
     * 是否已经阻止默认事件
     */
    #defaultPrevented: boolean = false
    /**
     * 是否继续冒泡
     */
    #bubble: boolean = true
    readonly #detail: T
    readonly #occasion: PluginHookOccasion

    constructor(init: PluginHookEventInit<T>) {
        this.#detail = init.detail
        this.#defaultPrevented = false
        this.#occasion = init.occasion
    }

    public get bubble() {
        return this.#bubble
    }

    public get detail() {
        return this.#detail
    }

    public preventDefault() {
        this.#defaultPrevented = true
    }

    public stopPropagation() {
        this.#bubble = false
    }

    public isDefaultPrevented() {
        return this.#defaultPrevented
    }
}

export type PluginHookEventInit<T> = {
    detail: T
    occasion: PluginHookOccasion
}