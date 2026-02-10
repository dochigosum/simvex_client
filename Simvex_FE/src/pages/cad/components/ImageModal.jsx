import React from 'react';

function ImageModal({ src, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="Preview" />
      </div>
    </div>
  );
}

export default ImageModal;
