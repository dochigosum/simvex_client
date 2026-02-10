import { Suspense, useState } from "react"; // useState 추가
import { useStudyLogic } from "../js/useStudy.js";
import * as S from "../js/Study.styles.js";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import { askAi } from "../apis/studyApi.js"; 

import {
  useGLTF,
  OrbitControls,
  ContactShadows,
  Environment,
  Center,
} from "@react-three/drei";

import Header from "../components/Header";
import arrow from "../assets/arrow.svg";
import X from "../assets/X.svg";
import plus from "../assets/Plus.png";
import minus from "../assets/Minus.svg";
import star from "../assets/Star.svg";
import glass from "../assets/glass.svg";
import oplus from "../assets/oplus.svg";

const Model = ({ url, zoom }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={zoom} />;
};

const Studypage = () => {
  const modelUrl = "/3Dasset/Drone/Armgear.glb";
  const {
    zoom, handleZoomIn, handleZoomOut,
    isOpen, toggleMenu,
    activeTab, setActiveTab,
    isModalOpen, setIsModalOpen,
    selectedNote, setSelectedNote
  } = useStudyLogic();

  const navigate = useNavigate();

  const [chatInput, setChatInput] = useState("");
  const [aiResponse, setAiResponse] = useState("무엇을 도와드릴까요? 제트 엔진에 대해 궁금한 점을 물어보세요."); // AI의 답변

  const handleSendQuestion = async () => {
    if (!chatInput.trim()) return;

    try {
      setAiResponse("AI가 답변을 생각하고 있습니다...");
      
      // 백엔드에서 순수 텍스트로 답장이 옴 (data 자체가 문자열)
      const textResponse = await askAi(chatInput); 
      
      setAiResponse(textResponse);
      setChatInput(""); // 전송 후 입력창 비우기
    } catch (error) {
      console.error("AI 연동 에러:", error);
      setAiResponse("답변을 가져오는 중 오류가 발생했습니다.");
    }
  };

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
          <S.StMenu_choice onClick={() => navigate("/study")}>단일 부품</S.StMenu_choice>
          <S.StMenu_choice onClick={() => navigate("/studybp")}>조립도</S.StMenu_choice>
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
                  <S.Com_explain>아아</S.Com_explain>
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
                  {/* 백엔드에서 받은 텍스트 출력 */}
                  <S.Ai_text>{aiResponse}</S.Ai_text>
                </S.St_Aichat>
                <S.St_user>
                  <img src={plus} alt="plus" />
                  <S.User_chat
                    type="text"
                    placeholder="무엇을 도와드릴까요?"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendQuestion()}
                  />
                  <img 
                    src={glass} 
                    alt="search" 
                    onClick={handleSendQuestion} 
                    style={{ cursor: "pointer" }}
                  />
                </S.St_user>
              </S.St_Ai>
            )}

            {activeTab === "Note" && (
              <S.St_notebox>
                <S.St_note
                  onClick={() => {
                    setSelectedNote({
                      title: "제목",
                      text: "메모를 작성해보세요!",
                    }); 
                    setIsModalOpen(true);
                  }}
                >
                  <S.Note_title>제목</S.Note_title>
                  <S.Note_line></S.Note_line>
                  <S.Note_text>메모를 작성해보세요!</S.Note_text>
                </S.St_note>

                <S.St_notemaker>
                  <img width={44} height={44} src={oplus} alt="add" />
                </S.St_notemaker>
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
              {selectedNote?.title} 
              <img src={X} alt="close" onClick={() => setIsModalOpen(false)}/>
            </S.Modal_title>
            <S.Modal_line></S.Modal_line>
            <S.Modal_text>{selectedNote?.text}</S.Modal_text>
          </S.Modal_main>
        </S.Note_modalbody>
      )}
    </S.Study_Body>
  );
};  

export default Studypage;