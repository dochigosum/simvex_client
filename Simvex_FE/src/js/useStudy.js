import { useState, useEffect, useRef } from "react";
// import { getComponentList } from "../api/studyApi";



export const useStudyLogic = () => {

  
  const [zoom, setZoom] = useState(20);
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(50);
  const [activeTab, setActiveTab] = useState("부품 정보");
  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const barRef = useRef(null);
  const isDragging = useRef(false);

  // const Studypage = () => {
  // // 1. 데이터를 담을 주머니(상태) 만들기
  // const [parts, setParts] = useState([]); 

  // // 2. 데이터를 가져오는 기능(함수) 만들기
  // const loadParts = async () => {
  //   try {
  //     const data = await getComponentList();
  //     setParts(data); // 백엔드에서 받은 데이터를 주머니에 쏙!
  //   } catch (error) {
  //     console.error("데이터를 못 불러왔어요:", error);
  //   }
  // };

  // // 3. 페이지가 처음 나타날 때 딱 한 번 실행
  // useEffect(() => {
  //   loadParts();
  // }, []);

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
