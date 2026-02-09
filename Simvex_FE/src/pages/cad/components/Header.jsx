import React from 'react';

function Header({ onSave }) {
  console.log('📋 Header - onSave:', !!onSave);
  
  // JSON 내보내기
  const handleExportJSON = () => {
    console.log('📥 JSON 내보내기 시작');
    
    // localStorage에서 현재 프로젝트 데이터 가져오기
    const PROJECTS_KEY = 'simvex_projects';
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const projects = savedProjects ? JSON.parse(savedProjects) : [];
    
    const currentProjectId = localStorage.getItem('current_project_id');
    const project = projects.find(p => p.id === Number(currentProjectId));
    
    if (!project) {
      alert('저장된 프로젝트가 없습니다!');
      console.error('❌ 프로젝트 없음');
      return;
    }
    
    // JSON 파일 생성 및 다운로드
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}_${project.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ JSON 다운로드 완료:', project);
  };
  
  return (
    <header className="header">
      <div className="logo">SIMVEX</div>
      <nav className="nav">
        <a href="/">Home</a>
        <a href="/study">Study</a>
        <a href="/cad" className="nav-cad">CAD</a>
      </nav>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button 
          className="export-json-btn"
          onClick={handleExportJSON}
          title="JSON 파일로 내보내기"
        >
          📥 JSON
        </button>
        {onSave && (
          <button 
            className="save-project-btn"
            onClick={() => {
              console.log('💾 저장 버튼 클릭!');
              onSave();
            }}
          >
            💾 저장
          </button>
        )}
        <button className="sign-in">
          <span>⮞</span> Sign in
        </button>
      </div>
    </header>
  );
}

export default Header;
