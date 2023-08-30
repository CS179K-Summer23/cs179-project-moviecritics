from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from models import db, User, UserPreference, moviedetails, UserWatchlist
import datetime
#from datetime import datetime
from movie_critics import MovieAnalyzerApp
import json
import jwt, os
from functools import wraps
from flask_bcrypt import Bcrypt
import csv 
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import or_
from movie_list import MovieList
from collections import Counter
from news import NewsAPI
#from surprise import Dataset, Reader, SVD
#from surprise.model_selection import train_test_split
#from movie_recommendation import MovieRecommendationSystem

#NEWS_API_KEY = " "
NEWS_API_KEY = 'd4eda2ea08d54a95ac9265626d8d9eab'  

news_api = NewsAPI(NEWS_API_KEY)



# Initializing flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)
CORS(app)

bcrypt = Bcrypt()


def generate_secret_key(length=32):
    return os.urandom(length).hex()

app.config['SECRET_KEY'] = 'randomForNow'

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        print('token', token)
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            #print('\n',data.user_id,'\n')
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

def todays_hottest(target_genres, movie_ids, age=None, min_vote_count=1000, limit=25):
    movies_list = []
   
    query = db.session.query(moviedetails)

    # watchlist = UserWatchlist.query.filter_by(user_id=user_id).first()
    
    for movie in query.all():
        movie_title = movie.title
        movie_genres = movie.genre
        vote_count = movie.vote_count
        vote_average = movie.vote_average
        release_date = movie.release_date
        movie_rating = movie.rated
        
        if any(genre.strip().lower() in target_genres for genre in movie_genres.split('-')) and movie_title not in movie_ids:
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


def top25_by_genre(target_genres, age, min_vote_count=1000, limit=25):
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

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    newUser = User(name = name, email = email, password = hashed_password, age = age, sharewatchlist = False)
    db.session.add(newUser)
    db.session.commit()
    # Generate a JWT token
    token = jwt.encode({'user_id': newUser.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                       app.config['SECRET_KEY'], algorithm='HS256')
    print(user)
    return jsonify({'message': 'Signup Successful', 'token': token}), 201
    #response = make_response(jsonify({'message': 'Signup Successful'}), 201)
    #response.set_cookie('authToken', token, httponly=True)

    #return response



@app.route('/login', methods=['POST'])
def login():
    print("API Called")
    user = request.get_json()
    email = user.get('email')
    password = user.get('password')

    if email is None or email == "" or password is None or password == "":
        return jsonify({"message": "Invalid credentials"}), 400

    user = User.query.filter_by(email=email).first()
    print("user:", user)
    if user is None or not bcrypt.check_password_hash(user.password, password):
        print("Invalid Credentials")
        return jsonify({"message": "Invalid credentials"}), 401
    
    token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                       app.config['SECRET_KEY'], algorithm='HS256')
    
    pref = UserPreference.query.filter_by(user_id = user.id).first()
    print("pref:", pref.genre)
    genrelist = json.loads(pref.genre)
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
    glist = [genre.strip().lower() for genre in glist.split(",")]
    result = todays_hottest(glist, [])

    return jsonify({"message": "Login Successful", "token": token, "result": result}), 200

@app.route('/addToWatchList/<string:movie_title>', methods=['POST'])
@token_required
def add_to_watchlist(current_user, movie_title):
    user_id = current_user.id
    watchlist = UserWatchlist.query.filter_by(user_id=user_id).first()
    print("watchlist:", watchlist)

    if not watchlist:
        print("Inside if")
        watchlist = UserWatchlist(user_id=user_id)
    print(watchlist.movie_id)
    if not watchlist.movie_id or movie_title not in watchlist.movie_id:
        new_title = ""
        if not watchlist.movie_id:
            print("creating new list")
            new_title = movie_title
        else:
            new_title = watchlist.movie_id + "|" + movie_title
        # new_title = "|" + movie_title
        watchlist.movie_id = new_title
        print("watchlist after adding:", watchlist.movie_id)
        db.session.add(watchlist)
        # db.session.flush()
        db.session.commit()
        return jsonify({'message': 'Movie added to watchlist'}), 201
    else:
        return jsonify({'message': 'Movie is already in watchlist'}), 400
    
@app.route('/genreDistribution', methods=['GET'])
def getGenreByAgeData():
    age_range = request.args.get('ageRange')
    user_data = []

    users = (
        db.session.query(User.id, User.age, UserPreference.genre)
        .join(UserPreference, User.id == UserPreference.user_id)
        .all()
    )
    print("age_range:", age_range)
    if age_range:
        min_age, max_age = map(int, age_range.split('-'))
    #     users = users.filter(User.age >= min_age, User.age <= max_age)

    genre_counts = Counter()

    for user in users:
        if age_range:
            if user.age >= min_age and user.age <= max_age:
                genres = json.loads(user.genre)
                for genre, value in genres.items():
                    genre_counts.update({genre: int(value)})
                user_data.append({"user_id": user.id, "age": user.age, "genres": user.genre})
        else:
            user_data.append({"user_id": user.id, "age": user.age, "genres": user.genre})
    print("genre_counts:", str(genre_counts))

    genre_data = [{"genre": genre, "count": count} for genre, count in genre_counts.items()]


    return jsonify(genre_data)


@app.route('/usersurvey', methods=['POST'])
@token_required
def usersurvey(current_user):
    genrelist = request.get_json()
    print("current user: ", current_user)
    print("genrelist: ", genrelist)
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

    newUser = UserPreference(user_id = current_user.id, genre=glist)
    db.session.add(newUser)
    db.session.commit()
    print(newUser)
    
    print('This is the result')
    
    return jsonify({'message': 'Genre Preference Has Been Set'}), 200

@app.route('/movierating', methods=['POST'])
@token_required
def movieratings(current_user):
    
    #serialized_genrelist = json.dumps(genrelist)

    user_id = current_user.id
    watchlist = UserWatchlist.query.filter_by(user_id=user_id).first()

    query = UserPreference.query.filter_by(user_id=current_user.id).first()
    glist = query.genre
    # glist = ""
    
    #genrelist_str = json.dumps(glist)
    movielist = watchlist.movie_id.split('|') if watchlist else []
    result = todays_hottest(glist, movielist)
    print('Hot Arrivals: ')
    print(result)

    return result

@app.route('/suggestions', methods=['POST'])
@token_required
def suggesttionfunction(current_user):
    print('hi')
    query = UserPreference.query.filter_by(user_id=current_user.id).first()
    glist = query.genre
    print('hi2')
    query2 = User.query.filter_by(id=current_user.id).first()
    age = query2.age
    print('hi3')
    result = top25_by_genre(glist, age)
    print('hi4')
    print(result)
    return result

# Route to fetch top movies based on choice and display as JSON
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


@app.route('/saveprofile', methods=['POST'])
def set_saveprofile():
    data = request.json  

    #data.Email find in user detail database
    #encrypt given data.Password
    #replace password

    return  

@app.route('/getwatched', methods=['POST'])
def get_watched():
    data = request.json  
    
    #data.Email find in user detail database
    # return list of titles
    
    return 

@app.route('/getusers', methods=['POST'])
def get_users():
    ids=[]
    query = db.session.query(UserWatchlist)
    
    for movie in query.all():
        id = movie.user_id
        query2= User.query.filter_by(id = movie.user_id).first()
        id = str(query2.name)
        user_info = {
                'title': id
            }
        ids.append(user_info)
    
    #ids = list(set(ids))
    
    print(ids)
    return ids


@app.route('/getlist', methods=['POST'])
def get_list():
    movielist=[]
    print('here')
    data = request.json
    print(data)
    print('hi2')
    name = data.get('user_id')  
    print(name)
    query = db.session.query(UserWatchlist).filter_by(user_id = name)

    for movie in query.all():
        moviename = movie.user_id
        movielist.append(moviename)
    
    return movielist

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

@app.route('/news')
def get_news():
    articles = news_api.fetch_news()
    return jsonify(articles)

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

# Sample data
total_movies = 1000
total_users = 5000

@app.route('/totalMovies', methods=['GET'])
def get_total_movies():
    # You can fetch this data from a database or any other source
    response_data = {
        'total_movies': total_movies
    }
    return jsonify(response_data)

@app.route('/totalUsers', methods=['GET'])
def get_total_users():
    # You can fetch this data from a database or any other source
    response_data = {
        'total_users': total_users
    }
    return jsonify(response_data)

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
    app.run(debug=True, port=8003)

