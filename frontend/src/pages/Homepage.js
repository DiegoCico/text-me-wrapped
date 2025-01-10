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

        setIsLoading(true);

        fetch("http://127.0.0.1:5000/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            setIsLoading(false);
            if (data.success) {
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
            setIsLoading(false);
          });
      } else {
        setUploadError("Please upload a valid .txt file.");
      }
    }
  };

  return (
    <div className="homepage">
      {/* <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div> 
      <div className="circle"></div>  */}
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
        <div className="insights">
          <h2>Chat Insights</h2>
          <div className="insight-card">
            <h3>Participants</h3>
            <p>{fileContent.participants.join(", ")}</p>
          </div>
          <div className="insight-card">
            <h3>Total Messages</h3>
            <p>{fileContent.total_messages}</p>
          </div>
          <div className="insight-card">
            <h3>Mood Percentages</h3>
            <ul>
              {Object.entries(fileContent.mood_percentages).map(([mood, percentage]) => (
                <li key={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}: {percentage}%
                </li>
              ))}
            </ul>
          </div>
          <div className="insight-card">
            <h3>Most Used Words</h3>
            {Object.entries(fileContent.most_used_words).map(([participant, data]) => (
              <p key={participant}>
                {participant}: {data.word} ({data.count} times)
              </p>
            ))}
          </div>
          <div className="insight-card">
            <h3>Participation Percentages</h3>
            {Object.entries(fileContent.participation_percentages).map(([participant, percentage]) => (
              <p key={participant}>
                {participant}: {percentage}%
              </p>
            ))}
          </div>
          <div className="insight-card">
            <h3>Reply Times</h3>
            <p>Average: {fileContent.reply_times.average}</p>
            <p>Quickest: {fileContent.reply_times.quickest}</p>
            <p>Slowest: {fileContent.reply_times.slowest}</p>
          </div>
        </div>
      )}
      {uploadError && <p className="error-message">{uploadError}</p>}
    </div>
  );
}

export default Homepage;
