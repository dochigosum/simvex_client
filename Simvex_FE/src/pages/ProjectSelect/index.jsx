import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Layout/Navigation';
import ProjectPreviewModal from './ProjectPreviewModal';
import NewProjectModal from './NewProjectModal';
import './styles.css';

const ProjectSelect = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    },
    {
      id: 2,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    },
    {
      id: 3,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    },
    {
      id: 4,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    },
    {
      id: 5,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    },
    {
      id: 6,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    },
    {
      id: 7,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    },
    {
      id: 8,
      name: 'First Project',
      thumbnail: null,
      createdAt: '2026.02.05',
      editedAt: '2026.02.05'
    }
  ]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleEditProject = (project) => {
    navigate('/cad', { state: { project } });
  };

  const handleCreateProject = (projectName) => {
    const newProject = {
      id: Date.now(),
      name: projectName,
      thumbnail: null,
      createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      editedAt: new Date().toISOString().split('T')[0].replace(/-/g, '.')
    };
    setProjects([...projects, newProject]);
    setShowNewProjectModal(false);
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
            + 프로젝트 생성
          </button>
        </div>

        <div className="project-grid">
          {projects.map(project => (
            <div 
              key={project.id} 
              className="project-card-wrapper"
              onClick={() => handleProjectClick(project)}
            >
              <div className="project-thumbnail-area">
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.name} className="project-thumb-img" />
                ) : (
                  <div className="project-thumb-placeholder"></div>
                )}
              </div>
              <div className="project-card-info">
                <h3 className="project-card-name">{project.name}</h3>
                <p className="project-card-date">1일 전</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <ProjectPreviewModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onEdit={handleEditProject}
        />
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
