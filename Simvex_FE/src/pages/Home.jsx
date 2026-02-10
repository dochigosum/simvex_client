// import { useState, useEffect } from "react";
import styled from "styled-components";
// import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import arrow from "../assets/arrow.svg"
const Homepage = () => {
  return (
    <Body>
      <Header />
      <Home_main>
        <Home_start>
          <Start_title>SIMVEX</Start_title>
          <Start_text>이공계열 학생을 위한 과학/공학 학습용 3D 뷰어 기반 학습 솔루션</Start_text>
          <Start_btn>get Start<img src={arrow}></img></Start_btn>
        </Home_start>
      </Home_main>
    </Body>
  );
};

const Body = styled.div`
  width: 100%;
  height: 100%;
`;



const Home_main = styled.div`
  width: 100%;
  height: 1990px;
  background-color: #1b1c20;
`;
const Home_start = styled.div`
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  padding-top: 296px;
`;

const Start_title = styled.span`
  font-weight: 700;
  font-size: 100px;
  color: #fff;
`;

const Start_text = styled.p`
  font-weight: 400;
  font-size: 24px;
  color: #ffffff;
  opacity: 60%;
`;

const Start_btn = styled.button`
  width: 124px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #4649F1;
  border: none;
  border-radius: 12px;
  gap: 10px;
  font-weight: 700;
  position: absolute;
  bottom: 321px;
`
export default Homepage;
