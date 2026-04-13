import React, { useState } from 'react';
import { JobNote, NoteType } from '@/types/job';

interface NoteEditorProps {
  applicationId: string;
  notes: JobNote[];
  onAddNote: (note: Omit<JobNote, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteNote?: (noteId: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ applicationId, notes, onAddNote, onDeleteNote }) => {
  const [content, setContent] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('memo');

  const noteTypes: { value: NoteType; label: string; color: string }[] = [
    { value: 'memo', label: '메모', color: 'var(--primary)' },
    { value: 'interview', label: '면접', color: 'var(--warning)' },
    { value: 'analysis', label: '분석', color: 'var(--success)' }
  ];

  const handleSubmit = () => {
    if (!content.trim()) return;

    onAddNote({
      applicationId,
      content,
      noteType
    });

    setContent('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* 노트 입력 영역 */}
      <div className="note-editor">
        <div className="note-editor-toolbar">
          {noteTypes.map(type => (
            <button
              key={type.value}
              className={noteType === type.value ? 'active' : ''}
              onClick={() => setNoteType(type.value)}
              style={{
                borderBottom: noteType === type.value ? `2px solid ${type.color}` : 'none'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div
          className="note-editor-content"
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          placeholder="메모를 입력하세요..."
          suppressContentEditableWarning
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '12px',
          borderTop: '1px solid var(--border)'
        }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            저장
          </button>
        </div>
      </div>

      {/* 노트 목록 */}
      {notes.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
            작성된 노트 ({notes.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notes.map(note => {
              const typeInfo = noteTypes.find(t => t.value === note.noteType);
              return (
                <div
                  key={note.id}
                  style={{
                    background: 'var(--background)',
                    borderRadius: 'var(--radius)',
                    padding: '16px',
                    borderLeft: `4px solid ${typeInfo?.color || 'var(--border)'}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: typeInfo?.color,
                      background: 'var(--surface)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {typeInfo?.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {formatDate(note.createdAt)}
                      </span>
                      {onDeleteNote && (
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            padding: '4px'
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    style={{ fontSize: '14px', lineHeight: '1.6' }}
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
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
