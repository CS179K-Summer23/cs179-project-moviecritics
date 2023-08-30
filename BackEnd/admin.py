import pandas as pd
from models import db, User, UserPreference, moviedetails, UserWatchlist, MovieReviews, RequestedMovies
from movie_list import MovieList
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import psycopg2

db = SQLAlchemy()
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost/postgres'
app.config['SQLALCHEMY_ECHO'] = True
db.init_app(app)
CORS(app)

def seereqmovies():
    a = 0
    query = RequestedMovies.query
    for movie in query.all():
        print(movie)
        a = input("(1) Approve \n (2) Disapprove \n (3) Exit")
        if (a == 1):
            approvemovie()
        if (a == 2):
            disaprovemovie()
        if (a == 3):
            break
        if (a < 1):
            break
        if (a > 3):
            break

def disaprovemovie():
    connection = psycopg2.connect(db_params)
    cursor = connection.cursor()
    query = "DELETE;"
    cursor.execute(query)
    connection.commit()

def viewmoviedatabase():
    #print movie database by writing a csv

def addmovie(moviename):
    a = input("Enter id:")
    b = input("Enter genre(s): (Seperated by  '-'  ) ")
    c = input("Enter language:")
    d = input("Enter Overview:")
    e = input("Enter Popularity:")
    f = input("Enter ProductionCompanies:")
    g = input("Enter ReleaseDate: (year-month-day)")
    h = input("Enter budget:")
    i = input("Enter revenue:") 
    j = input("Enter runtime:")
    k = input("Enter status:")
    l = "none"
    m = 5
    n = 1
    o = input("Enter credits:")
    p =  "none"  #q and r are img so do not take
    s = "1234"
    t = input("Enter profit:")
    u = input("Enter rating:")
    v = input("Enter rated (PG or PG-13):")
    w = 1

    addm = moviedetails(id = a, title= moviename, genre = b, language = c, overview = d, popularity = e, productioncompanies = f, release_date = g, budget = h, revenue = i, runtime = j, status = k, tagline = l, vote_average = m, vote_count = n, credits = o, keywords = p, recommendations = s, profit = t, rating = u, rated = v , new_rating = w  ) 
    db.session.add(addm)
    db.session.commit()
    print('Movie Added')
    #Delete Request


def deletemovie():
    #delete a movie in db

def updatemovie():
    #update selected movie in DB

def main():
    i=0
    id=0
    print('Welcome to the Admin portal')
    while i != 6:
        print('1. See Requested Movies')
        print('2. View Movie Database')
        print('3. Add a movie to Database')
        print('4. Delete a movie in Database')
        print('5. Update movie in Database')
        print('6. EXIT')
        i = input("Enter choice:")
        if (i == 1):
            seereqmovies()

        if (i == 2):
            viewmoviedatabase()

        if (i == 3):
            addmovie()

        if (i == 4):
            id = input("Input ID of Movie to be deleted: ")

        if (i == 5):
            id = input("Input ID of Movie to be updated: ")


  
  
# Using the special variable 
# __name__
if __name__=="__main__":
    main()