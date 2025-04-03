import { useState, useRef } from "react";
import ModelRetrain from "./ModelRetrain";
import histplot from "../assets/histplot.png";
import correlation from "../assets/correlation.png"


export default function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError("");

    if (!selectedFile) return;

    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file only");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://ml-pipeline-summative-03ve.onrender.com/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      alert("File uploaded successfully!");
      
      if (onFileUpload) {
        onFileUpload(file);
      }
    } catch (error) {
      setError("Upload failed. Please try again.");
      console.error("Upload Error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!droppedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file only");
      return;
    }

    setFile(droppedFile);
  };

  return (
    <section className="mb-4 mx-auto px-8">
      <h2 className="my-8 text-center font-bold text-3xl">
        Upload CSV to Retrain Model
      </h2>
      <div className="flex gap-3">
        <img src={correlation} className="object-contain w-1/4" alt="correlation"/>
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600">
                {file
                  ? file.name
                  : "Drag & drop your CSV file here, or click to browse"}
              </p>
              <p className="text-sm text-gray-500">Only CSV files are accepted</p>
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {file && (
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600 truncate max-w-xs">
                Selected: {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`mt-4 w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
              file && !uploading
                ? "bg-[#00abf0] hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
        <img src={histplot} className="object-contain w-1/4"/>
      </div>

      <ModelRetrain />
    </section>
  );
}
