
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { JobDescription } from "@/types";

interface ResumeUploaderProps {
  onUpload: (file: File, jobDescriptionId: string) => void;
  jobDescriptions?: JobDescription[];
}

const ResumeUploader = ({ onUpload, jobDescriptions = [] }: ResumeUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        validateAndSetFile(file);
      }
    },
    []
  );

  const validateAndSetFile = (file: File) => {
    // Check file type
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      if (!selectedJobId && jobDescriptions.length > 0) {
        toast({
          title: "Select a job description",
          description: "Please select a job description to compare the resume against.",
          variant: "destructive",
        });
        return;
      }

      onUpload(selectedFile, selectedJobId);
      toast({
        title: "Resume uploaded",
        description: `${selectedFile.name} has been uploaded successfully.`,
      });
      setSelectedFile(null);
    }
  };

  return (
    <Card className="w-full bg-gradient-to-br from-white to-blue-50 border-blue-100 shadow-md">
      <CardHeader className="border-b border-blue-100">
        <CardTitle className="text-2xl text-indigo-700">Upload Resume</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div
          className={`drop-zone ${isDragging ? "active" : ""} ${
            selectedFile ? "border-success-500 bg-success-50" : "bg-white"
          } hover:border-indigo-400 transition-all duration-300`}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 mx-auto text-success-500 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium text-slate-800">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-indigo-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="font-medium text-slate-800">Drag and drop resume here</p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse (PDF, DOCX)
              </p>
            </>
          )}
        </div>

        {jobDescriptions && jobDescriptions.length > 0 && (
          <div className="mt-6">
            <Label htmlFor="job-description" className="text-indigo-700 mb-2 block">
              Select a Job Description
            </Label>
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger id="job-description" className="bg-white border-indigo-200">
                <SelectValue placeholder="Choose a job description" />
              </SelectTrigger>
              <SelectContent>
                {jobDescriptions.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} - {job.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedFile && (
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleUploadClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Upload Resume
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
