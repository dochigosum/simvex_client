// ====================================
// 서버 연동 API 함수 모음
// 베이스 URL: http://43.203.96.167:8080
// ====================================

const BASE_URL = "https://43.203.96.167:8080";

// ====================================
// 🔧 부품 관련 API
// ====================================

/**
 * 1. 조립도의 전체 부품 목록 조회 (GET)
 * @returns {Promise<Array>} 부품 목록 배열
 * Response: [{ partId, partName, partModelUrl }]
 */
export const getPartsList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/drawing`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("부품 목록 조회 실패:", error);
    return [];
  }
};

/**
 * 2. 조립도 내 3D 부품 모델 가져오기 (GET)
 * @returns {Promise<Array>} 3D 좌표가 포함된 부품 배열
 * Response: [{ partId, partName, partModelUrl, x_coordinate, y_coordinate, z_coordinate, x_rotation, y_rotation, z_rotation }]
 */
export const getAssemblyParts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/drawing/model`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("조립도 부품 조회 실패:", error);
    return [];
  }
};

/**
 * 3. 단일 부품 설명 조회 (GET)
 * @param {number} partId - 부품 ID
 * @returns {Promise<Object>} 부품 상세 정보
 * Response: { partId, partName, partDetail }
 */
export const getPartDetail = async (partId) => {
  try {
    const response = await fetch(`${BASE_URL}/part/${partId}/explain`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("부품 상세 조회 실패:", error);
    return null;
  }
};

/**
 * 4. 단일 부품 3D 모델링 가져오기 (GET)
 * @param {number} partId - 부품 ID
 * @returns {Promise<Object>} 부품 모델 URL
 * Response: { partModelUrl: "string" }
 */
export const getPartModel = async (partId) => {
  try {
    const response = await fetch(`${BASE_URL}/part/${partId}/model`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("부품 모델 조회 실패:", error);
    return null;
  }
};

// ====================================
// 📝 Note 관련 API
// ====================================

/**
 * 5. Note 저장 (POST)
 * @param {number} drawingId - 도면 ID
 * @param {string} detail - 메모 내용
 * @returns {Promise<Object>} 생성된 메모 정보
 * Response: { created: 3 }
 */
export const createNote = async (drawingId, detail) => {
  try {
    const response = await fetch(`${BASE_URL}/drawing/memo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        drawingId,
        detail,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("메모 저장 실패:", error);
    return null;
  }
};

/**
 * 6. Note 조회 (GET)
 * @param {number} memoId - 메모 ID
 * @returns {Promise<Object>} 메모 정보
 * Response: { memoId: 3, drawingId: 123, detail: "저장고설다......." }
 */
export const getNote = async (memoId) => {
  try {
    const response = await fetch(`${BASE_URL}/drawing/memo/${memoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("메모 조회 실패:", error);
    return null;
  }
};

/**
 * 7. Note 삭제 (DELETE)
 * @param {number} memoId - 메모 ID
 * @returns {Promise<Object>} 삭제 결과
 * Response: { deleted: 3 }
 */
export const deleteNote = async (memoId) => {
  try {
    const response = await fetch(`${BASE_URL}/drawing/memo/${memoId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("메모 삭제 실패:", error);
    return null;
  }
};

// ====================================
// 🤖 AI Assistant 관련 API
// ====================================

/**
 * 8. AI에게 질문 전송 (POST)
 * @param {number} id - Assistant ID
 * @param {number} drawingId - 도면 ID
 * @param {string} templateName - 템플릿 이름 (예: "v4엔진")
 * @param {string} content - 질문 내용
 * @returns {Promise<string>} AI 응답
 * Response: "드론은 하늘을 날라다니는 장장세계"
 */
export const sendAiQuestion = async (id, drawingId, templateName, content) => {
  try {
    const response = await fetch(`${BASE_URL}/assistance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        drawing_id: drawingId,
        template_name: templateName,
        content,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // 응답이 문자열로 직접 올 수도 있고, 객체로 올 수도 있음
    return typeof data === "string" ? data : data.content || data;
  } catch (error) {
    console.error("AI 질문 전송 실패:", error);
    return "AI 응답을 가져오는 중 오류가 발생했습니다.";
  }
};

/**
 * 9. AI 대화 기록 조회 (GET)
 * @param {number} id - Assistant ID
 * @returns {Promise<Array>} 대화 기록 배열
 * Response: [
 *   { role: "user", content: "드론이 뭐야" },
 *   { role: "ai", content: "드론은 찌는 것" },
 *   { role: "user", content: "대단해" },
 *   { role: "ai", content: "별말쓸" }
 * ]
 */
export const getAiConversation = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/assistance/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("AI 대화 기록 조회 실패:", error);
    return [];
  }
};

// ====================================
// 🎯 레거시 호환용 (기존 코드에서 사용 중인 함수)
// ====================================

/**
 * @deprecated - sendAiQuestion 사용 권장
 */
export const askAi = async (question) => {
  return sendAiQuestion(1, 1, "기계 바이스", question);
};