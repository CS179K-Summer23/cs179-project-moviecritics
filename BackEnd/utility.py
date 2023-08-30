import csv
import psycopg2

db_params = {
    'dbname': 'postgres',
    'user': 'postgres',
    'password': '1234',
    'host': 'localhost',
    'port': '5432'
}

csv_file_path = 'movie_db.csv'

insert_columns = [
    'id', 'title', 'genre', 'language', 'overview', 'popularity',
    'productioncompanies', 'release_date', 'budget', 'revenue', 'runtime',
    'status', 'tagline', 'vote_average', 'vote_count', 'credits', 'keywords', 'poster_path', 'backdrop_path',
    'recommendations', 'profit', 'rating', 'rated'
]

connection = psycopg2.connect(**db_params)
connection.set_client_encoding('UTF8')
cursor = connection.cursor()

with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
    csvreader = csv.DictReader(csvfile)

    for row in csvreader:
        try:
            if any(ord(char) > 127 for char in row['overview']) or any(ord(char) > 127 for char in row['credits']):
                print(f"Skipping row with ID {row['id']} due to non-ASCII characters in 'overview' or 'credits'")
                continue  # Skip the row
                
            values = [
                int(row['id']),
                row['title'],
                row['genre'],
                row['language'],
                row['overview'],
                float(row['popularity']),
                row['productioncompanies'],
                row['release_date'],
                float(row['budget']),
                float(row['revenue']),
                float(row['runtime']),
                row['status'],
                row['tagline'],
                float(row['vote_average']),
                float(row['vote_count']),
                row['credits'],
                row['keywords'],
                row['poster_path'],
                row['backdrop_path'],
                row['recommendations'],
                float(row['profit']),
                float(row['rating']),
                row['rated']
            ]
            
            placeholders = ','.join(['%s'] * len(values))
            
            query = f"INSERT INTO movieDetails ({','.join(insert_columns)}) VALUES ({placeholders});"
            cursor.execute(query, values)
        except UnicodeEncodeError:
            print(f"Skipping row with ID {row['id']} due to encoding issues")

connection.commit()
cursor.close()
connection.close()

print("Data inserted successfully!")
