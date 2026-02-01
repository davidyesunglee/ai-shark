import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "./FileUpload";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export function UploadDialog({ open, onOpenChange, onUpload, isUploading }: UploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Business Plan</DialogTitle>
          <DialogDescription>
            Upload a business plan document (PDF, DOCX, or TXT, max 10MB) to receive an AI-powered assessment based on bank debt financing criteria.
          </DialogDescription>
        </DialogHeader>
        <FileUpload onUpload={onUpload} isUploading={isUploading} />
      </DialogContent>
    </Dialog>
  );
}
