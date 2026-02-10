import { Suspense, useState, useEffect } from "react";
import { useStudyLogic } from "../js/useStudy.js";
import * as S from "../js/Study.styles.js";
import { Canvas } from "@react-three/fiber";

import { useNavigate, useLocation } from "react-router-dom";

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

// 3D 모델 컴포넌트 - 에러 처리 추가
const Model = ({ url, zoom }) => {
  try {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={zoom} />;
  } catch (error) {
    console.warn("3D 모델 로딩 실패, 폴백 사용:", error);
    return null;
  }
};

// 폴백 3D 객체 (모델 로딩 실패 시)
const FallbackBox = ({ zoom }) => {
  return (
    <mesh scale={zoom / 10}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4649F1" />
    </mesh>
  );
};

const Studypage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedObject = location.state?.selectedObject;
  
  const [modelError, setModelError] = useState(false);
  
  // 모델 URL 설정
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
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  // 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      if (savedHistory) {
        setChatHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.warn("채팅 내역 로드 실패:", e);
    }
    
    try {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (e) {
      console.warn("메모 로드 실패:", e);
    }
  }, []);

  // 채팅 내역 저장
  useEffect(() => {
    if (chatHistory.length > 0) {
      try {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
      } catch (e) {
        console.warn("채팅 내역 저장 실패:", e);
      }
    }
  }, [chatHistory]);

  // 메모 저장
  useEffect(() => {
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (e) {
      console.warn("메모 저장 실패:", e);
    }
  }, [notes]);

  // AI 응답 시뮬레이션 함수
  const simulateAiResponse = async (question) => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    const lowerQ = question.toLowerCase();
    
    if (lowerQ.includes("안녕") || lowerQ.includes("hi") || lowerQ.includes("hello")) {
      return "안녕하세요! 3D 부품 학습 도우미입니다. 드론 부품에 대해 궁금하신 점을 물어보세요. 😊";
    }
    
    if (lowerQ.includes("드론")) {
      return "드론은 무인 항공기(UAV)로, 카메라, 센서 등을 탑재하여 촬영, 배송, 측량 등 다양한 용도로 활용됩니다. 드론은 주로 4개의 프로펠러(쿼드콥터)로 구성되며, 각 부품이 정밀하게 조립되어야 안정적으로 비행할 수 있습니다.";
    }
    
    if (lowerQ.includes("암기어") || lowerQ.includes("arm")) {
      return "암기어(Arm Gear)는 드론의 중요한 구조 부품입니다. 주요 역할은:\n\n• 모터 마운트 지지\n• 프로펠러와 본체 연결\n• 비행 중 진동 흡수\n• 배선 보호 및 정리\n\n일반적으로 탄소섬유나 알루미늄 합금으로 제작되어 가볍고 튼튼합니다.";
    }
    
    if (lowerQ.includes("엔진") || lowerQ.includes("모터")) {
      return "드론의 모터는 브러시리스 DC 모터(BLDC)가 주로 사용됩니다. 높은 효율과 내구성을 자랑하며, ESC(Electronic Speed Controller)를 통해 정밀하게 제어됩니다.";
    }
    
    if (lowerQ.includes("부품") || lowerQ.includes("구성")) {
      return "드론의 주요 부품:\n\n1. 프레임(Frame) - 본체 구조\n2. 모터(Motor) - 추진력 생성\n3. 프로펠러(Propeller) - 양력 발생\n4. ESC - 모터 속도 제어\n5. 비행 컨트롤러 - 자세 제어\n6. 배터리 - 전원 공급\n7. 암기어 - 구조 연결";
    }
    
    if (lowerQ.includes("재질") || lowerQ.includes("소재")) {
      return "드론 부품은 주로 다음 소재로 제작됩니다:\n\n• 탄소섬유(Carbon Fiber) - 가볍고 강함\n• 알루미늄 합금 - 내구성과 열전도\n• ABS 플라스틱 - 저렴하고 가공 용이\n• PC(Polycarbonate) - 충격 저항성";
    }
    
    if (lowerQ.includes("기능") || lowerQ.includes("역할")) {
      return "현재 보고 계신 부품의 주요 기능은 드론의 구조적 안정성을 유지하고, 각 구성요소를 안전하게 연결하는 것입니다. 비행 중 발생하는 진동과 충격을 흡수하여 드론의 성능을 최적화합니다.";
    }
    
    if (lowerQ.includes("어떻게") || lowerQ.includes("방법")) {
      return "부품 조립 시 주의사항:\n\n1. 나사를 대각선 순서로 균등하게 조임\n2. 과도한 힘으로 조이지 않기\n3. 케이블이 프로펠러에 닿지 않도록 정리\n4. 조립 후 육안 검사 필수\n5. 첫 비행 전 모터 회전 방향 확인";
    }
    
    if (lowerQ.includes("왜") || lowerQ.includes("이유")) {
      return "이 설계는 무게 대비 강도를 최적화하여 비행 효율을 높이기 위함입니다. 각 부품의 배치와 연결 방식은 공기역학과 구조역학을 고려하여 설계되었습니다.";
    }

    if (lowerQ.includes("고마") || lowerQ.includes("감사")) {
      return "천만에요! 더 궁금하신 점이 있으시면 언제든지 물어보세요. 😊";
    }

    return `"${question}"에 대해 알려드리겠습니다.\n\n현재 화면의 드론 부품은 정밀 가공된 구조물로, 비행 안정성과 내구성을 위해 설계되었습니다. 더 구체적인 질문을 해주시면 더 자세한 답변을 드릴 수 있습니다.\n\n예: "암기어의 역할은?", "어떤 소재로 만들어졌나요?", "조립 방법은?"`;
  };

  // 질문 전송
  const handleSendQuestion = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    
    setChatHistory(prev => [...prev, { role: "user", content: userMessage }]);
    setChatInput("");
    setIsLoading(true);

    try {
      const aiResponse = await simulateAiResponse(userMessage);
      setChatHistory(prev => [...prev, { role: "ai", content: aiResponse }]);
    } catch (error) {
      console.error("AI 응답 생성 에러:", error);
      setChatHistory(prev => [...prev, { 
        role: "ai", 
        content: "죄송합니다. 답변을 생성하는 중 오류가 발생했습니다." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 채팅 초기화
  const handleClearChat = () => {
    if (window.confirm("채팅 내역을 모두 삭제하시겠습니까?")) {
      setChatHistory([]);
      try {
        localStorage.removeItem('chatHistory');
      } catch (e) {
        console.warn("채팅 초기화 실패:", e);
      }
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

  const handleDeleteNote = () => {
    if (window.confirm("이 메모를 삭제하시겠습니까?")) {
      setNotes(notes.filter((n) => n.id !== selectedNote.id));
      setIsModalOpen(false);
      setSelectedNote(null);
    }
  };

  return (
    <S.Study_Body>
      <S.CanvasContainer>
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 45 }}
          onCreated={({ gl }) => {
            gl.setClearColor('#1b1c20');
          }}
        >
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} />
          <Suspense fallback={<FallbackBox zoom={zoom} />}>
            <Environment preset="city" />
            <Center>
              {!modelError ? (
                <Model url={modelUrl} zoom={zoom} />
              ) : (
                <FallbackBox zoom={zoom} />
              )}
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
                <S.Com_title>드론 암기어</S.Com_title>
                <S.Com_imagebox>3D 모델</S.Com_imagebox>
                <S.Com_explainbox>
                  <S.Com_explain>
                    드론 암기어는 드론의 주요 구조 부품 중 하나로, 모터와 프로펠러를 연결하는 역할을 합니다.
                    {'\n\n'}
                    <strong>주요 기능:</strong>{'\n'}
                    • 모터 마운트 지지{'\n'}
                    • 프로펠러와 본체 연결{'\n'}
                    • 비행 중 진동 흡수{'\n'}
                    • 배선 보호 및 정리{'\n'}
                    • 구조적 안정성 제공{'\n'}
                    {'\n'}
                    <strong>재질 및 특성:</strong>{'\n'}
                    주로 탄소섬유(Carbon Fiber) 또는 알루미늄 합금으로 제작되어 가볍고 튼튼합니다. 탄소섬유는 무게 대비 강도가 뛰어나 고성능 드론에 적합하며, 알루미늄은 가공성과 내구성이 우수합니다.
                    {'\n\n'}
                    <strong>설계 특징:</strong>{'\n'}
                    암기어의 길이와 두께는 드론의 크기와 용도에 따라 다르게 설계됩니다. 일반적으로 긴 암은 안정성을 높이지만 무게가 증가하므로, 최적의 균형점을 찾는 것이 중요합니다.
                  </S.Com_explain>
                </S.Com_explainbox>
              </S.St_component_box>
            )}

            {activeTab === "AI 어시스턴트" && (
              <S.St_Ai>
                <S.St_Aichat>
                  <S.Ai_title>
                    <img src={star} alt="star" />
                    AI 가이드
                    {chatHistory.length > 0 && (
                      <button
                        onClick={handleClearChat}
                        style={{
                          marginLeft: "auto",
                          padding: "4px 12px",
                          fontSize: "12px",
                          background: "#9a9da9",
                          border: "none",
                          borderRadius: "4px",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        초기화
                      </button>
                    )}
                  </S.Ai_title>
                  
                  <S.Ai_text>
                    {chatHistory.length === 0 ? (
                      <div style={{ opacity: 0.6, padding: "20px", textAlign: "center" }}>
                        무엇을 도와드릴까요? 드론 부품에 대해 궁금한 점을 물어보세요. 😊
                        {'\n\n'}
                        <div style={{ fontSize: "12px", marginTop: "10px", color: "#9a9da9" }}>
                          예시: "드론이 뭐야?", "암기어의 역할은?", "어떤 소재로 만들어졌나요?"
                        </div>
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleSendQuestion();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <img 
                    src={glass} 
                    alt="search" 
                    onClick={!isLoading ? handleSendQuestion : undefined} 
                    style={{ 
                      cursor: isLoading ? "not-allowed" : "pointer", 
                      opacity: isLoading ? 0.5 : 1 
                    }}
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
                  width: "calc(100% - 80px)",
                  fontSize: "inherit",
                  fontWeight: "inherit",
                  color: "inherit",
                }}
              />
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  onClick={handleDeleteNote}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    fontSize: "14px",
                    padding: "4px 8px",
                  }}
                >
                  삭제
                </button>
                <img
                  src={X}
                  alt="close"
                  onClick={() => setIsModalOpen(false)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </S.Modal_title>
            <S.Modal_line />
            <textarea
              value={selectedNote?.text || ""}
              onChange={(e) => handleUpdateNote("text", e.target.value)}
              placeholder="메모 내용을 입력하세요..."
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                width: "100%",
                height: "calc(100% - 60px)",
                resize: "none",
                fontSize: "16px",
                color: "inherit",
                marginTop: "10px",
                fontFamily: "inherit",
              }}
            />
          </S.Modal_main>
        </S.Note_modalbody>
      )}
    </S.Study_Body>
  );
};  

export default Studypage;