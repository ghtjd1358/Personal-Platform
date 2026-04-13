import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { portfoliosApi } from '../../../network'
import type { Portfolio } from '../../../network/apis/types'

const ProjectsListPage: React.FC = () => {
    const [projects, setProjects] = useState<Portfolio[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProjects = async () => {
        setLoading(true)
        const { data, error } = await portfoliosApi.getAll()
        if (data) setProjects(data)
        if (error) console.error(error)
        setLoading(false)
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleDelete = async (project: Portfolio) => {
        if (!confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) return
        const { error } = await portfoliosApi.delete(project.id)
        if (error) alert('삭제 실패')
        else fetchProjects()
    }

    if (loading) return <div className="admin-loading"><p>로딩 중...</p></div>

    return (
        <div className="admin-list-page">
            <header className="admin-page-header">
                <div className="admin-page-header-left">
                    <h1>프로젝트 관리</h1>
                </div>
                <div className="admin-page-header-right">
                    <Link to="/admin/projects/new" className="admin-btn admin-btn-primary">새 프로젝트 추가</Link>
                </div>
            </header>

            {projects.length === 0 ? (
                <div className="admin-empty"><p>등록된 프로젝트가 없습니다.</p></div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>제목</th>
                                <th>역할</th>
                                <th>기간</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td>{project.title}</td>
                                    <td>{project.role}</td>
                                    <td>{project.start_date} ~ {project.is_current ? '진행중' : project.end_date}</td>
                                    <td>
                                        <Link to={`/admin/projects/edit/${project.id}`}>수정</Link>
                                        {' '}
                                        <button onClick={() => handleDelete(project)}>삭제</button>
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

export default ProjectsListPage
