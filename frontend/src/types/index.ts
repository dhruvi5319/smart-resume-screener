
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
  email: string;
  phone: string;
  jobTitle: string;
  resumeId: string;
  matchScore: number;
  education: string[];
  summary: string;
  experience: string[];
  skills: Skill[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
