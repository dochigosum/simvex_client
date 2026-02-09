import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../../components/Layout/Navigation';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import AssetPanel from './components/AssetPanel';
import CADViewer from './components/CADViewer';
import ImageModal from './components/ImageModal';
import useUndoRedo from './hooks/useUndoRedo';
import './styles/index.css';

function App() {
  const [currentTool, setCurrentTool] = useState('select'); // 'select', 'move', 'rotate', 'delete'
  const [sceneObjects, setSceneObjects] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]); // 선택된 GLB 파일들
  const [imageModalSrc, setImageModalSrc] = useState(null);
  const [copiedObject, setCopiedObject] = useState(null); // 복사된 오브젝트
  const screenshotRef = useRef();
  
  const { setState: setUndoState, undo, redo, canUndo, canRedo } = useUndoRedo(sceneObjects);

  // sceneObjects 변경 감지
  useEffect(() => {
    console.log('📦 sceneObjects 변경됨:', sceneObjects.length, 'objects');
    console.log('📦 상세:', sceneObjects);
  }, [sceneObjects]);

  // 컴포넌트 마운트 시 프로젝트 불러오기
  useEffect(() => {
    console.log('🎨 CAD 페이지 로드');
    const currentProjectId = localStorage.getItem('current_project_id');
    console.log('📌 current_project_id:', currentProjectId);
    
    if (currentProjectId) {
      const PROJECTS_KEY = 'simvex_projects';
      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      console.log('📂 savedProjects:', savedProjects);
      
      const projects = savedProjects ? JSON.parse(savedProjects) : [];
      console.log('📁 파싱된 프로젝트:', projects);
      
      const project = projects.find(p => p.id === Number(currentProjectId));
      console.log('🔍 찾은 프로젝트:', project);
      
      if (project && project.objects) {
        console.log('✅ 오브젝트 복원:', project.objects);
        setSceneObjects(project.objects);
        // AssetPanel 선택 상태 복원
        const assetPaths = project.objects.map(obj => obj.assetPath);
        setSelectedAssets(assetPaths);
      } else {
        console.log('⚠️ 프로젝트 또는 오브젝트 없음');
      }
    } else {
      console.log('⚠️ current_project_id 없음');
    }
  }, []);

  // 프로젝트 저장 핸들러
  const handleSaveProject = () => {
    console.log('💾 저장 시작!');
    
    if (!screenshotRef.current) {
      alert('스크린샷을 캡처할 수 없습니다!');
      console.error('❌ screenshotRef.current가 없음');
      return;
    }

    // 현재 프로젝트 ID 가져오기
    const currentProjectId = localStorage.getItem('current_project_id');
    console.log('📌 현재 프로젝트 ID:', currentProjectId);
    
    // 스크린샷 캡처
    const thumbnail = screenshotRef.current.captureScreenshot();
    console.log('📸 스크린샷 캡처됨:', thumbnail?.substring(0, 50) + '...');
    
    // 프로젝트 목록 불러오기
    const PROJECTS_KEY = 'simvex_projects';
    const savedProjects = localStorage.getItem(PROJECTS_KEY);
    const projects = savedProjects ? JSON.parse(savedProjects) : [];
    console.log('📂 기존 프로젝트 목록:', projects);
    
    // 현재 프로젝트 찾기 또는 새로 생성
    const projectIndex = projects.findIndex(p => p.id === Number(currentProjectId));
    console.log('🔍 프로젝트 인덱스:', projectIndex);
    
    if (projectIndex >= 0) {
      // 기존 프로젝트 업데이트
      console.log('✏️ 기존 프로젝트 업데이트');
      projects[projectIndex] = {
        ...projects[projectIndex],
        previewImgUrl: thumbnail,
        thumbnail: thumbnail,
        objects: sceneObjects,
        updatedAt: new Date().toISOString()
      };
    } else {
      // 새 프로젝트 생성
      console.log('➕ 새 프로젝트 생성');
      const newProject = {
        id: Date.now(),
        name: 'New Project',
        previewImgUrl: thumbnail,
        thumbnail: thumbnail,
        objects: sceneObjects,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      projects.push(newProject);
      localStorage.setItem('current_project_id', newProject.id);
    }
    
    // localStorage에 저장
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    console.log('✅ 저장 완료!', projects);
    
    alert('프로젝트가 저장되었습니다! ✅');
  };

  // 에셋 클릭 핸들러
  const handleAssetClick = (asset) => {
    console.log('🎯 에셋 클릭:', asset);
    
    if (asset.type === 'glb') {
      // GLB 토글
      const isSelected = selectedAssets.includes(asset.path);
      console.log('🔍 이미 선택됨?', isSelected);
      
      if (isSelected) {
        // 제거
        console.log('➖ GLB 제거:', asset.path);
        setSelectedAssets(prev => prev.filter(p => p !== asset.path));
        const newObjects = sceneObjects.filter(obj => obj.assetPath !== asset.path);
        setSceneObjects(newObjects);
        setUndoState(newObjects); // 히스토리에 저장
        console.log('📦 sceneObjects 업데이트:', newObjects);
      } else {
        // 추가
        console.log('➕ GLB 추가:', asset.path);
        setSelectedAssets(prev => [...prev, asset.path]);
        const newObject = {
          id: Date.now() + Math.random(),
          assetPath: asset.path,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        };
        const newObjects = [...sceneObjects, newObject];
        console.log('📦 sceneObjects 업데이트:', newObjects);
        setSceneObjects(newObjects);
        setUndoState(newObjects); // 히스토리에 저장
      }
    } else if (asset.type === 'image') {
      // PNG 모달 열기
      console.log('🖼️ 이미지 모달 열기:', asset.path);
      setImageModalSrc(asset.path);
    }
  };

  // 오브젝트 업데이트 (항상 히스토리 저장)
  const updateObject = (id, updates) => {
    setSceneObjects(prev => {
      const newObjects = prev.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      );
      setUndoState(newObjects);
      return newObjects;
    });
  };

  // 삭제
  const deleteSelected = () => {
    if (selectedObjectId) {
      const objToDelete = sceneObjects.find(obj => obj.id === selectedObjectId);
      const newObjects = sceneObjects.filter(obj => obj.id !== selectedObjectId);
      
      // 삭제 후 남은 오브젝트들의 assetPath만 유지
      if (objToDelete) {
        const remainingPaths = newObjects.map(obj => obj.assetPath);
        if (!remainingPaths.includes(objToDelete.assetPath)) {
          setSelectedAssets(prev => prev.filter(p => p !== objToDelete.assetPath));
        }
      }
      
      setSceneObjects(newObjects);
      setUndoState(newObjects); // 히스토리에 저장
      setSelectedObjectId(null);
    }
  };

  // Undo 핸들러
  const handleUndo = () => {
    const prevState = undo();
    if (prevState) {
      setSceneObjects(prevState);
      // selectedAssets도 업데이트
      const assetPaths = prevState.map(obj => obj.assetPath);
      setSelectedAssets(assetPaths);
    }
  };

  // Redo 핸들러
  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setSceneObjects(nextState);
      // selectedAssets도 업데이트
      const assetPaths = nextState.map(obj => obj.assetPath);
      setSelectedAssets(assetPaths);
    }
  };

  // 복사
  const handleCopy = () => {
    if (selectedObjectId) {
      const objToCopy = sceneObjects.find(obj => obj.id === selectedObjectId);
      if (objToCopy) {
        setCopiedObject(objToCopy);
      }
    }
  };

  // 붙여넣기
  const handlePaste = () => {
    if (copiedObject) {
      const newObject = {
        ...copiedObject,
        id: Date.now() + Math.random(),
        position: [
          copiedObject.position[0] + 1, // 약간 오프셋
          copiedObject.position[1],
          copiedObject.position[2] + 1
        ]
      };
      const newObjects = [...sceneObjects, newObject];
      setSceneObjects(newObjects);
      setUndoState(newObjects);
      setSelectedObjectId(newObject.id);
    }
  };

  // 툴바 액션
  const handleToolbarAction = (action) => {
    switch(action) {
      case 'delete':
        deleteSelected();
        break;
      case 'undo':
        handleUndo();
        break;
      case 'redo':
        handleRedo();
        break;
      case 'copy':
        handleCopy();
        break;
      case 'paste':
        handlePaste();
        break;
      case 'move':
      case 'rotate':
        // 토글: 같은 툴 다시 클릭하면 해제
        setCurrentTool(currentTool === action ? 'select' : action);
        break;
      default:
        setCurrentTool(action);
    }
  };

  return (
    <div className="app">
      <Navigation />
      <Header onSave={handleSaveProject} />
      
      <div className="main-content">
        <Toolbar 
          currentTool={currentTool}
          onToolClick={handleToolbarAction}
          canUndo={canUndo}
          canRedo={canRedo}
        />
        
        <CADViewer
          objects={sceneObjects}
          selectedObjectId={selectedObjectId}
          currentTool={currentTool}
          onSelectObject={setSelectedObjectId}
          onUpdateObject={updateObject}
          screenshotRef={screenshotRef}
        />
        
        <AssetPanel
          selectedAssets={selectedAssets}
          onAssetClick={handleAssetClick}
        />
      </div>

      {imageModalSrc && (
        <ImageModal 
          src={imageModalSrc}
          onClose={() => setImageModalSrc(null)}
        />
      )}
    </div>
  );
}

export default App;
