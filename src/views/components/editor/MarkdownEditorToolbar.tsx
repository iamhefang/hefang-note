import {
  BoldOutlined,
  ItalicOutlined,
  LineOutlined,
  OrderedListOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons"
import { commandsCtx, rootDOMCtx } from "@milkdown/core"
import { Ctx, MilkdownPlugin } from "@milkdown/ctx"
import { EditorState, Plugin, PluginKey } from "@milkdown/prose/state"
import { EditorView } from "@milkdown/prose/view"
import { $ctx, $prose } from "@milkdown/utils"
import { Button, Divider, Select, Space, Spin, Tooltip, TooltipProps } from "antd"
import { OptionProps } from "antd/es/select"
import _ from "lodash"
import React, { ReactNode, useCallback } from "react"
import { createRoot } from "react-dom/client"

import { ValueOrFactory } from "~/types"

const toolbarDomCtx = $ctx({}, "toolbarDom")
const toolbarConfigCtx = $ctx({ items: [], attributes: { class: "milkdown-toolbar" } }, "toolbarConfig")
const key = new PluginKey("MILKDOWN_PLUGIN_TOOLBAR")

function createContainer(ctx: Ctx): HTMLDivElement {
  const config = ctx.get(toolbarConfigCtx.key)
  const container = document.createElement("div")
  Object.entries(config.attributes).forEach(([key2, val]) => {
    if (key2 === "class") {
      container.classList.add(val)
    } else {
      container.setAttribute(key2, val)
    }
  })

  return container
}

function execFactory<T, C>(ctx: C, func?: ValueOrFactory<T, C>): T {
  return _.isFunction(func) ? func?.(ctx) : (func as T)
}

export interface IToolbarItem {
  key: string
}

export interface IToolbarButtonItem extends IToolbarItem {
  type: "button"
  icon: ReactNode
  content?: ReactNode
  tooltip?: ReactNode | TooltipProps
  disabled?: ValueOrFactory<boolean, Ctx>
  active?: ValueOrFactory<boolean, Ctx>
}

export interface IToolbarSelectItem extends IToolbarItem {
  type: "select"
  optoins: OptionProps[]
  disabled?: ValueOrFactory<boolean, Ctx>
  value?: ValueOrFactory<string | number, Ctx>
  onSelect?: (value: string | number, ctx: Ctx) => [string, unknown?]
}

export interface IToolbarItemDivider {
  type: "divider"
}

export type ToolbarItem = IToolbarButtonItem | IToolbarItemDivider | IToolbarSelectItem

export const defaultToolbarItems: ToolbarItem[] = [
  { type: "button", icon: <RedoOutlined />, key: "Redo", tooltip: "重做" },
  {
    type: "button",
    icon: <UndoOutlined />,
    key: "Undo",
    tooltip: "撤销",
    disabled: (ctx) => {
      try {
        return !ctx.get("historyProviderConfig")
      } catch (error) {
        return false
      }
    },
  },
  { type: "divider" },
  {
    type: "select",
    key: "WrapInHeading",
    optoins: [
      { value: 0, children: "正文" },
      { label: "标题1", value: 1, children: <h1>标题1</h1> },
      { label: "标题2", value: 2, children: <h2>标题2</h2> },
      { label: "标题3", value: 3, children: <h3>标题3</h3> },
      { label: "标题4", value: 4, children: <h4>标题4</h4> },
      { label: "标题5", value: 5, children: <h5>标题5</h5> },
      { label: "标题6", value: 6, children: <h6>标题6</h6> },
    ],
    onSelect: (value, ctx) => (value ? ["WrapInHeading", value] : ["TurnIntoText"]),
  },
  { type: "divider" },
  {
    type: "button",
    icon: <BoldOutlined />,
    key: "ToggleStrong",
    tooltip: "粗体",
  },
  {
    type: "button",
    icon: <ItalicOutlined />,
    key: "ToggleEmphasis",
    tooltip: "斜体",
  },
  {
    type: "button",
    icon: <StrikethroughOutlined />,
    key: "ToggleStrikeThrough",
    tooltip: "删除线",
  },
  { type: "divider" },
  {
    type: "button",
    icon: <LineOutlined />,
    key: "divider",
    tooltip: "分割线",
  },
  { type: "divider" },
  { type: "button", icon: <OrderedListOutlined />, key: "WrapInOrderedList", tooltip: "有序列表" },
  { type: "button", icon: <UnorderedListOutlined />, key: "WrapInBulletList", tooltip: "无序列表" },
]

function ButtonItem({ item, ctx }: { item: IToolbarButtonItem; ctx: Ctx }) {
  const onClick = useCallback(() => {
    ctx.get(commandsCtx).call(item.key)
  }, [ctx, item.key])

  const button = (
    <Button
      size="small"
      type={execFactory(ctx, item.active) ? "primary" : "text"}
      icon={item.icon}
      onClick={onClick}
      disabled={execFactory(ctx, item.disabled)}
    >
      {item.content}
    </Button>
  )
  if (item.tooltip) {
    const props: TooltipProps =
      React.isValidElement(item.tooltip) || _.isString(item.tooltip)
        ? {
            title: item.tooltip,
          }
        : (item.tooltip as TooltipProps)

    return (
      <Tooltip mouseEnterDelay={1} {...props} placement="bottom">
        {button}
      </Tooltip>
    )
  }

  return button
}

function SelectItem({ item, ctx }: { item: IToolbarSelectItem; ctx: Ctx }) {
  const onSelect = useCallback(
    (value: string | number) => {
      const [command, args] = item.onSelect?.(value, ctx) || [item.key, value]
      ctx.get(commandsCtx).call(command, args)
    },
    [ctx, item],
  )

  return (
    <Select style={{ minWidth: 120 }} size="small" optionLabelProp="label" value={execFactory(ctx, item.value)} onSelect={onSelect}>
      {item.optoins.map((option) => (
        <Select.Option key={`${item.key}-${option.value}`} {...option} label={option.label || option.children} />
      ))}
    </Select>
  )
}

export default function MarkdownEditorToolbar({ ctx, items }: MarkdownEditorToolbarProps) {
  if (!ctx) {
    return <Spin />
  }

  return (
    <Space style={{ margin: 10 }}>
      {items.map((item, index) => {
        if (item.type === "button") {
          return <ButtonItem key={item.key} item={item} ctx={ctx} />
        }
        if (item.type === "divider") {
          return <Divider key={`divider-${index}`} type="vertical" />
        }
        if (item.type === "select") {
          return <SelectItem key={item.key} item={item} ctx={ctx} />
        }
      })}
    </Space>
  )
}

const toolbarView = $prose((ctx) => {
  return new Plugin({
    key,
    view: (editorView) => {
      const root = ctx.get(rootDOMCtx)
      const container = createContainer(ctx)
      ctx.set(toolbarDomCtx.key, container)
      const editor = editorView.dom
      root.insertBefore(container, editor)
      const toolbarRoot = createRoot(container)
      toolbarRoot.render(<MarkdownEditorToolbar ctx={ctx} items={defaultToolbarItems} />)

      return {
        update: (view: EditorView, prevState: EditorState) => {
          toolbarRoot.render(
            <Space>
              {defaultToolbarItems.map((item, index) => {
                if (item.type === "button") {
                  return <ButtonItem key={item.key} item={item} ctx={ctx} />
                }
                if (item.type === "divider") {
                  return <Divider key={`divider-${index}`} type="vertical" />
                }
              })}
            </Space>,
          )
        },
        destroy: () => {
          toolbarRoot.unmount()
          container.remove()
        },
      }
    },
  })
})

export const toolbar: MilkdownPlugin[] = [toolbarDomCtx, toolbarConfigCtx, toolbarView]

export type MarkdownEditorToolbarProps = {
  ctx: Ctx | undefined
  items: ToolbarItem[]
}
