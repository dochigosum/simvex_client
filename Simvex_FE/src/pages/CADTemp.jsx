import React from 'react';

function CADTemp() {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#1a1a1a',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>CAD 페이지</h1>
      <p>React Three Fiber 설정 중...</p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '10px 20px',
          background: '#6B7FFF',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default CADTemp;
