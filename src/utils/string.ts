export function format(str: string, params: Record<string, unknown>) {
  let value = str
  if (params) {
    for (const [placeholder, content] of Object.entries(params)) {
      value = value.replaceAll(`{${placeholder}}`, `${content}`)
    }
  }

  return value
}

export function hilightKeywords(content: string, keywords: string, color?: string): string {
  return keywords
    ? content.replaceAll(
        keywords,
        `<span class="highlight" ${color ? `style="color:${color}"` : ""}>${keywords}</span>`,
      )
    : content
}
