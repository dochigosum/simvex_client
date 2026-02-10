// import { useState, useEffect } from "react";
import styled from "styled-components";
import Logout from "../assets/Logout.svg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderBody>
      <Header_text>
        <Header_title>SIMVEX</Header_title>
        <Header_menu>
          {/* 현재 경로가 "/" 인지 확인 */}
          <Menu_choice
            $isActive={location.pathname === "/"}
            onClick={() => navigate("/")}
          >
            Home
          </Menu_choice>

          {/* 현재 경로가 "/study" 인지 확인 */}
          <Menu_choice
            $isActive={location.pathname === "/study" || "/studybp"}
            onClick={() => navigate("/study")}
          >
            Study
          </Menu_choice>

          <Menu_choice>CAD</Menu_choice>
        </Header_menu>
        <Header_sign>
          <img src={Logout} /> Sign&nbsp;in
        </Header_sign>
      </Header_text>
    </HeaderBody>
  );
};

const HeaderBody = styled.div`
  width: 1920px;
  height: 85px;
  padding: 16px 100px;
  background-color: #121417;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 100;
  position: fixed;
`;

const Header_text = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header_title = styled.span`
  font-weight: 700;
  font-size: 28.8px;
  color: #fff;
`;

const Header_menu = styled.div`
  width: 266.4px;
  height: 40px;
  display: flex;
  gap: 25.6px;
`;

const Menu_choice = styled.button`
  width: 76px;
  font-weight: 400;
  font-size: 19.2px;
  color: #fff;
  background-color: #121417;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9.6px;
  gap: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.$isActive ? "#4649F1" : "#121417")};
  color: ${(props) => (props.$isActive ? "#fff" : "#fff")};
  &:hover {
    background-color: ${(props) => (props.$isActive ? "#4649F1" : "#2a2d33")};
  }
`;

const Header_sign = styled.div`
  width: 105.6px;
  height: 40px;
  padding: 12px;
  color: #fff;
  background-color: #1b1c20;
  display: flex;
  align-items: center;
  border-radius: 50px;
`;

export default Header;
