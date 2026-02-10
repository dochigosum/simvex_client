import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Layout/Navigation';
import ProjectPreviewModal from './ProjectPreviewModal';
import NewProjectModal from './NewProjectModal';
import { getProjects, createProject } from '../../services/projectApi';
import './styles.css';

// localStorage 키
const PROJECTS_KEY = 'simvex_projects';
const USE_API = import.meta.env.VITE_USE_API === 'true';

// localStorage 헬퍼 함수
const saveProjectsToLocal = (projects) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};
//시발
const loadProjectsFromLocal = () => {
  const saved = localStorage.getItem(PROJECTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

const ProjectSelect = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('🔧 개발 모드:', USE_API ? 'API 사용' : 'localStorage만 사용');

  // selectedProject 변경 감지
  useEffect(() => {
    console.log('🔄 selectedProject 변경됨:', selectedProject);
  }, [selectedProject]);

  // 컴포넌트 마운트 시 프로젝트 목록 불러오기
  useEffect(() => {
    loadAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!USE_API) {
        // 개발 모드: localStorage만 사용
        console.log('📂 localStorage에서 프로젝트 불러오기...');
        const localProjects = loadProjectsFromLocal();
        setProjects(localProjects);
        setLoading(false);
        return;
      }

      // API 모드: 서버에서 프로젝트 목록 조회
      const userId = localStorage.getItem('user_id') || 1;
      console.log('📡 API: 프로젝트 목록 조회 시작...');
      const response = await getProjects(userId);
      console.log('✅ API: 프로젝트 목록 조회 성공:', response);
      
      setProjects(response.projects || []);
    } catch (err) {
      console.error('❌ API: 프로젝트 목록 조회 실패:', err);
      setError(err.message);
      
      // 에러 시 localStorage 폴백
      const fallbackProjects = loadProjectsFromLocal();
      if (fallbackProjects.length > 0) {
        console.log('⚠️ localStorage 폴백 사용');
        setProjects(fallbackProjects);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    console.log('🖱️ 프로젝트 클릭:', project);
    setSelectedProject(project);
  };

  const handleEditProject = (project) => {
    // CAD 페이지로 이동하면서 프로젝트 ID 전달
    localStorage.setItem('current_project_id', project.id);
    navigate('/cad', { state: { project } });
  };

  const handleCreateProject = async (projectName) => {
    try {
      console.log('📡 프로젝트 생성 시작...', projectName);

      if (!USE_API) {
        // 개발 모드: localStorage만 사용
        console.log('📂 localStorage에 프로젝트 생성...');
        const newProject = {
          id: Date.now(),
          name: projectName,
          previewImgUrl: null,
          thumbnail: null,
          objects: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        saveProjectsToLocal(updatedProjects);
        setShowNewProjectModal(false);
        
        localStorage.setItem('current_project_id', newProject.id);
        navigate('/cad', { state: { project: newProject } });
        return;
      }

      // API 모드: 서버에 프로젝트 생성
      const newProject = await createProject({
        name: projectName,
        previewImgUrl: "" // null 대신 빈 문자열 전송
      });
      
      console.log('✅ API: 프로젝트 생성 성공:', newProject);
      
      setProjects(prev => [...prev, newProject]);
      setShowNewProjectModal(false);
      
      localStorage.setItem('current_project_id', newProject.id);
      navigate('/cad', { state: { project: newProject } });
    } catch (err) {
      console.error('❌ 프로젝트 생성 실패:', err);
      alert('프로젝트 생성에 실패했습니다. ' + err.message);
    }
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

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px', 
            color: '#9ca3af',
            fontSize: '18px'
          }}>
            <p>프로젝트 불러오는 중...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px', 
            color: '#ef4444',
            fontSize: '16px'
          }}>
            <p>프로젝트를 불러올 수 없습니다.</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>{error}</p>
            <button 
              onClick={loadAllProjects}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#6B7FFF',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              다시 시도
            </button>
          </div>
        ) : projects.length === 0 ? (
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
                    편집: {formatDate(project.updatedAt || project.updated_at)}
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
