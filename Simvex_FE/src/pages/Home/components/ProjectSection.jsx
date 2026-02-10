import React, { useState } from 'react';
import ProjectCard from './ProjectCard';

const ProjectSection = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="project-section" className="project-section">
      <div className="project-container">
        <h2 className="project-title">학습할 3D 오브젝트를 선택해주세요.</h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">
            <img src="/icons/검색.png" alt="검색" className="search-icon" />
          </button>
        </div>

        <div className="project-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProjectSection;
