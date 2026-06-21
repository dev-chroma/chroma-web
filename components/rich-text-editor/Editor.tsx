"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Menubar from "./Menubar";

export function RichTextEditor({
  field,
}: {
  field: { value: string; onChange: (value: string) => void };
}) {
  console.log("Editor mounted");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] !text-emerald-950 p-4 focus:outline-none !w-full !max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      console.log(editor.getHTML());
      field.onChange(JSON.stringify(editor.getJSON()));
    },

    content: field.value
      ? JSON.parse(field.value)
      : {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Write your masterpiece...",
                },
              ],
            },
          ],
        },
  });

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
