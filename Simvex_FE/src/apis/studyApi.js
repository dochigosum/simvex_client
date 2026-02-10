import axios from "axios";

const API = axios.create({
  // 백엔드가 주소를 줄 때까지는 임시 주소를 넣거나, 비워둡니다.
  baseURL: "http://localhost:8080/api/v1/", 
  timeout: 1000, // 주소가 잘못되었을 때 너무 오래 기다리지 않게 설정
});

export const getPartsList = async () => {
  try {
    const response = await API.get("/parts");
    return response.data;
  } catch (error) {
    // 서버가 없거나 주소가 틀려도 에러를 던지지 않고 null을 반환하여 
    // 프론트엔드에서 mockData를 쓰게 유도합니다.
    console.warn("백엔드 연결 실패: Mock 데이터를 사용합니다.");
    return null;
  }
};

export const askAi = async (question) => {
  try {
    const response = await API.post("/ai/chat", { question }, { responseType: 'text' });
    return response.data;
  } catch (error) {
    console.error("AI 응답 에러:", error);
    return "현재 AI 연결이 원활하지 않습니다.";
  }
};
export const getComponentInfo = async (id) => {
  const response = await API.get(`/components/${id}`);
  return response.data;
};