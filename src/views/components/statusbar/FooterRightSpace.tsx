
import VersionView from "$components/version/VersionView"
import usePluginComponents from "$plugin/hooks/usePluginComponents"

export default function FooterRightSpace() {
    const components = usePluginComponents("FooterRight")

    return (
        <>
            {components}
            <VersionView/>
        </>
    )
}