import React from 'react';
import { Button } from '@sonhoseong/mfa-lib';
import { JobNote, NoteType } from '@/types/job';
import { useNoteEditor } from '@/hooks';

interface NoteEditorProps {
  applicationId: string;
  notes: JobNote[];
  onAddNote: (note: Omit<JobNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteNote?: (noteId: string) => void;
}

const noteTypes: { value: NoteType; label: string; color: string }[] = [
  { value: 'memo', label: '메모', color: 'var(--primary)' },
  { value: 'interview', label: '면접', color: 'var(--warning)' },
  { value: 'analysis', label: '분석', color: 'var(--success)' },
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const NoteEditor: React.FC<NoteEditorProps> = ({ applicationId, notes, onAddNote, onDeleteNote }) => {
  const { noteType, setNoteType, handleInput, handleSubmit, canSubmit } = useNoteEditor({
    applicationId,
    onAddNote,
  });

  return (
    <div>
      <div className="note-editor">
        <div className="note-editor-toolbar">
          {noteTypes.map(type => (
            <Button
              key={type.value}
              variant="text"
              size="sm"
              className={noteType === type.value ? 'active' : ''}
              onClick={() => setNoteType(type.value)}
              style={{ borderBottom: noteType === type.value ? `2px solid ${type.color}` : 'none' }}
            >
              {type.label}
            </Button>
          ))}
        </div>
        <div
          className="note-editor-content"
          contentEditable
          onInput={handleInput}
          data-placeholder="메모를 입력하세요..."
          suppressContentEditableWarning
        />
        <div className="note-editor-footer">
          <Button variant="primary" size="sm" onClick={handleSubmit} disabled={!canSubmit}>
            저장
          </Button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="note-list">
          <h4 className="note-list__title">
            작성된 노트 ({notes.length})
          </h4>
          <div className="note-list__items">
            {notes.map(note => {
              const typeInfo = noteTypes.find(t => t.value === note.noteType);
              return (
                <div
                  key={note.id}
                  style={{
                    background: 'var(--background)',
                    borderRadius: 'var(--radius)',
                    padding: '16px',
                    borderLeft: `4px solid ${typeInfo?.color || 'var(--border)'}`,
                  }}
                >
                  <div className="note-item__header">
                    <span style={{ fontSize: '12px', fontWeight: '500', color: typeInfo?.color, background: 'var(--surface)', padding: '2px 8px', borderRadius: '4px' }}>
                      {typeInfo?.label}
                    </span>
                    <div className="note-item__actions">
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{formatDate(note.createdAt)}</span>
                      {onDeleteNote && (
                        <Button.Icon
                          aria-label="노트 삭제"
                          size="sm"
                          variant="danger"
                          onClick={() => onDeleteNote(note.id)}
                          style={{ color: 'var(--text-secondary)', padding: '4px' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </Button.Icon>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }} dangerouslySetInnerHTML={{ __html: note.content }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;
