import {parseColor} from "@basementuniverse/parsecolor"

const colorCache: Record<string, string> = {}

function toHex(number: number) {
    return number.toString(16).padStart(2, "0")
}

export function rgb2rrggbb(color: string): string {
    if (color in colorCache) {
        return colorCache[color]
    }
    try {
        const {r: red, g: green, b: blue, a: alpha} = parseColor(color)

        const a = toHex(Math.floor(alpha * 255))

        return colorCache[color] = `#${toHex(red)}${toHex(green)}${toHex(blue)}${a}`
    } catch (err) {
        console.error(err)

        return color
    }
}