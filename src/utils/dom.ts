const editableTags = ["INPUT", "TEXTAREA"]
export function isContentEditable(element: Element | null): boolean {
    return !!element && (editableTags.includes(element.tagName) || element.getAttribute("contentEditable") === "true")
}