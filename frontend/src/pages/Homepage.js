import React, { useState } from "react";
import "../css/Homepage.css";

function Homepage() {
  const [fileContent, setFileContent] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/plain") {
        const formData = new FormData();
        formData.append("file", file);

        setIsLoading(true); // Show loading popup

        fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setIsLoading(false); // Hide loading popup
            if (data.success) {
              console.log("Insights:", data.insights); // Log the results to the console
              setFileContent(data.insights);
              setUploadError(null);
            } else {
              setUploadError(data.message);
              setFileContent(null);
            }
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            setUploadError("An error occurred while uploading the file.");
            setIsLoading(false); // Hide loading popup
          });
      } else {
        setUploadError("Please upload a valid .txt file.");
      }
    }
  };

  return (
    <div className="homepage">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <h1>Welcome to Text Me Wrapped</h1>
      <p>Analyze your messages and see insights in no time!</p>
      <div className="file-upload-container">
        <input
          type="file"
          accept=".txt"
          id="fileUpload"
          className="file-upload"
          onChange={handleFileUpload}
        />
        <label htmlFor="fileUpload" className="file-upload-label">
          Upload Your .txt File
        </label>
      </div>
      {isLoading && (
        <div className="loading-popup">
          <div className="loading-bar">
            <div className="progress"></div>
          </div>
          <p>Processing your file, please wait...</p>
        </div>
      )}
      {fileContent && (
        <div className="file-content">
          <h2>File Insights:</h2>
          <pre>{JSON.stringify(fileContent, null, 2)}</pre>
        </div>
      )}
      {uploadError && <p className="error-message">{uploadError}</p>}
    </div>
  );
}

export default Homepage;
