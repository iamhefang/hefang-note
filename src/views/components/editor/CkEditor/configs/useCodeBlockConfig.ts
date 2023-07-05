import { EditorConfig } from "@ckeditor/ckeditor5-core"
import { useMemo } from "react"

import { useTranslate } from "$hooks/useTranslate"

export default function useCodeBlockConfig() {
    const t = useTranslate()

    return useMemo<EditorConfig["codeBlock"]>(() => {
        return {
            languages: [
                { language: "plaintext", label: t("纯文本") },
                { language: "c", label: "C" },
                { language: "cs", label: "C#" },
                { language: "cpp", label: "C++" },
                { language: "css", label: "CSS" },
                { language: "diff", label: "Diff" },
                { language: "html", label: "HTML" },
                { language: "java", label: "Java" },
                { language: "javascript", label: "JavaScript" },
                { language: "php", label: "PHP" },
                { language: "python", label: "Python" },
                { language: "ruby", label: "Ruby" },
                { language: "typescript", label: "TypeScript" },
                { language: "xml", label: "XML" },
                { language: "shell", label: "Shell" },
            ],
        }
    }, [])
}