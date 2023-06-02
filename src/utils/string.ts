export function format(str: string, params: Record<string, unknown>) {
    let value = str
    if (params) {
        for (const [placeholder, content] of Object.entries(params)) {
            value = value.replaceAll(`{${placeholder}}`, `${content}`)
        }
    }

    return value
}
