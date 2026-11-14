"use client";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Heading2,
  Heading3,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";
import { type Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-md transition-colors hover:bg-secondary",
        active && "bg-secondary text-primary"
      )}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border p-2">
      <ToolbarButton title="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Underline" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")}>
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-border mx-1" />
      <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-border mx-1" />
      <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-border mx-1" />
      <ToolbarButton title="Align left" onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })}>
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Align center" onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })}>
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Align right" onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })}>
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-border mx-1" />
      <ToolbarButton title="Link" onClick={addLink} active={editor.isActive("link")}>
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Image" onClick={addImage}>
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Table"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon className="h-4 w-4" />
      </ToolbarButton>
      <div className="w-px h-5 bg-border mx-1" />
      <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}
