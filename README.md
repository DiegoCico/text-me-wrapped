# Text Me Wrapped

Text Me Wrapped is a React-based frontend application connected to a Flask backend hosted on AWS EC2. It provides users with deep insights into their chat logs, such as sentiment analysis, emoji usage, participation percentages, and more. This project turns your chat data into an engaging, interactive, and visually appealing summary.

---

## Features

- **Upload Chat Logs**: Upload `.txt` files of chat logs to analyze and visualize.
- **Sentiment Analysis**: Break down chat moods into emotions like excited, calm, frustrated, and more.
- **Emoji Insights**: See the most used emojis and their frequencies for each participant.
- **Participation Analytics**: Get percentages of messages contributed by each participant.
- **Profanity Detection**: Identify participants and messages containing profanity.
- **Hourly Activity Tracking**: Analyze when participants are most active.
- **Message Lengths**: Calculate average message lengths for each participant.
- **Unique Word Counts**: Track the number of unique words used by each participant.
- **Engaging Design**: A React-based modern, responsive frontend to display the insights.

---

## Technology Stack

### Frontend:

- **React**: Provides the interactive user interface for file uploads and displaying insights.
- **CSS**: Ensures the application has a clean and modern visual appeal.

### Backend:

The backend is implemented using Flask and connected to AWS EC2 for hosting. It processes and analyzes the chat logs in the following ways:

- **Sentiment Analysis**:
  - Uses the `nltk` library's `SentimentIntensityAnalyzer` to calculate polarity scores and categorize emotions.
- **Profanity Detection**:
  - Powered by the `better_profanity` library to identify and count instances of profanity.
- **Emoji Parsing**:
  - Regular expressions are used to detect and count emojis within chat messages.
- **Data Extraction**:
  - Parses chat messages in a specific format to extract timestamps, participants, and content.
- **Statistical Insights**:
  - Tracks participation, message frequencies by the hour, word usage, and reply times.
- **Utilities**:
  - Includes helper functions for calculations like streaks of activity, unique word counts, and most-used words.

### Hosting:

- **AWS EC2**:
  - The Flask backend is deployed on AWS EC2, providing a scalable and reliable platform for hosting the API.
- **CORS Support**:
  - Configured to handle cross-origin requests, allowing seamless integration with the React frontend.

### Libraries Used:

- **Flask**: API development framework.
- **nltk**: Natural language processing library for sentiment analysis.
- **better_profanity**: Library for detecting inappropriate language.
- **textblob**: Text analysis library for extracting word frequencies.
- **datetime**: Handles timestamps and calculates time-based metrics.
- **collections**: Provides efficient data structures like `Counter` for word and emoji frequency tracking.

---

## Usage

1. Open the frontend application (hosted or locally).
2. Upload a `.txt` chat log file using the "Upload Your Chat File" button.
3. View detailed insights such as:
   - Participant names and their contributions.
   - Mood breakdown percentages.
   - Most-used words and emojis.
   - Hourly activity and message statistics.

---

## Example Chat Log Format

The chat logs should follow this format:

[01/15/23, 10:15:00 AM] John Doe: Hello!
[01/15/23, 10:16:00 AM] Jane Smith: Hi there! 😊

## Insights Displayed

### Participants:
- List of all participants in the chat.

### Total Messages:
- Total number of messages sent in the chat.

### Mood Breakdown:
- Percentage breakdown of emotions like excited, happy, calm, neutral, frustrated, sad, and angry.

### Most Used Words:
- Displays the most frequently used word for each participant, along with the count.

### Participation Percentages:
- The percentage of total messages sent by each participant.

### Profanity Count:
- Number of profane messages sent by each participant.

### Emoji Usage:
- Most-used emoji per participant, along with total emoji usage.

### Hourly Activity:
- A breakdown of chat activity by hour for each participant.

### Average Message Length:
- Average message length for each participant in characters.

---

Transform your chats into a personalized, fun, and meaningful analysis with **Text Me Wrapped**!

