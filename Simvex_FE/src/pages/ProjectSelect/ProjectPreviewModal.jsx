import React from 'react';

const ProjectPreviewModal = ({ project, onClose, onEdit }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <h2 className="preview-title">{project.name}</h2>
        
        <div className="preview-thumbnail">
          {project.thumbnail ? (
            <img src={project.thumbnail} alt={project.name} />
          ) : (
            <div className="preview-placeholder"></div>
          )}
        </div>
        
        <div className="preview-info">
          <p className="preview-date">
            <span>편집 날짜</span> {project.editedAt}
          </p>
          <p className="preview-date">
            <span>생성 날짜</span> {project.createdAt}
          </p>
        </div>
        
        <button className="preview-edit-btn" onClick={() => onEdit(project)}>
          편집
        </button>
      </div>
    </div>
  );
};

export default ProjectPreviewModal;
