/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = "http://localhost:8080/api";

// ✅ Upload resume with job description ID
export const uploadResume = async (file: File, jobDescriptionId: number) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jobDescriptionId", jobDescriptionId.toString());

  try {
    const response = await axios.post(`${API_URL}/resumes/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Backend should return candidate object or filename
    return response.data; // This will be candidate object or string
  } catch (error) {
    console.error("Resume upload failed:", error);
    throw error;
  }
};

// ✅ Save job description
export const saveJobDescription = async (data: any) => {
  return await axios.post(`${API_URL}/job-descriptions`, data);
};

// ✅ Fetch job descriptions
export const fetchJobDescriptions = async () => {
  const response = await axios.get(`${API_URL}/job-descriptions`);
  return response.data;
};

// ✅ Fetch uploaded candidates
export const fetchCandidates = async () => {
  const response = await axios.get(`${API_URL}/resumes/all`);
  return response.data;
};
