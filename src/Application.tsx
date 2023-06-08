import {App as Antd, ConfigProvider} from "antd"
import React, {Suspense, useEffect} from "react"

import {uiSlice} from "~/redux/uiSlice"
import View from "~/views"

import {useAppDispatch} from "./redux"

import Loading from "$components/loading/Loading"
import useContentLoader from "$hooks/useContentLoader"
import {useStates} from "$hooks/useSelectors"
import useSettingsLoader from "$hooks/useSettingsLoader"
import {useThemeConfig} from "$hooks/useThemeConfig"
import {useLocaleDefine} from "$hooks/useTranslate"
import usePluginComponents from "$plugin/hooks/usePluginComponents"
import usePluginEffect from "$plugin/hooks/usePluginEffect"




const LazySettings = React.lazy(async () => import("~/views/settings"))

export default function Application() {
    const {launching} = useStates()
    const loadContents = useContentLoader()
    const loadSettings = useSettingsLoader()
    const dispatch = useAppDispatch()
    useEffect(() => {
        void (async () => {
            await loadSettings()
            dispatch(uiSlice.actions.ready({}))
            void loadContents()
        })()
    }, [dispatch, loadContents, loadSettings])

    usePluginEffect()
    const themeConfig = useThemeConfig()
    const locale = useLocaleDefine()
    const components = usePluginComponents("Float")

    return launching ? (
        <Loading/>
    ) : (
        <ConfigProvider autoInsertSpaceInButton={false} locale={locale.antd} theme={themeConfig}>
            <Antd message={{top: 40}} notification={{top: 40}}>
                <View/>
                <Suspense>
                    <LazySettings/>
                </Suspense>
                {/*<ShowInPlatform platforms={["Linux", "Darwin", "Windows_NT", "Browser"]}>*/}
                {/*    {() => (*/}
                {/*        */}
                {/*    )}*/}
                {/*</ShowInPlatform>*/}
                {components}
            </Antd>
        </ConfigProvider>
    )
}
