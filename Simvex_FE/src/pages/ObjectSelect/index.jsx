import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Layout/Navigation';
import { getDrawingTemplates } from '../../services/drawingApi';
import './styles.css';

const USE_API = import.meta.env.VITE_USE_API === 'true';

// 폴백 데이터 (개발 모드용)
const FALLBACK_OBJECTS = [
  {
    id: 1,
    name: 'Drone',
    previewImgUrl: '/3D Asset/Drone/조립도1.png',
    thumbnail: '/3D Asset/Drone/조립도1.png',
    category: 'Drone'
  },
  {
    id: 2,
    name: 'Suspension',
    previewImgUrl: '/3D Asset/Suspension/서스펜션 조립도.png',
    thumbnail: '/3D Asset/Suspension/서스펜션 조립도.png',
    category: 'Suspension'
  },
  {
    id: 3,
    name: 'V4 Engine',
    previewImgUrl: '/3D Asset/V4_Engine/V4실린더 엔진 조립도.png',
    thumbnail: '/3D Asset/V4_Engine/V4실린더 엔진 조립도.png',
    category: 'V4_Engine'
  },
  {
    id: 4,
    name: 'Robot Arm',
    previewImgUrl: '/3D Asset/Robot Arm/로보팔 조립도.png',
    thumbnail: '/3D Asset/Robot Arm/로보팔 조립도.png',
    category: 'Robot Arm'
  },
  {
    id: 5,
    name: 'Machine Vice',
    previewImgUrl: '/3D Asset/Machine Vice/공작 기계 바이스.jpg',
    thumbnail: '/3D Asset/Machine Vice/공작 기계 바이스.jpg',
    category: 'Machine Vice'
  },
  {
    id: 6,
    name: 'Leaf Spring',
    previewImgUrl: '/3D Asset/Leaf Spring/판스프링 조립도.png',
    thumbnail: '/3D Asset/Leaf Spring/판스프링 조립도.png',
    category: 'Leaf Spring'
  },
  {
    id: 7,
    name: 'Robot Gripper',
    previewImgUrl: '/3D Asset/Robot Gripper/로봇집게 조립도.png',
    thumbnail: '/3D Asset/Robot Gripper/로봇집게 조립도.png',
    category: 'Robot Gripper'
  }
];

const ObjectSelect = () => {
  const navigate = useNavigate();
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('🔧 개발 모드:', USE_API ? 'API 사용' : 'localStorage만 사용');

  useEffect(() => {
    loadDrawingTemplates();
  }, []);

  const loadDrawingTemplates = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!USE_API) {
        // 개발 모드: 하드코딩 데이터 사용
        console.log('📂 폴백 데이터 사용 (개발 모드)');
        setObjects(FALLBACK_OBJECTS);
        setLoading(false);
        return;
      }
      
      // API 모드: 서버에서 조립도 목록 조회
      console.log('📡 API: 조립도 목록 조회 시작...');
      const response = await getDrawingTemplates();
      console.log('✅ API: 조립도 목록 조회 성공:', response);
      
      setObjects(response || []);
    } catch (err) {
      console.error('❌ API: 조립도 목록 조회 실패:', err);
      setError(err.message);
      
      // 에러 시 폴백 데이터 사용
      console.log('⚠️ 폴백 데이터 사용');
      setObjects(FALLBACK_OBJECTS);
    } finally {
      setLoading(false);
    }
  };

  const handleObjectClick = (object) => {
<<<<<<< HEAD
    navigate('/study/BP', { state: { selectedObject: object } });
=======
    // 친구가 만든 Study 페이지로 이동
    navigate('/study', { state: { selectedObject: object } });
>>>>>>> origin/develop
  };

  const handleAddObject = () => {
    // TODO: 오브젝트 추가 기능 구현
    console.log('오브젝트 추가 클릭!');
  };

  return (
    <div className="object-select-page">
      <Navigation />
      
      <div className="object-select-container">
        <h1 className="object-select-title">학습할 오브젝트를 선택하세요</h1>
        
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px', 
            color: '#9ca3af',
            fontSize: '18px'
          }}>
            <p>오브젝트 불러오는 중...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px', 
            color: '#ef4444',
            fontSize: '16px'
          }}>
            <p>오브젝트를 불러올 수 없습니다.</p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>{error}</p>
            <button 
              onClick={loadDrawingTemplates}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#6B7FFF',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="object-grid">
            {objects.map(object => (
              <div 
                key={object.id} 
                className="object-card-wrapper"
                onClick={() => handleObjectClick(object)}
              >
                <div className="object-card">
                  <img 
                    src={object.previewImgUrl || object.thumbnail} 
                    alt={object.name}
                    className="object-thumbnail"
                  />
                  <h3 className="object-name">{object.name}</h3>
                </div>
              </div>
            ))}
            
            {/* 오브젝트 추가 카드 */}
            <div 
              className="object-card-wrapper add-card"
              onClick={handleAddObject}
            >
              <div className="object-card">
                <div className="add-icon">+</div>
                <div className="add-text">오브젝트 추가</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectSelect;
