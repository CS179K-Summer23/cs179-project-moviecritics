import pandas as pd
from models import db, User, UserPreference, moviedetails, UserWatchlist
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import or_
from movie_list import MovieList

def seereqmovies():
    #print requested movies
    #approve or disapprove
    #remove from requested movies

def viewmoviedatabase():
    #print movie database by writing a csv

def addmovie():

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