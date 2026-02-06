import React from 'react';

function Toolbar({ currentTool, onToolClick, canUndo, canRedo }) {
  const topTools = [
    { id: 'move', icon: '/toolbar_icon/확대.png', label: '이동' },
    { id: 'rotate', icon: '/toolbar_icon/회전.png', label: '회전' },
    { id: 'copy', icon: '/toolbar_icon/복사.png', label: '복사' },
    { id: 'paste', icon: '/toolbar_icon/붙여넣기.png', label: '붙여넣기' },
  ];

  const bottomTools = [
    { id: 'light', icon: '/toolbar_icon/자연광.png', label: '조명' },
    { id: 'undo', icon: '/toolbar_icon/뒤로가기.png', label: '뒤로가기', disabled: !canUndo },
    { id: 'redo', icon: '/toolbar_icon/되돌리기.png', label: '되돌리기', disabled: !canRedo },
    { id: 'delete', icon: '/toolbar_icon/삭제.png', label: '삭제' },
  ];

  const renderButton = (tool) => (
    <button
      key={tool.id}
      className={`toolbar-btn ${currentTool === tool.id ? 'active' : ''} ${tool.disabled ? 'disabled' : ''}`}
      onClick={() => !tool.disabled && onToolClick(tool.id)}
      title={tool.label}
      disabled={tool.disabled}
    >
      {tool.isText ? (
        <span className="toolbar-text">{tool.icon}</span>
      ) : (
        <img src={tool.icon} alt={tool.label} className="toolbar-icon-img" />
      )}
    </button>
  );

  return (
    <div className="toolbar">
      <div className="toolbar-top">
        {topTools.map(renderButton)}
      </div>
      <div className="toolbar-bottom">
        {bottomTools.map(renderButton)}
      </div>
    </div>
  );
}

export default Toolbar;
