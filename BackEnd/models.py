from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class UserPreference(db.Model):
    __tablename__ = 'user_preference'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    genre = db.Column(db.Text, nullable=False)  # Store serialized JSON as text

    def __init__(self, user_id, genre):
        self.user_id = user_id
        self.genre = genre
    

class moviedetails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(500), nullable=False)
    genre = db.Column(db.String(100), nullable=False) 
    language = db.Column(db.String(10), nullable=False)
    overview = db.Column(db.String(10000), nullable=False)
    popularity = db.Column(db.Float, nullable=False)
    productioncompanies = db.Column(db.String(10000), nullable=False)
    release_date = db.Column(db.TIMESTAMP, nullable=False)
    budget = db.Column(db.Float, primary_key=True)
    revenue = db.Column(db.Float, primary_key=True)
    runtime = db.Column(db.Float, primary_key=True)
    status = db.Column(db.String(20), nullable=False)
    tagline = db.Column(db.db.String(10000), nullable=False)
    vote_average = db.Column(db.Float, primary_key=True)
    vote_count = db.Column(db.Float, primary_key=True)
    credits = db.Column(db.String(10000), nullable=False)
    keywords = db.Column(db.String(10000), nullable=False)
    recommendations = db.Column(db.String(10000), nullable=False)
    profit = db.Column(db.Float, primary_key=True)
    rating = db.Column(db.Float, primary_key=True)
    rated = db.Column(db.String(10), nullable=False)
                     
                   


class User_watchlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    userid = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    movie_id = db.Column(db.String(120), unique=True, nullable=False)