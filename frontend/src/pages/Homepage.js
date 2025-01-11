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
      <header className="homepage-header">
        <h1 className="title">
          <span className="highlight">Text Me Wrapped</span>
        </h1>
        <p className="tagline">Discover the story behind your chats in style!</p>
      </header>

      <div className="upload-section">
        <div className="file-upload-container">
          <input
            type="file"
            accept=".txt"
            id="fileUpload"
            className="file-upload"
            onChange={handleFileUpload}
          />
          <label htmlFor="fileUpload" className="file-upload-label">
            Upload Your Chat File
          </label>
        </div>
        {uploadError && <p className="error-message">{uploadError}</p>}
      </div>

      {isLoading && (
        <div className="popup">
          <div className="popup-content">
            <div className="loading-spinner"></div>
            <p>Analyzing your chat... Hang tight!</p>
          </div>
        </div>
      )}

      {fileContent && (
        <div className="results">
          <h2>Your Chat Insights</h2>
          <div className="results-grid">
            {fileContent.participants && (
              <div className="card colorful-card">
                <h3>Participants</h3>
                <p>{fileContent.participants.join(", ")}</p>
              </div>
            )}
            {fileContent.total_messages !== undefined && (
              <div className="card colorful-card">
                <h3>Total Messages</h3>
                <p>{fileContent.total_messages}</p>
              </div>
            )}
            {fileContent.mood_percentages && (
              <div className="card colorful-card">
                <h3>Mood Breakdown</h3>
                <ul>
                  {Object.entries(fileContent.mood_percentages).map(
                    ([mood, percentage]) => (
                      <li key={mood}>
                        {mood.charAt(0).toUpperCase() + mood.slice(1)}:{" "}
                        <strong>{percentage}%</strong>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {fileContent.most_used_words && (
              <div className="card colorful-card">
                <h3>Most Used Words</h3>
                {Object.entries(fileContent.most_used_words).map(
                  ([participant, data]) => (
                    <p key={participant}>
                      {participant}: "{data.word}" ({data.count} times)
                    </p>
                  )
                )}
              </div>
            )}
            {fileContent.participation_percentages && (
              <div className="card colorful-card">
                <h3>Participation Percentages</h3>
                {Object.entries(fileContent.participation_percentages).map(
                  ([participant, percentage]) => (
                    <p key={participant}>
                      {participant}: <strong>{percentage}%</strong>
                    </p>
                  )
                )}
              </div>
            )}
            {fileContent.profanity_counts && (
              <div className="card colorful-card">
                <h3>Profanity Count</h3>
                {Object.entries(fileContent.profanity_counts).map(
                  ([participant, count]) => (
                    <p key={participant}>
                      {participant}: <strong>{count} instances</strong>
                    </p>
                  )
                )}
              </div>
            )}
            {fileContent.emoji_usage && (
              <div className="card colorful-card">
                <h3>Emoji Usage</h3>
                {Object.entries(fileContent.emoji_usage).map(
                  ([participant, data]) => (
                    <p key={participant}>
                      {participant}: Most used emoji:{" "}
                      <strong>{data.most_used}</strong> (
                      {data.count} times, Total: {data.total})
                    </p>
                  )
                )}
              </div>
            )}
            {fileContent.hourly_activity && (
              <div className="card colorful-card">
                <h3>Hourly Activity</h3>
                {Object.entries(fileContent.hourly_activity).map(
                  ([participant, hours]) => (
                    <p key={participant}>
                      {participant}:{" "}
                      {Object.entries(hours).map(([hour, count]) => (
                        <span key={hour}>
                          {hour}:00 - {count} messages{" "}
                        </span>
                      ))}
                    </p>
                  )
                )}
              </div>
            )}
            {fileContent.avg_message_length && (
              <div className="card colorful-card">
                <h3>Average Message Length</h3>
                {Object.entries(fileContent.avg_message_length).map(
                  ([participant, avgLength]) => (
                    <p key={participant}>
                      {participant}: <strong>{avgLength} characters</strong>
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="homepage-footer">
        <p>&copy; 2025 Text Me Wrapped. Designed to bring your chats to life.</p>
      </footer>
    </div>
  );
}

export default Homepage;
