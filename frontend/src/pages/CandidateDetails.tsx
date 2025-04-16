import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Candidate } from "@/types";
import { fetchCandidates } from "@/services/api";
import MatchScoreChart from "@/components/MatchScoreChart";
import SkillsChart from "@/components/SkillsChart";
import { Button } from "@/components/ui/button";

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const loadCandidate = async () => {
      const allCandidates = await fetchCandidates();
      const selected = allCandidates.find((c) => c.id.toString() === id);
      setCandidate(selected || null);
    };

    loadCandidate();
  }, [id]);

  if (!candidate) return <p className="text-center mt-10">Candidate not found</p>;

  const { matchScore, skills, education, experience, summary } = candidate;

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        ← Back
      </Button>

      <h1 className="text-2xl font-bold mb-4">{candidate.name}'s Details</h1>

      {/* Chart section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <MatchScoreChart score={matchScore} />
        <SkillsChart skills={skills} />
      </div>

      {/* AI Resume Summary */}
      {candidate.summary && (
         <div className="mb-6">
            <h3 className="text-lg font-bold text-indigo-700 mb-2">AI Summary</h3>
            <p className="text-gray-700 whitespace-pre-line">{candidate.summary}</p>
         </div>
       )
      }

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-indigo-700">Education</h2>
            <p>{education}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-700">Experience</h2>
            <ul className="list-disc pl-6 space-y-1">
              {experience?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        
      </div>
    </div>
  );
};

export default CandidateDetails;
