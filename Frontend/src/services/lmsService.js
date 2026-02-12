import { api } from "./api";

export async function listCourses(parentId = null) {
  const params = parentId ? { parentId } : {};
  const { data } = await api.get("/courses", { params });
  return data;
}

export async function getCourse(courseId) {
  const { data } = await api.get(`/courses/${courseId}`);
  return data;
}

export async function listSectionsByCourse(courseId) {
  const { data } = await api.get(`/sections/by-course/${courseId}`);
  return data;
}

export async function listSessionsBySection(sectionId) {
  const { data } = await api.get(`/sessions/by-section/${sectionId}`);
  return data;
}

export async function createCourse(payload) {
  const { data } = await api.post("/courses", payload);
  return data;
}

export async function createSection(payload) {
  const { data } = await api.post("/sections", payload);
  return data;
}

export async function createSession(payload) {
  const { data } = await api.post("/sessions", payload);
  return data;
}

export async function addContentToSession(sessionId, payload) {
  const { data } = await api.put(`/sessions/${sessionId}/add-content`, payload);
  return data;
}

export async function deleteCourse(courseId) {
  const { data } = await api.delete(`/courses/${courseId}`);
  return data;
}

export async function deleteSection(sectionId) {
  const { data } = await api.delete(`/sections/${sectionId}`);
  return data;
}

export async function deleteSession(sessionId) {
  const { data } = await api.delete(`/sessions/${sessionId}`);
  return data;
}

export async function deleteSessionContent(sessionId, type, contentId) {
  const { data } = await api.delete(`/sessions/${sessionId}/content/${type}/${contentId}`);
  return data;
}
