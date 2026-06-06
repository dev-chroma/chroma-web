"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";

interface MenubarProps {
  editor: Editor | null;
}

function ToolbarButton({
  icon: Icon,
  active,
  title,
  onClick,
}: {
  icon: React.ElementType;
  active?: boolean;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        flex h-11 w-11 items-center justify-center
        rounded-xl transition-all duration-300
        ${
          active
            ? "bg-emerald-950 text-cream-50 shadow-lg shadow-emerald-950/20"
            : "text-emerald-950/50 hover:bg-emerald-950/5 hover:text-emerald-950"
        }
      `}
    >
      <Icon size={18} />
    </button>
  );
}

function Divider() {
  return <div className="h-8 w-px bg-emerald-950/10 mx-1" />;
}

export default function Menubar({ editor }: MenubarProps) {
  if (!editor) return null;

  return (
    <div className="sticky z-50 flex flex-wrap items-center gap-2 p-5 bg-white/90 backdrop-blur-xl rounded-xl border border-emerald-950/5">
      {/* Formatting */}
      <ToolbarButton
        icon={Bold}
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />

      <ToolbarButton
        icon={Italic}
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />

      <ToolbarButton
        icon={Strikethrough}
        title="Strike"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />

      <Divider />

      {/* Headings */}
      <ToolbarButton
        icon={Heading1}
        title="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />

      <ToolbarButton
        icon={Heading2}
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />

      <ToolbarButton
        icon={Heading3}
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <Divider />

      {/* Lists */}
      <ToolbarButton
        icon={List}
        title="Bullet List"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />

      <ToolbarButton
        icon={ListOrdered}
        title="Ordered List"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      <Divider />

      {/* Alignment */}
      <ToolbarButton
        icon={AlignLeft}
        title="Align Left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      />

      <ToolbarButton
        icon={AlignCenter}
        title="Align Center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      />

      <ToolbarButton
        icon={AlignRight}
        title="Align Right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      />

      <Divider />

      {/* History */}
      <ToolbarButton
        icon={Undo}
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      />

      <ToolbarButton
        icon={Redo}
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
}
