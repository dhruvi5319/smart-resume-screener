
export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
  password?: string;
}

export interface Resume {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  fileType: string;
  url?: string;
}

export interface JobDescription {
  id: number;
  title: string;
  department: string;
  description: string;
  requiredSkills: string[];
  location: string;
  createdAt: Date;
}

export interface Skill {
  name: string;
  score: number;
  isMatch: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  resumeId: string;
  jobTitle?: string;  // Added jobTitle field
  skills: Skill[];
  experience: string[];
  strengths: string[];
  weaknesses: string[];
  education: string;
  email?: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
