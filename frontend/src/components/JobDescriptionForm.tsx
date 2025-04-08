import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobDescription } from "@/types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { uploadResume, saveJobDescription } from "@/services/api";

interface JobDescriptionFormProps {
  onSubmit: (job: Omit<JobDescription, "id" | "createdAt">) => void;
}

const JobDescriptionForm = ({ onSubmit }: JobDescriptionFormProps) => {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const { toast } = useToast();

  const handleUpload = async (file: File, jobDescriptionId: number) => {
    try {
      await uploadResume(file, jobDescriptionId);
      console.log("Resume uploaded to backend.");
    } catch (error) {
      console.error("Error uploading resume:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !skills) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const jobDescription = {
      title,
      department,
      description,
      location,
      requiredSkills: skills.split(",").map((skill) => skill.trim()),
    };
    console.log("📤 Saving job description:", jobDescription);

    try {
      await saveJobDescription(jobDescription);
      toast({
        title: "Job description saved",
        description: "Your job description has been saved successfully.",
      });
      onSubmit(jobDescription); // trigger job list refresh if needed

      // Reset form
      setTitle("");
      setDepartment("");
      setDescription("");
      setLocation("");
      setSkills("");
    } catch (error) {
      toast({
        title: "Error saving job",
        description: "Something went wrong while saving. Try again.",
        variant: "destructive",
      });
      console.error("Error saving job:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Engineering"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote, New York, NY"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Required Skills *</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js"
              required
            />
            <p className="text-xs text-gray-500">
              Separate skills with commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter the full job description here..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save Job Description</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionForm;
