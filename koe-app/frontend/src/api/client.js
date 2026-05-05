const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  getPosts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/posts${q ? '?' + q : ''}`);
  },
  getPost: (id) => request(`/posts/${id}`),
  createPost: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  resonatePost: (id) => request(`/posts/${id}/resonate`, { method: 'POST' }),
  getComments: (postId) => request(`/posts/${postId}/comments`),
  createComment: (data) => request('/comments', { method: 'POST', body: JSON.stringify(data) }),
  getUser: (id) => request(`/users/${id}`),
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
  getToday: () => request('/today'),
  getTimecapsules: () => request('/timecapsules'),
  createTimecapsule: (data) => request('/timecapsules', { method: 'POST', body: JSON.stringify(data) }),
  getPopularTags: () => request('/tags/popular'),
};

export const currentUser = {
  id: '1', name: 'みお', username: 'mio_98',
  era: '1998年生まれ', ageLabel: '26歳', birthYear: 1998,
};
