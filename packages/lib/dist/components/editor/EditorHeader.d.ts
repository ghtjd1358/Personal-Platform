import React from 'react';
export interface EditorHeaderProps {
    isEditMode: boolean;
    isSaving: boolean;
    lastSavedAt?: Date | null;
    hasUnsavedChanges?: boolean;
    onBack: () => void;
    onSaveDraft: () => void;
    onPublish: () => void;
    publishLabel?: string;
}
declare const EditorHeader: React.FC<EditorHeaderProps>;
export { EditorHeader };
//# sourceMappingURL=EditorHeader.d.ts.map