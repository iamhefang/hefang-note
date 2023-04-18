import { Form, FormItemProps, Tabs } from "antd"

export type FormGeneratorProps = {
  items: FormItemGroup[]
}

export type FormItemGroup = {
  label: string
  key: string
  items: FormGeneratorItem[]
}

export type FormGeneratorItem = Omit<FormItemProps, "children"> & {
  valueType: "boolean" | "string" | "number"
  fieldType: "select" | "checkbox" | "radiobox" | "switch" | "input" | "textarea"
}

export default function FormGenerator({ items }: FormGeneratorProps) {
  const [form] = Form.useForm()

  return (
    <Form form={form}>
      <Tabs
        tabPosition="left"
        items={items.map((item) => ({
          key: item.key,
          label: item.label,
          children: item.items.map(({ valueType, fieldType, ...itemProps }) => {
            // eslint-disable-next-line react/jsx-key
            return <Form.Item {...itemProps}>{}</Form.Item>
          }),
        }))}
      />
    </Form>
  )
}
