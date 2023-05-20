export function stopPropagation(e: { stopPropagation: () => void, stopImmediatePropagation?: () => void }) {
    e.stopPropagation()
    e.stopImmediatePropagation?.()
}

export function preventDefault(e: Event) {
    e.preventDefault()
}