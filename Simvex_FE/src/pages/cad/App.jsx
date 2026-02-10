import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navigation from '../../components/Layout/Navigation';
import Header from './components/Header';
import Toolbar from './components/Toolbar';
import AssetPanel from './components/AssetPanel';
import CADViewer from './components/CADViewer';
import ImageModal from './components/ImageModal';
import useUndoRedo from './hooks/useUndoRedo';
import { saveProjectModel } from '../../services/projectApi';
import './styles/index.css';

// localStorage 키
const PROJECTS_KEY = 'simvex_projects';
const USE_API = import.meta.env.VITE_USE_API === 'true';

// localStorage 헬퍼
const saveProjectsToLocal = (projects) => {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
};

const loadProjectsFromLocal = () => {
  const saved = localStorage.getItem(PROJECTS_KEY);
  return saved ? JSON.parse(saved) : [];
};

function App() {
  const [currentTool, setCurrentTool] = useState('select');
  const [sceneObjects, setSceneObjects] = useState([]);
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [imageModalSrc, setImageModalSrc] = useState(null);
  const [copiedObject, setCopiedObject] = useState(null);
  const [isLightControlActive, setIsLightControlActive] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const screenshotRef = useRef();
  
  const { setState: setUndoState, undo, redo, canUndo, canRedo } = useUndoRedo(sceneObjects);

  console.log('🔧 개발 모드:', USE_API ? 'API 사용' : 'localStorage만 사용');

  // sceneObjects 변경 감지
  useEffect(() => {
    console.log('📦 sceneObjects 변경됨:', sceneObjects.length, 'objects');
  }, [sceneObjects]);

  // 컴포넌트 마운트 시 프로젝트 불러오기
  useEffect(() => {
    const loadProject = async () => {
      try {
        const currentProjectId = localStorage.getItem('current_project_id');
        console.log('📌 current_project_id:', currentProjectId);
        
        if (!currentProjectId) {
          console.log('⚠️ 프로젝트 ID 없음');
          return;
        }

        // localStorage에서 프로젝트 불러오기
        const projects = loadProjectsFromLocal();
        const localProject = projects.find(p => p.id === Number(currentProjectId));
        
        if (localProject) {
          console.log('✅ localStorage에서 프로젝트 복원:', localProject);
          setCurrentProject(localProject);
          setSceneObjects(localProject.objects || []);
          const assetPaths = (localProject.objects || []).map(obj => obj.assetPath);
          setSelectedAssets(assetPaths);
        }

        // API 모드일 때만 서버에서 추가 조회 (현재는 생략, 필요시 구현)
        if (USE_API) {
          console.log('📡 API: 프로젝트 상세 조회 시도...');
          // TODO: getProjectDetail API 호출
        }
        
      } catch (err) {
        console.error('❌ 프로젝트 불러오기 실패:', err);
      }
    };

    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 저장 함수 (useCallback으로 선언)
  const handleSaveProject = useCallback(async (saveToMySQL = true) => {
    try {
      console.log('💾 저장 시작! (MySQL:', saveToMySQL, ')');
      
      if (!currentProject) {
        // 프로젝트 정보가 없으면 localStorage에서 찾기
        const currentProjectId = localStorage.getItem('current_project_id');
        if (!currentProjectId) {
          alert('프로젝트 정보가 없습니다!');
          return;
        }
        
        const projects = loadProjectsFromLocal();
        const project = projects.find(p => p.id === Number(currentProjectId));
        if (project) {
          setCurrentProject(project);
        } else {
          alert('프로젝트를 찾을 수 없습니다!');
          return;
        }
      }

      // 스크린샷 캡처 (MySQL 저장시만)
      let thumbnail = null;
      if (saveToMySQL && screenshotRef.current) {
        thumbnail = screenshotRef.current.captureScreenshot();
        console.log('📸 스크린샷 캡처됨');
      }

      // localStorage에 저장 (개발/API 모드 공통)
      const projects = loadProjectsFromLocal();
      const projectIndex = projects.findIndex(p => p.id === currentProject.id);
      
      if (projectIndex >= 0) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          objects: sceneObjects,
          updatedAt: new Date().toISOString()
        };
        
        if (saveToMySQL && thumbnail) {
          projects[projectIndex].previewImgUrl = thumbnail;
          projects[projectIndex].thumbnail = thumbnail;
        }
        
        saveProjectsToLocal(projects);
        setCurrentProject(projects[projectIndex]);
        console.log('✅ localStorage 저장 완료');
      }

      // API 모드일 때만 서버에 저장
      if (!USE_API) {
        if (saveToMySQL) {
          alert('프로젝트가 저장되었습니다! (개발 모드 - localStorage)');
        }
        return;
      }

      // API로 서버에 저장
      const partInfo = sceneObjects.map((obj, index) => ({
        id: index + 1,
        x_coordinate: obj.position[0],
        y_coordinate: obj.position[1],
        z_coordinate: obj.position[2],
        x_rotation: obj.rotation[0],
        y_rotation: obj.rotation[1],
        z_rotation: obj.rotation[2]
      }));

      console.log('📦 partInfo:', partInfo);

      // 이미지를 Blob으로 변환 (MySQL 저장시만)
      let imageBlob = null;
      if (saveToMySQL && thumbnail) {
        const base64Data = thumbnail.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        imageBlob = new Blob([byteArray], { type: 'image/png' });
        console.log('🖼️ 이미지 Blob 생성:', imageBlob.size, 'bytes');
      }

      // API 호출
      const projectName = currentProject.name || currentProject.id;
      
      console.log('📡 API: 프로젝트 저장 시작...');
      await saveProjectModel(projectName, partInfo, imageBlob);
      console.log('✅ API: 프로젝트 저장 성공!');

      if (saveToMySQL) {
        alert('프로젝트가 저장되었습니다!');
      }
    } catch (err) {
      console.error('❌ 프로젝트 저장 실패:', err);
      
      if (saveToMySQL) {
        alert(USE_API 
          ? '서버 저장 실패! localStorage에만 저장되었습니다.' 
          : '프로젝트가 저장되었습니다! (개발 모드 - localStorage)'
        );
      }
    }
  }, [currentProject, sceneObjects]);

  // 자동 저장 타이머 시작 (API 모드일 때만)
  useEffect(() => {
    if (USE_API && currentProject) {
      console.log('⏰ 자동 저장 타이머 시작');
      
      // 2분마다 Redis 저장
      const redisTimer = setInterval(() => {
        console.log('⏰ Redis 자동 저장 (2분)');
        handleSaveProject(false);
      }, 2 * 60 * 1000);
      
      // 15분마다 MySQL 저장
      const mysqlTimer = setInterval(() => {
        console.log('⏰ MySQL 자동 저장 (15분)');
        handleSaveProject(true);
      }, 15 * 60 * 1000);
      
      return () => {
        clearInterval(redisTimer);
        clearInterval(mysqlTimer);
      };
    }
  }, [currentProject, handleSaveProject]);

  const handleAssetClick = (asset) => {
    console.log('🎨 AssetPanel에서 에셋 클릭:', asset);
    
    if (asset.type === 'glb') {
      if (selectedAssets.includes(asset.path)) {
        console.log('⚠️ 이미 추가된 에셋:', asset.path);
        return;
      }
      console.log('➕ GLB 파일 추가:', asset.path);
      if (!selectedAssets.includes(asset.path)) {
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
        setUndoState(newObjects);
      }
    } else if (asset.type === 'image') {
      console.log('🖼️ 이미지 모달 열기:', asset.path);
      setImageModalSrc(asset.path);
    }
  };

  const updateObject = (id, updates) => {
    setSceneObjects(prev => {
      const newObjects = prev.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      );
      setUndoState(newObjects);
      return newObjects;
    });
  };

  const deleteSelected = () => {
    if (selectedObjectId) {
      const objToDelete = sceneObjects.find(obj => obj.id === selectedObjectId);
      const newObjects = sceneObjects.filter(obj => obj.id !== selectedObjectId);
      
      if (objToDelete) {
        const remainingPaths = newObjects.map(obj => obj.assetPath);
        if (!remainingPaths.includes(objToDelete.assetPath)) {
          setSelectedAssets(prev => prev.filter(p => p !== objToDelete.assetPath));
        }
      }
      
      setSceneObjects(newObjects);
      setUndoState(newObjects);
      setSelectedObjectId(null);
    }
  };

  const handleUndo = () => {
    const prevState = undo();
    if (prevState) {
      setSceneObjects(prevState);
      const assetPaths = prevState.map(obj => obj.assetPath);
      setSelectedAssets(assetPaths);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      setSceneObjects(nextState);
      const assetPaths = nextState.map(obj => obj.assetPath);
      setSelectedAssets(assetPaths);
    }
  };

  const handleCopy = () => {
    if (selectedObjectId) {
      const objToCopy = sceneObjects.find(obj => obj.id === selectedObjectId);
      if (objToCopy) {
        setCopiedObject(objToCopy);
      }
    }
  };

  const handlePaste = () => {
    if (copiedObject) {
      const newObject = {
        ...copiedObject,
        id: Date.now() + Math.random(),
        position: [
          copiedObject.position[0] + 1,
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
      case 'light':
        setIsLightControlActive(!isLightControlActive);
        break;
      case 'move':
      case 'rotate':
        setCurrentTool(currentTool === action ? 'select' : action);
        break;
      default:
        setCurrentTool(action);
    }
  };

  return (
    <div className="app">
      <Navigation />
      <Header onSave={() => handleSaveProject(true)} />
      
      <div className="main-content">
        <Toolbar 
          currentTool={currentTool}
          onToolClick={handleToolbarAction}
          canUndo={canUndo}
          canRedo={canRedo}
          isLightActive={isLightControlActive}
        />
        
        <CADViewer
          objects={sceneObjects}
          selectedObjectId={selectedObjectId}
          currentTool={currentTool}
          onSelectObject={setSelectedObjectId}
          onUpdateObject={updateObject}
          screenshotRef={screenshotRef}
          isLightControlActive={isLightControlActive}
          setIsLightControlActive={setIsLightControlActive}
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
