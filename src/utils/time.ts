function pad(value: number): string {
    return value.toString().padStart(2, "0")
}

export function time() {
    const date = new Date()

    return [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds()),
    ].join(":")
}
