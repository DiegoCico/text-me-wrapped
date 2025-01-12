from flask import Flask, jsonify, request
from flask_cors import CORS
from textblob import TextBlob
from collections import Counter
import re
from better_profanity import profanity
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk import download
from datetime import datetime

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route('/life', methods=['GET'])
def check_life():
    return jsonify(success=True, message="Server is up and running!")

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify(success=False, message="No file part in the request"), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify(success=False, message="No file selected"), 400

    if file and file.filename.endswith('.txt'):
        content = file.read().decode('utf-8')
        insights = analyze_chat(content)
        return jsonify(success=True, insights=insights)

    return jsonify(success=False, message="Invalid file type. Please upload a .txt file"), 400

# Download necessary resources
download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

def analyze_chat(content):
    lines = content.split('\n')
    participants = set()
    messages = []
    word_counts = Counter()
    emotion_scores = {
        "excited": 0,
        "happy": 0,
        "calm": 0,
        "neutral": 0,
        "frustrated": 0,
        "sad": 0,
        "angry": 0
    }
    profanity_counts = Counter()
    emoji_usage = Counter()
    message_lengths = Counter()
    hourly_activity = Counter()
    unique_words = Counter()

    for line in lines:
        match = re.match(r'\[(.*?)\] (.*?): (.*)', line)
        if match:
            timestamp, name, message = match.groups()
            participants.add(name.strip())
            messages.append((timestamp, name.strip(), message.strip()))

            # Analyze sentiment
            sentiment = sia.polarity_scores(message)
            compound = sentiment['compound']
            if compound >= 0.5:
                emotion_scores["excited"] += 1
            elif 0.2 <= compound < 0.5:
                emotion_scores["happy"] += 1
            elif 0.1 <= compound < 0.2:
                emotion_scores["calm"] += 1
            elif -0.1 < compound < 0.1:
                emotion_scores["neutral"] += 1
            elif -0.2 <= compound <= -0.1:
                emotion_scores["frustrated"] += 1
            elif -0.5 < compound < -0.2:
                emotion_scores["sad"] += 1
            else:
                emotion_scores["angry"] += 1

            # Count profanity
            if profanity.contains_profanity(message):
                profanity_counts[name.strip()] += 1

            # Count words and unique words
            words = re.findall(r'\b\w+\b', message.lower())
            word_counts.update({(name.strip(), word): count for word, count in Counter(words).items()})
            unique_words[name.strip()] += len(set(words))

            # Count emojis
            emojis = re.findall(r'[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F700-\U0001F77F]', message)
            emoji_usage.update({(name.strip(), emoji): 1 for emoji in emojis})

            # Message length
            message_lengths[name.strip()] += len(message)

            # Hourly activity
            message_time = datetime.strptime(timestamp, '%m/%d/%y, %I:%M:%S %p')
            hourly_activity[(name.strip(), message_time.hour)] += 1

    # Calculate mood percentages
    total_messages = len(messages)
    mood_percentages = {emotion: round(count / total_messages * 100, 2) for emotion, count in emotion_scores.items()}

    # Most used word for each person
    most_used_words = {}
    for participant in participants:
        participant_words = {word: count for (name, word), count in word_counts.items() if name == participant}
        if participant_words:
            most_used_word = max(participant_words, key=participant_words.get)
            most_used_words[participant] = {"word": most_used_word, "count": participant_words[most_used_word]}

    # Participation
    participant_message_count = Counter([name for _, name, _ in messages])
    participation_percentages = {
        participant: round(count / total_messages * 100, 2) for participant, count in participant_message_count.items()
    }

    # Reply Times
    reply_times = calculate_reply_times(messages)

    # Emoji Usage
    emoji_stats = {}
    for participant in participants:
        participant_emojis = {emoji: count for (name, emoji), count in emoji_usage.items() if name == participant}
        if participant_emojis:
            most_frequent_emoji = max(participant_emojis, key=participant_emojis.get)
            emoji_stats[participant] = {
                "most_used": most_frequent_emoji,
                "count": participant_emojis[most_frequent_emoji],
                "total": sum(participant_emojis.values())
            }

    # Activity by hour
    hourly_stats = {
        participant: {
            hour: count
            for (name, hour), count in hourly_activity.items()
            if name == participant
        }
        for participant in participants
    }

    # Average message length
    avg_message_length = {
        participant: round(message_lengths[participant] / participant_message_count[participant], 2)
        for participant in participants
    }

    # Fun Stats
    activity_streaks = calculate_activity_streaks(messages)

    return {
        "participants": list(participants),
        "total_messages": total_messages,
        "mood_percentages": mood_percentages,
        "most_used_words": most_used_words,
        "participation_percentages": participation_percentages,
        "reply_times": reply_times,
        "emoji_usage": emoji_stats,
        "hourly_activity": hourly_stats,
        "avg_message_length": avg_message_length,
        "unique_word_count": unique_words,
        "profanity_counts": profanity_counts,
        "activity_streaks": activity_streaks
    }


def calculate_reply_times(messages):
    reply_times = []
    last_time = None

    for timestamp, _, _ in messages:
        current_time = datetime.strptime(timestamp, '%m/%d/%y, %I:%M:%S %p')
        if last_time:
            reply_times.append((current_time - last_time).seconds)
        last_time = current_time

    if reply_times:
        return {
            "average": f"{sum(reply_times) // len(reply_times)} seconds",
            "quickest": f"{min(reply_times)} seconds",
            "slowest": f"{max(reply_times)} seconds"
        }
    return {"average": "N/A", "quickest": "N/A", "slowest": "N/A"}

def calculate_activity_streaks(messages):
    dates = [datetime.strptime(timestamp, '%m/%d/%y, %I:%M:%S %p').date() for timestamp, _, _ in messages]
    unique_dates = sorted(set(dates))

    streaks = []
    current_streak = 1

    for i in range(1, len(unique_dates)):
        if (unique_dates[i] - unique_dates[i - 1]).days == 1:
            current_streak += 1
        else:
            streaks.append(current_streak)
            current_streak = 1

    streaks.append(current_streak)  # Add the last streak

    return {
        "longest_streak": max(streaks),
        "total_active_days": len(unique_dates)
    }

if __name__ == '__main__':
    app.run(debug=True)
