export async function digestHash(hashType: string, input: string) {
    const digest = await crypto.subtle.digest(hashType, new TextEncoder().encode(input))

    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
}