const password = localStorage.getItem("key") || (() => {
    const key = crypto.randomUUID().replace(/-/g, "")
    localStorage.setItem("key", key)

    return key
})()
const encoder = new TextEncoder()
const decoder = new TextDecoder("utf-8")
const iv = encoder.encode(password)
const keyBuffer = encoder.encode(password)
const key = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, ["encrypt", "decrypt"])

export async function encrypt(content: string): Promise<number[]> {
    try {
        const result = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(content))

        return [...new Uint8Array(result)]
    } catch (e) {
        console.error("encrypt", e)

        return [...new Uint8Array(encoder.encode(content))]
    }
}

export async function decrypt(content: number[]): Promise<string> {
    const value = Uint8Array.from(content)
    try {
        const buffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, value)

        return decoder.decode(buffer)
    } catch (error) {
        return decoder.decode(value)
    }
}