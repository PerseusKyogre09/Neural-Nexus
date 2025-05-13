import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function UploadForm() {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    // Integrate Firebase/S3 upload and blockchain ownership transfer here
    console.log("Uploading...", file);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-white"
      />
      <Button onClick={handleUpload} className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700">
        <Upload className="w-5 h-5" />
        Upload AI Model
      </Button>
    </div>
  );
}
