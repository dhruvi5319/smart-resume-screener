import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Candidate } from "@/types";
import { useNavigate } from "react-router-dom";

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
}

const CandidateCard = ({ candidate, onViewDetails }: CandidateCardProps) => {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/candidate/${candidate.id}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success-600";
    if (score >= 60) return "text-warning-600";
    return "text-destructive";
  };

  const skills = candidate.skills ?? [];
  // const strengths = candidate.strengths ?? [];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{candidate.name}</CardTitle>
          <span className={`text-2xl font-bold ${getScoreColor(candidate.matchScore)}`}>
            {candidate.matchScore}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Education</h4>
            <p className="mt-1">{candidate.education}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Key Skills</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.slice(0, 5).map((skill) => (
                <Badge key={skill.name} variant={skill.isMatch ? "default" : "outline"}>
                  {skill.name}
                </Badge>
              ))}
              {skills.length > 5 && (
                <Badge variant="secondary">+{skills.length - 5}</Badge>
              )}
            </div>
          </div>

          {/* <div>
            <h4 className="text-sm font-medium text-gray-500">Strengths</h4>
            <ul className="mt-1 text-sm pl-5 list-disc">
              {strengths.slice(0, 2).map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
              {strengths.length > 2 && <li>...</li>}
            </ul>
          </div> */}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Button
          onClick={handleViewDetails}
          className="w-full"
          variant="outline"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;