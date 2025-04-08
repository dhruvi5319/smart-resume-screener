/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// 🔐 Helper to attach Bearer token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Upload resume with job description ID
export const uploadResume = async (file: File, jobDescriptionId: number) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobDescriptionId", jobDescriptionId.toString());

  try {
    const response = await axios.post(`${API_URL}/resumes/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...getAuthHeaders(),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Resume upload failed:", error);
    throw error;
  }
};

// ✅ Save job description
export const saveJobDescription = async (data: any) => {
  try {
    const response = await axios.post(`${API_URL}/job-descriptions`, data, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to save job description:", error);
    throw error;
  }
};

// ✅ Fetch job descriptions
export const fetchJobDescriptions = async () => {
  try {
    const response = await axios.get(`${API_URL}/job-descriptions`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch job descriptions:", error);
    throw error;
  }
};

// ✅ Fetch uploaded candidates
export const fetchCandidates = async () => {
  try {
    const response = await axios.get(`${API_URL}/resumes/all`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch candidates:", error);
    throw error;
  }
};
