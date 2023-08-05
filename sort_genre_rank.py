import csv
import json

csv_file = 'movies.csv'

def top25_by_genre(csv_file, target_genres, min_vote_count=1000, limit=25):
    movies_list = []
    with open(csv_file, 'r', newline='') as file:
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
        
        # Sort movies by vote_average in descending order
        sorted_movies = sorted(movies_list, key=lambda x: x['vote_average'], reverse=True)
        
        return sorted_movies[:limit]

if __name__ == "__main__":
    user_genres = input("Enter genres (Seperate gnenres by commas): ")
    user_genres = [genre.strip().lower() for genre in user_genres.split(",")]
    if 1 <= len(user_genres) <= 5:
        movies_data = top25_by_genre(csv_file, user_genres)
        if movies_data:
            json_data = json.dumps(movies_data, indent=2)
            print(json_data)
        else:
            print(f"No movies found :( ")
    else:
        print("Please enter 1 to 5 genres separated by commas.")