import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import SceneObject from './SceneObject';
import * as THREE from 'three';

function CADViewer({ objects, selectedObjectId, currentTool, onSelectObject, onUpdateObject, onSave0, onSave100 }) {
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  // 배경 클릭 핸들러 - 오브젝트만 해제, 툴은 유지
  const handleBackgroundClick = (e) => {
    e.stopPropagation();
    onSelectObject(null);
  };

  return (
    <div className="cad-viewer">
      {/* 저장 버튼 */}
      <div className="save-buttons">
        <button className="save-btn" onClick={onSave0}>
          0% 상태 저장
        </button>
        <button className="save-btn" onClick={onSave100}>
          100% 상태 저장
        </button>
        <button className="help-btn" title="도움말" onClick={() => { /* TODO: 도움말 모달 열기 */ }}>
          ?
        </button>
      </div>

      {/* 좌표/회전 표시 - 왼쪽 */}
      {selectedObject && (
        <div className="object-info-left">
          <div>위치: X: {selectedObject.position[0].toFixed(2)}, Y: {selectedObject.position[1].toFixed(2)}, Z: {selectedObject.position[2].toFixed(2)}</div>
          <div>회전: X: {(selectedObject.rotation[0] * 180 / Math.PI).toFixed(1)}°, Y: {(selectedObject.rotation[1] * 180 / Math.PI).toFixed(1)}°, Z: {(selectedObject.rotation[2] * 180 / Math.PI).toFixed(1)}°</div>
        </div>
      )}

      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        {/* 조명 */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />

        {/* 카메라 컨트롤 - 마우스 버튼 설정 변경 */}
        <OrbitControls 
          makeDefault 
          mouseButtons={{
            LEFT: undefined,  // 좌클릭: 사용 안 함 (오브젝트 선택용)
            MIDDLE: THREE.MOUSE.PAN,  // 휠버튼: 화면 이동
            RIGHT: THREE.MOUSE.ROTATE  // 우클릭: 화면 회전
          }}
        />

        {/* 배경 클릭 감지용 투명 평면 */}
        <mesh 
          position={[0, -0.01, 0]} 
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={handleBackgroundClick}
        >
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {/* 그리드 작업 평면 */}
        <Grid 
          args={[20, 20]} 
          cellSize={1} 
          cellThickness={0.5} 
          cellColor="#6e6e6e" 
          sectionSize={5} 
          sectionThickness={1} 
          sectionColor="#b4b4b4" 
          fadeDistance={150} 
          fadeStrength={1} 
          followCamera={false}
          infiniteGrid={true}
        />

        {/* 씬 오브젝트들 */}
        {objects.map(obj => (
          <SceneObject
            key={obj.id}
            object={obj}
            isSelected={obj.id === selectedObjectId}
            currentTool={currentTool}
            onSelect={() => onSelectObject(obj.id)}
            onUpdate={(updates) => onUpdateObject(obj.id, updates)}
          />
        ))}
      </Canvas>
    </div>
  );
}

export default CADViewer;
