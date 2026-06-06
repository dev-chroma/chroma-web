"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Write your masterpiece here</p>",
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
  });

  return <EditorContent editor={editor} />;
};

export default Tiptap;
