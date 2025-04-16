import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ResumeUploader from "@/components/ResumeUploader";
import JobDescriptionForm from "@/components/JobDescriptionForm";
import CandidateCard from "@/components/CandidateCard";
import {
  fetchCandidates,
  fetchJobDescriptions,
  saveJobDescription,
} from "@/services/api";
import { Candidate, JobDescription as JobDescriptionType } from "@/types";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("candidates");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobDescriptions, setJobDescriptions] = useState<JobDescriptionType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [newlyAddedCandidate, setNewlyAddedCandidate] = useState<Candidate | null>(null);

  const candidatesPerPage = 6;
  const { toast } = useToast();
  const navigate = useNavigate();

  const jobTitles = useMemo(() => {
    const titles = new Set(candidates.map((c) => c.jobTitle).filter(Boolean));
    return Array.from(titles);
  }, [candidates]);

  useEffect(() => {
    const loadInitialData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("🚫 No token found. Redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const jobs = await fetchJobDescriptions();
        const fetchedCandidates = await fetchCandidates();
        setJobDescriptions(jobs);
        setCandidates(fetchedCandidates);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("❌ Failed to load data:", error);
        if (error?.response?.status === 403) {
          toast({
            title: "Access Denied",
            description: "Please log in again.",
            variant: "destructive",
          });
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    loadInitialData();
  }, [navigate, toast]);

  const handleCandidateAdd = (candidate: Candidate) => {
    setCandidates((prev) => [...prev, candidate]);
    setNewlyAddedCandidate(candidate);
    setActiveTab("candidate-result");
  };

  const handleJobDescriptionSubmit = async (
    jobDesc: Omit<JobDescriptionType, "id" | "createdAt">
  ) => {
    try {
      const response = await saveJobDescription(jobDesc);
      const savedJob = response.data;
      setJobDescriptions((prev) => [...prev, savedJob]);
      console.log("✅ Saved job description:", savedJob);
    } catch (error) {
      toast({
        title: "Failed to save job description",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (c) =>
        c.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
        c.matchScore >= minScore
    );
  }, [candidates, searchTerm, minScore]);

  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  const paginatedCandidates = useMemo(() => {
    const startIdx = (currentPage - 1) * candidatesPerPage;
    const endIdx = startIdx + candidatesPerPage;
    return filteredCandidates.slice(startIdx, endIdx);
  }, [filteredCandidates, currentPage]);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [searchTerm, minScore]);

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <TabsList className="bg-indigo-100">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            <TabsTrigger value="job">Job Description</TabsTrigger>
            {newlyAddedCandidate && (
              <TabsTrigger value="candidate-result">Latest Result</TabsTrigger>
            )}
          </TabsList>

          {activeTab === "candidates" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Search by Job Title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
              <Input
                type="number"
                min={0}
                max={100}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                placeholder="Min Match Score"
                className="max-w-xs"
              />
            </div>
          )}
        </div>

        <TabsContent value="candidates">
          {paginatedCandidates.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onViewDetails={() => {}}
                  />
                ))}
              </div>

              <div className="flex justify-center items-center mt-6 space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                >
                  ⬅ Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
                >
                  Next ➡
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">No candidates match the filter.</p>
          )}
        </TabsContent>

        <TabsContent value="upload">
          <ResumeUploader
            jobDescriptions={jobDescriptions}
            onUploadSuccess={handleCandidateAdd}
          />
        </TabsContent>

        <TabsContent value="job">
          <JobDescriptionForm onSubmit={handleJobDescriptionSubmit} />
        </TabsContent>

        <TabsContent value="candidate-result">
          {newlyAddedCandidate && (
            <CandidateCard
              candidate={newlyAddedCandidate}
              onViewDetails={() => {}}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
