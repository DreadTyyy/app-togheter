import { json } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_APP_BASEURL;

const putAccessToken = (token) => {
  return localStorage.setItem("token", token);
};

const getAccessToken = () => {
  return localStorage.getItem("token");
};

const fetchWithToken = async (url, options = {}) => {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
};

const login = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/Json",
    },
    body: JSON.stringify({ email, password }),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    alert(responseJson.message);
    return { error: true, token: null };
  }
  return { error: false, token: responseJson.token };
};

const register = async ({ username, password, email }) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/Json",
    },
    body: JSON.stringify({ username, password, email }),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    alert(responseJson.message);
    return { error: true };
  }
  return { error: false };
};

const getUserLogged = async () => {
  const response = await fetchWithToken(`${BASE_URL}/users/me`);
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    return { error: true, username: null };
  }
  return { error: false, username: responseJson.username };
};

const getQuestions = async () => {
  const response = await fetch(`${BASE_URL}/questions`);
  const responseJson = await response.json();

  if (responseJson.status !== "success") {
    return { error: true, data: [] };
  }
  return { error: false, data: responseJson.data };
};

const getDetailQuestion = async (id) => {
  const response = await fetch(`${BASE_URL}/question/${id}`);
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    return { error: true, data: null };
  }
  return { error: false, data: responseJson.data };
};

const addQuestion = async ({ title }) => {
  const response = await fetchWithToken(`${BASE_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/Json",
    },
    body: JSON.stringify({ title }),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    return { error: true, message: responseJson.message };
  }
  return { error: false, message: responseJson.message };
};

const addAnswer = async ({ id_question, body }) => {
  const response = await fetchWithToken(`${BASE_URL}/questions/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/Json",
    },
    body: JSON.stringify({ id_question, body }),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    alert(responseJson.message);
    return { error: true, data: null };
  }
  return { error: false, data: responseJson.data };
};

const getBlogs = async () => {
  const response = await fetch(`${BASE_URL}/blogs`);
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    return { error: true, data: [] };
  }
  return { error: false, data: responseJson.data };
};

const addBlog = async ({ title, body }) => {
  const response = await fetchWithToken(`${BASE_URL}/blogs`, {
    method: "POST",
    headers: {
      "Content-Type": "Application/Json",
    },
    body: JSON.stringify({ title, body }),
  });
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    return { error: true, message: responseJson.message };
  }
  return { error: false, message: responseJson.message };
};

const getDetailBlog = async ({ id }) => {
  const response = await fetch(`${BASE_URL}/blogs/${id}`);
  const responseJson = await response.json();
  if (responseJson.status !== "success") {
    return { error: true, data: [] };
  }
  return { error: false, data: responseJson.data };
};

export {
  getAccessToken,
  putAccessToken,
  login,
  register,
  getUserLogged,
  getQuestions,
  getDetailQuestion,
  addQuestion,
  addAnswer,
  getBlogs,
  getDetailBlog,
  addBlog,
};
