import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// 개별 3D 오브젝트
function PreviewObject({ object }) {
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      object.assetPath,
      (gltf) => {
        setModel(gltf.scene);
      },
      undefined,
      (error) => {
        console.error('GLB 로드 실패:', error);
      }
    );
  }, [object.assetPath]);

  if (!model) return null;

  return (
    <primitive
      object={model.clone()}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale || [1, 1, 1]}
    />
  );
}

// 3D 씬 미리보기
function Scene3DPreview({ sceneData }) {
  if (!sceneData || !sceneData.objects || sceneData.objects.length === 0) {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#2d3748',
        color: '#9ca3af',
        fontSize: '14px'
      }}>
        저장된 씬이 없습니다
      </div>
    );
  }

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
      {/* 조명 */}
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {/* 카메라 컨트롤 */}
      <OrbitControls 
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
      />

      {/* 그리드 */}
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
      {sceneData.objects.map((obj, index) => (
        <PreviewObject key={index} object={obj} />
      ))}
    </Canvas>
  );
}

export default Scene3DPreview;
