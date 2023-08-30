from flask import Flask, request, jsonify
import psycopg2
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': '1234',
    'host': 'localhost',
    'port': '5432'
}

class MovieList:
    def __init__(self, db_params):
        self.db_params = db_params

    def read_movie_data(self):
        movie_data = []
        try:
            connection = psycopg2.connect(**self.db_params)
            cursor = connection.cursor()
            query = "SELECT title, rating FROM movieDetails;"
            cursor.execute(query)
            rows = cursor.fetchall()
            for row in rows:
                movie_data.append({'title': row[0], 'rating': row[1]})
        except psycopg2.Error as e:
            print("Error:", e)
        finally:
            cursor.close()
            connection.close()
        return movie_data

    def submit_rating(self, movie_title, new_rating):
        try:
            connection = psycopg2.connect(**self.db_params)
            cursor = connection.cursor()

            # Update new_rating
            #update_query = "UPDATE movieDetails SET new_rating = %s WHERE title = %s;"
            #cursor.execute(update_query, (new_rating, movie_title))

            # Calculate average between rating and new_rating
            avg_query = "UPDATE movieDetails SET rating = ((rating * vote_count) + %s) / (vote_count + 1) WHERE title = %s;"
            cursor.execute(avg_query, (new_rating, movie_title))

            
            #update_query = "UPDATE movieDetails SET vote_count = (vote_count + 1) WHERE title = %s;"
            #cursor.execute(update_query, (movie_title))

            connection.commit()
            return True
        except psycopg2.Error as e:
            print("Error:", e)
            return False
        finally:
            cursor.close()
            connection.close()

    def insert_review(self, user_id, movie_id, rating, comment):
        try:
            connection = psycopg2.connect(**self.db_params)
            cursor = connection.cursor()

            insert_query = "INSERT INTO movie_reviews (user_id, movie_id, rating, comment) VALUES (%s, %s, %s, %s);"
            cursor.execute(insert_query, (user_id, movie_id, rating, comment))

            connection.commit()
            return True
        except psycopg2.Error as e:
            print("Error:", e)
            return False
        finally:
            cursor.close()
            connection.close()


@app.route('/movie_data', methods=['POST'])
def get_movie_data():
    movie_app = MovieList(db_params)
    movie_data = movie_app.read_movie_data()

    if movie_data:
        return jsonify({'movie_data': movie_data})
    else:
        return jsonify({'message': 'No movie data found.'}), 404

@app.route('/submit_rating', methods=['POST'])
def submit_rating():
    data = request.get_json()
    user_id = data.get('user_id')
    movie_id = data.get('movie_id')
    new_rating = data.get('new_rating')
    comment = data.get('comment')

    movie_app = MovieList(db_params)
    if movie_app.submit_rating(movie_id, new_rating):
        if movie_app.insert_review(user_id, movie_id, new_rating, comment):
            return 'Rating and review submitted successfully', 200
        else:
            return 'Failed to submit review', 500
    else:
        return 'Movie not found', 404


if __name__ == "__main__":
    app.run(debug=True)
