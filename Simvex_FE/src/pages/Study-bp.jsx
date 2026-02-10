import { useState, useEffect, Suspense } from "react";
import { useStudyLogic } from "../js/useStudy.js";
import * as S from "../js/Study-bp.styles.js";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import {
  useGLTF,
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import { getAssemblyParts, getAiConversation, sendAiQuestion, createNote } from "../apis/studyApi";

import Header from "../components/Header";
import arrow from "../assets/arrow.svg";
import X from "../assets/X.svg";
import tr from "../assets/tr.svg";
import plus from "../assets/Plus.png";
import minus from "../assets/Minus.svg";
import star from "../assets/star.svg";
import glass from "../assets/glass.svg";
import oplus from "../assets/oplus.svg";

const PartModel = ({ url, position, rotation, scale = 1, explosionFactor }) => {
  try {
    const { scene } = useGLTF(url);
    const clonedScene = scene.clone();

    // [분해 로직] 각 좌표축별 분해 가중치 적용
    const explodedPosition = [
      position[0] + position[0] * explosionFactor * 0.5,
      position[1] + position[1] * explosionFactor * 1.2,
      position[2] + position[2] * explosionFactor * 0.5,
    ];

    return (
      <primitive
        object={clonedScene}
        position={explodedPosition}
        rotation={rotation}
        scale={scale}
      />
    );
  } catch (e) {
    return null;
  }
};

/**
 * [Machine Vice 조립 좌표 - Fallback용]
 * 서버에서 데이터 못 가져올 때 사용
 */
const mockParts = [
  {
    partId: 1,
    partName: "Part8-grundplatte", // 바닥 베이스
    fileName: "Part8-grundplatte.glb",
    x_coordinate: -1.2,
    y_coordinate: 1.2,
    z_coordinate: 7,
    x_rotation: 1.57,
    y_rotation: 0,
    z_rotation: 0,
  },
  {
    partId: 5,
    partName: "Part1 Fuhrung", // 가이드 레일
    fileName: "Part1 Fuhrung.glb",
    x_coordinate: -0.8, 
    y_coordinate: 1.2, // 베이스 바로 위
    z_coordinate: 7.155,
    x_rotation: 1.57,
    y_rotation: 0,
    z_rotation: 0,
  },
  {
    partId: 7,
    partName: "Part2 Feste Backe", // 고정 죠 (우측)
    fileName: "Part2 Feste Backe.glb",
    x_coordinate: 2.5, // 우측 끝으로 이동
    y_coordinate: 1.15,
    z_coordinate: 7,
    x_rotation: 0,
    y_rotation: -1.57,
    z_rotation: 0,
  },
  {
    partId: 6,
    partName: "Part3-lose backe", // 이동 죠 (좌측)
    fileName: "Part3-lose backe.glb",
    x_coordinate: 0.0, // 좌측 위치
    y_coordinate: 1.9,
    z_coordinate: 6.95,
    x_rotation: 0,
    y_rotation: -1.57,
    z_rotation: 0,
  },
  {
    partId: 4,
    partName: "Part4 spindelsockel", // 스핀들 고정부 (좌측 끝)
    fileName: "Part4 spindelsockel.glb",
    x_coordinate: -1.2,
    y_coordinate: 1.2,
    z_coordinate: 8.05,
    x_rotation: 0,
    y_rotation: 1.57,
    z_rotation: 0,
  },
  {
    partId: 3,
    partName: "Part5-Spannbacke", // 죠 플레이트 1 (고정 죠 안쪽)
    fileName: "Part5-Spannbacke.glb",
    x_coordinate: 2.168,
    y_coordinate: 1.84,
    z_coordinate: 6.97,
    x_rotation: 0,
    y_rotation: -1.57,
    z_rotation: 0,
  },
  {
    partId: 8,
    partName: "Part5-Spannbacke", // 죠 플레이트 2 (이동 죠 안쪽)
    fileName: "Part5-Spannbacke.glb",
    x_coordinate: 0.848,
    y_coordinate: 1.88,
    z_coordinate: 8.45,
    x_rotation: 0,
    y_rotation: 1.57, // 반대 방향 회전 유지
    z_rotation: 0,
  },
  {
    partId: 2,
    partName: "Part7-TrapezSpindel", // 메인 스핀들 (수평 관통)
    fileName: "Part7-TrapezSpindel.glb",
    x_coordinate: -1.7, 
    y_coordinate: 2.07,
    z_coordinate: 7.7,
    x_rotation: 3.14,
    y_rotation: -1.57,
    z_rotation: 0,
  },
];

mockParts.forEach((part) => {
  useGLTF.preload(`/3Dasset/Machine Vice/${part.fileName}`);
});

const Studypage = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState(mockParts);
  const [chatInput, setChatInput] = useState("");
  const [aiResponse, setAiResponse] = useState("데이터를 불러오는 중...");
  const [notes, setNotes] = useState([]);
  

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

  // ====================================
  // 🤖 AI 초기 메시지 가져오기
  // ====================================
  useEffect(() => {
    const fetchInitialAiMessage = async () => {
      try {
        const data = await getAiConversation(1);
        if (data && data.length > 0) {
          // AI의 마지막 응답 찾기
          const lastAiMessage = data.filter(msg => msg.role === "ai").pop();
          setAiResponse(lastAiMessage?.content || "안녕하세요! 무엇을 도와드릴까요?");
        } else {
          setAiResponse("안녕하세요! 무엇을 도와드릴까요?");
        }
      } catch (error) {
        console.error("AI 가이드를 불러오지 못했습니다.", error);
        setAiResponse("안녕하세요! 무엇을 도와드릴까요?");
      }
    };
    fetchInitialAiMessage();
  }, []);

  // 마운트 시 분해도 0 초기화
  useEffect(() => {
    if (typeof setProgress === "function") {
      setProgress(0);
    }
  }, [setProgress]);

  // ====================================
  // 🔧 조립도 부품 데이터 가져오기
  // ====================================
  useEffect(() => {
    const fetchParts = async () => {
      try {
        const data = await getAssemblyParts();
        if (data && data.length > 0) {
          // 서버 데이터를 mockParts 형식으로 매핑
          const mappedParts = data.map((serverPart) => {
            // fileName이나 partModelUrl에서 파일명 추출
            const fileName = serverPart.fileName || 
                           serverPart.partModelUrl?.split('/').pop() || 
                           `${serverPart.partName}.glb`;
            
            return {
              partId: serverPart.partId,
              partName: serverPart.partName,
              fileName: fileName,
              x_coordinate: serverPart.x_coordinate || 0,
              y_coordinate: serverPart.y_coordinate || 0,
              z_coordinate: serverPart.z_coordinate || 0,
              x_rotation: serverPart.x_rotation || 0,
              y_rotation: serverPart.y_rotation || 0,
              z_rotation: serverPart.z_rotation || 0,
            };
          });
          setParts(mappedParts);
          console.log("✅ 서버에서 부품 데이터 로드 완료:", mappedParts);
        } else {
          console.log("⚠️ 서버 데이터 없음, Mock 데이터 사용");
        }
      } catch (error) {
        console.error("❌ 부품 데이터 로드 실패, Mock 데이터 사용:", error);
      }
    };
    fetchParts();
  }, []);

  // ====================================
  // 💬 AI 질문 전송
  // ====================================
  const handleSendQuestion = async () => {
    if (!chatInput.trim()) return;
    
    const prevChat = chatInput;
    setChatInput("");
    setAiResponse("분석 중...");

    try {
      const aiAnswer = await sendAiQuestion(1, 1, "기계 바이스", prevChat);
      setAiResponse(aiAnswer);
    } catch (error) {
      console.error("AI 응답 에러:", error);
      setAiResponse("답변을 가져오는 중 오류가 발생했습니다.");
    }
  };

  // ====================================
  // 📝 Note 추가 (서버에 저장)
  // ====================================
  const handleAddNewNote = async () => {
    if (notes.length >= 12) {
      alert("메모는 최대 12개까지만 작성할 수 있습니다.");
      return;
    }
    
    const newNote = {
      id: Date.now(),
      title: `메모 ${notes.length + 1}`,
      text: "내용을 입력하세요.",
    };
    
    // 로컬 상태에 먼저 추가
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
    setIsModalOpen(true);
    
    // 서버에 저장 (비동기)
    try {
      const detail = JSON.stringify({
        title: newNote.title,
        text: newNote.text
      });
      
      const result = await createNote(1, detail); // drawingId = 1
      console.log("✅ 메모 서버 저장 성공:", result);
    } catch (error) {
      console.error("❌ 메모 서버 저장 실패:", error);
    }
  };

  // ====================================
  // 📝 Note 수정 (서버에도 업데이트)
  // ====================================
  const handleUpdateNote = async (field, value) => {
    const updated = { ...selectedNote, [field]: value };
    setSelectedNote(updated);
    setNotes(notes.map((n) => (n.id === selectedNote.id ? updated : n)));
    
    // 서버에 저장 (디바운싱 없이 즉시 저장 - 실제론 디바운싱 권장)
    try {
      const detail = JSON.stringify({
        title: updated.title,
        text: updated.text
      });
      
      await createNote(1, detail); // drawingId = 1
      console.log("✅ 메모 업데이트 완료");
    } catch (error) {
      console.error("❌ 메모 업데이트 실패:", error);
    }
  };

  const explosionFactor = progress / 100;

  return (
    <S.Study_Body>
      <S.CanvasContainer>
        <Canvas dpr={[1, 2]} camera={{ position: [1, 2, 5], fov: 45 }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} />

          <Suspense fallback={null}>
            <Environment preset="city" />
            <Center>
              {parts.map((part, index) => (
                <PartModel
                  key={`${part.partId || index}`}
                  url={`/3Dasset/Machine Vice/${part.fileName}`}
                  position={[
                    part.x_coordinate,
                    part.y_coordinate,
                    part.z_coordinate,
                  ]}
                  rotation={[
                    part.x_rotation || 0,
                    part.y_rotation || 0,
                    part.z_rotation || 0,
                  ]}
                  scale={zoom}
                  explosionFactor={explosionFactor}
                />
              ))}
            </Center>
            <ContactShadows
              position={[0, -2, 0]}
              opacity={0.4}
              scale={30}
              blur={2.5}
            />
          </Suspense>
          <OrbitControls makeDefault target={[0, 0, 0]} />
        </Canvas>
      </S.CanvasContainer>

      <Header />

      <S.St_Main>
        <S.St_Menu>
          <S.StMenu_choice onClick={() => navigate("/study")}>
            단일 부품
          </S.StMenu_choice>
          <S.StMenu_choice onClick={() => navigate("/studybp")}>
            조립도
          </S.StMenu_choice>
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

            {activeTab === "부품 정보" && (
              <>
                <S.St_component_box>
                  <S.Com_title>Machine Vice 조립도</S.Com_title>
                  <S.Com_imagebox>
                    {parts.map((p, idx) => (
                      <S.Com_image key={`img-${idx}`} style={{ position: 'relative', overflow: 'hidden' }}>
                        {/* 3D 미리보기만 */}
                        <Canvas
                          dpr={[1, 2]}
                          camera={{ position: [2, 2, 2], fov: 50 }}
                          style={{ width: '100%', height: '100%' }}
                        >
                          <ambientLight intensity={1} />
                          <pointLight position={[5, 5, 5]} intensity={1} />
                          <Suspense fallback={null}>
                            <PartModel
                              url={`/3Dasset/Machine Vice/${p.fileName}`}
                              position={[0, 0, 0]}
                              rotation={[p.x_rotation || 0, p.y_rotation || 0, p.z_rotation || 0]}
                              scale={1}
                              explosionFactor={0}
                            />
                          </Suspense>
                          <OrbitControls 
                            enableZoom={false}
                            enablePan={false}
                            enableRotate={false}
                          />
                        </Canvas>
                      </S.Com_image>
                    ))}
                  </S.Com_imagebox>
                  <S.Com_explainbox>
                    <S.Com_extitle>부품 이름</S.Com_extitle>
                    <S.Com_explain>
                      설명
                    </S.Com_explain>
                  </S.Com_explainbox>
                </S.St_component_box>
                <S.Progress_box>
                  <S.Progress_text>분해도</S.Progress_text>
                  <S.Progress_bar_container ref={barRef}>
                    <S.Progress_tr
                      $pos={progress}
                      onMouseDown={handleMouseDown}
                    >
                      <img src={tr} alt="tr" draggable="false" />
                    </S.Progress_tr>
                    <S.Progress_bar />
                    <S.Progress_Indicator $pos={progress} />
                  </S.Progress_bar_container>
                </S.Progress_box>
              </>
            )}

            {activeTab === "AI 어시스턴트" && (
              <S.St_Ai>
                <S.St_Aichat>
                  <S.Ai_title>
                    <img src={star} alt="star" /> AI 가이드
                  </S.Ai_title>
                  <S.Ai_text>{aiResponse}</S.Ai_text>
                </S.St_Aichat>
                <S.St_user>
                  <img src={plus} alt="plus" />
                  <S.User_chat
                    placeholder="무엇을 도와드릴까요?"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendQuestion();
                      }
                    }}
                  />
                  <img 
                    src={glass} 
                    alt="search" 
                    onClick={handleSendQuestion}
                    style={{ cursor: 'pointer' }}
                  />
                </S.St_user>
              </S.St_Ai>
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