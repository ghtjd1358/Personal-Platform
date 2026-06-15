import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CommonButton } from '../button/CommonButton';
const formatLastSaved = (date) => {
    if (!date)
        return null;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1)
        return '방금 자동 저장됨';
    if (minutes < 60)
        return `${minutes}분 전 자동 저장됨`;
    return `${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 자동 저장됨`;
};
const EditorHeader = ({ isEditMode, isSaving, lastSavedAt, hasUnsavedChanges, onBack, onSaveDraft, onPublish, publishLabel, }) => {
    return (_jsxs("header", { className: "editor-header", children: [_jsxs("div", { className: "editor-header-left", children: [_jsx(CommonButton, { variant: "ghost", size: "sm", onClick: onBack, className: "btn-back", children: "\u2190 \uB098\uAC00\uAE30" }), !isEditMode && lastSavedAt && (_jsx("span", { className: `autosave-indicator ${hasUnsavedChanges ? 'unsaved' : ''}`, children: hasUnsavedChanges ? '저장되지 않은 변경사항' : formatLastSaved(lastSavedAt) }))] }), _jsxs("div", { className: "editor-header-right", children: [_jsx(CommonButton, { variant: "secondary", onClick: onSaveDraft, disabled: isSaving, children: "\uC784\uC2DC\uC800\uC7A5" }), _jsx(CommonButton, { variant: "primary", onClick: onPublish, disabled: isSaving, loading: isSaving, children: publishLabel ?? (isEditMode ? '수정하기' : '발행하기') })] })] }));
};
export { EditorHeader };
