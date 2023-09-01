from flask import Flask, jsonify
from flask_cors import CORS  # Import CORS from flask_cors
import requests

app = Flask(__name__)
CORS(app)
class NewsAPI:
    def __init__(self, api_key):
        self.api_key = api_key
        self.base_url = 'https://newsapi.org/v2/everything'
        self.query = 'Hollywood films, Warner-Bros, Marvel, DC'
        self.page_size = 20

    def fetch_news(self):
        params = {
            'q': self.query,
            'sortBy': 'publishedAt',
            'apiKey': self.api_key,
            'pageSize': self.page_size,
            'language': 'en'  # Add the language parameter to fetch English articles
        }

        response = requests.get(self.base_url, params=params)

        if response.status_code == 200:
            data = response.json()
            articles = data['articles']
            return articles
        else:
            return [{'error': 'Failed to fetch news'}]


app = Flask(__name__)

NEWS_API_KEY = ''  # Replace with your actual NewsAPI key
news_api = NewsAPI(NEWS_API_KEY)

@app.route('/news')
def get_news():
    articles = news_api.fetch_news()
    return jsonify(articles)

if __name__ == '__main__':
    app.run(debug=True)
