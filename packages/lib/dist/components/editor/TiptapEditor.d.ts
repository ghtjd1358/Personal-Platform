import React from 'react';
export interface TiptapEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    /**
     * 파일 업로드 함수 — 성공 시 image URL, 실패/검증 실패 시 null.
     * 호출자가 MIME/size 검증과 toast 통지를 책임지는 책임 분리 contract.
     */
    uploader: (file: File) => Promise<string | null>;
}
export declare const TiptapEditor: React.FC<TiptapEditorProps>;
//# sourceMappingURL=TiptapEditor.d.ts.map