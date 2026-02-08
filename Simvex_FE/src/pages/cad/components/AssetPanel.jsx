import React, { useState, useEffect, useCallback } from 'react';

// 폴더 목록을 컴포넌트 밖으로 (상수)
const ASSET_FOLDERS = [
  'Drone',
  'Leaf Spring',
  'Machine Vice',
  'Robot Arm',
  'Robot Gripper',
  'Suspension',
  'V4_Engine'
];

function AssetPanel({ selectedAssets, onAssetClick }) {
  const [folders] = useState(ASSET_FOLDERS); // 초기값으로 설정
  const [currentFolder, setCurrentFolder] = useState(null);
  const [files, setFiles] = useState([]);

  // useCallback으로 감싸서 의존성 문제 해결
  const loadFolderFiles = useCallback(async (folderName) => {
    try {
      // public 폴더에서 직접 읽기
      // 서버에서 파일 목록을 가져와야 하지만, 임시로 하드코딩
      const fileMap = {
        'Drone': [
          'Arm gear.glb', 'Beater disc.glb', 'Gearing.glb', 'Impellar Blade.glb',
          'Leg.glb', 'Main frame.glb', 'Main frame_MIR.glb', 'Nut.glb', 'Screw.glb', 'xyz.glb',
          '조립도1.png', '조립도2.png', '조립도3.png', '조립도4.png', '조립도5.png', '조립도6.png', '조립도7.png', '조립도8.png'
        ],
        'Leaf Spring': [
          'Clamp-Center.glb', 'Clamp-Primary.glb', 'Clamp-Secondary.glb', 'Leaf-Layer.glb',
          'Support-Chassis Rigid.glb', 'Support-Chassis.glb', 'Support-Rubber 60mm.glb', 'Support-Rubber.glb', 'Support.glb',
          '판스프링 조립도.png', '판스프링 조립도2.png'
        ],
        'Machine Vice': [
          'Part1 Fuhrung.glb', 'Part1.glb', 'Part2 Feste Backe.glb', 'Part3-lose backe.glb',
          'Part4 spindelsockel.glb', 'Part5-Spannbacke.glb', 'Part6-fuhrungschiene.glb', 'Part7-TrapezSpindel.glb',
          'Part8-grundplatte.glb', 'Part9-Druckhulse.glb',
          '공작 기계 바이스.jpg', '공작 기계 바이스2.png'
        ],
        'Robot Arm': [
          'base.glb', 'Part2.glb', 'Part3.glb', 'Part4.glb', 'Part5.glb', 'Part6.glb', 'Part7.glb', 'Part8.glb',
          '로보팔 조립도.png'
        ],
        'Robot Gripper': [
          'Base Gear.glb', 'Base Mounting bracket.glb', 'Base Plate.glb', 'Gear link 1.glb',
          'Gear link 2.glb', 'Gripper.glb', 'Link.glb', 'Pin.glb',
          '로봇집게 조립도.png', '로봇집게 조립도2.png', '로봇집게 조립도3.png'
        ],
        'Suspension': [
          'BASE.glb', 'NIT.glb', 'NUT.glb', 'ROD.glb', 'SPRING.glb',
          '서스펜션 조립도.png'
        ],
        'V4_Engine': [
          'Connecting Rod Cap.glb', 'Connecting Rod.glb', 'Conrod Bolt.glb', 'Crankshaft.glb',
          'Piston Pin.glb', 'Piston Ring.glb', 'Piston.glb',
          'V4실린더 엔진 조립도.png'
        ]
      };
      
      const filesInFolder = fileMap[folderName] || [];
      const fileList = filesInFolder.map(fileName => {
        const fileType = fileName.split('.').pop().toLowerCase();
        const type = fileType === 'glb' ? 'glb' : 'image';
        
        return {
          name: fileName,
          path: `/3D Asset/${folderName}/${fileName}`,
          type: type
        };
      });
      
      // glb 파일 먼저, 그 다음 이미지 파일 순으로 정렬
      fileList.sort((a, b) => {
        if (a.type === b.type) {
          return a.name.localeCompare(b.name);
        }
        return a.type === 'glb' ? -1 : 1;
      });
      
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  }, []); // useCallback 종료

  // currentFolder 변경시 파일 로드
  useEffect(() => {
    if (currentFolder) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadFolderFiles(currentFolder);
    }
  }, [currentFolder, loadFolderFiles]);

  const handleFolderClick = (folderName) => {
    setCurrentFolder(folderName);
  };

  const handleBackClick = () => {
    setCurrentFolder(null);
    setFiles([]);
  };

  return (
    <div className="asset-panel">
      <div className="asset-header">
        {currentFolder && (
          <span className="back-icon" onClick={handleBackClick}>⬅</span>
        )}
        {!currentFolder && (
          <span className="collapse-icon">≫</span>
        )}
        <h3>{currentFolder || '3D Assets'}</h3>
      </div>
      
      <div className="asset-grid">
        {!currentFolder ? (
          // 폴더 목록 표시
          folders.map((folder, index) => (
            <div 
              key={index}
              className="asset-item folder-item"
              onClick={() => handleFolderClick(folder)}
            >
              <div className="asset-preview folder-preview">
                <span className="folder-icon">📁</span>
              </div>
              <div className="asset-name">{folder}</div>
            </div>
          ))
        ) : (
          // 파일 목록 표시
          files.map((file, index) => {
            const isSelected = selectedAssets.includes(file.path);
            
            return (
              <div 
                key={index}
                className={`asset-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onAssetClick(file)}
              >
                <div className="asset-preview">
                  {file.type === 'glb' ? (
                    <div className="glb-preview">GLB</div>
                  ) : (
                    <img src={file.path} alt={file.name} />
                  )}
                </div>
                <div className="asset-name">{file.name}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AssetPanel;
