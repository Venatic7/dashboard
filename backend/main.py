from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

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
        dbname="political2",
        user="postgres",
        password="0111",
        host="localhost",
        port="5432",
        cursor_factory=RealDictCursor
    )

@app.get("/api/dashboard")
async def get_dashboard_data():
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Fetch metrics
        cur.execute("""
            SELECT * FROM dashboard_metrics 
            ORDER BY created_at DESC 
            LIMIT 1
        """)
        metrics = cur.fetchone()

        # Fetch notifications
        cur.execute("""
            SELECT id, title, message, 
                   CASE 
                       WHEN NOW() - time < INTERVAL '1 minute' THEN 'just now'
                       WHEN NOW() - time < INTERVAL '1 hour' THEN EXTRACT(MINUTE FROM (NOW() - time))::TEXT || 'm ago'
                       ELSE EXTRACT(HOUR FROM (NOW() - time))::TEXT || 'h ago'
                   END as time
            FROM notifications 
            ORDER BY time DESC 
            LIMIT 5
        """)
        notifications = cur.fetchall()

        # Fetch user info
        cur.execute("SELECT * FROM user_info LIMIT 1")
        user_info = cur.fetchone()

        return {
            "status": "success",
            "data": {
                "total_reach_facebook": metrics["total_reach_facebook"],
                "total_reach_twitter": metrics["total_reach_twitter"],
                "total_reach_instagram": metrics["total_reach_instagram"],
                "engagement_rate": metrics["engagement_rate"],
                "sentiment_positive": metrics["sentiment_positive"],
                "sentiment_neutral": metrics["sentiment_neutral"],
                "sentiment_negative": metrics["sentiment_negative"],
                "opposition_content_total": metrics["opposition_content_total"],
                "opposition_critical_posts": metrics["opposition_critical_posts"],
                "opposition_active_campaigns": metrics["opposition_active_campaigns"],
                "performance_index": metrics["performance_index"],
                "response_rate": metrics["response_rate"],
                "average_response_time": metrics["average_response_time"],
                "total_shares": metrics["total_shares"],
                "total_comments": metrics["total_comments"],
                "trending_topics": metrics["trending_topics"],
                "hot_topics": metrics["hot_topics"],
                "notifications": notifications,
                "user_info": user_info
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        cur.close()
        conn.close()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
