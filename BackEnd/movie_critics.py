import pandas as pd

class MovieAnalyzer:
    def __init__(self, csv_path):
        self.csv_path = csv_path
        self.movie_df = pd.read_csv(csv_path)

        # Remove duplicate entries based on 'title' and 'release_date'
        self.movie_df.drop_duplicates(subset=['title', 'release_date'], keep='first', inplace=True)

        self.calculate_profit()
        self.calculate_rating()

    def calculate_profit(self):
        self.movie_df['profit'] = self.movie_df['revenue'] - self.movie_df['budget']

    def calculate_rating(self):
        def calculate(row, min_votes, min_rating):
            vote_count = row['vote_count']
            vote_average = row['vote_average']
            weighted_average = (vote_count / (vote_count + min_votes)) * vote_average
            default_rating = (min_votes / (vote_count + min_votes)) * min_rating
            return weighted_average + default_rating

        min_votes = 100
        min_rating = 5.0
        self.movie_df['rating'] = self.movie_df.apply(lambda row: calculate(row, min_votes, min_rating), axis=1)

    def rank_movies_by_vote_average(self):
        ranked_movies = self.movie_df.sort_values(by=['rating', 'title'], ascending=[False, True])
        ranked_movies['rank'] = range(1, len(ranked_movies) + 1)
        return ranked_movies

    def rank_movies_by_profit(self):
        ranked_movies = self.movie_df.sort_values(by=['profit', 'title'], ascending=[False, True])
        ranked_movies['rank'] = range(1, len(ranked_movies) + 1)
        return ranked_movies

    def rank_movies_by_revenue(self):
        ranked_movies = self.movie_df.sort_values(by=['revenue', 'title'], ascending=[False, True])
        ranked_movies['rank'] = range(1, len(ranked_movies) + 1)
        return ranked_movies

    def get_top_movies_by_rating_df(self, n=30):
        columns_to_display = ['rank', 'title', 'rating', 'release_date']
        top_movies_df = self.rank_movies_by_vote_average().head(n)
        return top_movies_df[columns_to_display]

    def get_top_movies_by_profit_df(self, n=30):
        columns_to_display = ['rank', 'title', 'profit', 'release_date']
        top_movies_df = self.rank_movies_by_profit().head(n)
        return top_movies_df[columns_to_display]

    def get_top_movies_by_revenue_df(self, n=30):
        columns_to_display = ['rank', 'title', 'revenue', 'release_date']
        top_movies_df = self.rank_movies_by_revenue().head(n)
        return top_movies_df[columns_to_display]

    def display_top_movies_table(self, top_movies_df):
        print(top_movies_df.to_string(index=False))

    def save_to_csv(self):
        self.movie_df.to_csv(self.csv_path, index=False)

if __name__ == "__main__":
    class MovieAnalyzerApp:
        def __init__(self):
            self.movie_csv_path = 'movies.csv'
            self.analyzer = MovieAnalyzer(self.movie_csv_path)
            
        def run(self):
            print("-----Top 30 Films based on ratings-----")
            top_movies_by_rating_df = self.analyzer.get_top_movies_by_rating_df()
            self.analyzer.display_top_movies_table(top_movies_by_rating_df)

            print("\n-----Top 30 Films based on profits-----")
            top_movies_by_profit_df = self.analyzer.get_top_movies_by_profit_df()
            self.analyzer.display_top_movies_table(top_movies_by_profit_df)

            print("\n-----Top 30 Films based on revenue-----")
            top_movies_by_revenue_df = self.analyzer.get_top_movies_by_revenue_df()
            self.analyzer.display_top_movies_table(top_movies_by_revenue_df)

            self.analyzer.save_to_csv()

    app = MovieAnalyzerApp()
    app.run()
