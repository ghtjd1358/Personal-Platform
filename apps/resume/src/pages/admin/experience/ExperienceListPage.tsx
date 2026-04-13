import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { experiencesApi } from '../../../network'
import type { Experience } from '../../../network/apis/types'

const ExperienceListPage: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([])
    const [loading, setLoading] = useState(true)

    const fetchExperiences = async () => {
        setLoading(true)
        const { data, error } = await experiencesApi.getAll()
        if (data) setExperiences(data)
        if (error) console.error(error)
        setLoading(false)
    }

    useEffect(() => {
        fetchExperiences()
    }, [])

    const handleDelete = async (exp: Experience) => {
        if (!confirm(`"${exp.company}" 경력을 삭제하시겠습니까?`)) return
        const { error } = await experiencesApi.delete(exp.id)
        if (error) alert('삭제 실패')
        else fetchExperiences()
    }

    if (loading) return <div className="admin-loading"><p>로딩 중...</p></div>

    return (
        <div className="admin-list-page">
            <header className="admin-page-header">
                <div className="admin-page-header-left">
                    <h1>경력 관리</h1>
                </div>
                <div className="admin-page-header-right">
                    <Link to="/admin/experience/new" className="admin-btn admin-btn-primary">새 경력 추가</Link>
                </div>
            </header>

            {experiences.length === 0 ? (
                <div className="admin-empty"><p>등록된 경력이 없습니다.</p></div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>회사</th>
                                <th>직책</th>
                                <th>기간</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiences.map((exp) => (
                                <tr key={exp.id}>
                                    <td>{exp.company}</td>
                                    <td>{exp.position}</td>
                                    <td>{exp.start_date} ~ {exp.is_current ? '현재' : exp.end_date}</td>
                                    <td>
                                        <Link to={`/admin/experience/edit/${exp.id}`}>수정</Link>
                                        {' '}
                                        <button onClick={() => handleDelete(exp)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default ExperienceListPage
