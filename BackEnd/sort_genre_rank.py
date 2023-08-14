import csv
import json

csv_file = 'movies_db.csv'

def top25_by_genre(csv_file, target_genres, min_vote_count=1000, limit=25, age=None):
    movies_list = []
    with open(csv_file, 'r', newline='') as file:
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

if __name__ == "__main__":
    user_genres = input("Enter genres (Separate genres by commas): ")
    user_genres = [genre.strip().lower() for genre in user_genres.split(",")]
    
    user_age = int(input("Enter your age: "))
    
    if 1 <= len(user_genres) <= 5:
        movies_data = top25_by_genre(csv_file, user_genres, age=user_age)
        
        if movies_data:
            for movie in movies_data:
                movie['genres'] = '-'.join(movie['genres'].split('-'))
            
            json_data = json.dumps(movies_data, indent=2)
            print(json_data)
        else:
            print("No movies found :(")
    else:
        print("Please enter 1 to 5 genres separated by commas.")
