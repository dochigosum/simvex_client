import React, { useRef, useEffect, useState } from 'react';
import { TransformControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

function SceneObject({ object, isSelected, currentTool, onSelect, onUpdate }) {
  const modelRef = useRef(null);
  const originalMaterialsRef = useRef(new Map());
  const groupRef = useRef();
  const transformRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  // TransformControls를 group에 연결
  useEffect(() => {
    if (transformRef.current && groupRef.current) {
      transformRef.current.attach(groupRef.current);
    }
  }, [isSelected, currentTool]);

  // GLB 파일 로드
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setLoading(true);
    const loader = new GLTFLoader();
    
    loader.load(
      object.assetPath,
      (gltf) => {
        console.log('GLB loaded successfully:', object.assetPath);
        
        // 바운딩 박스 계산
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        console.log('Model size:', size);
        console.log('Model center:', center);
        console.log('Model scale:', gltf.scene.scale);
        
        // 모델 중앙 정렬
        gltf.scene.position.sub(center);
        
        modelRef.current = gltf.scene;
        setModel(gltf.scene);
        setLoading(false);
      },
      (progress) => {
        // 로딩 중
        const percent = progress.total > 0 
          ? (progress.loaded / progress.total * 100).toFixed(1) 
          : 0;
        console.log('Loading:', percent + '%');
      },
      (error) => {
        console.error('Error loading GLB:', object.assetPath, error);
        setLoading(false);
      }
    );

    return () => {
      // 클린업
      if (modelRef.current) {
        modelRef.current.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
        modelRef.current = null;
      }
    };
  }, [object.assetPath]);

  // 모델에 하이라이트 효과 적용
  useEffect(() => {
    if (model) {
      model.traverse((child) => {
        if (child.isMesh) {
          if (isSelected) {
            // 원본 저장 (아직 저장 안 된 경우만)
            if (!originalMaterialsRef.current.has(child.uuid)) {
              originalMaterialsRef.current.set(child.uuid, child.material);
            }
            // 선택됨: 발광 효과
            const clonedMat = child.material.clone();
            clonedMat.emissive = new THREE.Color(0x4a5eff);
            clonedMat.emissiveIntensity = 0.3;
            child.material = clonedMat;
          } else {
            // 원본 복원
            const original = originalMaterialsRef.current.get(child.uuid);
            if (original) {
              if (child.material !== original) {
                child.material.dispose();
              }
              child.material = original;
            }
          }
        }
      });
    }
  }, [model, isSelected]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...object.position);
      groupRef.current.rotation.set(...object.rotation);
      groupRef.current.scale.set(...object.scale);
    }
  }, [object.position, object.rotation, object.scale]);

  // Transform 시작
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  // Transform 끝 - 이때만 히스토리 저장!
  const handleMouseUp = () => {
    if (isDragging && groupRef.current) {
      const pos = groupRef.current.position.toArray();
      const rot = groupRef.current.rotation.toArray().slice(0, 3);
      const scale = groupRef.current.scale.toArray();
      
      // 히스토리에 저장
      onUpdate({
        position: pos,
        rotation: rot,
        scale: scale,
      });
      
      setIsDragging(false);
    }
  };

  // TransformControls 모드 결정
  const getTransformMode = () => {
    if (currentTool === 'move') return 'translate';
    if (currentTool === 'rotate') return 'rotate';
    return null;
  };

  const transformMode = getTransformMode();

  return (
    <>
      <group ref={groupRef} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
        {loading ? (
          // 로딩 중
          <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial 
              color="yellow" 
              wireframe
            />
          </mesh>
        ) : model ? (
          // GLB 모델
          <primitive 
            object={model} 
            scale={100} // 100배 키움!
          />
        ) : (
          // 로딩 실패
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={isSelected ? 'red' : 'pink'} 
              transparent
              opacity={0.5}
            />
          </mesh>
        )}
      </group>

      {/* Transform Controls */}
      {isSelected && transformMode && (
        <TransformControls
          ref={transformRef}
          mode={transformMode}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          translationSnap={0.1}
          rotationSnap={THREE.MathUtils.degToRad(15)}
        />
      )}
    </>
  );
}

export default SceneObject;
