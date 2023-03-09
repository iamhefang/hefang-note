import { IEditorProps } from "$hooks/usePlugins"

export default function DefaultEditor({ placeholder, value, onChange, onBlur, onFocus }: IEditorProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.currentTarget.value)}
      maxLength={5000}
      onFocus={onFocus}
      onBlur={onBlur}
      style={{
        background: "inherit",
        color: "inherit",
        width: "100%",
        height: "100%",
        outline: "none",
        border: "none",
        fontSize: "inherit",
        lineHeight: "inherit",
        resize: "none",
        padding: 15,
        boxSizing: "border-box",
      }}
    />
  )
}
