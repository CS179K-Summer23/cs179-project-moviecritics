import psycopg2
import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split
import json
from datetime import datetime
from flask import Flask, request, jsonify

app = Flask(__name__)

class MovieRecommendationSystem:
    def __init__(self):
        self.conn = psycopg2.connect(
            database='postgres',
            user='postgres',
            password='1234',
            host='localhost',
            port='5432'
        )
        self.movie_data = self.fetch_movie_data()

        self.reader = Reader(rating_scale=(0, 10))
        self.data = Dataset.load_from_df(self.movie_data[['title', 'vote_average', 'rating']], self.reader)
        self.trainset, self.testset = train_test_split(self.data, test_size=0.2)

        self.model = SVD(n_factors=50, verbose=True)
        self.model.fit(self.trainset)

    def fetch_movie_data(self):
        query = "SELECT * FROM moviedetails"
        return pd.read_sql_query(query, self.conn)

    def get_movie_details_by_idx(self, movie_idx):
        return self.movie_data.loc[movie_idx].to_dict()



    def get_genre_preferences(self, user_watchlist):
        genre_preferences = []
        for movie_id in user_watchlist:
            query = f"SELECT genre FROM moviedetails WHERE title = '{movie_id}'"
            genre_result = pd.read_sql_query(query, self.conn)
            if not genre_result.empty:
                genres = genre_result.iloc[0]['genre']
                genre_preferences.extend(genres.split('|'))
        return list(set(genre_preferences))



    def get_user_age(self, user_id):
        query = f"SELECT age FROM \"user\" WHERE id = {user_id}"
        result = pd.read_sql_query(query, self.conn)
        if not result.empty:
            return result.iloc[0]['age']
        return None
    
    def generate_recommendations_for_user(self, user_id, n_recommendations=10):
        query_watchlist = f"SELECT * FROM user_watchlist WHERE user_id = {user_id}"
        watchlist_result = pd.read_sql_query(query_watchlist, self.conn)
        user_watchlist = watchlist_result['movie_id'].str.split('|', expand=True).values.flatten()

        genre_preferences = self.get_genre_preferences(user_watchlist)
        genre_movie_indices = [
            movie_idx for movie_idx, row in self.movie_data.iterrows() if any(genre in row['genre'] for genre in genre_preferences)
        ]

        if len(genre_movie_indices) < n_recommendations:
            n_recommendations = len(genre_movie_indices)

        genre_movie_indices.sort(key=lambda x: self.movie_data.loc[x]['vote_average'], reverse=True)
    
        user_age = self.get_user_age(user_id)
        if user_age is None:
            print("User not found or age not available.")
            return []
    
        recommendations = []
        for movie_idx in genre_movie_indices[:n_recommendations]:
            movie_details = self.get_movie_details_by_idx(movie_idx)
            if user_age >= 13 or movie_details['rating'] <= user_age:  # Filter based on user's age
                recommendations.append(movie_details)
        
        return recommendations



movie_system = MovieRecommendationSystem()

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
        user_id = int(request.json['user_id'])
    except (KeyError, ValueError):
        return jsonify({'error': 'Invalid input'}), 400

    user_recommendations = movie_system.generate_recommendations_for_user(user_id)

    recommendations_df = pd.DataFrame(user_recommendations)
    columns_to_drop = ['runtime', 'vote_average']
    recommendations_df = recommendations_df.drop(columns=columns_to_drop)
    recommendations_df['rating'] = recommendations_df['rating'].apply(lambda x: round(x, 2))
    recommendations_df['release_date'] = recommendations_df['release_date'].apply(lambda x: x.strftime('%Y-%m-%d'))
    recommendations_json = recommendations_df.to_dict(orient='records')
    recommendations_json_string = json.dumps(recommendations_json, indent=2)

    return recommendations_json_string
    
if __name__ == '__main__':
    app.run(debug=True)
