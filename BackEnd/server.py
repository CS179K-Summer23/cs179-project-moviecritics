from flask import Flask, request
from flask_cors import CORS
from models import db, User
import datetime
 
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
    newUser = User(name = name, email = email, password = password, age = age)
    db.session.add(newUser)
    db.session.commit()
    print(user)
    return 'Signup Successful'

@app.route('/usersurvey', methods=['POST'])
def usersurvey():
    genrelist = request.get_json()
    
    print(genrelist)
    genrelist = ""
    if(genrelist.get('Adventure')) : genrelist =+ "Adventure,"
    if(genrelist.get('Adventure')) : genrelist =+ "Adventure,"
    if(genrelist.get('Adventure')) : genrelist =+ "Adventure,"
    if(genrelist.get('Adventure')) : genrelist =+ "Adventure,"
    if(genrelist.get('Adventure')) : genrelist =+ "Adventure,"
    if(genrelist.get('Adventure')) : genrelist =+ "Adventure,"
    genrelist = genrelist[:-1]
    #call Roz function, 


    return #json 

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