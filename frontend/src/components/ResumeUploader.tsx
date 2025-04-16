import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { JobDescription, Candidate } from "@/types";
import { uploadResume } from "@/services/api";

interface ResumeUploaderProps {
  jobDescriptions?: JobDescription[];
  onUploadSuccess: (candidate: Candidate) => void;
}

const ResumeUploader = ({ jobDescriptions = [], onUploadSuccess }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) validateAndSetFile(files[0]);
  }, []);

  const validateAndSetFile = (file: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file", description: "Please upload a PDF or DOCX", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 5MB", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) validateAndSetFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    if (!selectedFile || !selectedJob) {
      toast({
        title: "Missing Information",
        description: "Please upload a resume and select a job.",
        variant: "destructive",
      });
      return;
    }

    try {
      const candidate = await uploadResume(selectedFile, String(selectedJob.id));
      toast({ title: "Upload Successful", description: "Candidate analyzed successfully." });
      onUploadSuccess(candidate);
      setSelectedFile(null);
    } catch (error) {
      toast({ title: "Upload Failed", description: "Something went wrong.", variant: "destructive" });
      console.error("Upload failed:", error);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-md">
      <CardHeader><CardTitle>Upload Resume</CardTitle></CardHeader>
      <CardContent>
        <div
          className={`drop-zone ${isDragging ? "active" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleFileInputChange}
          />
          {selectedFile ? (
            <div className="text-center">
              <p>{selectedFile.name}</p>
              <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Drop or select a resume file</p>
          )}
        </div>

        {jobDescriptions.length > 0 && (
          <div className="mt-6">
            <Label>Select Job Description</Label>
            <Select onValueChange={(value) => {
              const job = jobDescriptions.find(j => j.id.toString() === value);
              setSelectedJob(job || null);
            }}>
              <SelectTrigger><SelectValue placeholder="Choose a job" /></SelectTrigger>
              <SelectContent>
                {jobDescriptions.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.title} - {job.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedFile && (
          <div className="mt-6 text-right">
            <Button onClick={handleUploadClick}>Upload Resume</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
