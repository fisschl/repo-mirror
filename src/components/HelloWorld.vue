<script lang="ts" setup>
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import { ref } from "vue";
import "../assets/tiptap.css";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";

const content = ref(
  `
        <h2>
          Hi there,
        </h2>
        <p>
          this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
        </p>
        <ul>
          <li>
            That's a bullet list with one …
          </li>
          <li>
            … or two list items.
             has support for links to the whole <a href="https://en.wikipedia.org/wiki/World_Wide_Web">world wide web</a>. We tested a lot of URLs and I think you can add *every URL* you want. Isn’t that cool? Let’s try <a href="https://statamic.com/">another one!</a> Yep, seems 
          </li>
        </ul>
          <p><mark>But that one is.</mark></p>
        <p>
          Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
        </p>
        <pre><code class="language-css">body {
  display: none;
}</code></pre>
        <p>
          I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
        </p>
        <blockquote>
          Wow, that's amazing. Good work, boy! 👏
          <br />
          — Mom
        </blockquote>
      `
);

const editor = useEditor({
  content: content.value,
  extensions: [StarterKit, Highlight, Link],
});
</script>

<template>
  <div class="container">
    <div class="control-group">
      <div class="button-group">
        <button
          @click="editor?.chain().focus().toggleBold().run()"
          :disabled="!editor?.can().chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor?.isActive('bold') }"
        >
          Bold
        </button>
        <button
          @click="editor?.chain().focus().toggleItalic().run()"
          :disabled="!editor?.can().chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor?.isActive('italic') }"
        >
          Italic
        </button>
        <button
          @click="editor?.chain().focus().toggleStrike().run()"
          :disabled="!editor?.can().chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor?.isActive('strike') }"
        >
          Strike
        </button>
        <button
          @click="editor?.chain().focus().toggleCode().run()"
          :disabled="!editor?.can().chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor?.isActive('code') }"
        >
          Code
        </button>
        <button
          @click="editor?.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor?.isActive('paragraph') }"
        >
          Paragraph
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 1 }) }"
        >
          H1
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 2 }) }"
        >
          H2
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 3 }) }"
        >
          H3
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 4 }) }"
        >
          H4
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 5 }) }"
        >
          H5
        </button>
        <button
          @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
          :class="{ 'is-active': editor?.isActive('heading', { level: 6 }) }"
        >
          H6
        </button>
        <button
          @click="editor?.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor?.isActive('bulletList') }"
        >
          Bullet list
        </button>
        <button
          @click="editor?.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor?.isActive('orderedList') }"
        >
          Ordered list
        </button>
        <button
          @click="editor?.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor?.isActive('codeBlock') }"
        >
          Code block
        </button>
        <button
          @click="editor?.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor?.isActive('blockquote') }"
        >
          Blockquote
        </button>
        <button @click="editor?.chain().focus().setHorizontalRule().run()">
          Horizontal rule
        </button>
        <button @click="editor?.chain().focus().setHardBreak().run()">
          Hard break
        </button>
      </div>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>

<style scoped>
.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button-group button {
  padding: 3px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
}

.button-group button.is-active {
  background-color: #000;
  color: #fff;
}
</style>
