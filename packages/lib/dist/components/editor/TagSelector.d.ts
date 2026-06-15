import React from 'react';
export interface TagItem {
    id: string;
    name: string;
}
export interface TagSelectorProps {
    tags: TagItem[];
    selectedTagIds: string[];
    onTagToggle: (tagId: string) => void;
}
declare const TagSelector: React.FC<TagSelectorProps>;
export { TagSelector };
//# sourceMappingURL=TagSelector.d.ts.map