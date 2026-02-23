"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import {
  Bold, Italic, Code, Heading2, List,
  ListOrdered, Quote, Minus, Undo, Redo
} from "lucide-react"
import { cn } from "@/lib/utils"

const lowlight = createLowlight(common)

interface NotesEditorProps {
  content: string
  onChange: (value: string) => void
  placeholder?: string
}

export function NotesEditor({ content, onChange, placeholder }: NotesEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing..." }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: content ? tryParse(content) : "",
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
    editorProps: {
      attributes: { class: "tiptap-editor focus:outline-none" },
    },
  })

  if (!editor) return null

  const tools = [
    { icon: Undo, action: () => editor.chain().focus().undo().run(), title: "Undo" },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), title: "Redo" },
    null,
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
    { icon: Code, action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code"), title: "Inline Code" },
    null,
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), title: "Heading" },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), title: "Bullet List" },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), title: "Ordered List" },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), title: "Quote" },
    { icon: Minus, action: () => editor.chain().focus().setHorizontalRule().run(), title: "Divider" },
  ]

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-zinc-700 transition-colors">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-zinc-800 bg-zinc-950/50 flex-wrap">
        {tools.map((tool, i) =>
          tool === null ? (
            <div key={i} className="w-px h-4 bg-zinc-800 mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              title={tool.title}
              onClick={tool.action}
              className={cn(
                "p-1.5 rounded transition-colors",
                tool.active
                  ? "bg-orange-500/20 text-orange-400"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              )}
            >
              <tool.icon size={13} />
            </button>
          )
        )}

        {/* Code block button */}
        <div className="w-px h-4 bg-zinc-800 mx-1" />
        <button
          type="button"
          title="Code Block"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={cn(
            "px-2 py-1 rounded text-[10px] font-mono transition-colors",
            editor.isActive("codeBlock")
              ? "bg-orange-500/20 text-orange-400"
              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
          )}
        >
          {"</>"}
        </button>
      </div>

      {/* Editor */}
      <div className="p-4 min-h-[280px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

function tryParse(str: string) {
  try { return JSON.parse(str) } catch { return str }
}
