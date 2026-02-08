import React, { useState } from 'react';

const NewProjectModal = ({ onClose, onCreate }) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (projectName.trim()) {
      onCreate(projectName.trim());
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content new-project-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <h2 className="new-project-title">New Project</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="new-project-input"
            placeholder="프로젝트 이름을 입력하세요"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            autoFocus
          />
          
          <button type="submit" className="new-project-submit-btn">
            프로젝트 생성
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal;
