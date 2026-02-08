import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Layout/Navigation';
import './styles.css';

const ObjectSelect = () => {
  const navigate = useNavigate();
  const [objects] = useState([
    {
      id: 1,
      name: 'Drone',
      thumbnail: '/3D Asset/Drone/조립도1.png',
      category: 'Drone'
    },
    {
      id: 2,
      name: 'Suspension',
      thumbnail: '/3D Asset/Suspension/서스펜션 조립도.png',
      category: 'Suspension'
    },
    {
      id: 3,
      name: 'V4 Engine',
      thumbnail: '/3D Asset/V4_Engine/V4실린더 엔진 조립도.png',
      category: 'V4_Engine'
    },
    {
      id: 4,
      name: 'Robot Arm',
      thumbnail: '/3D Asset/Robot Arm/로보팔 조립도.png',
      category: 'Robot Arm'
    },
    {
      id: 5,
      name: 'Machine Vice',
      thumbnail: '/3D Asset/Machine Vice/공작 기계 바이스.jpg',
      category: 'Machine Vice'
    },
    {
      id: 6,
      name: 'Leaf Spring',
      thumbnail: '/3D Asset/Leaf Spring/판스프링 조립도.png',
      category: 'Leaf Spring'
    },
    {
      id: 7,
      name: 'Robot Gripper',
      thumbnail: '/3D Asset/Robot Gripper/로봇집게 조립도.png',
      category: 'Robot Gripper'
    }
  ]);

  const handleObjectClick = (object) => {
    navigate('/study', { state: { selectedObject: object } });
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
        
        <div className="object-grid">
          {objects.map(object => (
            <div 
              key={object.id} 
              className="object-card-wrapper"
              onClick={() => handleObjectClick(object)}
            >
              <div className="object-card">
                <img 
                  src={object.thumbnail} 
                  alt={object.name}
                  className="object-thumbnail"
                />
              </div>
              <h3 className="object-name">{object.name}</h3>
            </div>
          ))}
          
          {/* 오브젝트 추가 카드 */}
          <div 
            className="object-card-wrapper add-object-wrapper"
            onClick={handleAddObject}
          >
            <div className="object-card add-object-card">
              <div className="add-object-icon">+</div>
            </div>
            <h3 className="object-name">오브젝트 추가</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectSelect;
