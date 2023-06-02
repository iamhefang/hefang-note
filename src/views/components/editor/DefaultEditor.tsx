import {Select} from "antd"

import {EditorComponent, IEditorProps} from "~/plugin"

const DefaultEditor: EditorComponent = ({placeholder, value, onChange, onBlur, onFocus}: IEditorProps) => {
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
                fontFamily: "inherit",
                lineHeight: "inherit",
                resize: "none",
                padding: 15,
                boxSizing: "border-box",
            }}
        />
    )
}

const fontSizeItems = ["12px", "14px", "16px", "18px", "20px", "22px"]
const fontFamilyMaps = {
    serif: "衬线字体",
    "sans-serif": "无衬线字体",
}
const lineHeights = [1, 1.2, 1.5]

DefaultEditor.options = [
    {
        label: "字体",
        children: (
            <Select style={{width: 120}}>
                <Select.Option key={"setting-form-editorOptions-fontFamily"} value="inherit">
                    自动字体
                </Select.Option>
                {Object.entries(fontFamilyMaps).map(([value, label]) => (
                    <Select.Option key={`settings-form-editorOptions-font-${value}`} value={value}>
                        <span style={{fontFamily: value}}>{label}</span>
                    </Select.Option>
                ))}
            </Select>
        ),
        name: "fontFamily",
    },
    {
        label: "字体大小",
        children: (
            <Select>
                <Select.Option key={"setting-form-editorOptions-fontSize"} value="inherit">
                    自动大小
                </Select.Option>
                {fontSizeItems.map((size) => (
                    <Select.Option key={`setting-form-font-size-${size}`} value={size}>
                        <span style={{fontSize: size}}>{size}</span>
                    </Select.Option>
                ))}
            </Select>
        ),
        name: "fontSize",
    },
    {
        label: "行高",
        name: "lineHeight",
        children: (
            <Select style={{minWidth: 60}}>
                {lineHeights.map((value) => (
                    <Select.Option value={value} key={`line-height-${value}`}>
                        {value}
                    </Select.Option>
                ))}
            </Select>
        ),
    },
]

export default DefaultEditor
