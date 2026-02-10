import styled from "styled-components";

export const Study_Body = styled.div`
  width: 100vw;
  height: 1080px;
  position: relative;
  background-color: #1b1c20;
  display: flex;
  flex-direction: column;
`;

export const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

export const St_Main = styled.div`
  flex: 1;
  position: relative;
  z-index: 2;
  pointer-events: none;
  margin-top: 86px;

  & > * {
    pointer-events: auto;
  }
`;

export const St_Menu = styled.div`
  position: absolute;
  width: 315px;
  height: 49px;
  top: 50px;
  left: 100px;
  display: flex;
  align-items: center;
  pointer-events: auto;
`;

export const StMenu_choice = styled.span`
  padding: 14px 16px;
  color: #fff;
  font-weight: 400;
  font-size: 24px;
  box-sizing: border-box;
  cursor: pointer;
  &:nth-child(2) {
    border: 2px solid #9a9da9;
    border-radius: 50px;
  }
`;

export const St_page = styled.div`
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
  transform: ${({ $isOpen }) => ($isOpen ? "translateX(0)" : "translateX(571px)")};
`;

export const St_pageslider = styled.div`
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

export const ArrowImg = styled.img`
  width: 100%;
  transition: transform 0.3s ease;
  transform: ${({ $isOpen }) => ($isOpen ? "scaleX(1)" : "scaleX(-1)")};
`;

export const St_3dSetting = styled.div`
  width: 571px;
  height: 100%;
  background-color: #42464d;
  border-radius: 12px;
  overflow: hidden;
  transition: opacity 0.4s ease-in-out, visibility 0.4s;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? "visible" : "hidden")};
  position: relative;
`;

export const Btn_box = styled.div`
  display: flex;
  width: 363px;
  height: 36px;
  gap: 14px;
  position: absolute;
  left: 40px;
`;

export const Set_btn = styled.span`
  height: 36px;
  display: flex;
  align-items: center;
  color: #fff;
  padding: 7px 18px;
  background-color: ${({ $isActive }) => ($isActive ? "#4649F1" : "#9a9da9")};
  border-radius: 0 0 12px 12px;
  cursor: pointer;
`;

// AI 영역
export const St_Ai = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: baseline;
  bottom: 29px;
  left: 40px;
`;

export const St_Aichat = styled.div`
  width: 495px;
  height: 704px;
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

export const Ai_title = styled.span`
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

export const Ai_text = styled.div`
  width: 495px;
  height: 628px;
  color: #fff;
  overflow-y: scroll;
  padding: 10px;
`;

export const St_user = styled.div`
  width: 516px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: 50px;
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.25);
`;

export const User_chat = styled.input`
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

// 노트 영역
export const St_notebox = styled.div`
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

export const St_note = styled.div`
  width: 200px;
  height: 200px;
  background-color: #bcbeff;
  padding: 10px 17px;
  border-radius: 12px;
`;

export const Note_title = styled.span`
  width: 100%;
  height: 21px;
  color: #000;
  font-weight: 400;
  font-size: 16px;
`;

export const Note_text = styled.div`
  display: flex;
  height: 143px;
  align-items: baseline;
  justify-content: baseline;
  overflow: hidden;
  color: #000;
  opacity: 20%;
`;

export const Note_line = styled.div`
  width: 166px;
  height: 0.5px;
  background-color: #000;
  opacity: 20%;
  margin: 8px 0;
`;

export const St_notemaker = styled.div`
  width: 200px;
  height: 200px;
  border: 1px dashed #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
`;

// 컴포넌트 정보 영역
export const St_component_box = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 68px;
  padding: 0 80px;
  position: relative;
`;

export const Com_title = styled.span`
  position: absolute;
  top: 0;
  left: 62px;
  color: #fff;
  font-size: 32px;
  font-weight: 600;
`;

export const Com_imagebox = styled.div`
  width: 407px;
  height: 156px;
  display: flex;
  margin-top: 62px;
  gap: 14.25px;
  flex-wrap: wrap;
`;

export const Com_image = styled.div`
  width: 70px;
  height: 70px;
  box-sizing: border-box;
  border: 1px solid #fff;
`;

export const Com_explainbox = styled.div`
  width: 390px;
  height: 71px;
  margin-top: 32px;
  justify-content: baseline;
`;

export const Com_extitle = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 20px;
`;

export const Com_explain = styled.p`
  color: #fff;
  font-weight: 400;
  font-size: 14px;
  flex-wrap: wrap;
  margin-top: 5px;
  margin-bottom: 18px;
`;

// 프로그레스 바 영역
export const Progress_box = styled.div`
  width: 471px;
  display: flex;
  align-items: center;
  gap: 11px;
  position: absolute;
  bottom: 40.5px;
  left: 60px;
  user-select: none;
`;

export const Progress_tr = styled.div`
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

export const Progress_bar_container = styled.div`
  position: relative;
  width: 419px;
  height: 18px;
  display: flex;
  align-items: center;
`;

export const Progress_Indicator = styled.div`
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

export const Progress_text = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: #fff;
  white-space: nowrap;
`;

export const Progress_bar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50px;
  background: linear-gradient(45deg, #a8aaff, #4649f1, #202187);
`;

// 버튼 영역
export const PM_btnbox = styled.div`
  position: absolute;
  left: 100px;
  bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Plus_btn = styled.button`
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

export const Minus_btn = styled(Plus_btn)``;

// 모달 영역
export const Note_modalbody = styled.div`
  width: 100vw;
  height: 120vh;
  background-color: rgba(27, 28, 32, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;

export const Modal_main = styled.div`
  width: 700px;
  height: 700px;
  padding: 21px;
  background-color: #BCBEFF;
  border-radius: 12px;
`;

export const Modal_title = styled.div`
  width: 658px;
  height: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  font-weight: 400;
  font-size: 16px;
`;

export const Modal_line = styled.div`
  width: 658px;
  height: 0px;
  border: 1px solid #9193DB;
  margin-bottom: 8px;
  margin-top: 5px;
`;

export const Modal_text = styled.div`
  display: flex;
  justify-content: baseline;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: scroll;
  opacity: 20%;
`;