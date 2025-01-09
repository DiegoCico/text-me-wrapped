import React, { useState } from 'react';
import '../css/Homepage.css';

function Homepage() {
  const [fileContent, setFileContent] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "text/plain") {
        const formData = new FormData();
        formData.append("file", file);

        fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              setFileContent(data.content);
              setUploadError(null);
            } else {
              setUploadError(data.message);
              setFileContent(null);
            }
          })
          .catch((error) => {
            console.error("Error uploading file:", error);
            setUploadError("An error occurred while uploading the file.");
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
      {fileContent && (
        <div className="file-content">
          <h2>File Content:</h2>
          <pre>{fileContent}</pre>
        </div>
      )}
      {uploadError && <p className="error-message">{uploadError}</p>}
    </div>
  );
}

export default Homepage;
