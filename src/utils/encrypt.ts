import { Context, sm4_crypt_ecb, sm4_setkey_dec, sm4_setkey_enc } from "./sm4"

const password = localStorage.getItem("key") || (() => {
    const key = crypto.randomUUID().replace(/-/g, "")
    localStorage.setItem("key", key)

    return key
})()
const encoder = new TextEncoder()
const decoder = new TextDecoder("utf-8")
const keyBuffer = encoder.encode(password)

const ctx = new Context()


export function encrypt(content: string): number[] {
    ctx.mode = 1
    sm4_setkey_enc(ctx, keyBuffer)

    return sm4_crypt_ecb(ctx, encoder.encode(content))
    // return CryptoJS.AES.encrypt(content, password).ciphertext
    // try {
    //     const result = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(content))

    //     return [...new Uint8Array(result)]
    // } catch (e) {
    //     console.error("encrypt", e)

    //     return [...new Uint8Array(encoder.encode(content))]
    // }
}

export function decrypt(content: number[]): string {
    ctx.mode = 0
    sm4_setkey_dec(ctx, keyBuffer)

    return decoder.decode(new Uint8Array(sm4_crypt_ecb(ctx, new Uint8Array(content))))
    // const value = Uint8Array.from(content)
    // try {
    //     const buffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, value)

    //     return decoder.decode(buffer)
    // } catch (error) {
    //     return decoder.decode(value)
    // }
}