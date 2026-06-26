import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Dropcursor from '@tiptap/extension-dropcursor';
import { common, createLowlight } from 'lowlight';
import { Button } from '../button/Button';
import { LoadingSpinner } from '../loading/LoadingSpinner';
import { useToast } from '../toast/ToastContext';
import { validateRichTextUrl } from '../../utils/validation';
const lowlight = createLowlight(common);
const ToolbarButton = ({ onClick, isActive, title, disabled, children }) => (_jsx(Button, { type: "button", variant: "text", size: "sm", onClick: onClick, className: isActive ? 'active' : '', title: title, disabled: disabled, children: children }));
export const TiptapEditor = ({ content, onChange, placeholder = '내용을 입력하세요...', uploader, }) => {
    const fileInputRef = useRef(null);
    const editorWrapperRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const toast = useToast();
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ codeBlock: false }),
            Image.configure({ HTMLAttributes: { class: 'editor-image' }, allowBase64: true }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
            Placeholder.configure({ placeholder }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: true }),
            CodeBlockLowlight.configure({ lowlight }),
            Dropcursor.configure({ color: '#3b82f6', width: 2 }),
        ],
        content,
        onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
        editorProps: {
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (!items)
                    return false;
                for (const item of Array.from(items)) {
                    if (item.type.startsWith('image/')) {
                        event.preventDefault();
                        const file = item.getAsFile();
                        if (file) {
                            setUploading(true);
                            uploader(file).then((url) => {
                                if (url && view.state) {
                                    const { schema } = view.state;
                                    const node = schema.nodes.image.create({ src: url });
                                    const transaction = view.state.tr.replaceSelectionWith(node);
                                    view.dispatch(transaction);
                                }
                                setUploading(false);
                            }).catch(() => setUploading(false));
                        }
                        return true;
                    }
                }
                return false;
            },
            handleDrop: (view, event, _slice, moved) => {
                if (moved)
                    return false;
                const files = event.dataTransfer?.files;
                if (!files || files.length === 0)
                    return false;
                const file = files[0];
                if (!file.type.startsWith('image/'))
                    return false;
                event.preventDefault();
                setUploading(true);
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                uploader(file).then((url) => {
                    if (url && view.state && coordinates) {
                        const { schema } = view.state;
                        const node = schema.nodes.image.create({ src: url });
                        const transaction = view.state.tr.insert(coordinates.pos, node);
                        view.dispatch(transaction);
                    }
                    setUploading(false);
                    setIsDragging(false);
                }).catch(() => { setUploading(false); setIsDragging(false); });
                return true;
            },
        },
    });
    // 외부에서 content 가 늦게 도착했을 때 초기 빈 상태(<p></p>) 1회만 주입.
    // 일반 onUpdate 흐름과 충돌하지 않도록 가드.
    useEffect(() => {
        if (editor && content && !editor.isDestroyed) {
            const currentContent = editor.getHTML();
            if (currentContent !== content && currentContent === '<p></p>') {
                editor.commands.setContent(content);
            }
        }
    }, [editor, content]);
    // wrapper level drag overlay — handleDrop 외에 enter/leave 시각 효과만 담당.
    useEffect(() => {
        const wrapper = editorWrapperRef.current;
        if (!wrapper)
            return;
        const handleDragEnter = (e) => {
            e.preventDefault();
            if (e.dataTransfer?.types.includes('Files'))
                setIsDragging(true);
        };
        const handleDragLeave = (e) => {
            e.preventDefault();
            const rect = wrapper.getBoundingClientRect();
            if (e.clientX <= rect.left || e.clientX >= rect.right || e.clientY <= rect.top || e.clientY >= rect.bottom) {
                setIsDragging(false);
            }
        };
        const handleDragOver = (e) => e.preventDefault();
        const handleDrop = () => setIsDragging(false);
        wrapper.addEventListener('dragenter', handleDragEnter);
        wrapper.addEventListener('dragleave', handleDragLeave);
        wrapper.addEventListener('dragover', handleDragOver);
        wrapper.addEventListener('drop', handleDrop);
        return () => {
            wrapper.removeEventListener('dragenter', handleDragEnter);
            wrapper.removeEventListener('dragleave', handleDragLeave);
            wrapper.removeEventListener('dragover', handleDragOver);
            wrapper.removeEventListener('drop', handleDrop);
        };
    }, []);
    const handleFileSelect = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file || !editor)
            return;
        setUploading(true);
        uploader(file)
            .then((url) => {
            if (url)
                editor.chain().focus().setImage({ src: url }).run();
        })
            .catch(() => toast.error('이미지 업로드 중 오류가 발생했습니다.'))
            .finally(() => {
            setUploading(false);
            if (fileInputRef.current)
                fileInputRef.current.value = '';
        });
    }, [editor, uploader, toast]);
    const addImage = useCallback(() => fileInputRef.current?.click(), []);
    const addImageUrl = useCallback(() => {
        const url = window.prompt('이미지 URL을 입력하세요:');
        if (!url || !editor)
            return;
        const result = validateRichTextUrl(url, 'image');
        if (!result.valid) {
            toast.warning(result.error || '유효하지 않은 URL입니다.');
            return;
        }
        editor.chain().focus().setImage({ src: result.url }).run();
    }, [editor, toast]);
    const setLink = useCallback(() => {
        if (!editor)
            return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('링크 URL을 입력하세요:', previousUrl);
        if (url === null)
            return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        const result = validateRichTextUrl(url, 'link');
        if (!result.valid) {
            toast.error(result.error || '유효하지 않은 URL입니다.');
            return;
        }
        editor.chain().focus().extendMarkRange('link')
            .setLink({ href: result.url, target: '_blank', rel: 'noopener noreferrer' })
            .run();
    }, [editor, toast]);
    if (!editor)
        return null;
    return (_jsxs("div", { className: "tiptap-editor", ref: editorWrapperRef, children: [uploading && (_jsx("div", { className: "editor-upload-indicator", children: _jsx(LoadingSpinner, { message: "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC \uC911..." }) })), isDragging && (_jsx("div", { className: "editor-drag-overlay", children: _jsxs("div", { className: "drag-overlay-content", children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", width: "48", height: "48", children: [_jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }), _jsx("polyline", { points: "17 8 12 3 7 8" }), _jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })] }), _jsx("p", { children: "\uC774\uBBF8\uC9C0\uB97C \uC5EC\uAE30\uC5D0 \uB193\uC73C\uC138\uC694" })] }) })), _jsxs("div", { className: "editor-toolbar", children: [_jsxs("div", { className: "toolbar-group", children: [_jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }), title: "\uC81C\uBAA9 1", children: "H1" }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }), title: "\uC81C\uBAA9 2", children: "H2" }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive('heading', { level: 3 }), title: "\uC81C\uBAA9 3", children: "H3" })] }), _jsx("div", { className: "toolbar-divider" }), _jsxs("div", { className: "toolbar-group", children: [_jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), title: "\uAD75\uAC8C", children: _jsx("strong", { children: "B" }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), title: "\uAE30\uC6B8\uC784", children: _jsx("em", { children: "I" }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive('underline'), title: "\uBC11\uC904", children: _jsx("u", { children: "U" }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive('strike'), title: "\uCDE8\uC18C\uC120", children: _jsx("s", { children: "S" }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleHighlight().run(), isActive: editor.isActive('highlight'), title: "\uD615\uAD11\uD39C", children: _jsx("span", { className: "toolbar-highlight-preview", children: "H" }) })] }), _jsx("div", { className: "toolbar-divider" }), _jsxs("div", { className: "toolbar-group", children: [_jsx(ToolbarButton, { onClick: () => editor.chain().focus().setTextAlign('left').run(), isActive: editor.isActive({ textAlign: 'left' }), title: "\uC67C\uCABD \uC815\uB82C", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), _jsx("line", { x1: "3", y1: "12", x2: "15", y2: "12" }), _jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })] }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().setTextAlign('center').run(), isActive: editor.isActive({ textAlign: 'center' }), title: "\uAC00\uC6B4\uB370 \uC815\uB82C", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), _jsx("line", { x1: "6", y1: "12", x2: "18", y2: "12" }), _jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })] }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().setTextAlign('right').run(), isActive: editor.isActive({ textAlign: 'right' }), title: "\uC624\uB978\uCABD \uC815\uB82C", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }), _jsx("line", { x1: "9", y1: "12", x2: "21", y2: "12" }), _jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })] }) })] }), _jsx("div", { className: "toolbar-divider" }), _jsxs("div", { className: "toolbar-group", children: [_jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), title: "\uAE00\uBA38\uB9AC \uAE30\uD638", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "9", y1: "6", x2: "20", y2: "6" }), _jsx("line", { x1: "9", y1: "12", x2: "20", y2: "12" }), _jsx("line", { x1: "9", y1: "18", x2: "20", y2: "18" }), _jsx("circle", { cx: "4", cy: "6", r: "1.5", fill: "currentColor" }), _jsx("circle", { cx: "4", cy: "12", r: "1.5", fill: "currentColor" }), _jsx("circle", { cx: "4", cy: "18", r: "1.5", fill: "currentColor" })] }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), title: "\uBC88\uD638 \uB9E4\uAE30\uAE30", children: "1." }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive('blockquote'), title: "\uC778\uC6A9\uAD6C", children: _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "currentColor", children: _jsx("path", { d: "M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" }) }) })] }), _jsx("div", { className: "toolbar-divider" }), _jsxs("div", { className: "toolbar-group", children: [_jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleCode().run(), isActive: editor.isActive('code'), title: "\uC778\uB77C\uC778 \uCF54\uB4DC", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("polyline", { points: "16 18 22 12 16 6" }), _jsx("polyline", { points: "8 6 2 12 8 18" })] }) }), _jsx(ToolbarButton, { onClick: () => editor.chain().focus().toggleCodeBlock().run(), isActive: editor.isActive('codeBlock'), title: "\uCF54\uB4DC \uBE14\uB85D", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), _jsx("polyline", { points: "9 8 5 12 9 16" }), _jsx("polyline", { points: "15 8 19 12 15 16" })] }) })] }), _jsx("div", { className: "toolbar-divider" }), _jsxs("div", { className: "toolbar-group", children: [_jsx(ToolbarButton, { onClick: setLink, isActive: editor.isActive('link'), title: "\uB9C1\uD06C", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }), _jsx("path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })] }) }), _jsx(ToolbarButton, { onClick: addImage, title: "\uC774\uBBF8\uC9C0 \uC5C5\uB85C\uB4DC", disabled: uploading, children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), _jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }), _jsx("polyline", { points: "21 15 16 10 5 21" })] }) }), _jsx(ToolbarButton, { onClick: addImageUrl, title: "\uC774\uBBF8\uC9C0 URL", children: _jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }), _jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }), _jsx("path", { d: "M21 15l-5-5L5 21" })] }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", onChange: handleFileSelect, className: "input-hidden" })] }), _jsx("div", { className: "toolbar-divider" }), _jsx("div", { className: "toolbar-group", children: _jsx(ToolbarButton, { onClick: () => editor.chain().focus().setHorizontalRule().run(), title: "\uAD6C\uBD84\uC120", children: _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }) }) }) })] }), _jsx(EditorContent, { editor: editor, className: "editor-content" }), _jsx("div", { className: "editor-hint", children: _jsx("span", { children: "Ctrl+V\uB85C \uC774\uBBF8\uC9C0 \uBD99\uC5EC\uB123\uAE30 | \uC774\uBBF8\uC9C0 \uB4DC\uB798\uADF8 \uC564 \uB4DC\uB86D \uC9C0\uC6D0" }) })] }));
};
