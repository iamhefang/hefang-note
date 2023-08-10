import { Avatar, Col, Divider, Row } from "antd"

import { isInClient, productDescription, productName, versionName } from "~/consts"

import pkg from "../../../../package.json"

import ss from "./index.module.scss"

import { openInNative } from "$components/utils/native"
import { T } from "$hooks/useTranslate"
import logo from "^/src-tauri/icons/icon.png"

const src = import.meta.env.VITE_COMMIT
  ? `https://github.com/iamhefang/hefang-note/tree/${import.meta.env.VITE_COMMIT}`
  : "https://github.com/iamhefang/hefang-note"

export default function About() {
  return (
    <div className={ss.root}>
      <Row gutter={10} align="middle">
        <Col>
          <Avatar src={logo} size={50} shape="square" />
        </Col>
        <Col flex={1}>
          <div>
            <h1 style={{ fontSize: 15 }}>{`${productName} v${versionName}`}</h1>
            <span>{productDescription}</span>
          </div>
        </Col>
        {isInClient ? (
          <Col>
            <a href="https://note.hefang.app" onClick={openInNative}>
              <T input="网页版" />
            </a>
          </Col>
        ) : null}
        <Col>
          <a href={src} onClick={openInNative}>
            <T input="源码" />
          </a>
        </Col>
        <Col>
          <a
            href="https://github.com/iamhefang/hefang-note/issues"
            target="_blank"
            rel="noreferrer"
            onClick={openInNative}
          >
            <T input="反馈" />
          </a>
        </Col>
      </Row>
      <div>
        <Divider />
        <T input="本软件基于下列开源软件开发" />：
        <ol>
          {Object.keys(pkg.dependencies).map((name) => (
            <li key={name}>
              <a href={`https://www.npmjs.com/package/${name}`} target="_blank" rel="noreferrer" onClick={openInNative}>
                {name}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
