import sys
import pymongo
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from collections import Counter
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# MongoDB connection details
host = 'localhost'  # Replace with your MongoDB host
port = 27017  # Replace with the port number
database_name = 'referenda'  # Replace with your database name
collection_name = 'laws'  # Replace with your collection name

# Get the institution name from command line argument
institution_param = sys.argv[1] if len(sys.argv) > 1 else ""
if not institution_param:
    print("Please provide an institution name as a command line argument.")
    sys.exit(1)

# Establish the MongoDB connection
client = pymongo.MongoClient(host, port)

# Access the database and collection
db = client[database_name]
collection = db[collection_name]

# Retrieve the documents from the collection for the specified institution
query = {"institution": {"$regex": f".*{institution_param}.*", "$options": "i"}}
documents = list(collection.find(query, {"long_description": 1, "institution": 1}))

# Check the number of documents collected
num_documents = len(documents)
print(f"Number of documents collected for institution {institution_param}: {num_documents}")

# Extracting the descriptions
descriptions = [doc["long_description"] for doc in documents]

# Count the frequency of words in descriptions grouped by institution
word_counts_by_institution = {}
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("spanish"))

for description in descriptions:
    # Filter out stop words and punctuation marks, and perform lemmatization
    filtered_words = [
        lemmatizer.lemmatize(word.lower()) for word in description.split()
        if word.lower() not in stop_words and word.isalpha()
    ]
    word_counts_by_institution.setdefault(institution_param, Counter()).update(filtered_words)

# Create word cloud for the specified institution
word_counts = word_counts_by_institution.get(institution_param, Counter())

if len(word_counts) > 0:
    wordcloud = WordCloud(width=800, height=400, background_color="white").generate_from_frequencies(word_counts)
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation="bilinear")
    plt.title(f"Word Cloud - {institution_param}")
    plt.axis("off")
    plt.savefig(f"{institution_param}_word_cloud.png")  # Save as PNG file
    plt.close()
else:
    print(f"No words found for institution: {institution_param}")

