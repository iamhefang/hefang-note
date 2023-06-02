export default function Loading() {
    return (
        <div className="ant-app" data-tauri-drag-region>
            <div className="loading-container">
                <div className="ant-spin ant-spin-lg ant-spin-spinning" aria-live="polite" aria-busy="true">
          <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item"/>
            <i className="ant-spin-dot-item"/>
            <i className="ant-spin-dot-item"/>
            <i className="ant-spin-dot-item"/>
          </span>
                </div>
            </div>
        </div>
    )
}
