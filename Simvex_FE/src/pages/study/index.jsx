import React from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from '../../components/Layout/Navigation';

const Study = () => {
  const location = useLocation();
  const selectedObject = location.state?.selectedObject;

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#1B1C20',
      paddingTop: '64px'
    }}>
      <Navigation />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 64px)',
        color: 'white',
        fontSize: '24px',
        textAlign: 'center',
        padding: '32px'
      }}>
        {selectedObject ? (
          <>
            <h1>Study: {selectedObject.name}</h1>
            <p style={{ color: '#9ca3af', fontSize: '16px', marginTop: '16px' }}>
              선택된 오브젝트를 분석합니다
            </p>
          </>
        ) : (
          <p>Study 페이지 - 오브젝트를 선택해주세요</p>
        )}
      </div>
    </div>
  );
};

export default Study;
