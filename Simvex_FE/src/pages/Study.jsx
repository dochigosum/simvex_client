import {Suspense } from "react";
import { useStudyLogic } from "../js/useStudy.js";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
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
import tr from "../assets/tr.svg";
import plus from "../assets/Plus.png";
import minus from "../assets/Minus.svg";
import star from "../assets/Star.svg";
import glass from "../assets/glass.svg";
import oplus from "../assets/oplus.svg";

// 3D 모델 컴포넌트
const Model = ({ url, zoom }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={zoom} />;
};

const Studypage = () => {
  const modelUrl = "/3Dasset/Drone/Armgear.glb";
  const {
    zoom, handleZoomIn, handleZoomOut,
    isOpen, toggleMenu,
    progress, barRef, handleMouseDown,
    activeTab, setActiveTab,
    isModalOpen, setIsModalOpen,
    selectedNote, setSelectedNote
  } = useStudyLogic();

  return (
    <Study_Body>
      <CanvasContainer>
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
      </CanvasContainer>

      <Header />

      <St_Main>
        <St_Menu>
          <StMenu_choice>단일 부품</StMenu_choice>
          <StMenu_choice>조립도</StMenu_choice>
        </St_Menu>
        <St_page $isOpen={isOpen}>
          <St_pageslider onClick={toggleMenu}>
            <ArrowImg src={arrow} alt="arrow" $isOpen={isOpen} />
          </St_pageslider>
          <St_3dSetting $isOpen={isOpen}>
            <Btn_box>
              <Set_btn
                $isActive={activeTab === "부품 정보"}
                onClick={() => setActiveTab("부품 정보")}
              >
                부품 정보
              </Set_btn>
              <Set_btn
                $isActive={activeTab === "AI 어시스턴트"}
                onClick={() => setActiveTab("AI 어시스턴트")}
              >
                AI 어시스턴트
              </Set_btn>
              <Set_btn
                $isActive={activeTab === "Note"}
                onClick={() => setActiveTab("Note")}
              >
                Note
              </Set_btn>
            </Btn_box>
            {activeTab === "부품 정보" && (
              <>
                <St_component_box>
                  <Com_title>제목</Com_title>
                  <Com_imagebox>
                    {[...Array(10)].map((_, i) => (
                      <Com_image key={i} />
                    ))}
                  </Com_imagebox>
                  <Com_explainbox>
                    <Com_extitle>제목</Com_extitle>
                    <Com_explain>텍스트 내용...</Com_explain>
                  </Com_explainbox>
                </St_component_box>
                <Progress_box>
                  <Progress_text>분해도</Progress_text>
                  <Progress_bar_container ref={barRef}>
                    <Progress_tr $pos={progress} onMouseDown={handleMouseDown}>
                      <img src={tr} alt="tr" draggable="false" />
                    </Progress_tr>
                    <Progress_bar />
                    <Progress_Indicator $pos={progress} />
                  </Progress_bar_container>
                </Progress_box>
              </>
            )}
            {activeTab === "AI 어시스턴트" && (
              <St_Ai>
                <St_Aichat>
                  <Ai_title>
                    <img src={star} />
                    제트 엔진의 기본 작동 원리 (가스 터빈 엔진)
                  </Ai_title>
                  <Ai_text>대충 그 긴거</Ai_text>
                </St_Aichat>
                <St_user>
                  <img src={plus} />
                  <User_chat
                    type="text"
                    placeholder="무엇을 도와드릴까요?"
                  ></User_chat>
                  <img src={glass} />
                </St_user>
              </St_Ai>
            )}
            {/* Note 탭 내용 영역 */}
            {activeTab === "Note" && (
              <St_notebox>
                <St_note
                  onClick={() => {
                    setSelectedNote({
                      title: "제목",
                      text: "메모를 작성해보세요!",
                    }); 
                    setIsModalOpen(true);
                  }}
                >
                  <Note_title>제목</Note_title>
                  <Note_line></Note_line>
                  <Note_text>메모를 작성해보세요!</Note_text>
                </St_note>

                <St_notemaker>
                  <img width={44} height={44} src={oplus} alt="add" />
                </St_notemaker>
              </St_notebox>
            )}
          </St_3dSetting>
        </St_page>

        <PM_btnbox>
          <Plus_btn onClick={handleZoomIn}>
            <img src={plus} alt="plus" />
          </Plus_btn>
          <Minus_btn onClick={handleZoomOut}>
            <img src={minus} alt="minus" />
          </Minus_btn>
        </PM_btnbox>
      </St_Main>
      {isModalOpen && (
      <Note_modalbody onClick={() => setIsModalOpen(false)}>
        <Modal_main onClick={(e) => e.stopPropagation()}>
          <Modal_title>{selectedNote?.title} <img src={X} onClick={() => setIsModalOpen(false)}/></Modal_title>
          <Modal_line></Modal_line>
          <Modal_text>{selectedNote?.text}</Modal_text>
        </Modal_main>
      </Note_modalbody>
      )}
    </Study_Body>
  );
};

// --- 아래는 기존 스타일 그대로 유지 ---

const Study_Body = styled.div`
  width: 100vw;
  height: 1080px;
  position: relative;
  background-color: #1b1c20;
  display: flex;
  flex-direction: column;
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const St_Main = styled.div`
  flex: 1;
  position: relative;
  z-index: 2;
  pointer-events: none;
  margin-top: 86px;

  & > * {
    pointer-events: auto;
  }
`;
const St_Menu = styled.div`
  position: absolute;
  width: 315px;
  height: 49px;
  top: 50px;
  left: 100px;
  display: flex;
  align-items: center;
  pointer-events: auto;
`;
const StMenu_choice = styled.span`
  padding: 14px 16px;
  color: #fff;
  font-weight: 400;
  font-size: 24px;
  &:nth-child(1) {
    border: 2px solid #9a9da9;
    border-radius: 50px;
  }
`;
const St_page = styled.div`
  width: 591px;
  height: 875px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 50px;
  right: 100px;
  z-index: 2;
  pointer-events: auto;
  transition: transform 0.4s ease-in-out;
  transform: ${({ $isOpen }) =>
    $isOpen ? "translateX(0)" : "translateX(571px)"};
`;
const St_pageslider = styled.div`
  width: 21px;
  height: 97px;
  background-color: #42464d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6.5px;
  clip-path: polygon(100% 0, 100% 100%, 0 85%, 0 15%);
  cursor: pointer;
  z-index: 3;
`;
const ArrowImg = styled.img`
  width: 100%;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "scaleX(1)" : "scaleX(-1)")};
`;
const St_3dSetting = styled.div`
  width: 571px;
  height: 100%;
  background-color: #42464d;
  border-radius: 12px;
  overflow: hidden;
  transition:
    opacity 0.4s ease-in-out,
    visibility 0.4s;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  position: relative;
`;
const Btn_box = styled.div`
  display: flex;
  width: 363px;
  height: 36px;
  gap: 14px;
  position: absolute;
  left: 40px;
`;
const Set_btn = styled.span`
  height: 36px;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 7px 18px;
  background-color: ${({ $isActive }) => ($isActive ? "#4649F1" : "#9a9da9")};
  border-radius: 0 0 12px 12px;
  cursor: pointer;
`;

//AI
const St_Ai = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: baseline;
  bottom: 29px;
  left: 40px;
`;
const St_Aichat = styled.div`
  width: 495px;
  height: 704px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;
const Ai_title = styled.span`
  min-width: 403px;
  color: #fff;
  height: 60px;
  display: flex;
  align-items: center;
  margin-bottom: 35.5px;
  gap: 16px;
  font-weight: 600;
  font-size: 20px;
`;

const Ai_text = styled.div`
  width: 495px;
  height: 628px;
  color: #fff;
  overflow-y: scroll;
  padding: 10px;
`;

const St_user = styled.div`
  width: 516px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 50px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.25);
`;
const User_chat = styled.input`
  width: 380px;
  height: 32px;
  display: flex;
  align-items: center;
  color: #fff;
  background-color: #42464d;
  border: none;
  font-size: 20px;
  font-weight: 400;
  margin: 0 24px;
`;

//노트
const St_notebox = styled.div`
  position: absolute;
  width: 432px;
  height: 743px;
  overflow: auto;
  padding: 0;
  top: 72px;
  left: 70px;
  display: flex;
  gap: 32px;
`;

const St_note = styled.div`
  width: 200px;
  height: 200px;
  background-color: #bcbeff;
  padding: 10px 17px;
  border-radius: 12px;
`;
const Note_title = styled.span`
  width: 100%;
  height: 21px;
  color: #000;
  font-weight: 400;
  font-size: 16px;
`;
const Note_text = styled.div`
  display: flex;
  height: 143px;
  align-items: baseline;
  justify-content: baseline;
  overflow: hidden;
  color: #000;
  opacity: 20%;
`;
const Note_line = styled.div`
  width: 166px;
  height: 0.5px;
  background-color: #000;
  opacity: 20%;
  margin: 8px 0;
`;

const St_notemaker = styled.div`
  width: 200px;
  height: 200px;
  border: 1px dashed #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
`;

const St_component_box = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 68px;
  padding: 0 80px;
  position: relative;
`;
const Com_title = styled.span`
  position: absolute;
  top: 0;
  left: 62px;
  color: #fff;
  font-size: 32px;
  font-weight: 600;
`;
const Com_imagebox = styled.div`
  width: 407px;
  height: 156px;
  display: flex;
  margin-top: 62px;
  gap: 14.25px;
  flex-wrap: wrap;
`;
const Com_image = styled.div`
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  border: 1px solid #fff;
`;
const Com_explainbox = styled.div`
  width: 390px;
  height: 71px;
  margin-top: 32px;
  justify-content: baseline;
`;
const Com_extitle = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 20px;
`;
const Com_explain = styled.p`
  color: #fff;
  font-weight: 400;
  font-size: 14px;
  flex-wrap: wrap;
  margin-top: 5px;
  margin-bottom: 18px;
`;
const Progress_box = styled.div`
  width: 471px;
  display: flex;
  align-items: center;
  gap: 11px;
  position: absolute;
  bottom: 40.5px;
  left: 60px;
  user-select: none;
`;

const Progress_tr = styled.div`
  position: absolute;
  top: -15px;
  left: ${({ $pos }) => $pos}%;
  width: 14px;
  transform: translateX(-50%);
  cursor: grab;
  z-index: 10;

  &:active {
    cursor: grabbing;
  }
  img {
    width: 100%;
    display: block;
  }
`;
const Progress_bar_container = styled.div`
  position: relative;
  width: 419px;
  height: 18px;
  display: flex;
  align-items: center;
`;
const Progress_Indicator = styled.div`
  position: absolute;
  top: 0;
  left: ${({ $pos }) => $pos}%;
  width: 2px;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 5;
`;
const Progress_text = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  white-space: nowrap;
`;
const Progress_bar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: linear-gradient(45deg, #a8aaff, #4649f1, #202187);
`;
const PM_btnbox = styled.div`
  position: absolute;
  left: 100px;
  bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Plus_btn = styled.button`
  width: 40px;
  height: 40px;
  background: #121417;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: #2a2d33;
  }
`;



const Minus_btn = styled(Plus_btn)``;

const Note_modalbody = styled.div`
  width: 100vw;
  height: 120vh;
  background-color: rgba(27, 28, 32, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`

const Modal_main = styled.div`
  width: 700px;
  height: 700px;
  padding: 21px;
  background-color: #BCBEFF;
  border-radius: 12px;
`

const Modal_title = styled.div`
  width: 658px;
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  font-weight: 400;
  font-size: 16px;
`

const Modal_line= styled.div`
  width: 658px;
  height: 0px;
  border: 1px solid #9193DB;
  margin-bottom: 8px;
  margin-top: 5px;
`

const Modal_text = styled.div`
  display: flex;
  justify-content: baseline;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: scroll;
  opacity: 20%;
`
export default Studypage;
