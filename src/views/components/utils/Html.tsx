import React from "react"

export type HtmlProps = React.HTMLAttributes<HTMLDivElement> & {
  children: string
}
export function Html({ children, ...props }: HtmlProps) {
  // eslint-disable-next-line react/no-danger
  return <div {...props} dangerouslySetInnerHTML={{ __html: children }} />
}
