import {PluginHookOccasion} from "../enums"

export class PluginHookEvent<T> {
    /**
     * 是否已经阻止默认事件
     */
    #defaultPrevented: boolean = false
    /**
     * 是否继续冒泡
     */
    #bubble: boolean = true
    readonly #currentTarget: T | null
    readonly #occasion: PluginHookOccasion

    constructor(init: PluginHookEventInit<T>) {
        this.#currentTarget = init.currentTarget
        this.#defaultPrevented = false
        this.#occasion = init.occasion
        console.info("插件事件", this)
    }

    public get bubble() {
        return this.#bubble
    }

    public get currentTarget() {
        return this.#currentTarget
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
    currentTarget: T
    occasion: PluginHookOccasion
}