import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Layout/Navigation';
import ProjectPreviewModal from './ProjectPreviewModal';
import NewProjectModal from './NewProjectModal';
import './styles.css';

// localStorage 키
const PROJECTS_KEY = 'simvex_projects';

// 프로젝트 저장
const saveProjects = (projects) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

// 프로젝트 불러오기
const loadProjects = () => {
  const saved = localStorage.getItem(PROJECTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

const ProjectSelect = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // selectedProject 변경 감지
  useEffect(() => {
    console.log('🔄 selectedProject 변경됨:', selectedProject);
  }, [selectedProject]);

  // 컴포넌트 마운트 시 프로젝트 목록 불러오기
  useEffect(() => {
    const loadedProjects = loadProjects();
    console.log('📁 불러온 프로젝트:', loadedProjects);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(loadedProjects);
  }, []);

  const handleProjectClick = (project) => {
    console.log('🖱️ 프로젝트 클릭:', project);
    setSelectedProject(project);
  };

  const handleEditProject = (project) => {
    // CAD 페이지로 이동하면서 프로젝트 ID 전달
    localStorage.setItem('current_project_id', project.id);
    navigate('/cad', { state: { project } });
  };

  const handleCreateProject = (projectName) => {
    const newProject = {
      id: Date.now(), // 임시 ID (timestamp)
      name: projectName,
      previewImgUrl: null,
      thumbnail: null,
      objects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveProjects(updatedProjects);
    setShowNewProjectModal(false);
    
    // 바로 CAD 페이지로 이동
    localStorage.setItem('current_project_id', newProject.id);
    navigate('/cad', { state: { project: newProject } });
  };

  // 날짜 포맷팅
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR').replace(/\. /g, '.').replace('.', '');
  };

  return (
    <div className="project-select-page">
      <Navigation />
      
      <div className="project-select-container">
        <div className="project-select-header">
          <button 
            className="create-project-btn"
            onClick={() => setShowNewProjectModal(true)}
          >
            + 새 프로젝트
          </button>
        </div>

        {projects.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px', 
            color: '#9ca3af',
            fontSize: '18px'
          }}>
            <p>프로젝트가 없습니다.</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              "+ 새 프로젝트" 버튼을 클릭해서 시작하세요!
            </p>
          </div>
        ) : (
          <div className="project-grid">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card-wrapper"
                onClick={() => handleProjectClick(project)}
              >
                <div className="project-thumbnail-area">
                  {project.previewImgUrl || project.thumbnail ? (
                    <img 
                      src={project.previewImgUrl || project.thumbnail} 
                      alt={project.name}
                      className="project-thumb-img"
                    />
                  ) : (
                    <div className="project-thumb-placeholder"></div>
                  )}
                </div>
                
                <div className="project-card-info">
                  <h3 className="project-card-name">{project.name}</h3>
                  <p className="project-card-date">
                    편집:  {formatDate(project. updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <>
          {console.log('🎭 모달 렌더링 시작, selectedProject:', selectedProject)}
          <ProjectPreviewModal
            project={selectedProject}
            onClose={() => {
              console.log('❌ 모달 닫기');
              setSelectedProject(null);
            }}
            onEdit={handleEditProject}
          />
        </>
      )}

      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
};

export default ProjectSelect;
