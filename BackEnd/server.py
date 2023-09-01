from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from models import db, User, UserPreference, moviedetails, UserWatchlist, MovieReviews, RequestedMovies
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
from sqlalchemy import func
from movie_list import MovieList
from collections import Counter
from news import NewsAPI
# from surprise import Dataset, Reader, SVD
# from surprise.model_selection import train_test_split

import pandas as pd


from collections import defaultdict
import locale


import requests
import pandas as pd
import psycopg2
#from surprise import Dataset, Reader, SVD
#from surprise.model_selection import train_test_split
#from movie_recommendation import MovieRecommendationSystem

NEWS_API_KEY = " "

news_api = NewsAPI(NEWS_API_KEY)

streamurl = "https://streaming-availability.p.rapidapi.com/get"

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
        backdrop_path = movie.backdrop_path
        poster_path = movie.poster_path
        movie_rating = movie.rated
        poster = movie.poster_path
        backdrop = movie.backdrop_path
        
        if any(genre.strip().lower() in target_genres for genre in movie_genres.split('-')) and movie_title not in movie_ids:
            date_string = movie.release_date.strftime("%a, %d %b %Y")  # Format the date without time and timezone
            movie_info = {
                'title': movie_title,
                'genre': movie_genres,
                'vote_count': vote_count,
                'vote_average': vote_average,
                'release_date': date_string,
                'rated': movie_rating,

                'backdrop_path': backdrop_path,
                'poster_path' : poster_path

            }
            movies_list.append(movie_info)
    
    sorted_movies = sorted(movies_list, key=lambda x: datetime.datetime.strptime(x['release_date'], "%a, %d %b %Y"), reverse=True)
    return sorted_movies[:limit]


def top25_by_genre(target_genres, age, movielist, min_vote_count=1000, limit=25):
    movies_list = []

    ilike_conditions = [
        moviedetails.genre.ilike(f'%{genre}%') for genre in target_genres
    ]
    query = db.session.query(moviedetails).filter(or_(*ilike_conditions))

    for movie in query.all():

        if movie.title not in movielist:
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
    user = User.query.filter_by(email = email).first()
    if user:
        return jsonify({'message': 'User Already Exists'}), 201

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
    
    # pref = UserPreference.query.filter_by(user_id = user.id).first()
    # print("pref:", pref.genre)
    # genrelist = json.loads(pref.genre)
    # glist = ""
    # if(genrelist.get('Action')) : glist += "Action,"
    # if(genrelist.get('Adventure')) : glist += "Adventure,"
    # if(genrelist.get('Animation')) : glist += "Animation,"
    # if(genrelist.get('Comedy')) : glist += "Comedy,"
    # if(genrelist.get('Crime')) : glist += "Crime,"
    # if(genrelist.get('Documentary')) : glist += "Documentary,"
    # if(genrelist.get('Drama')) : glist += "Drama,"
    # if(genrelist.get('Family')) : glist += "Family,"
    # if(genrelist.get('Fantasy')) : glist += "Fantasy,"
    # if(genrelist.get('History')) : glist += "History,"
    # if(genrelist.get('Horror')) : glist += "Horror,"
    # if(genrelist.get('Music')) : glist += "Music,"
    # if(genrelist.get('Mystery')) : glist += "Mystery,"
    # if(genrelist.get('Romance')) : glist += "Romance,"
    # if(genrelist.get('ScienceFiction')) : glist += "ScienceFiction,"
    # if(genrelist.get('TVMovie')) : glist += "TVMovie,"
    # if(genrelist.get('Thriller')) : glist += "Thriller,"
    # if(genrelist.get('War')) : glist += "War,"
    # if(genrelist.get('Western')) : glist += "Western,"


    # glist = glist[:-1]
    # glist = [genre.strip().lower() for genre in glist.split(",")]
    # result = todays_hottest(glist, [])

    # return jsonify({"message": "Login Successful", "token": token, "result": result}), 200
    return jsonify({"message": "Login Successful", "token": token}), 200

@app.route('/updateaccount', methods=['POST'])
@token_required
def updateaccount(current_user):
    data=request.get_json()
    u = data.get(':r1u:')
    p = data.get(':r1v:')
    print('\n something')
    print(u)
    print(p)
    print('\n')
    hashed_password = bcrypt.generate_password_hash(p).decode('utf-8')
    print('\n else')
    print(hashed_password)
    print('\n')
    query = User.query.filter_by(id=current_user.id).first()
    query.email = u
    query.password = hashed_password
    db.session.add(query)
    # db.session.flush()
    db.session.commit()
    return jsonify({'message': 'Account Credentials Updated'}), 201


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
    print('Par Chart Data')
    age_range = request.args.get('ageRange')
    user_data = []

    users = (
        db.session.query(User.id, User.age, UserPreference.genre)
        .join(UserPreference, User.id == UserPreference.user_id)
        .all()
    )
    #print("age_range:", age_range)
    if age_range:
        min_age, max_age = map(int, age_range.split('-'))
    #     users = users.filter(User.age >= min_age, User.age <= max_age)

    genre_counts = Counter()
    print("length:", len(users))

    for user in users:

        if type(user.genre) != str:
            print("genre Type:", user.genre)
        if age_range:
            if user.age >= min_age and user.age <= max_age:
                try:
                    genres = json.loads(user.genre)

                    for genre, value in genres.items():
                        genre_counts.update({genre: int(value)})
                    user_data.append({"user_id": user.id, "age": user.age, "genres": user.genre})
                except:
                    genres = set(user.genre[1:-1].split(','))
                    for genre in genres:
                        genre_counts[genre] += 1
                    user_data.append({"user_id": user.id, "age": user.age, "genres": user.genre})
        else:
            user_data.append({"user_id": user.id, "age": user.age, "genres": user.genre})
    #print("genre_counts:", str(genre_counts))

    genre_data = [{"genre": genre, "count": count} for genre, count in genre_counts.items()]

    #print('genre_data:', genre_data)
    return jsonify(genre_data)


#Bar Graph
@app.route('/meanVotePerGenre', methods=['GET'])
def getMeanVotePerGenre():
    print('Bar Chart Data')
    genre_sums = defaultdict(float)
    genre_counts = Counter()

    movies = db.session.query(moviedetails.genre, moviedetails.vote_average).all()

    for movie_genre, mean_vote_average in movies:
        individual_genres = movie_genre.split('-')
        for genre in individual_genres:
            genre_sums[genre] += mean_vote_average
            genre_counts[genre] += 1
    
    #print('Genres', genre_counts)

    genre_mean_vote_data = [
        {
            "genre": genre,
            "mean_vote_average": round(genre_sums[genre] / genre_counts[genre], 2),
            "total_movies": genre_counts[genre]
        }
        for genre in genre_counts.keys()
    ]
    genre_mean_vote_data.sort(key=lambda x: x["mean_vote_average"])
    print('mean__vote_genres', genre_mean_vote_data)
    return jsonify(genre_mean_vote_data)



#Line Graph Chart
@app.route('/topGenresAndCompanies', methods=['GET'])
def getTopGenresAndCompanies():
    print('Top Genres and Companies Data')
    
    # Set locale for formatting numbers with commas and currency symbol
    locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
    
    genre_sums = defaultdict(lambda: {"votes": 0, "budget": 0, "revenue": 0, "profit": 0, "rating": 0})
    genre_counts = Counter()
    company_sums = defaultdict(lambda: {"votes": 0, "budget": 0, "revenue": 0, "profit": 0, "rating": 0})
    company_counts = Counter()

    movies = db.session.query(
        moviedetails.genre,
        moviedetails.productioncompanies,
        moviedetails.vote_average,
        moviedetails.budget,
        moviedetails.revenue
    ).all()

    for movie_genre, production_company, mean_vote_average, budget, revenue in movies:
        individual_genres = movie_genre.split('-')
        for genre in individual_genres:
            genre_sums[genre]["votes"] += mean_vote_average
            genre_sums[genre]["budget"] += budget
            genre_sums[genre]["revenue"] += revenue
            genre_sums[genre]["profit"] += (revenue - budget)
            genre_counts[genre] += 1
        
        # Check if the production company has a name before processing
        if production_company and production_company.strip():
            cleaned_company = production_company.strip()
            company_sums[cleaned_company]["votes"] += mean_vote_average
            company_sums[cleaned_company]["budget"] += budget
            company_sums[cleaned_company]["revenue"] += revenue
            company_sums[cleaned_company]["profit"] += (revenue - budget)
            company_counts[cleaned_company] += 1

    for genre in genre_sums:
        if genre_counts[genre] > 0:
            genre_sums[genre]["rating"] = round(genre_sums[genre]["votes"] / genre_counts[genre], 2)
            genre_sums[genre]["votes"] = round(genre_sums[genre]["votes"], 2)
            genre_sums[genre]["budget"] = locale.currency(genre_sums[genre]["budget"], grouping=True)
            genre_sums[genre]["revenue"] = locale.currency(genre_sums[genre]["revenue"], grouping=True)
            genre_sums[genre]["profit"] = locale.currency(genre_sums[genre]["profit"], grouping=True)
    
    for company in company_sums:
        if company_counts[company] > 0:
            company_sums[company]["rating"] = round(company_sums[company]["votes"] / company_counts[company], 2)
            company_sums[company]["votes"] = round(company_sums[company]["votes"], 2)
            company_sums[company]["budget"] = locale.currency(company_sums[company]["budget"], grouping=True)
            company_sums[company]["revenue"] = locale.currency(company_sums[company]["revenue"], grouping=True)
            company_sums[company]["profit"] = locale.currency(company_sums[company]["profit"], grouping=True)
            company_sums[company]["rating"] = round(company_sums[company]["rating"], 2)  

    top_genres = [{"genre": genre, **data} for genre, data in genre_sums.items()]
    top_genres.sort(key=lambda x: x["rating"], reverse=True)
    top_genres = top_genres[:5]

    top_companies = [{"company": company, **data} for company, data in company_sums.items()]
    top_companies.sort(key=lambda x: x["rating"], reverse=True)
    top_companies = top_companies[:5]
    
    #print('top_genres:', top_genres)
    #print('top_companies:', top_companies)
    return jsonify({"top_genres": top_genres, "top_companies": top_companies})

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
    # glist = [genre.strip().lower() for genre in glist.split(",")]

    newUser = UserPreference(user_id = current_user.id, genre=glist)
    db.session.add(newUser)
    db.session.commit()
    print(newUser)
    
    print('This is the result')
    
    return jsonify({'message': 'Genre Preference Has Been Set'}), 200

@app.route('/usersurveyupdate', methods=['POST'])
@token_required
def usersurveyupdate(current_user):
    genrelist = request.get_json()
    print("current user: ", current_user)
    print("genrelist: ", genrelist)
    glist = ""
    user = UserPreference.query.filter_by(user_id = current_user.id).first()
    print(user.genre)
    print('something else')
    
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

    user.genre = glist
    print(glist)
    print('\n')
    db.session.add(user)
    # db.session.flush()
    db.session.commit()
    
    return jsonify({'message': 'Genre Preference Has Been Set'}), 200

@app.route('/movierating', methods=['POST'])
@token_required
def movieratings(current_user):
    
    #serialized_genrelist = json.dumps(genrelist)

    user_id = current_user.id
    watchlist = UserWatchlist.query.filter_by(user_id=user_id).first()

    query = UserPreference.query.filter_by(user_id=current_user.id).first()
    glist = query.genre
    glist = [genre.strip().lower() for genre in glist.split(",")]
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
    glist = [genre.strip().lower() for genre in glist.split(",")]
    print('hi2')
    query2 = User.query.filter_by(id=current_user.id).first()
    age = query2.age
    watchlist = UserWatchlist.query.filter_by(user_id=current_user.id).first()
    movielist = watchlist.movie_id.split('|') if watchlist else []
    print('hi3')
    result = top25_by_genre(glist, age, movielist = movielist)
    print('hi4')
    print(result)
    print(type(result))
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



@app.route('/getwatched', methods=['POST'])
@token_required
def get_watched(current_user):

    watchlist = UserWatchlist.query.filter_by(user_id=current_user.id).first()
    listq = watchlist.movie_id
    listq = listq.split('|')
    
    return listq

@app.route('/getreviews', methods=['POST'])
@token_required
def get_reviews(current_user):
    result = []
    query = MovieReviews.query.filter_by(user_id=current_user.id)
    for movie in query.all():
        print('\n')
        print(movie.movie_id)
        print('\n')
        query2 = moviedetails.query.filter_by(id=movie.movie_id).first()
        movie_title = query2.title
        movie_rating = movie.rating
        movie_comment = movie.comment   
        movie_info = {
            'title': movie_title,
            'rating': movie_rating,
            'comment' : movie_comment
        }
        result.append(movie_info)
    
    return result

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
    data = request.args.get('jsonchoose')
    print('\n')
    print(data)
    print('\n')
    query = User.query.filter_by(name=data).first()
    print('\n')
    newid = query.id
    print('\n')
    print(newid)
    print('\n')
    query2 = UserWatchlist.query.filter_by(user_id=newid).first()
    print('\n')
    print(query2)
    print('\n')
    listq = query2.movie_id
    listq = listq.split('|')
    #print(type(listq))
    #print(listq)
    
    
    return listq

@app.route('/movie_data', methods=['POST'])
def get_movie_data():
    movie_app = MovieList(db_params)
    movie_data = movie_app.read_movie_data()

    if movie_data:
        return jsonify({'movie_data': movie_data}), 200
    else:
        return jsonify({'message': 'No movie data found.'}), 404
    

@app.route('/submit_rating', methods=['POST'])
@token_required
def submit_rating(current_user):
    data = request.get_json()
    movie_title = data.get('movie_title')
    new_rating = data.get('new_rating')
    c = data.get('comment')

    print("params:", c, movie_title, new_rating)

    movie_app = MovieList(db_params)

    query = moviedetails.query.filter_by(title=movie_title).first()
    mid = query.id
    newrev = MovieReviews( user_id=current_user.id , movie_id=mid , rating  = new_rating, comment = c)
    db.session.add(newrev)
    db.session.commit()

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
    print('userecommend')
    print(user_recommendations)
    recommendations_df = pd.DataFrame(user_recommendations)
    columns_to_drop = ['runtime', 'vote_average']
    #recommendations_df = recommendations_df.drop(columns=columns_to_drop)
    recommendations_df['rating'] = recommendations_df['rating'].apply(lambda x: round(x, 2))
    recommendations_df['release_date'] = recommendations_df['release_date'].apply(lambda x: x.strftime('%Y-%m-%d'))
    recommendations_json = recommendations_df.to_dict(orient='records')
    recommendations_json_string = json.dumps(recommendations_json, indent=2)

    return recommendations_json_string
    



@app.route('/movieInfo', methods=["POST"])
def get_movieinfo():
    name = request.args.get('moviename')
    data = moviedetails.query.filter_by(title=name).first()
    movie_info = {
                'title': data.title,
                'genre': data.genre,
                'vote_count': data.vote_count,
                'vote_average': data.vote_average,
                'rated': data.rated,
                'backdrop_path': data.backdrop_path,
                'poster_path' : data.poster_path,
                'language' : data.language,
                'overview' : data.overview,
                'productioncompanies' : data.productioncompanies,
                'releasedate' : data.release_date,
                'credits' : data.credits
            }
    
    print(movie_info)
    return movie_info

@app.route('/reviews', methods=["POST"])
def get_revmovie():
    review_list=[]
    name = request.args.get('moviename')
    mid = moviedetails.query.filter_by(title=name).first()
    data = MovieReviews.query.filter_by(movie_id=mid.id)

    for movie in data.all():
        rating = movie.rating
        comment = movie.comment
        
        rev = {
            'rating': rating,
            'comment': comment
        }
        review_list.append(rev)

    print('list: \n')
    print(review_list)
    print(type(review_list))
    return review_list

@app.route('/streaminfo', methods=["POST"])
def get_streammovie():
    name = request.args.get('moviename')
    data = moviedetails.query.filter_by(title=name).first()
    moviequery = "movie/" + str(data.id)

    querystring = {"output_language":"en","tmdb_id":moviequery}
    print('here1')
    headers = {
	"X-RapidAPI-Key": "",
	"X-RapidAPI-Host": ""
    }
    print('here2')
    response = requests.get(streamurl, headers=headers, params=querystring)
    print('here3')
    print(response.json())
    print('here4')
    resp_dict = response.json()
    result = []
    for item in resp_dict["result"]["streamingInfo"]["ca"]:
        print(item)
        element = {}
        element['service'] = item.get('service', 'None')
        element['streamingType'] = item.get('streamingType', 'None')
        result.append(element)
        print(item.get('service', 'None'))
        print(item.get('streamingType', 'None'))
        # print(item['service'], item['streamingType'])
        # print(item.get['services'])
        
    response = jsonify(result)
    return response

@app.route('/requestmovie')
def request_movie():
    req = request.get_json()
    id = req.get('user_id')
    name = req.get('movie_name')
    description = req.get('description')

    newreq = User(user_id = id, movie_name = name, description = description)
    db.session.add(newreq)
    db.session.commit()
   
    return jsonify({'message': 'Movie Requested'})


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
    
@app.route('/suggestions', methods=['POST'])
def get_suggestions(current_user):
    print('Here12132')
    data = request.json
    user = User.query.filter_by(id=current_user.id).first()
    age = user.age
    query = UserPreference.query.filter_by(user_id = current_user.id).first()
    genre = query.genre

    result = top25_by_genre(genre,age)

    print(result)
    return result

# @app.route('/movieratings', methods=['POST'])
# @token_required
# def movieratings(current_user):

#     query = UserPreference.query.filter_by(user_id=current_user.id).first()
#     query2= User.query.filter_by(id = current_user.id).first()
#     age = query2.age
#     genre = query.genre



#     result = todays_hottest(genre, age)
#     print('Hot Arrivals: ')
#     print(result)

#     return result
 
     
# Running app
if __name__ == '__main__':
    app.run(debug=True, port=8003)

