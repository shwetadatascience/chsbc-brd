import api from './api';

export const createSession = async () => {
  try {
    const response = await api.post('/create/session'); // adjust endpoint as needed
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

//service to upload prod specs file
export const uploadProductSpecsFile = async (file: File, sessionId: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/create/support-data?session_id=${sessionId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

//service to get inital Outline
export const getInitialOutline = async (sessionId: string) => {
  const response = await api.get(`/create/template?session_id=${sessionId}`);
  return response.data;
};

//service to generate sections by sections
export const generateIndividualSection = async (sectionId: string, sessionId: string) => {
  try {
    const response = await api.post(`/generate/section/${sectionId}?session_id=${sessionId}`);

    return response.data; // assuming it returns { content: '...' }
  } catch (error) {
    console.error('Error generating section:', error);
    throw error;
  }
};

//service to download pdf file
export const downloadPdfDocument = async (sessionId: string) => {
  const response = await api.get(`/download/pdf/${sessionId}`, {
    responseType: "blob",
  });
  return response.data;
};

//service to download word file
export const downloadWordDocument = async (sessionId: string) => {
  const response = await api.get(`/edit/document/?session_id=${sessionId}`, {
    responseType: "blob",
  });
  return response.data;
};
