from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
from engine import engine_instance

app = FastAPI()

# ALLOW REACT (Port 3000) TO TALK TO PYTHON (Port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Start the trading engine in a separate background thread
    thread = threading.Thread(target=engine_instance.run_loop, daemon=True)
    thread.start()

@app.get("/api/dashboard")
def get_dashboard_data():
    # THIS IS THE DATA YOUR REACT APP WILL FETCH
    return {
        "equity": 84732.45, # Later: fetch real balance from exchange
        "dailyPnL": 1247.83,
        "killSwitch": False,
        "positions": [
            {"id": "1", "symbol": engine_instance.symbol, "side": engine_instance.position['side'] if engine_instance.position else "flat", "pnl": 162.50}
        ] if engine_instance.position else [],
        "logs": engine_instance.trade_log[-20:] # Send last 20 logs
    }
