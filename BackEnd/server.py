from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User, UserPreference
import datetime
from movie_critics import MovieAnalyzerApp
import json
import csv
import jwt, os
from functools import wraps
from flask_bcrypt import Bcrypt

csv_filename = "movies_db.csv"

# Initializing flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
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

        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def todays_hottest(csv_file, target_genres, min_vote_count=1000, limit=10):
    movies_list = []
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            movie_title = row['title']
            movie_genres = row['genres'].split('-')
            vote_count = float(row['vote_count'])
            vote_average = float(row['vote_average'])
            release_date_str = row['release_date']
          
            ## Check for non-empty release_date
            if release_date_str:
                # Extract the year from the release_date
                try:
                    release_year = int(release_date_str.split('-')[0])
                except ValueError:
                    release_year = None

                if (release_year == 2023 or release_year == 2022 or release_year == 2021 or release_year == 2020 or release_year == 2019 or release_year == 2018) and any(genre.strip().lower() in target_genres for genre in movie_genres) and vote_count > min_vote_count:
                    movie_info = {
                        'title': movie_title,
                        'genres': movie_genres,
                        'vote_count': vote_count,
                        'vote_average': vote_average,
                        'release_date': release_date_str
                    }
                    movies_list.append(movie_info)
        
        # Sort movies by vote_count in descending order
        sorted_movies = sorted(movies_list, key=lambda x: x['vote_average'], reverse=True)
        
        return sorted_movies[:limit]

def top25_by_genre(csv_file, target_genres, min_vote_count=1000, limit=25):
    movies_list = []
    csv_file = 'movies_db.csv'
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            movie_title = row['title']
            movie_genres = row['genres'].split('-')
            vote_count = float(row['vote_count'])
            vote_average = float(row['vote_average'])
            if any(genre.strip().lower() in target_genres for genre in movie_genres) and vote_count > min_vote_count:
                movie_info = {
                    'title': movie_title,
                    'genres': movie_genres,
                    'vote_count': vote_count,
                    'vote_average': vote_average
                }
                movies_list.append(movie_info)
        print(31)
        # Sort movies by vote_average in descending order
        sorted_movies = sorted(movies_list, key=lambda x: x['vote_average'], reverse=True)
        
        return sorted_movies[:limit]
 
x = datetime.datetime.now()

@app.route('/signup', methods=['POST'])
def signup():
    user = request.get_json()
    name = user.get('name')
    email = user.get('email')
    password = user.get('password')
    age = user.get('age')

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    newUser = User(name = name, email = email, password = hashed_password, age = age)
    db.session.add(newUser)
    db.session.commit()
    # Generate a JWT token
    token = jwt.encode({'user_id': newUser.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                       app.config['SECRET_KEY'], algorithm='HS256')
    # print(user)
    return jsonify({'message': 'Signup Successful', 'token': token}), 201

@app.route('/login', methods=['POST'])
def login():
    print("API Called")
    user = request.get_json()
    email = user.get('email')
    password = user.get('password')
    # print(email, password)

    if email is None or email == "" or password is None or password == "":
        return jsonify({"message": "Invalid credentials"}), 400

    user = User.query.filter_by(email=email).first()
    print("user:", user)
    if user is None or not bcrypt.check_password_hash(user.password, password):
        print("Invalid Credentials")
        return jsonify({"message": "Invalid credentials"}), 401
    
    # Generate a JWT token
    token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                       app.config['SECRET_KEY'], algorithm='HS256')
    
    pref = UserPreference.query.filter_by(user_id = user.id).first()
    print("pref:", pref.genre)
    genrelist = json.loads(pref.genre)
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
    result = top25_by_genre('movies_db.csv', glist)

    return jsonify({"message": "Login Successful", "token": token, "result": result}), 200

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
    result = top25_by_genre('movies_db.csv', glist)
   
    return result

@app.route('/movieratings', methods=['POST'])
@token_required
def movieratings(current_user):
    genrelist = request.get_json()
    serialized_genrelist = json.dumps(genrelist)

    # Insert the serialized JSON string into the database
    new_preference = UserPreference(user_id=current_user.id, genre=serialized_genrelist)
    db.session.add(new_preference)
    db.session.commit()
    
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
    print(glist)
    #genrelist_str = json.dumps(glist)
    glist = [genre.strip().lower() for genre in glist.split(",")]
    print(glist)
    result = todays_hottest('movies_db.csv',glist)
   
    print (result)
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