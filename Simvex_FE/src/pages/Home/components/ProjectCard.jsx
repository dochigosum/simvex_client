import React from 'react';

const ProjectCard = ({ project }) => {
  const handleClick = () => {
    console.log('Selected project:', project);
  };

  return (
    <div>
      <div className="project-card" onClick={handleClick}>
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="project-thumbnail"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="project-placeholder">
            <span className="placeholder-icon">+</span>
          </div>
        )}
      </div>
      <div className="project-info">
        <h3 className="project-name">{project.name}</h3>
      </div>
    </div>
  );
};

export default ProjectCard;
