import { FileUpload } from "../FileUpload";

export default function FileUploadExample() {
  const handleUpload = (file: File) => {
    console.log("File uploaded:", file.name);
  };

  return (
    <div className="w-full max-w-md">
      <FileUpload onUpload={handleUpload} />
    </div>
  );
}
