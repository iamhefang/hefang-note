import { Context, sm4_crypt_ecb, sm4_setkey_dec, sm4_setkey_enc } from "~/utils/sm4"

test("sm4", () => {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const key = encoder.encode("11111111111111111111111111111111")
    const data = ["This is Cotnent", "这是中文内容", `## v0.2.0

1.\`新增\` 最上级目录和笔记支持锁定
2. \`优化\` 修复一些 bug
3. \`新增\` 状态栏添加到 Github 的链接
4. \`新增\` 启动时如果版本不一致显示更新日志

## v0.1.0

1. \`优化\` 支持 20w 条笔记滚动不卡顿
2. \`新增\` 支持锁定和关闭窗口快捷键配置
3. \`新增\` 支持使用方向键选中笔记和展开/收起目录
4. \`优化\` 修复一些 bug

## v0.0.1

1. 第一个开源版本`]


    for (const item of data) {
        const ctx = new Context()
        ctx.mode = 1
        sm4_setkey_enc(ctx, key)
        const encrypted = sm4_crypt_ecb(ctx, encoder.encode(item))

        ctx.mode = 0
        sm4_setkey_dec(ctx, key)
        const decode = sm4_crypt_ecb(ctx, new Uint8Array(encrypted))
        expect(item).toBe(decoder.decode(new Uint8Array(decode)))
    }
})

export { }
