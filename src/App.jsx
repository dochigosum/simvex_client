import React, { useState } from 'react';
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
  
  const { setState: setUndoState, undo, redo, canUndo, canRedo } = useUndoRedo(sceneObjects);

  // 에셋 클릭 핸들러
  const handleAssetClick = (asset) => {
    if (asset.type === 'glb') {
      // GLB 토글
      const isSelected = selectedAssets.includes(asset.path);
      
      if (isSelected) {
        // 제거
        setSelectedAssets(prev => prev.filter(p => p !== asset.path));
        const newObjects = sceneObjects.filter(obj => obj.assetPath !== asset.path);
        setSceneObjects(newObjects);
        setUndoState(newObjects); // 히스토리에 저장
      } else {
        // 추가
        setSelectedAssets(prev => [...prev, asset.path]);
        const newObject = {
          id: Date.now() + Math.random(),
          assetPath: asset.path,
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        };
        const newObjects = [...sceneObjects, newObject];
        setSceneObjects(newObjects);
        setUndoState(newObjects); // 히스토리에 저장
      }
    } else if (asset.type === 'image') {
      // PNG 모달 열기
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
      if (objToDelete) {
        setSelectedAssets(prev => prev.filter(p => p !== objToDelete.assetPath));
      }
      const newObjects = sceneObjects.filter(obj => obj.id !== selectedObjectId);
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
      default:
        setCurrentTool(action);
    }
  };

  // 저장 핸들러
  const handleSave0 = () => {
    console.log('0% 상태 저장:', sceneObjects);
    // TODO: 서버에 저장 또는 로컬스토리지에 저장
    alert('0% 상태가 저장되었습니다.');
  };

  const handleSave100 = () => {
    console.log('100% 상태 저장:', sceneObjects);
    // TODO: 서버에 저장 또는 로컬스토리지에 저장
    alert('100% 상태가 저장되었습니다.');
  };

  // 툴 선택 해제
  const handleDeselectTool = () => {
    setCurrentTool('select');
  };

  return (
    <div className="app">
      <Header />
      
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
          onSave0={handleSave0}
          onSave100={handleSave100}
          onDeselectTool={handleDeselectTool}
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
