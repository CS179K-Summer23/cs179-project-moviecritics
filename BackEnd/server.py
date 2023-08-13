from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, User
import datetime
from movie_critics import MovieAnalyzerApp
#from sort_genre_rank import top25_by_genre
#import subprocess
import json
import csv 

def top25_by_genre(csv_file, target_genres, min_vote_count=1000, limit=25):
    movies_list = []
    csv_file = 'movies.csv'
    print(13)
    with open(csv_file, 'r', newline='', encoding='utf-8') as file:
        print(15)
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
 
# Initializing flask app
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
db.init_app(app)
CORS(app)



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

@app.route('/usersurvey', methods=['POST'])
def usersurvey():
    genrelist = request.get_json()
    
    print(genrelist)
    glist = ""

    if(genrelist.get('Adventure')) : glist += "Adventure,"
    if(genrelist.get('Animation')) : glist += "Animation,"
    if(genrelist.get('Biography')) : glist += "Biography,"
    if(genrelist.get('Comedy')) : glist += "Comedy,"
    if(genrelist.get('Crime')) : glist += "Crime,"
    if(genrelist.get('Documentary')) : glist += "Documentary,"
    if(genrelist.get('Horror')) : glist += "Horror,"
    if(genrelist.get('Mystery')) : glist += "Mystery,"
    if(genrelist.get('Thriller')) : glist += "Thriller,"
    if(genrelist.get('War')) : glist += "War,"


    glist = glist[:-1]
    print(glist)
    #genrelist_str = json.dumps(glist)
    glist = [genre.strip().lower() for genre in glist.split(",")]
    print('79')
    print(glist)
    result = top25_by_genre('movies.csv', glist)
    
    print('59')
    #result_str = result.decode('utf-8')
    
    print('61')

    #call Roz function, 
    #result = subprocess.check_output(["python", "sort_genre_rank.py", glist])
    print('Hi')
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