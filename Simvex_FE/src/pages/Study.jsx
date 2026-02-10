import { Suspense, useState, useEffect } from "react";
import { useStudyLogic } from "../js/useStudy.js";
import * as S from "../js/Study.styles.js";
import { Canvas } from "@react-three/fiber";

import { useNavigate, useLocation } from "react-router-dom";
import {} from "../apis/studyApi.js"; 


import {
  useGLTF,
  OrbitControls,
  ContactShadows,
  Environment,
  Center,
} from "@react-three/drei";

import Header from "../components/Layout/Navigation";
import arrow from "../assets/arrow.svg";
import X from "../assets/X.svg";
import plus from "../assets/Plus.png";
import minus from "../assets/Minus.svg";
import star from "../assets/star.svg";
import glass from "../assets/glass.svg";
import oplus from "../assets/oplus.svg";

const Model = ({ url, zoom }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={zoom} />;
};

const Studypage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedObject = location.state?.selectedObject;
  
  // 선택된 오브젝트에 따라 모델 URL 설정 (임시로 기본값 사용)
  const modelUrl = selectedObject?.category 
    ? `/3D Asset/${selectedObject.category}/Armgear.glb`
    : "/3D Asset/Drone/Armgear.glb";
  
  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    isOpen,
    toggleMenu,
    progress,
    setProgress,
    barRef,
    handleMouseDown,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
    selectedNote,
    setSelectedNote,
  } = useStudyLogic();

  // AI 채팅 관련 상태
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // 전체 채팅 내역
  const [isLoading, setIsLoading] = useState(false);

  
    const [notes, setNotes] = useState([]);

  // 페이지 로드 시 채팅 내역 불러오기
  useEffect(() => {
    loadChatHistory();
  }, []);

  // 채팅 내역 불러오기
  const loadChatHistory = async () => {
    try {
      const drawingId = 1; // 실제로는 props나 context에서 받아와야 함
      const history = await getChatHistory(drawingId);
      setChatHistory(history);
    } catch (error) {
      console.error("채팅 내역 로드 실패:", error);
    }
  };

  // 질문 전송
  const handleSendQuestion = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    
    // 사용자 메시지를 즉시 화면에 표시
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    setIsLoading(true);

    try {
      const drawingId = 1; // 실제로는 props나 context에서 받아와야 함
      const templateName = "드론"; // 실제로는 선택된 부품명
      
      // AI 답변 받기
      const aiResponse = await askAi(drawingId, templateName, userMessage);
      
      // AI 답변을 채팅 내역에 추가
      setChatHistory(prev => [...prev, { role: "ai", content: aiResponse }]);
      
    } catch (error) {
      console.error("AI 연동 에러:", error);
      setChatHistory(prev => [...prev, { 
        role: "ai", 
        content: "죄송합니다. 답변을 가져오는 중 오류가 발생했습니다." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewNote = () => {
    if (notes.length >= 12) {
      alert("메모는 최대 12개까지만 작성할 수 있습니다.");
      return;
    }
    const newNote = {
      id: Date.now(),
      title: `메모 ${notes.length + 1}`,
      text: "내용을 입력하세요.",
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setIsModalOpen(true);
  };

  const handleUpdateNote = (field, value) => {
    const updated = { ...selectedNote, [field]: value };
    setSelectedNote(updated);
    setNotes(notes.map((n) => (n.id === selectedNote.id ? updated : n)));
  };

  const explosionFactor = progress / 100;

  return (
    <S.Study_Body>
      <S.CanvasContainer>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <Center>
              <Model url={modelUrl} zoom={zoom} />
            </Center>
            <ContactShadows
              position={[0, -1.5, 0]}
              opacity={0.4}
              scale={20}
              blur={2}
              far={4.5}
            />
          </Suspense>
          <OrbitControls enablePan={false} enableZoom={false} />
        </Canvas>
      </S.CanvasContainer>

      <Header />

      <S.St_Main>
        <S.St_Menu>
          <S.StMenu_choice onClick={() => navigate("/study/")}>단일 부품</S.StMenu_choice>
          <S.StMenu_choice onClick={() => navigate("/study/BP")}>조립도</S.StMenu_choice>
        </S.St_Menu>

        <S.St_page $isOpen={isOpen}>
          <S.St_pageslider onClick={toggleMenu}>
            <S.ArrowImg src={arrow} alt="arrow" $isOpen={isOpen} />
          </S.St_pageslider>

          <S.St_3dSetting $isOpen={isOpen}>
            <S.Btn_box>
              <S.Set_btn
                $isActive={activeTab === "부품 정보"}
                onClick={() => setActiveTab("부품 정보")}
              >
                부품 정보
              </S.Set_btn>
              <S.Set_btn
                $isActive={activeTab === "AI 어시스턴트"}
                onClick={() => setActiveTab("AI 어시스턴트")}
              >
                AI 어시스턴트
              </S.Set_btn>
              <S.Set_btn
                $isActive={activeTab === "Note"}
                onClick={() => setActiveTab("Note")}
              >
                Note
              </S.Set_btn>
            </S.Btn_box>

            {activeTab === "부품 정보" && (
              <S.St_component_box>
                <S.Com_title>제트엔진</S.Com_title>
                <S.Com_imagebox>이미지</S.Com_imagebox>
                <S.Com_explainbox>
                  <S.Com_explain>아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아아</S.Com_explain>
                </S.Com_explainbox>
              </S.St_component_box>
            )}

            {activeTab === "AI 어시스턴트" && (
              <S.St_Ai>
                <S.St_Aichat>
                  <S.Ai_title>
                    <img src={star} alt="star" />
                    AI 가이드
                  </S.Ai_title>
                  
                  <S.Ai_text>
                    {chatHistory.length === 0 ? (
                      <div style={{ opacity: 0.6 }}>
                        무엇을 도와드릴까요? 제트 엔진에 대해 궁금한 점을 물어보세요.
                      </div>
                    ) : (
                      chatHistory.map((msg, index) => (
                        <S.ChatMessage key={index} $isUser={msg.role === "user"}>
                          <S.ChatRole>{msg.role === "user" ? "You" : "AI"}</S.ChatRole>
                          <S.ChatContent>{msg.content}</S.ChatContent>
                        </S.ChatMessage>
                      ))
                    )}
                    
                    {isLoading && (
                      <S.ChatMessage $isUser={false}>
                        <S.ChatRole>AI</S.ChatRole>
                        <S.ChatContent>답변을 생성하고 있습니다...</S.ChatContent>
                      </S.ChatMessage>
                    )}
                  </S.Ai_text>
                </S.St_Aichat>
                
                <S.St_user>
                  <img src={plus} alt="plus" />
                  <S.User_chat
                    type="text"
                    placeholder="무엇을 도와드릴까요?"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendQuestion()}
                    disabled={isLoading}
                  />
                  <img 
                    src={glass} 
                    alt="search" 
                    onClick={isLoading ? null : handleSendQuestion} 
                    style={{ cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.5 : 1 }}
                  />
                </S.St_user>
              </S.St_Ai>
            )}

            {activeTab === "Note" && (
              <S.St_notebox
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 200px)",
                  gap: "32px",
                  overflowY: "auto",
                  height: "calc(100% - 120px)",
                  padding: "20px",
                  justifyContent: "center",
                  alignContent: "start",
                }}
              >
                {notes.map((note) => (
                  <S.St_note
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsModalOpen(true);
                    }}
                    style={{ width: "200px", height: "200px", flexShrink: 0 }}
                  >
                    <S.Note_title>{note.title}</S.Note_title>
                    <S.Note_line />
                    <S.Note_text>{note.text}</S.Note_text>
                  </S.St_note>
                ))}
                {notes.length < 12 && (
                  <S.St_notemaker onClick={handleAddNewNote}>
                    <img width={44} height={44} src={oplus} alt="add" />
                  </S.St_notemaker>
                )}
              </S.St_notebox>
            )}
          </S.St_3dSetting>
        </S.St_page>

        <S.PM_btnbox>
          <S.Plus_btn onClick={handleZoomIn}>
            <img src={plus} alt="plus" />
          </S.Plus_btn>
          <S.Minus_btn onClick={handleZoomOut}>
            <img src={minus} alt="minus" />
          </S.Minus_btn>
        </S.PM_btnbox>
      </S.St_Main>

     {isModalOpen && (
        <S.Note_modalbody onClick={() => setIsModalOpen(false)}>
          <S.Modal_main onClick={(e) => e.stopPropagation()}>
            <S.Modal_title>
              <input
                value={selectedNote?.title || ""}
                onChange={(e) => handleUpdateNote("title", e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "85%",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  color: "inherit",
                }}
              />
              <img
                src={X}
                alt="close"
                onClick={() => setIsModalOpen(false)}
                style={{ cursor: "pointer" }}
              />
            </S.Modal_title>
            <S.Modal_line />
            <textarea
              value={selectedNote?.text || ""}
              onChange={(e) => handleUpdateNote("text", e.target.value)}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                height: "250px",
                resize: "none",
                fontSize: "16px",
                color: "inherit",
                marginTop: "10px",
              }}
            />
          </S.Modal_main>
        </S.Note_modalbody>
      )}
    </S.Study_Body>
  );
};  

export default Studypage;
