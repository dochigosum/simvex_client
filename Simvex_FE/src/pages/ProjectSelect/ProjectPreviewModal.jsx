import React from 'react';

const ProjectPreviewModal = ({ project, onClose, onEdit }) => {
  console.log('🎨 미리보기 모달 렌더링:', project);
  
  // 날짜 포맷팅
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <h2 className="preview-title">{project.name}</h2>
        
        <div className="preview-thumbnail">
          {project.previewImgUrl || project.thumbnail ? (
            <img src={project.previewImgUrl || project.thumbnail} alt={project.name} />
          ) : (
            <div className="preview-placeholder">미리보기 없음</div>
          )}
        </div>
        
        <div className="preview-bottom">
          <div className="preview-info">
            <p className="preview-date">
              <span>편집 날짜</span> {formatDate(project.updatedAt)}
            </p>
            <p className="preview-date">
              <span>생성 날짜</span> {formatDate(project.createdAt)}
            </p>
          </div>
          
          <button className="preview-edit-btn" onClick={() => onEdit(project)}>
            편집
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectPreviewModal;
