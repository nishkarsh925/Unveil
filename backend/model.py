import pandas as pd
import numpy as np
import re
import nltk
import pickle
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.metrics.pairwise import cosine_similarity
from gensim.models import Word2Vec
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.feature_selection import SelectFromModel
# Download all necessary NLTK resources
def download_nltk_resources():
    resources = [
        'punkt',
        'stopwords',
        'wordnet',
        'vader_lexicon',
        'averaged_perceptron_tagger'
    ]
    for resource in resources:
        try:
            nltk.download(resource, quiet=True)
        except Exception as e:
            print(f"Error downloading {resource}: {e}")

# Download resources before initializing
download_nltk_resources()

class NewsBiasDetector:
    def __init__(self, api_key=None):
        # Initialize NewsAPI client if key is provided
        self.newsapi = None
        if api_key:
            try:
                from newsapi import NewsApiClient
                self.newsapi = NewsApiClient(api_key=api_key)
            except ImportError:
                print("NewsAPI client not installed. Running without real-time news fetching.")
        
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()
        self.sia = SentimentIntensityAnalyzer()
        self.tfidf_vectorizer = None
        self.model = None
        self.word2vec_model = None
        
        # Dictionary of politically loaded words
        self.loaded_words = {
            'left_leaning': ['progressive', 'liberal', 'socialist', 'welfare', 'equity'],
            'right_leaning': ['conservative', 'tradition', 'freedom', 'patriot', 'fiscal'],
            'biased_adjectives': ['corrupt', 'radical', 'extremist', 'dictatorial', 'anti-national', 
                                'revolutionary', 'historic', 'transformative', 'disastrous']
        }
        
        # Default NewsAPI key - replace with your actual key
        self.default_api_key = "9b9ad6a918884349a9a75f2d5c2c6f78"
        
    def fetch_stories(self, category=None, query=None, count=10):
        """
        Fetch news stories from NewsAPI and analyze them for bias
        
        Args:
            category: News category (business, entertainment, health, science, sports, technology)
            query: Search query
            count: Number of stories to fetch
            
        Returns:
            List of analyzed stories
        """
        if not self.newsapi:
            try:
                from newsapi import NewsApiClient
                self.newsapi = NewsApiClient(api_key=self.default_api_key)
            except (ImportError, Exception) as e:
                print(f"Error initializing NewsAPI: {e}")
                return self._get_sample_stories(count)
        
        try:
            # Fetch top headlines or search results
            if query:
                response = self.newsapi.get_everything(
                    q=query,
                    language='en',
                    page_size=count,
                    sort_by='relevancy'
                )
            else:
                response = self.newsapi.get_top_headlines(
                    category=category,
                    language='en',
                    page_size=count
                )
            
            stories = []
            for idx, article in enumerate(response.get('articles', [])):
                if not article.get('content'):
                    continue
                    
                # Basic analysis without full text to save processing time
                processed_text = self.preprocess_text(article.get('description', '') + ' ' + article.get('title', ''))
                sentiment = self.sia.polarity_scores(processed_text)
                
                # Count sources
                source_count = 1  # At minimum the article itself is a source
                if article.get('content'):
                    # Rough estimation of additional sources by counting quotes
                    quotes = len(re.findall(r'"[^"]*"', article.get('content', '')))
                    source_count += min(quotes, 20)  # Cap at reasonable number
                
                # Quick bias estimation based on loaded words
                bias_score = 0
                for category, words in self.loaded_words.items():
                    bias_score += sum(1 for word in processed_text.split() if word in words)
                bias_score = min(100, bias_score * 10)  # Scale from 0-100
                
                # Estimate accuracy based on source reputation
                # This is a simplified estimate - in real app would use more factors
                accuracy = 60 + (40 - min(bias_score/2, 40))
                
                story = {
                    "id": str(idx + 1),
                    "title": article.get('title', 'Untitled Story'),
                    "description": article.get('description', 'No description available'),
                    "url": article.get('url', ''),
                    "urlToImage": article.get('urlToImage', ''),
                    "publishedAt": article.get('publishedAt', ''),
                    "source": article.get('source', {}).get('name', 'Unknown Source'),
                    "type": "important" if accuracy > 80 else "viral",
                    "metrics": {
                        "accuracy": int(accuracy),
                        "bias": int(bias_score),
                        "sources": source_count
                    }
                }
                
                stories.append(story)
            
            return stories
                
        except Exception as e:
            print(f"Error fetching stories from NewsAPI: {e}")
            return self._get_sample_stories(count)
            
    def _get_sample_stories(self, count=10):
        """Return sample stories when NewsAPI is unavailable"""
        sample_stories = []
        return sample_stories[:count]
    
    def collect_data(self, sources=None, categories=None, sample_size=1000):
        """
        Collect news articles and assign bias labels based on source credibility
        """
        print("Collecting data...")
        
        if not self.newsapi:
            print("NewsAPI client not initialized. Cannot collect data.")
            return self.create_sample_data()
        
        # Sample of sources categorized by bias
        biased_sources = ['breitbart.com', 'foxnews.com', 'huffpost.com', 'msnbc.com']
        unbiased_sources = ['reuters.com', 'apnews.com', 'bbc.com', 'economist.com']
        
        articles = []
        labels = []
        
        # Get articles from biased sources
        for source in biased_sources:
            try:
                response = self.newsapi.get_everything(
                    domains=source,
                    language='en',
                    page_size=sample_size//len(biased_sources)
                )
                
                for article in response['articles']:
                    articles.append(article['content'])
                    labels.append(1)  # Biased
            except Exception as e:
                print(f"Error fetching from {source}: {e}")
        
        # Get articles from unbiased sources
        for source in unbiased_sources:
            try:
                response = self.newsapi.get_everything(
                    domains=source,
                    language='en',
                    page_size=sample_size//len(unbiased_sources)
                )
                
                for article in response['articles']:
                    articles.append(article['content'])
                    labels.append(0)  # Unbiased
            except Exception as e:
                print(f"Error fetching from {source}: {e}")
        
        if not articles:
            print("No articles collected. Using sample data.")
            return self.create_sample_data()
            
        return pd.DataFrame({
            'content': articles,
            'bias': labels
        })
    
    def create_sample_data(self):
     """Create a more diverse sample dataset for testing"""
     print("Creating sample dataset...")
     sample_data = {
        'content': [
            # Biased articles (political right)
            "The corrupt socialist government introduced another anti-business law that will destroy our economy.",
            "Radical leftist politicians continue pushing their extremist agenda against hard-working citizens.",
            "Patriots must stand against the dictatorial regime's anti-freedom policies.",
            
            # Biased articles (political left)
            "The oppressive conservative regime imposed draconian measures against vulnerable communities.",
            "Corporate-backed politicians ram through another destructive anti-environment bill.",
            "Progressive champions battle against regressive forces of bigotry and hatred.",
            
            # Neutral articles
            "The new legislation contains provisions for both tax increases and spending cuts.",
            "Economic experts disagree on the potential impact of the proposed regulations.",
            "Recent polls show mixed public reaction to the policy changes.",
            "The bill passed with support from members of both major parties.",
            "Analysis suggests the law may have both positive and negative effects.",
            "Independent observers note varying outcomes in different regions.",
            "Research indicates complex relationship between policy and economic growth.",
            "Studies show multiple factors influence the program's effectiveness.",
            "Experts recommend careful evaluation of the policy's long-term impacts."
        ],
        'bias': [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]  # 1 for biased, 0 for unbiased
     }
     return pd.DataFrame(sample_data)
    
    def load_existing_datasets(self):
        """
        Load and combine existing datasets
        This is a placeholder - actual implementation would load from files or APIs
        """
        print("Loading existing datasets...")
        return self.create_sample_data()
    
    def preprocess_text(self, text):
        """
        Preprocess text data with improved error handling
        """
        try:
            if not isinstance(text, str):
                return ""
                
            # Convert to lowercase
            text = text.lower()
            
            # Remove special characters, numbers, and punctuation
            text = re.sub(r'[^\w\s]', '', text)
            text = re.sub(r'\d+', '', text)
            
            try:
                # Tokenize with error handling
                tokens = word_tokenize(text)
            except LookupError:
                # Fallback tokenization if NLTK tokenizer fails
                tokens = text.split()
            
            # Remove stopwords and lemmatize
            tokens = [self.lemmatizer.lemmatize(word) for word in tokens if word not in self.stop_words]
            
            return ' '.join(tokens)
        except Exception as e:
            print(f"Error in preprocess_text: {e}")
            return ""
    
    def extract_features(self, text):
        """
        Extract features for bias detection
        """
        features = {}
        
        # 1. Sentiment Analysis
        sentiment = self.sia.polarity_scores(text)
        features['sentiment_compound'] = sentiment['compound']
        features['sentiment_positive'] = sentiment['pos']
        features['sentiment_negative'] = sentiment['neg']
        features['sentiment_neutral'] = sentiment['neu']
        
        # 2. Emotion & Tone Detection
        emotion_keywords = {
            'anger': ['angry', 'furious', 'outrage', 'rage'],
            'fear': ['afraid', 'scared', 'terrified', 'fearful'],
            'joy': ['happy', 'excited', 'celebration', 'triumph'],
            'sadness': ['sad', 'depressed', 'grief', 'sorrow']
        }
        
        for emotion, keywords in emotion_keywords.items():
            features[f'emotion_{emotion}'] = sum(1 for word in text.split() if word in keywords)
        
        # 3. Keyword & Framing Bias
        for category, words in self.loaded_words.items():
            features[f'loaded_words_{category}'] = sum(1 for word in text.split() if word in words)
        
        return features
    
    def find_similar_articles(self, article_text, sources=None):
        """
        Find similar articles from different sources for comparison
        """
        if not self.newsapi:
            return []
            
        tokens = self.preprocess_text(article_text).split()
        keywords = ' OR '.join([token for token in tokens if len(token) > 4][:5])
        
        similar_articles = []
        try:
            response = self.newsapi.get_everything(
                q=keywords,
                language='en',
                page_size=5,
                sort_by='relevancy'
            )
            
            for article in response['articles']:
                similar_articles.append({
                    'source': article['source']['name'],
                    'title': article['title'],
                    'content': article['content'],
                    'url': article['url']
                })
        except Exception as e:
            print(f"Error finding similar articles: {e}")
        
        return similar_articles
    
    def train_word_embeddings(self, texts):
        """
        Train Word2Vec model for political affiliation detection
        """
        sentences = [text.split() for text in texts]
        
        self.word2vec_model = Word2Vec(sentences, vector_size=100, window=5, min_count=1, workers=4)
        self.word2vec_model.train(sentences, total_examples=len(sentences), epochs=10)
    
    def detect_political_affiliation(self, text):
        """
        Use word embeddings to detect political affiliation
        """
        if not self.word2vec_model:
            return "neutral"
            
        words = text.split()
        
        left_score = 0
        right_score = 0
        
        for word in words:
            if word in self.word2vec_model.wv:
                for left_word in self.loaded_words['left_leaning']:
                    if left_word in self.word2vec_model.wv:
                        left_score += self.word2vec_model.wv.similarity(word, left_word)
                
                for right_word in self.loaded_words['right_leaning']:
                    if right_word in self.word2vec_model.wv:
                        right_score += self.word2vec_model.wv.similarity(word, right_word)
        
        if abs(left_score - right_score) < 0.1:
            return "neutral"
        elif left_score > right_score:
            return "left-leaning"
        else:
            return "right-leaning"
    def prepare_dataset(self, df):
      """
      Prepare dataset for model training with proper feature naming
      """
      try:
          # Preprocess text
          df['processed_text'] = df['content'].apply(self.preprocess_text)
          
          # Extract features
          features_list = []
          for text in df['processed_text']:
              features_list.append(self.extract_features(text))
        
          features_df = pd.DataFrame(features_list)
        
          # TF-IDF Vectorization
          self.tfidf_vectorizer = TfidfVectorizer(max_features=5000)
          tfidf_matrix = self.tfidf_vectorizer.fit_transform(df['processed_text'])
        
          # Convert TF-IDF features to DataFrame with string column names
          tfidf_df = pd.DataFrame(
              tfidf_matrix.toarray(),
              columns=[f'tfidf_feature_{i}' for i in range(tfidf_matrix.shape[1])]
          )
        
          # Ensure all feature names are strings
          features_df.columns = features_df.columns.astype(str)
        
          # Combine all features
          X = pd.concat([tfidf_df, features_df], axis=1)
          y = df['bias']
          
          return X, y
      except Exception as e:
          print(f"Error in prepare_dataset: {e}")
          raise
    
    def train_model(self, X, y):
     """
     Train and evaluate the bias detection model with improved parameters
     """
     try:
        # Split data with stratification to ensure balanced classes
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=0.2, 
            random_state=42,
            stratify=y
        )
        
        # Check if we have enough samples per class
        min_samples = min(np.bincount(y))
        n_splits = min(5, min_samples)
        
        # Define models with regularization
        models = {
            'logistic_regression': LogisticRegression(
                class_weight='balanced',
                random_state=42
            ),
            'svm': SVC(
                probability=True,
                class_weight='balanced',
                random_state=42
            )
        }
        
        # More extensive parameter grid
        params = {
            'logistic_regression': {
                'C': [0.001, 0.01, 0.1, 1, 10],
                'max_iter': [1000]
            },
            'svm': {
                'C': [0.1, 1, 10],
                'kernel': ['linear', 'rbf'],
                'gamma': ['scale', 'auto']
            }
        }
        
        best_score = 0
        best_model = None
        
        # Train and evaluate models
        for name, model in models.items():
            print(f"\nTraining {name}...")
            
            try:
                grid = GridSearchCV(
                    model, 
                    params[name], 
                    cv=n_splits, 
                    scoring='f1',
                    error_score='raise',
                    verbose=1
                )
                grid.fit(X_train, y_train)
                
                # Cross-validation scores
                print(f"Cross-validation scores: {grid.cv_results_['mean_test_score']}")
                print(f"Best parameters: {grid.best_params_}")
                
                y_pred = grid.predict(X_test)
                f1 = f1_score(y_test, y_pred)
                
                print(f"{name} F1 Score: {f1:.4f}")
                
                if f1 > best_score:
                    best_score = f1
                    best_model = grid.best_estimator_
            except Exception as e:
                print(f"Error training {name}: {e}")
                continue
        
        if best_model is None:
            raise ValueError("No models were successfully trained")
        
        self.model = best_model
        
        # Final evaluation
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        
        print(f"\nFinal Model Performance:")
        print(f"Accuracy: {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall: {recall:.4f}")
        print(f"F1 Score: {f1:.4f}")
        
        return self.model
     except Exception as e:
        print(f"Error in train_model: {e}")
        raise 
    
    def highlight_biased_words(self, text):
        """
        Highlight potentially biased words in the text
        """
        biased_words = []
        
        all_biased_words = []
        for words in self.loaded_words.values():
            all_biased_words.extend(words)
        
        for word in text.split():
            word_clean = re.sub(r'[^\w\s]', '', word.lower())
            if word_clean in all_biased_words:
                biased_words.append(word)
        
        highlighted_text = text
        for word in biased_words:
            pattern = r'\b' + re.escape(word) + r'\b'
            highlighted_text = re.sub(pattern, f"**{word}**", highlighted_text, flags=re.IGNORECASE)
        
        return highlighted_text, biased_words
    
    def suggest_neutral_alternative(self, text):
        import os

        from groq import Groq

        client = Groq(
            api_key=("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"),

        )

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"I am providing you an article(biased) , provide its neutral version and also explain that which words or sentences are making it bias , point wise{text}",
                }
            ],
            model="llama-3.3-70b-versatile",
        )

        response = chat_completion.choices[0].message.content
        return response
    
    def analyze_article(self, article_text):
      """
      Analyze a news article for bias with proper feature name handling
      """
      if not self.model or not self.tfidf_vectorizer:
          raise ValueError("Model not trained. Call train_model() first.")
        
      try:
          # Preprocess text
          processed_text = self.preprocess_text(article_text)
        
          # Extract features
          features = self.extract_features(processed_text)
          features_df = pd.DataFrame([features])
        
          # Ensure feature names are strings
          features_df.columns = features_df.columns.astype(str)
        
          # TF-IDF transformation
          tfidf_features = self.tfidf_vectorizer.transform([processed_text])
        
          # Create DataFrame with proper string column names
          tfidf_df = pd.DataFrame(
              tfidf_features.toarray(),
              columns=[f'tfidf_feature_{i}' for i in range(tfidf_features.shape[1])]
          )
        
          # Combine features
          X = pd.concat([tfidf_df, features_df], axis=1)
        
          # Ensure all column names are strings
          X.columns = X.columns.astype(str)
        
          # Predict bias
          bias_prob = self.model.predict_proba(X)[0][1]
          is_biased = bias_prob > 0.5
        
          # Highlight biased words
          highlighted_text, biased_words = self.highlight_biased_words(article_text)
        
          # Sentiment analysis
          sentiment = self.sia.polarity_scores(article_text)
        
          # Political affiliation
          political_affiliation = self.detect_political_affiliation(processed_text)
        
          # Find similar articles
          similar_articles = self.find_similar_articles(article_text)
        
          # Source comparison
          source_bias = "Balanced"
          if similar_articles:
              sentiments = []
              for article in similar_articles:
                  article_sentiment = self.sia.polarity_scores(article['content'])['compound']
                  sentiments.append(article_sentiment)
            
              sentiment_std = np.std(sentiments)
              if sentiment_std > 0.5:
                  source_bias = "One-sided"
        
          # Suggest neutral alternative
          neutral_alternative = self.suggest_neutral_alternative(article_text)
        
          # Prepare analysis result
          result = {
              "is_biased": is_biased,
              "bias_confidence": f"{bias_prob*100:.1f}%",
              "highlighted_text": highlighted_text,
              "biased_words": biased_words,
              "neutral_alternative": neutral_alternative,
              "breakdown": {
                  "sentiment": "Negative" if sentiment['compound'] < -0.05 else "Positive" if sentiment['compound'] > 0.05 else "Neutral",
                  "emotion": "Strong" if sum(features[k] for k in features if k.startswith('emotion_')) > 2 else "Neutral",
                  "keyword_bias": "Biased" if len(biased_words) > 0 else "Neutral",
                  "source_comparison": source_bias,
                  "political_affiliation": political_affiliation
              },
              "similar_articles": similar_articles
          }
          
          return result
          
      except Exception as e:
          print(f"Error analyzing article: {e}")
          raise
    
    def save_model(self, filepath):
        """
        Save trained model and vectorizer to disk
        """
        model_data = {
            'model': self.model,
            'tfidf_vectorizer': self.tfidf_vectorizer,
            'word2vec_model': self.word2vec_model
        }
        
        with open(filepath, 'wb') as f:
            pickle.dump(model_data, f)
        
        print(f"Model saved to {filepath}")
    
    def load_model(self, filepath):
        """
        Load trained model and vectorizer from disk
        """
        with open(filepath, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model = model_data['model']
        self.tfidf_vectorizer = model_data['tfidf_vectorizer']
        self.word2vec_model = model_data['word2vec_model']
        
        print(f"Model loaded from {filepath}")


# Example usage
if __name__ == "__main__":
    # Initialize detector without API key for demo
    detector = NewsBiasDetector()
    
    # Load or collect data
    df = detector.load_existing_datasets()
    
    # Prepare dataset
    X, y = detector.prepare_dataset(df)
    
    # Train word embeddings
    detector.train_word_embeddings(df['processed_text'])
    
    # Train_model
    detector.train_model(X, y)
    
    # Save model
    detector.save_model('news_bias_detector.pkl')
    
    # Test on a sample article
    sample_article = "The government passed a revolutionary new law that will transform the country."
    analysis = detector.analyze_article(sample_article)
    
    print(f"Bias analysis: {analysis['is_biased']} ({analysis['bias_confidence']})")
    print(f"Highlighted text: {analysis['highlighted_text']}")
    print(f"Breakdown:")
    for category, value in analysis['breakdown'].items():
        print(f"  - {category}: {value}")
    print(f"Neutral alternative: {analysis['neutral_alternative']}")