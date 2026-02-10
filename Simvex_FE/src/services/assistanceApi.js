import apiCall from './api';

/**
 * AI 어시스턴트에게 질문
 * POST /assistance
 */
export const askAssistant = async (id, drawingId, templateName, content) => {
  const response = await apiCall('/assistance', {
    method: 'POST',
    body: JSON.stringify({
      id,
      drawing_id: drawingId,
      template_name: templateName,
      content,
    }),
  });
  return response;
};

/**
 * AI 대화 내역 조회
 * GET /assistance
 */
export const getAssistantHistory = async () => {
  const response = await apiCall('/assistance', {
    method: 'GET',
  });
  return response;
};
