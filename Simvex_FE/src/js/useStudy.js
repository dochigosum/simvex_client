import { useState, useEffect, useRef } from "react";

export const useStudyLogic = () => {
  const [zoom, setZoom] = useState(20);
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(50);
  const [activeTab, setActiveTab] = useState("부품 정보");
  
  // 모달 관련 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const barRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => {
    isDragging.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newProgress = (offsetX / rect.width) * 100;
    setProgress(Math.min(Math.max(newProgress, 0), 100));
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 1, 30));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 1, 1));
  const toggleMenu = () => setIsOpen(!isOpen);

  return {
    zoom, handleZoomIn, handleZoomOut,
    isOpen, toggleMenu,
    progress, setProgress, barRef, handleMouseDown,
    activeTab, setActiveTab,
    isModalOpen, setIsModalOpen,
    selectedNote, setSelectedNote
  };
};