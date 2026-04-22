/**
 * IconPicker — iconMap 의 key 목록을 grid 로 보여주고 선택하게 함.
 * 검색 필터 + 선택 highlight + "커스텀" 옵션 (iconMap 에 없는 emoji/텍스트 직접 입력)
 */
import React, { useState, useMemo } from 'react';
import { iconMap } from '../../../constants/iconMap';

interface IconPickerProps {
    /** 현재 선택된 icon key 또는 커스텀 텍스트 */
    value: string;
    onChange: (value: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({ value, onChange }) => {
    const [query, setQuery] = useState('');
    const [customMode, setCustomMode] = useState(() => !iconMap[value]);

    const allKeys = useMemo(() => Object.keys(iconMap).sort((a, b) => a.localeCompare(b)), []);
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allKeys;
        return allKeys.filter((k) => k.toLowerCase().includes(q));
    }, [allKeys, query]);

    return (
        <div className="icon-picker">
            {/* 모드 토글 */}
            <div className="icon-picker-modes">
                <button
                    type="button"
                    className={`icon-picker-mode ${!customMode ? 'active' : ''}`}
                    onClick={() => setCustomMode(false)}
                >
                    iconMap 선택
                </button>
                <button
                    type="button"
                    className={`icon-picker-mode ${customMode ? 'active' : ''}`}
                    onClick={() => setCustomMode(true)}
                >
                    커스텀 (이모지/텍스트)
                </button>
            </div>

            {customMode ? (
                <div className="icon-picker-custom">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="💻  또는 임의 텍스트"
                        className="icon-picker-custom-input"
                        maxLength={4}
                    />
                    <span className="icon-picker-custom-preview">{value || '—'}</span>
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="아이콘 검색…"
                        className="icon-picker-search"
                    />
                    <div className="icon-picker-grid">
                        {filtered.map((key) => (
                            <button
                                key={key}
                                type="button"
                                className={`icon-picker-item ${value === key ? 'selected' : ''}`}
                                onClick={() => onChange(key)}
                                title={key}
                            >
                                <span className="icon-picker-item-visual">{iconMap[key]}</span>
                                <span className="icon-picker-item-label">{key}</span>
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <div className="icon-picker-empty">검색 결과 없음</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default IconPicker;
