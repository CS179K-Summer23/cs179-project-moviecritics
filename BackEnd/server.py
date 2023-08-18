from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User
import datetime
from movie_critics import MovieAnalyzerApp
#from sort_genre_rank import top25_by_genre
#import subprocess
import json
import csv 
import datetime
import psycopg2
from movie_list import MovieList


csv_filename = "movies_db.csv"

def todays_hottest(csv_filename, target_genres, min_vote_count=1000, limit=25):
    movies_list = []
    with open(csv_filename, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            movie_title = row['title']
            movie_genres = row['genres'].split('-')
            vote_count = float(row['vote_count'])
            vote_average = float(row['vote_average'])
            release_date_str = row['release_date']
          
            if release_date_str:
                try:
                    release_date = datetime.datetime.strptime(release_date_str, '%Y-%m-%d')
                except ValueError:
                    release_date = None

                current_date = datetime.datetime.now()

                if release_date and release_date <= current_date and any(genre.strip().lower() in target_genres for genre in movie_genres) and vote_count > min_vote_count:
                    movie_info = {
                        'title': movie_title,
                        'genres': movie_genres,
                        'vote_count': vote_count,
                        'vote_average': vote_average,
                        'release_date': release_date_str
                    }
                    movies_list.append(movie_info)

        sorted_movies = sorted(movies_list, key=lambda x: x['release_date'], reverse=True)
        
        return sorted_movies[:limit]

def top25_by_genre(csv_file, target_genres, age, min_vote_count=1000, limit=25):
    movies_list = []
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            movie_title = row['title']
            movie_genres = row['genres']  
            vote_count = float(row['vote_count'])
            vote_average = float(row['vote_average'])
            movie_rating = row['Rated']
            
            if age is not None and age < 13 and movie_rating == 'PG-13':
                continue
            
            if any(genre.strip().lower() in target_genres for genre in movie_genres.split('-')):
                movie_info = {
                    'title': movie_title,
                    'genres': movie_genres, 
                    'vote_count': vote_count,
                    'vote_average': vote_average,
                    'Rated': movie_rating
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
    global globalage 
    globalage = int(age)
 
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

    result = top25_by_genre('movies_db.csv', glist, globalage)
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
   
    result = todays_hottest('movies_db.csv',glist)
   

    return result

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
    app.run(debug=True)
