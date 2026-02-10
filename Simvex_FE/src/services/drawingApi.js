import apiCall from './api';

/**
 * 조립도 템플릿 목록 조회
 * GET /template
 */
export const getDrawingTemplates = async () => {
  const response = await apiCall('/template', {
    method: 'GET',
  });
  return response;
};

/**
 * 조립도 템플릿별 부품 목록 조회
 * GET /template/{templateId}/part
 */
export const getDrawingParts = async (templateId) => {
  const response = await apiCall(`/template/${templateId}/part`, {
    method: 'GET',
  });
  return response;
};
