import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const TagSelector = ({ tags, selectedTagIds, onTagToggle, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));
    const availableTags = tags.filter((tag) => !selectedTagIds.includes(tag.id) &&
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "editor-tags", children: [_jsxs("div", { className: "tags-header", children: [_jsx("div", { className: "tags-label", children: "\uD0DC\uADF8" }), _jsx("input", { type: "text", className: "tags-search", placeholder: "\uD0DC\uADF8 \uAC80\uC0C9...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), selectedTags.length > 0 && (_jsx("div", { className: "tags-selected", children: selectedTags.map((tag) => (_jsxs("button", { type: "button", className: "tag-chip selected", onClick: () => onTagToggle(tag.id), children: ["#", tag.name, " \u00D7"] }, tag.id))) })), _jsx("div", { className: "tags-list", children: availableTags.map((tag) => (_jsxs("button", { type: "button", className: "tag-chip", onClick: () => onTagToggle(tag.id), children: ["#", tag.name] }, tag.id))) })] }));
};
export { TagSelector };
