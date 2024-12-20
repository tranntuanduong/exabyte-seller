import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import React, { useEffect } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaHeading,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaUndo,
  FaUnderline,
} from "react-icons/fa";
import { Box, Button } from "@mui/material";
import styled from "@emotion/styled";
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return <></>;
  }

  return (
    <div className="menu-bar">
      <div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          type="button"
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          type="button"
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
          type="button"
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          type="button"
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
          type="button"
        >
          <FaHeading />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          type="button"
        >
          <FaListUl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          type="button"
        >
          <FaListOl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
          type="button"
        >
          <FaQuoteLeft />
        </button>
      </div>
      <div
        style={{
          display: "flex",
        }}
      >
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          type="button"
        >
          <FaUndo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          type="button"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
};

interface Props {
  getContent: (content: string) => void;
}

const TipTap = ({ getContent }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: ``,
  });

  useEffect(() => {
    if (!editor) return;
    if (!editor?.isFocused) getContent(editor.getHTML());
  }, [editor?.isFocused]);

  return (
    <Box
      className="text-editor"
      sx={{
        flex: 1,
      }}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Box>
  );
};
export default TipTap;
