import api from '@/lib/axios';

export const lessonService = {
  getLessons: async (params = {}) => {
    const { data } = await api.get('/api/lessons', { params });
    return data;
  },

  getLesson: async (id) => {
    const { data } = await api.get(`/api/lessons/${id}`);
    return data;
  },

  createLesson: async (formData) => {
    const { data } = await api.post('/api/lessons', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updateLesson: async (id, formData) => {
    const { data } = await api.patch(`/api/lessons/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteLesson: async (id) => {
    const { data } = await api.delete(`/api/lessons/${id}`);
    return data;
  },

  toggleLike: async (id) => {
    const { data } = await api.patch(`/api/lessons/${id}/like`);
    return data;
  },

  getMyLessons: async () => {
    const { data } = await api.get('/api/lessons/my/all');
    return data;
  },

  getRelated: async (id) => {
    const { data } = await api.get(`/api/lessons/${id}/related`);
    return data;
  },

  getFeatured: async () => {
    const { data } = await api.get('/api/lessons/featured');
    return data;
  },

  getTopContributors: async () => {
    const { data } = await api.get('/api/lessons/top-contributors');
    return data;
  },

  getMostSaved: async () => {
    const { data } = await api.get('/api/lessons/most-saved');
    return data;
  },
};

export const favoriteService = {
  toggle: async (lessonId) => {
    const { data } = await api.post('/api/favorites', { lessonId });
    return data;
  },

  remove: async (id) => {
    const { data } = await api.delete(`/api/favorites/${id}`);
    return data;
  },

  getMyFavorites: async () => {
    const { data } = await api.get('/api/favorites');
    return data;
  },
};

export const commentService = {
  add: async (lessonId, text) => {
    const { data } = await api.post('/api/comments', { lessonId, text });
    return data;
  },

  getByLesson: async (lessonId, params = {}) => {
    const { data } = await api.get(`/api/comments/${lessonId}`, { params });
    return data;
  },
};

export const reportService = {
  report: async (lessonId, reason) => {
    const { data } = await api.post('/api/reports', { lessonId, reason });
    return data;
  },
};

export const adminService = {
  getStats: async () => {
    const { data } = await api.get('/api/admin/stats');
    return data;
  },

  getUsers: async (params = {}) => {
    const { data } = await api.get('/api/admin/users', { params });
    return data;
  },

  updateUser: async (id, body) => {
    const { data } = await api.patch(`/api/admin/users/${id}`, body);
    return data;
  },

  deleteUser: async (id) => {
    const { data } = await api.delete(`/api/admin/users/${id}`);
    return data;
  },

  blockUser: async (id, { isBlocked, blockedUntil }) => {
    const { data } = await api.patch(`/api/admin/users/${id}`, { isBlocked, blockedUntil });
    return data;
  },

  unblockUser: async (id) => {
    const { data } = await api.patch(`/api/admin/users/${id}`, { isBlocked: false, blockedUntil: null });
    return data;
  },

  getLessons: async (params = {}) => {
    const { data } = await api.get('/api/admin/lessons', { params });
    return data;
  },

  toggleFeature: async (id) => {
    const { data } = await api.patch(`/api/admin/lessons/${id}/feature`);
    return data;
  },

  reviewLesson: async (id) => {
    const { data } = await api.patch(`/api/admin/lessons/${id}/review`);
    return data;
  },

  deleteLesson: async (id) => {
    const { data } = await api.delete(`/api/admin/lessons/${id}`);
    return data;
  },

  getReports: async (params = {}) => {
    const { data } = await api.get('/api/reports', { params });
    return data;
  },

  deleteReport: async (id) => {
    const { data } = await api.delete(`/api/reports/${id}`);
    return data;
  },
};

export const paymentService = {
  createCheckout: async () => {
    const { data } = await api.post('/api/payment/create-checkout-session');
    return data;
  },
};

export const userService = {
  updateProfile: async (name, photoURL) => {
    const { data } = await api.put('/api/users/profile', { name, photoURL });
    return data;
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/api/upload/image?folder=avatars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  getSessions: async () => {
    const { data } = await api.get('/api/users/sessions');
    return data;
  },
  revokeSession: async (id) => {
    const { data } = await api.delete(`/api/users/sessions/${id}`);
    return data;
  },
};
