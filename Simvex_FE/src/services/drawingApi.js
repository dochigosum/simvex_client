import apiCall from './api';

/**
 * 조립도 목록 조회
 * GET /drawing_template
 */
export const getDrawingTemplates = async () => {
  const response = await apiCall('/drawing_template', {
    method: 'GET',
  });
  return response;
};

/**
 * 조립도별 부품 목록 조회
 * GET /drawing_template/{drawingTemplateId}/part
 */
export const getDrawingParts = async (drawingTemplateId) => {
  const response = await apiCall(`/drawing_template/${drawingTemplateId}/part`, {
    method: 'GET',
  });
  return response;
};
