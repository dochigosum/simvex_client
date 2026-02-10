import apiCall from './api';

/**
 * 프로젝트 생성
 * POST /project
 */
export const createProject = async (projectData) => {
  const response = await apiCall('/project', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
  return response;
};

/**
 * 프로젝트 목록 조회
 * GET /project?user_id={userId}
 */
export const getProjects = async (userId) => {
  const response = await apiCall(`/project?user_id=${userId}`, {
    method: 'GET',
  });
  return response;
};

/**
 * 프로젝트 상세 조회
 * GET /project/{projectName}/detail
 */
export const getProjectDetail = async (projectName) => {
  const response = await apiCall(`/project/${projectName}/detail`, {
    method: 'GET',
  });
  return response;
};

/**
 * 프로젝트 이름 변경
 * PATCH /project/{projectName}/rename
 */
export const renameProject = async (projectName, newName) => {
  const response = await apiCall(`/project/${projectName}/rename`, {
    method: 'PATCH',
    body: JSON.stringify({ new_name: newName }),
  });
  return response;
};

/**
 * 프로젝트 삭제
 * DELETE /project/{projectName}/delete
 */
export const deleteProject = async (projectName) => {
  const response = await apiCall(`/project/${projectName}/delete`, {
    method: 'DELETE',
  });
  return response;
};

/**
 * 프로젝트에 부품 추가
 * POST /project/{projectName}/part/{partId}
 */
export const addPartToProject = async (projectName, partId) => {
  const response = await apiCall(`/project/${projectName}/part/${partId}`, {
    method: 'POST',
  });
  return response;
};

/**
 * 프로젝트 저장 (3D 모델 저장)
 * PUT /project/{projectName}/store
 */
export const saveProjectModel = async (projectName, partInfo, saveImage) => {
  const formData = new FormData();
  formData.append('partInfo', JSON.stringify(partInfo));
  
  if (saveImage) {
    formData.append('saveImage', saveImage);
  }
  
  const response = await apiCall(`/project/${projectName}/store`, {
    method: 'PUT',
    body: formData,
  });
  return response;
};
