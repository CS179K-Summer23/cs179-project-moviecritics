from flask import Flask, request, jsonify
import pandas as pd
import json

app = Flask(__name__)

class MovieAnalyzerApp:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.movie_df = pd.read_csv(csv_path)

        # Remove duplicate entries based on 'title' and 'release_date'
        self.movie_df.drop_duplicates(subset=['title', 'release_date'], keep='first', inplace=True)

    def calculate_profit(self):
        self.movie_df['profit'] = self.movie_df['revenue'] - self.movie_df['budget']

    def calculate_rating(self):
        def calculate(row, min_votes, min_rating):
            vote_count = row['vote_count']
            vote_average = row['vote_average']
            weighted_average = (vote_count / (vote_count + min_votes)) * vote_average
            default_rating = (min_votes / (vote_count + min_votes)) * min_rating
            return weighted_average + default_rating

        min_votes = 100
        min_rating = 5.0
        self.movie_df['rating'] = self.movie_df.apply(lambda row: calculate(row, min_votes, min_rating), axis=1)

    def rank_movies_by_vote_average(self):
        ranked_movies = self.movie_df.sort_values(by=['rating', 'title'], ascending=[False, True])
        ranked_movies['rank'] = range(1, len(ranked_movies) + 1)
        return ranked_movies

    def rank_movies_by_profit(self):
        ranked_movies = self.movie_df.sort_values(by=['profit', 'title'], ascending=[False, True])
        ranked_movies['rank'] = range(1, len(ranked_movies) + 1)
        return ranked_movies

    def rank_movies_by_revenue(self):
        ranked_movies = self.movie_df.sort_values(by=['revenue', 'title'], ascending=[False, True])
        ranked_movies['rank'] = range(1, len(ranked_movies) + 1)
        return ranked_movies

    def get_top_movies_by_rating_df(self, n=30):
        columns_to_display = ['rank', 'title', 'rating', 'genres','release_date']
        self.calculate_rating()
        top_movies_df = self.rank_movies_by_vote_average().head(n)
        return top_movies_df[columns_to_display]

    def get_top_movies_by_profit_df(self, n=30):
        columns_to_display = ['rank', 'title', 'profit', 'genres', 'tagline',  'release_date']
        self.calculate_profit()
        top_movies_df = self.rank_movies_by_profit().head(n)
        return top_movies_df[columns_to_display]

    def get_top_movies_by_revenue_df(self, n=30):
        columns_to_display = ['rank', 'title', 'revenue', 'genres', 'tagline', 'release_date']
        top_movies_df = self.rank_movies_by_revenue().head(n)
        return top_movies_df[columns_to_display]

# Route to fetch top movies based on choice and display as JSON
@app.route('/pagination', methods=['POST'])
def get_top_movies():
    data = request.json  # Get JSON data from the request
    choice = data.get("choice")
    n = int(data.get("n", 30))

    analyzer = MovieAnalyzerApp("movies_db.csv")

    if choice == "rating":
        top_movies_df = analyzer.get_top_movies_by_rating_df(n)
    elif choice == "profits":
        top_movies_df = analyzer.get_top_movies_by_profit_df(n)
    elif choice == "revenue":
        top_movies_df = analyzer.get_top_movies_by_revenue_df(n)
    else:
        return jsonify({"error": "Invalid choice"}), 400

    records = top_movies_df.to_dict(orient="records")
    return jsonify(records)

if __name__ == "__main__":
    app.run(debug=True)
