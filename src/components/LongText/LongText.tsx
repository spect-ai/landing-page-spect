import "./styles.scss";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styled from "styled-components";

const MenuBar = ({ editor }: any) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        code
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        quote
      </button>
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
    </div>
  );
};

export default function LongText() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: ``,
  });

  return (
    <Container>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </Container>
  );
}

const Container = styled.div`
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;

  button {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding: 0.25rem 0.5rem;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: #eee;
      color: #1b1b1b;
    }

    &.is-active {
      background: #fff;
      color: #1b1b1b;
    }
  }
`;
