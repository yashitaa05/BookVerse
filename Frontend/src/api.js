import client from './api/axios';

export const api = {
  register: async (payload) => {
    const { data } = await client.post('/auth/register', payload);
    return data;
  },

  login: async (payload) => {
    const { data } = await client.post('/auth/login', payload);
    return data;
  },

  me: async () => {
    const { data } = await client.get('/auth/me');
    return data;
  },

  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('document', file);

    const { data } = await client.post('/documents/upload', formData);

    return data;
  },

  getDocuments: async () => {
    const { data } = await client.get('/documents');
    return data;
  },

  saveTextDocument: async (title, text) => {
    const { data } = await client.post('/documents', { title, text });
    return data;
  },

  getDocument: async (id) => {
    const { data } = await client.get(`/documents/${id}`);
    return data;
  },

  deleteDocument: async (id) => {
    const { data } = await client.delete(`/documents/${id}`);
    return data;
  },

  getBooks: async () => {
    const { data } = await client.get('/books');
    return data;
  },

  getBook: async (id) => {
    const { data } = await client.get(`/books/${id}`);
    return data;
  },

  uploadBook: async (file, title) => {
    const formData = new FormData();
    formData.append('book', file);
    if (title) formData.append('title', title);

    const { data } = await client.post('/books/uploads', formData);

    return data;
  },

  generateBookContent: async (bookId, mode) => {
    const { data } = await client.post(`/books/generate/${bookId}`, { mode });
    return data;
  },

  deleteBook: async (bookId) => {
    const { data } = await client.delete(`/books/${bookId}`);
    return data;
  },

  getChapterConversations: async (chapterId) => {
    const { data } = await client.get(`/conversation/chapter/${chapterId}`);
    return data;
  },

  generateChapterConversation: async (chapterId, mode, language, difficulty) => {
    const { data } = await client.post('/conversation/generate', {
      chapterId,
      mode,
      language,
      difficulty,
    });
    return data;
  },

  askTutor: async (chapterId, question) => {
    const { data } = await client.post('/tutor/ask', {
      chapterId,
      question,
    });
    return data;
  },
};
