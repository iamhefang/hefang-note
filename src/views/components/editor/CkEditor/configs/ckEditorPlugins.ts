import { Autoformat } from "@ckeditor/ckeditor5-autoformat"
import { Bold, Code, CodeEditing, CodeUI, Italic, Strikethrough } from "@ckeditor/ckeditor5-basic-styles"
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote"
import { CodeBlock, CodeBlockEditing, CodeBlockUI } from "@ckeditor/ckeditor5-code-block"
import { EditorConfig } from "@ckeditor/ckeditor5-core"
import { Essentials } from "@ckeditor/ckeditor5-essentials"
import { Heading } from "@ckeditor/ckeditor5-heading"
import { HorizontalLine } from "@ckeditor/ckeditor5-horizontal-line"
import { Image, ImageCaption } from "@ckeditor/ckeditor5-image"
import { Link } from "@ckeditor/ckeditor5-link"
import { List, TodoList } from "@ckeditor/ckeditor5-list"
import { Markdown } from "@ckeditor/ckeditor5-markdown-gfm"
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed"
import { Paragraph } from "@ckeditor/ckeditor5-paragraph"
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office"
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing"
import { Table, TableToolbar } from "@ckeditor/ckeditor5-table"

export const ckEditorPlugins: EditorConfig["plugins"] = [
    Markdown,
    SourceEditing,
    Heading,
    Essentials,
    Bold,
    Italic,
    Strikethrough,
    Paragraph,
    //   ImageUpload,
    //   EasyImage,
    //   UploadAdapter,
    BlockQuote,
    //   CKFinder,
    Image,
    ImageCaption,
    Link,
    List,
    TodoList,
    MediaEmbed,
    PasteFromOffice,
    Table,
    TableToolbar,
    Autoformat,
    HorizontalLine,
    CodeBlock,
    CodeBlockEditing,
    CodeBlockUI,
    Code,
    CodeEditing,
    CodeUI,
]