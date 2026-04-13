import React from 'react'
import { useNavigate } from 'react-router-dom'

const SkillsEditorPage: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="admin-editor-page">
            <header className="admin-page-header">
                <button type="button" onClick={() => navigate('/admin/skills')}>← 목록으로</button>
                <h1>스킬 관리 안내</h1>
            </header>
            <div className="admin-info-box" style={{ padding: '20px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
                <p>스킬은 아이콘 매핑이 필요하여 코드에서 직접 관리합니다.</p>
                <p><code>src/data/skills.ts</code> 파일을 수정하세요.</p>
            </div>
        </div>
    )
}

export default SkillsEditorPage
