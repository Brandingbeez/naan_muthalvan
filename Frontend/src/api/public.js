import api from './client'

export const getCenters = () => api.get('/centers')
export const getCourses = (centerId) => api.get(`/centers/${centerId}/courses`)
export const getCourse = (courseCode) => api.get(`/courses/${courseCode}`)
export const getSubjects = (courseCode) => api.get(`/courses/${courseCode}/subjects`)
export const getSessions = (subjectId) => api.get(`/subjects/${subjectId}/sessions`)
export const getResources = (sessionId) => api.get(`/sessions/${sessionId}/resources`)