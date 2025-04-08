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

  return (
    <div className="container mx-auto p-6">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        ← Back
      </Button>

      <h1 className="text-2xl font-bold mb-4">{candidate.name}'s Details</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <MatchScoreChart score={candidate.matchScore} />
        <SkillsChart skills={candidate.skills} />
      </div>
    </div>
  );
};

export default CandidateDetails;
