import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function FileUpload({ onUpload, isUploading = false }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: isUploading,
  });

  const fileTooLarge = fileRejections.some(
    (rejection) => rejection.errors.some((e) => e.code === "file-too-large")
  );

  const handleSubmit = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
          ${isUploading ? "cursor-not-allowed opacity-50" : ""}
        `}
        data-testid="dropzone-upload"
      >
        <input {...getInputProps()} data-testid="input-file-upload" />
        
        {selectedFile ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              data-testid="button-clear-file"
            >
              <X className="mr-1 h-4 w-4" />
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">
                {isDragActive ? "Drop your file here" : "Drag & drop your business plan"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Supports PDF, DOCX, and TXT files (max 10MB)
            </p>
            {fileTooLarge && (
              <p className="mt-2 text-xs text-destructive font-medium">
                File exceeds 10MB limit. Please upload a smaller file.
              </p>
            )}
          </div>
        )}
      </div>

      {selectedFile && (
        <Button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full"
          data-testid="button-analyze"
        >
          {isUploading ? "Analyzing..." : "Analyze Business Plan"}
        </Button>
      )}
    </div>
  );
}
