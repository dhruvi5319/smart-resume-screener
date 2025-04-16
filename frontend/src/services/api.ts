/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_URL } from "@/config";
import axios from "axios";



// 🔐 Helper to attach Bearer token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Upload resume with job description ID
export const uploadResume = async (file: File, jobDescriptionId: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobDescriptionId", jobDescriptionId); 

  try {
    const response = await axios.post(`${API_URL}/api/resumes/upload`, formData, {
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
    const response = await axios.post(`${API_URL}/api/job-descriptions`, data, {
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
    const response = await axios.get(`${API_URL}/api/job-descriptions`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch job descriptions:", error);
    throw error;
  }
};

// ✅ Fetch uploaded candidates for logged-in user
export const fetchCandidates = async () => {
  const headers = getAuthHeaders();
  console.log("🧾 Token being sent in header:", headers.Authorization);

  try {
    const response = await axios.get(`${API_URL}/api/resumes/candidates`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch candidates:", error);
    throw error;
  }
};
