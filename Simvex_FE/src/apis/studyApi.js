import axios from "axios";

const API = axios.create({
  baseURL: "http://15.165.72.154:8000/api/v1/", 
  timeout: 10000,
});



// AI에게 질문하기 (POST)
export const askAi = async (drawingId, templateName, question) => {
  try {
    const response = await API.post("/assistant", { 
      id: drawingId,
      drawing_id: drawingId,
      template_name: templateName,
      content: question 
    });
    // Response: "드론의 '날개' 수는 종류에 따라 다릅니다.\n\n- 멀티로터..."
    return response.data;
  } catch (error) {
    console.error("AI 응답 에러:", error);
    throw error;
  }
};

// AI 채팅 내역 조회 (GET)
export const getChatHistory = async (drawingId) => {
  try {
    const response = await API.get(`/assistant/${drawingId}`);
    // Response: [
    //   { role: "user", content: "드론이 뭐야" },
    //   { role: "ai", content: "드론은 쩌는 거" },
    //   { role: "user", content: "대단해" },
    //   { role: "ai", content: "별말슴" }
    // ]
    return response.data;
  } catch (error) {
    console.error("채팅 내역 조회 에러:", error);
    return [];
  }
};

// 부품 리스트 조회
export const getPartsList = async () => {
  try {
    const response = await API.get("/parts");
    return response.data;
  } catch (error) {
    console.warn("백엔드 연결 실패: Mock 데이터를 사용합니다.");
    return null;
  }
};

// 부품 상세 정보 조회
export const getComponentInfo = async (id) => {
  try {
    const response = await API.get(`/components/${id}`);
    return response.data;
  } catch (error) {
    console.error("부품 정보 조회 에러:", error);
    return null;
  }
};