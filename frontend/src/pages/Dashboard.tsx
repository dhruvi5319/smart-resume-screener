
import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescriptionForm from "@/components/JobDescriptionForm";
import CandidateCard from "@/components/CandidateCard";
import MatchScoreChart from "@/components/MatchScoreChart";
import SkillsChart from "@/components/SkillsChart";
import { Candidate, JobDescription as JobDescriptionType, Skill } from "@/types";

const generateMockCandidate = (id: number): Candidate => {
  const skills: Skill[] = [
    { name: "JavaScript", score: 90 + Math.random() * 10, isMatch: true },
    { name: "React", score: 85 + Math.random() * 15, isMatch: true },
    { name: "TypeScript", score: 75 + Math.random() * 20, isMatch: true },
    { name: "HTML/CSS", score: 80 + Math.random() * 20, isMatch: true },
    { name: "Node.js", score: 60 + Math.random() * 30, isMatch: true },
    { name: "GraphQL", score: 40 + Math.random() * 40, isMatch: false },
    { name: "Python", score: 30 + Math.random() * 50, isMatch: false },
    { name: "SQL", score: 60 + Math.random() * 40, isMatch: true },
  ];

  const jobTitles = [
    "Frontend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "DevOps Engineer",
    "Data Scientist",
    "Project Manager",
    "QA Engineer",
    "Backend Developer"
  ];

  return {
    id: `candidate-${id}`,
    name: [
      "John Smith",
      "Emily Johnson",
      "Michael Williams",
      "Jessica Brown",
      "David Jones",
      "Sarah Miller",
      "Robert Davis",
      "Jennifer Wilson",
    ][id % 8],
    matchScore: Math.floor(60 + Math.random() * 35),
    resumeId: `resume-${id}`,
    jobTitle: jobTitles[id % jobTitles.length],
    skills,
    experience: [
      "5 years as Senior Frontend Developer at Tech Co.",
      "3 years as Web Developer at Startup Inc.",
      "Freelance Developer for various clients",
    ],
    strengths: [
      "Strong problem-solving abilities",
      "Excellent communication skills",
      "Team leadership experience",
      "Proactive learner with adaptability",
    ],
    weaknesses: [
      "Limited experience with backend technologies",
      "No formal project management certification",
    ],
    education: ["Bachelor's in Computer Science, State University", "Full Stack Web Development Bootcamp"][
      id % 2
    ],
    email: `candidate${id}@example.com`,
    phone: `(555) 123-${4000 + id}`,
  };
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [candidates, setCandidates] = useState<Candidate[]>([
    generateMockCandidate(1),
    generateMockCandidate(2),
    generateMockCandidate(3),
    generateMockCandidate(4),
    generateMockCandidate(5),
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescriptionType[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState<string>("");
  const [scoreFilter, setScoreFilter] = useState<number[]>([0]);
  const [newlyAddedCandidate, setNewlyAddedCandidate] = useState<Candidate | null>(null);
  
  const { toast } = useToast();

  const jobTitles = useMemo(() => {
    const titles = new Set(candidates.map(c => c.jobTitle).filter(Boolean));
    return Array.from(titles);
  }, [candidates]);

  const handleResumeUpload = (file: File, jobDescriptionId: string) => {
    // Find the job description to match against
    const matchingJobDesc = jobDescriptionId 
      ? jobDescriptions.find(j => j.id === jobDescriptionId)
      : jobDescriptions.length > 0 ? jobDescriptions[0] : null;
    
    // Generate a new candidate with potentially higher match score if there's a job description
    const matchBoost = matchingJobDesc ? 10 : 0; // Higher match if matched against a job
    const newCandidate = {
      ...generateMockCandidate(candidates.length + 1),
      matchScore: Math.min(95, Math.floor(65 + Math.random() * 25) + matchBoost)
    };
    
    setCandidates([...candidates, newCandidate]);
    setNewlyAddedCandidate(newCandidate);
    
    toast({
      title: "Resume processed",
      description: "The AI has analyzed the resume and added it to your candidates.",
    });
    
    // Switch to the candidates tab and show the newly added candidate
    setActiveTab("candidate-result");
  };

  const handleJobDescriptionSubmit = (jobDesc: Omit<JobDescriptionType, "id" | "createdAt">) => {
    const newJobDesc = {
      ...jobDesc,
      id: `job-${jobDescriptions.length + 1}`,
      createdAt: new Date(),
    };
    
    setJobDescriptions([...jobDescriptions, newJobDesc]);
    
    toast({
      title: "Job description processed",
      description: "The AI is now using this job description to match candidates.",
    });
  };

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailsOpen(true);
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const nameMatch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const jobMatch = !jobTitleFilter || candidate.jobTitle === jobTitleFilter;
      
      const scoreMatch = candidate.matchScore >= scoreFilter[0];
      
      return nameMatch && jobMatch && scoreMatch;
    });
  }, [candidates, searchTerm, jobTitleFilter, scoreFilter]);

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="bg-indigo-100">
            <TabsTrigger value="candidates" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Candidates</TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Upload Resume</TabsTrigger>
            <TabsTrigger value="job" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Job Description</TabsTrigger>
            {newlyAddedCandidate && (
              <TabsTrigger value="candidate-result" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">Latest Result</TabsTrigger>
            )}
          </TabsList>
          
          {activeTab === "candidates" && (
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs border-indigo-200 focus:border-indigo-400"
              />
            </div>
          )}
        </div>

        <TabsContent value="candidates" className="mt-6">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">Matched Candidates</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Label htmlFor="job-filter" className="mb-2 block text-indigo-700">Filter by Job Title</Label>
              <Select value={jobTitleFilter} onValueChange={setJobTitleFilter}>
                <SelectTrigger id="job-filter" className="border-indigo-200">
                  <SelectValue placeholder="All Job Titles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-jobs">All Job Titles</SelectItem>
                  {jobTitles.map((title) => (
                    <SelectItem key={title} value={title}>{title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-2/3">
              <Label className="mb-2 block text-indigo-700">Minimum Match Score: {scoreFilter[0]}%</Label>
              <Slider
                defaultValue={[0]}
                max={100}
                step={5}
                value={scoreFilter}
                onValueChange={setScoreFilter}
                className="py-4"
              />
            </div>
          </div>
          
          {filteredCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-indigo-100">
              <h3 className="text-xl font-medium text-indigo-700">No candidates found</h3>
              <p className="text-gray-500 mt-2">
                {candidates.length > 0 
                  ? "Try adjusting your filters to see more results." 
                  : "Upload some resumes to see matched candidates here."}
              </p>
              {candidates.length === 0 && (
                <Button
                  onClick={() => setActiveTab("upload")}
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                >
                  Upload Resume
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">Upload Resume</h2>
          <div className="max-w-2xl mx-auto">
            <ResumeUploader onUpload={handleResumeUpload} jobDescriptions={jobDescriptions} />
          </div>
        </TabsContent>
        
        <TabsContent value="candidate-result" className="mt-6">
          {newlyAddedCandidate && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-indigo-800">Analysis Results</h2>
              <div className="bg-white p-6 rounded-lg shadow-md border border-indigo-100">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <h3 className="text-xl font-bold text-indigo-700 mb-4">{newlyAddedCandidate.name}</h3>
                    <p className="mb-2 text-gray-600">{newlyAddedCandidate.jobTitle}</p>
                    <p className="mb-4 text-gray-600">{newlyAddedCandidate.email}</p>
                    <MatchScoreChart score={newlyAddedCandidate.matchScore} />
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-4">Skills Assessment</h3>
                    <SkillsChart skills={newlyAddedCandidate.skills} />
                    
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-indigo-600 mb-2">Key Strengths</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {newlyAddedCandidate.strengths.map((strength, index) => (
                            <li key={index} className="text-gray-700">{strength}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-indigo-600 mb-2">Areas for Improvement</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {newlyAddedCandidate.weaknesses.map((weakness, index) => (
                            <li key={index} className="text-gray-700">{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-4">
                  <Button 
                    variant="outline"
                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                    onClick={() => setActiveTab("candidates")}
                  >
                    View All Candidates
                  </Button>
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handleViewDetails(newlyAddedCandidate)}
                  >
                    View Full Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="job" className="mt-6">
          <h2 className="text-2xl font-bold mb-6 text-indigo-800">Job Description</h2>
          <div className="max-w-2xl mx-auto">
            <JobDescriptionForm onSubmit={handleJobDescriptionSubmit} />
          </div>
          
          {jobDescriptions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">Saved Job Descriptions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobDescriptions.map((job) => (
                  <div key={job.id} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-lg text-indigo-700">{job.title}</h4>
                    <p className="text-sm text-gray-500 mb-2">{job.department} • {job.location}</p>
                    <p className="text-sm mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.requiredSkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                          +{job.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      Created: {job.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-indigo-100">
          {selectedCandidate && (
            <>
              <DialogHeader className="relative">
                <DialogTitle className="text-2xl text-indigo-800">{selectedCandidate.name}</DialogTitle>
                <DialogDescription>
                  {selectedCandidate.jobTitle && (
                    <span className="font-medium text-indigo-600">{selectedCandidate.jobTitle} • </span>
                  )}
                  {selectedCandidate.email} • {selectedCandidate.phone}
                </DialogDescription>
                <DialogClose className="absolute right-0 top-0 rounded-full p-2 text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <MatchScoreChart score={selectedCandidate.matchScore} />
                </div>
                <div>
                  <SkillsChart skills={selectedCandidate.skills} />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-medium text-lg text-indigo-700 mb-2">Experience</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedCandidate.experience.map((exp, index) => (
                      <li key={index}>{exp}</li>
                    ))}
                  </ul>
                  
                  <h3 className="font-medium text-lg mt-4 text-indigo-700 mb-2">Education</h3>
                  <p>{selectedCandidate.education}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-lg text-indigo-700 mb-2">Strengths</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedCandidate.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                  
                  <h3 className="font-medium text-lg mt-4 text-indigo-700 mb-2">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedCandidate.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-4">
                <Button variant="outline" className="border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                  Download Resume
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  Contact Candidate
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
