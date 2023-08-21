from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, moviedetails
import datetime
#from datetime import datetime
from movie_critics import MovieAnalyzerApp
import json
import csv 
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import or_
from movie_list import MovieList



def todays_hottest(target_genres, age=None, min_vote_count=1000, limit=25):
    movies_list = []
    
    query = db.session.query(moviedetails)
    
    for movie in query.all():
        movie_title = movie.title
        movie_genres = movie.genre
        vote_count = movie.vote_count
        vote_average = movie.vote_average
        release_date = movie.release_date
        movie_rating = movie.rated
        
        if any(genre.strip().lower() in target_genres for genre in movie_genres.split('-')):
            date_string = movie.release_date.strftime("%a, %d %b %Y")  # Format the date without time and timezone
            movie_info = {
                'title': movie_title,
                'genre': movie_genres,
                'vote_count': vote_count,
                'vote_average': vote_average,
                'release_date': date_string,
                'rated': movie_rating
            }
            movies_list.append(movie_info)
    
    sorted_movies = sorted(movies_list, key=lambda x: datetime.datetime.strptime(x['release_date'], "%a, %d %b %Y"), reverse=True)
    return sorted_movies[:limit]


def top25_by_genre(target_genres, min_vote_count=1000, limit=25, age=None):
    movies_list = []

    ilike_conditions = [
        moviedetails.genre.ilike(f'%{genre}%') for genre in target_genres
    ]
    query = db.session.query(moviedetails).filter(or_(*ilike_conditions))

    for movie in query.all():
        movie_title = movie.title
        movie_genres = movie.genre
        vote_count = movie.vote_count
        vote_average = movie.vote_average
        movie_rating = movie.rated
        
        if age is not None and age < 13 and movie_rating == 'PG-13':
            continue
        
        if any(genre.strip().lower() in target_genres for genre in movie_genres.split('-')):
            movie_info = {
                'title': movie_title,
                'genre': movie_genres,
                'vote_count': vote_count,
                'vote_average': vote_average,
                'rated': movie_rating
            }
            movies_list.append(movie_info)
    
    sorted_movies = sorted(movies_list, key=lambda x: x['vote_average'], reverse=True)
    return sorted_movies[:limit]

 
x = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
db.init_app(app)
CORS(app)

db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': '1234',
    'host': 'localhost',
    'port': '5432'
}


@app.route('/signup', methods=['POST'])
def signup():
    user = request.get_json()
    name = user.get('name')
    email = user.get('email')
    password = user.get('password')
    age = user.get('age')
    #Check if email is being used already
    
    #curr = app.cursor()
    #curr.execute("SELECT * FROM "user" WHERE email EQUALS)
    #data = curr.fetchall()
    #if(len(data) != 0)
    #{
    #    return 'Email is being used, try Login or a different email'
    #}

    newUser = User(name = name, email = email, password = password, age = age)
    db.session.add(newUser)
    db.session.commit()
    print(user)
    return 'Signup Successful'



@app.route('/login', methods=['POST'])
def login():
    user = request.get_json()
    email = user.get('email')
    password = user.get('password')

    if email is None or email == "" or password is None or password == "":
        return 'False', 400

    user = User.query.filter_by(email=email, password=password).first()
    if user is not None:
        return 'Login Successful'
    return 'Invalid Username or password', 400

@app.route('/usersurvey', methods=['POST'])
def usersurvey():
    genrelist = request.get_json()
    
    print(genrelist)
    glist = ""
    
    if(genrelist.get('Action')) : glist += "Action,"
    if(genrelist.get('Adventure')) : glist += "Adventure,"
    if(genrelist.get('Animation')) : glist += "Animation,"
    if(genrelist.get('Comedy')) : glist += "Comedy,"
    if(genrelist.get('Crime')) : glist += "Crime,"
    if(genrelist.get('Documentary')) : glist += "Documentary,"
    if(genrelist.get('Drama')) : glist += "Drama,"
    if(genrelist.get('Family')) : glist += "Family,"
    if(genrelist.get('Fantasy')) : glist += "Fantasy,"
    if(genrelist.get('History')) : glist += "History,"
    if(genrelist.get('Horror')) : glist += "Horror,"
    if(genrelist.get('Music')) : glist += "Music,"
    if(genrelist.get('Mystery')) : glist += "Mystery,"
    if(genrelist.get('Romance')) : glist += "Romance,"
    if(genrelist.get('ScienceFiction')) : glist += "ScienceFiction,"
    if(genrelist.get('TVMovie')) : glist += "TVMovie,"
    if(genrelist.get('Thriller')) : glist += "Thriller,"
    if(genrelist.get('War')) : glist += "War,"
    if(genrelist.get('Western')) : glist += "Western,"

    glist = glist[:-1]
    #genrelist_str = json.dumps(glist)
    glist = [genre.strip().lower() for genre in glist.split(",")]

    result = top25_by_genre(glist)
    print('This is the result')
    print(result)
    return result

@app.route('/movieratings', methods=['POST'])
def movieratings():
    genrelist = request.get_json()
    
    glist = ""

    if(genrelist.get('Action')) : glist += "Action,"
    if(genrelist.get('Adventure')) : glist += "Adventure,"
    if(genrelist.get('Animation')) : glist += "Animation,"
    if(genrelist.get('Comedy')) : glist += "Comedy,"
    if(genrelist.get('Crime')) : glist += "Crime,"
    if(genrelist.get('Documentary')) : glist += "Documentary,"
    if(genrelist.get('Drama')) : glist += "Drama,"
    if(genrelist.get('Family')) : glist += "Family,"
    if(genrelist.get('Fantasy')) : glist += "Fantasy,"
    if(genrelist.get('History')) : glist += "History,"
    if(genrelist.get('Horror')) : glist += "Horror,"
    if(genrelist.get('Music')) : glist += "Music,"
    if(genrelist.get('Mystery')) : glist += "Mystery,"
    if(genrelist.get('Romance')) : glist += "Romance,"
    if(genrelist.get('ScienceFiction')) : glist += "ScienceFiction,"
    if(genrelist.get('TVMovie')) : glist += "TVMovie,"
    if(genrelist.get('Thriller')) : glist += "Thriller,"
    if(genrelist.get('War')) : glist += "War,"
    if(genrelist.get('Western')) : glist += "Western,"


    glist = glist[:-1]
    
    #genrelist_str = json.dumps(glist)
    glist = [genre.strip().lower() for genre in glist.split(",")]
   
    result = todays_hottest(glist)
    print('Hot Arrivals: ')
    print(result)

    return result

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
    print(records)
    return jsonify(records)

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
    movie_title = data.get('movie_title')
    new_rating = data.get('new_rating')

    movie_app = MovieList(db_params)

    if movie_app.submit_rating(movie_title, new_rating):
        return 'Rating submitted successfully', 200
    else:
        return 'Movie not found', 404

# Route for seeing a data
@app.route('/data')
def get_time():
 
    # Returning an api for showing in  reactjs
    return {
        'Name':"geek",
        "Age":"22",
        "Date":x,
        "programming":"python"
        }
 
     
# Running app
if __name__ == '__main__':
    app.run(debug=True, port=5000)

