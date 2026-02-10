import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingSection = () => {
  const navigate = useNavigate();

  return (
    <section className="landing-section">
      <div className="landing-content">
        <h1 className="landing-title">SIMVEX</h1>
        <p className="landing-subtitle">
          이공계열 학생을 위한 과학/공학 학습용 3D 뷰어 기반 학습 솔루션
        </p>
        
        <div className="landing-buttons">
          <button className="landing-btn primary" onClick={() => navigate('/study/select')}>
            학습 바로가기 <span className="arrow">›</span>
          </button>
          <button className="landing-btn secondary" onClick={() => navigate('/cad/select')}>
            편집 바로가기 <span className="arrow">›</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default LandingSection;
