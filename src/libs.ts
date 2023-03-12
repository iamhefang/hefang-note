import antd from "antd"
import _ from "lodash"
import React from "react"
import ReactDOM from "react-dom"
import ReactDOMClient from "react-dom/client"


Object.defineProperties(window,
    {
        React: { value: React },
        ReactDOM: { value: ReactDOM },
        ReactDOMClient: { value: ReactDOMClient },
        _: { value: _ },
        antd: { value: antd },
    },
)


export { React, ReactDOM, ReactDOMClient, _, antd }
