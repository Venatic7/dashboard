from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    return psycopg2.connect(
        host="localhost",
        database="political3",
        user="postgres",
        password="0111",
        cursor_factory=RealDictCursor
    )

@app.get("/")
async def root():
    return {"status": "online"}

@app.get("/api/dashboard")
async def get_dashboard_data():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        
        cur.execute("SELECT * FROM total_reach ORDER BY date_recorded DESC LIMIT 1")
        total_reach = cur.fetchone()
        
        cur.execute("SELECT * FROM engagement_metrics ORDER BY date_recorded DESC LIMIT 1")
        engagement = cur.fetchone()
        
        cur.execute("SELECT * FROM sentiment_analysis ORDER BY date_recorded DESC LIMIT 1")
        sentiment = cur.fetchone()
        
        cur.execute("SELECT * FROM opposition_tracking ORDER BY date_recorded DESC LIMIT 1")
        opposition = cur.fetchone()
        
        cur.execute("SELECT * FROM performance_metrics ORDER BY date_recorded DESC LIMIT 1")
        performance = cur.fetchone()
        
        cur.execute("SELECT * FROM top_posts ORDER BY date_recorded DESC LIMIT 1")
        posts = cur.fetchone()
        
        cur.execute("SELECT * FROM scheme_metrics ORDER BY date_recorded DESC LIMIT 1")
        schemes = cur.fetchone()

        data = {
            "total_reach_facebook": total_reach['facebook_reach'],
            "total_reach_twitter": total_reach['twitter_reach'],
            "total_reach_instagram": total_reach['instagram_reach'],
            "engagement_rate": float(engagement['engagement_rate']),
            "weekly_growth": float(engagement['weekly_growth']),
            "monthly_average": float(engagement['monthly_average']),
            "sentiment_positive": float(sentiment['positive_sentiment']),
            "sentiment_neutral": float(sentiment['neutral_sentiment']),
            "sentiment_negative": float(sentiment['negative_sentiment']),
            "opposition_content_total": opposition['total_content'],
            "opposition_critical_posts": opposition['critical_posts'],
            "opposition_active_campaigns": opposition['active_campaigns'],
            "opposition_response_rate": float(opposition['response_rate']),
            "performance_index": float(performance['performance_index']),
            "average_response_time": float(performance['average_response_time']),
            "engagement_quality": float(performance['engagement_quality']),
            "top_post_development": posts['development_posts'],
            "top_post_infrastructure": posts['infrastructure_posts'],
            "top_post_youth": posts['youth_posts'],
            "scheme_rural_development": float(schemes['rural_development']),
            "scheme_education": float(schemes['education']),
            "scheme_healthcare": float(schemes['healthcare'])
        }
        
        cur.close()
        conn.close()
        return {"data": data}
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/notifications")
async def get_notifications():
    return [
        {"id": 1, "title": "New Campaign", "message": "Election campaign started in Region A", "time": "2 hours ago"},
        {"id": 2, "title": "Engagement Spike", "message": "Unusual activity detected in social media", "time": "5 hours ago"},
        {"id": 3, "title": "Report Ready", "message": "Weekly analytics report is available", "time": "1 day ago"}
    ]
