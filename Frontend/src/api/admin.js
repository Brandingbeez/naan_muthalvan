import api from './client'

export const adminLogin = (data) => api.post('/admin/auth/login', data)

export const getCenters = () => api.get('/admin/centers')
export const createCenter = (data) => api.post('/admin/centers', data)
export const updateCenter = (id, data) => api.put(`/admin/centers/${id}`, data)
export const deleteCenter = (id) => api.delete(`/admin/centers/${id}`)

export const getCourses = () => api.get('/admin/courses')
export const createCourse = (data) => api.post('/admin/courses', data)
export const updateCourse = (id, data) => api.put(`/admin/courses/${id}`, data)
export const deleteCourse = (id) => api.delete(`/admin/courses/${id}`)

export const getSubjects = () => api.get('/admin/subjects')
export const createSubject = (data) => api.post('/admin/subjects', data)
export const updateSubject = (id, data) => api.put(`/admin/subjects/${id}`, data)
export const deleteSubject = (id) => api.delete(`/admin/subjects/${id}`)

export const getSessions = () => api.get('/admin/sessions')
export const createSession = (data) => api.post('/admin/sessions', data)
export const updateSession = (id, data) => api.put(`/admin/sessions/${id}`, data)
export const deleteSession = (id) => api.delete(`/admin/sessions/${id}`)

export const getResources = () => api.get('/admin/resources')
export const createResource = (data) => api.post('/admin/resources', data)
export const uploadFileResource = (sessionId, file, title, description) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('sessionId', sessionId)
  formData.append('title', title)
  formData.append('description', description)
  return api.post('/admin/resources/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const uploadYoutubeResource = (sessionId, youtubeUrl, title, description) => 
  api.post('/admin/resources/youtube', {
    sessionId,
    youtubeUrl,
    title,
    description
  })
export const updateResource = (id, data) => api.put(`/admin/resources/${id}`, data)
export const deleteResource = (id) => api.delete(`/admin/resources/${id}`)

export const publishCourse = (courseCode) => api.post(`/admin/nm/publish/${courseCode}`)
export const getNmCourses = () => api.get('/admin/nm/courses')

export const getAuditLogs = (params) => api.get('/admin/audit', { params })