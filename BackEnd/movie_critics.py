from flask import Flask, request, jsonify
import pandas as pd
import json
import psycopg2

app = Flask(__name__)

db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': '1234',
    'host': 'localhost',
    'port': '5432'
}

class MovieAnalyzerApp:
    def __init__(self, db_params):
        self.db_params = db_params
        self.connection = psycopg2.connect(**db_params)
        self.connection.set_client_encoding('UTF8')
        self.cursor = self.connection.cursor()

    def fetch_data_from_db(self, query):
        self.cursor.execute(query)
        return self.cursor.fetchall()

    def calculate_profit(self):
        query = "SELECT id, revenue, budget FROM moviedetails;"
        data = self.fetch_data_from_db(query)
        profit_data = [(row[0], row[1] - row[2]) for row in data]
        return profit_data

    def calculate_rating(self):
        query = "SELECT id, vote_count, vote_average FROM moviedetails;"
        data = self.fetch_data_from_db(query)
        min_votes = 100
        min_rating = 5.0
        ratings = []

        for row in data:
            id_, vote_count, vote_average = row
            weighted_average = (vote_count / (vote_count + min_votes)) * vote_average
            default_rating = (min_votes / (vote_count + min_votes)) * min_rating
            final_rating = weighted_average + default_rating
            ratings.append((id_, final_rating))

        return ratings

    def get_top_movies_by_rating_df(self, n=30):
        query = f"SELECT title, rating, release_date FROM moviedetails ORDER BY rating DESC, release_date ASC LIMIT {n};"
        return self.fetch_data_from_db(query)

    def rank_movies_by_profit(self):
        profit_data = self.calculate_profit()
        sorted_profit_data = sorted(profit_data, key=lambda x: x[1], reverse=True)
        ranked_movies = []

        for rank, (movie_id, _) in enumerate(sorted_profit_data, start=1):
            query = f"SELECT title, profit, genre, tagline, release_date FROM moviedetails WHERE id = {movie_id};"
            self.cursor.execute(query)
            movie_data = self.cursor.fetchone()
            ranked_movies.append((rank,) + movie_data)

        return ranked_movies

    def rank_movies_by_revenue(self):
        query = "SELECT id, title, revenue, genre, tagline, release_date FROM moviedetails ORDER BY revenue DESC, title ASC;"
        return self.fetch_data_from_db(query)

    def get_top_movies_by_rating_df(self, n=30):
        query = f"SELECT id, title, rating, genre, release_date FROM moviedetails ORDER BY rating DESC, title ASC LIMIT {n};"
        return self.fetch_data_from_db(query)

    def get_top_movies_by_profit_df(self, n=30):
        ranked_movies = self.rank_movies_by_profit()[:n]
        return ranked_movies

    def get_top_movies_by_revenue_df(self, n=30):
        query = f"SELECT id, title, revenue, genre, tagline, release_date FROM moviedetails ORDER BY revenue DESC, title ASC LIMIT {n};"
        return self.fetch_data_from_db(query)

@app.route('/pagination', methods=['POST'])
def get_top_movies():
    data = request.json
    choice = data.get("choice")
    n = int(data.get("n", 30))

    analyzer = MovieAnalyzerApp(db_params)

    if choice == "rating":
        top_movies = analyzer.get_top_movies_by_rating_df(n)
        records = [{'rank': i + 1, 'title': row[1], 'rating': row[2], 'genre': row[3], 'release_date': row[4]} for i, row in enumerate(top_movies[:n])]
    elif choice == "profits":
        top_movies = analyzer.get_top_movies_by_profit_df(n)
        records = [{'rank': row[0], 'title': row[1], 'profit': row[2], 'genre': row[3], 'release_date': row[5]} for row in top_movies]
    elif choice == "revenue":
        top_movies = analyzer.get_top_movies_by_revenue_df(n)
        records = [{'rank': i + 1, 'title': row[1], 'revenue': row[2], 'genre': row[3], 'release_date': row[5]} for i, row in enumerate(top_movies[:n])]
    else:
        return jsonify({"error": "Invalid choice"}), 400

    return jsonify(records)

if __name__ == "__main__":
    app.run(debug=True)
