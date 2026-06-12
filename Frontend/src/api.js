const API_URL = "http://localhost:5000/api";

export const api = {
  // Books
  getBooks: async () => {
    const res = await fetch(`${API_URL}/books`);
    if (!res.ok) throw new Error("Failed to fetch books");
    return res.json();
  },
  
  getBook: async (id) => {
    const res = await fetch(`${API_URL}/books/${id}`);
    if (!res.ok) throw new Error("Failed to fetch book details");
    return res.json();
  },
  
  uploadBook: async (file, title) => {
    const formData = new FormData();
    formData.append("book", file);
    if (title) formData.append("title", title);
    
    const res = await fetch(`${API_URL}/books/uploads`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Failed to upload book");
    return res.json();
  },
  
  generateBookContent: async (bookId, mode) => {
    const res = await fetch(`${API_URL}/books/generate/${bookId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });
    if (!res.ok) throw new Error("Failed to generate content");
    return res.json();
  },

  deleteBook: async (bookId) => {
    const res = await fetch(`${API_URL}/books/${bookId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete book");
    return res.json();
  },

  // Conversations
  getChapterConversations: async (chapterId) => {
    const res = await fetch(`${API_URL}/conversation/chapter/${chapterId}`);
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return res.json();
  },

  generateChapterConversation: async (chapterId, mode, language, difficulty) => {
    const res = await fetch(`${API_URL}/conversation/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId, mode, language, difficulty }),
    });
    if (!res.ok) throw new Error("Failed to generate conversation");
    return res.json();
  },

  // Tutor
  askTutor: async (chapterId, question) => {
    const res = await fetch(`${API_URL}/tutor/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterId, question }),
    });
    if (!res.ok) throw new Error("Failed to ask tutor");
    return res.json();
  },

  // Audio
  generateAudio: async (conversationId) => {
    const res = await fetch(`${API_URL}/audio/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId }),
    });
    if (!res.ok) throw new Error("Failed to generate audio");
    return res.json();
  }
};
