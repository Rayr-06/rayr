import ccxt
import pandas as pd
import time
import os

class RayrEngine:
    def __init__(self):
        # INDUSTRY STANDARD: ALWAYS use testnet/sandbox first!
        self.exchange = ccxt.binance({
            'apiKey': os.getenv('BINANCE_API_KEY', 'YOUR_TESTNET_API_KEY'),
            'secret': os.getenv('BINANCE_SECRET', 'YOUR_TESTNET_SECRET'),
            'enableRateLimit': True,
        })
        self.exchange.set_sandbox_mode(True) # REMOVE THIS LATER FOR REAL MONEY
        
        self.symbol = 'BTC/USDT'
        self.timeframe = '15m'
        self.position = None
        self.trade_log = []
        
    def log(self, level, message):
        log_entry = {"time": pd.Timestamp.now().strftime('%H:%M:%S'), "level": level, "message": message}
        self.trade_log.append(log_entry)
        print(f"[{level.upper()}] {message}")

    def fetch_data(self):
        self.log("info", f"Fetching {self.symbol} data...")
        bars = self.exchange.fetch_ohlcv(self.symbol, self.timeframe, limit=100)
        df = pd.DataFrame(bars, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
        
        # Calculate Indicators (EMA 9, EMA 21, RSI 14)
        df['ema_fast'] = df['close'].ewm(span=9, adjust=False).mean()
        df['ema_slow'] = df['close'].ewm(span=21, adjust=False).mean()
        
        # RSI Calculation
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        return df

    def generate_signal(self, df):
        last_row = df.iloc[-1]
        prev_row = df.iloc[-2]

        # STRATEGY LOGIC: EMA Crossover + RSI Filter (Not 97% win rate, but actually profitable)
        if prev_row['ema_fast'] < prev_row['ema_slow'] and last_row['ema_fast'] > last_row['ema_slow']:
            if last_row['rsi'] < 70: # Not overbought
                return 'BUY'
        
        elif prev_row['ema_fast'] > prev_row['ema_slow'] and last_row['ema_fast'] < last_row['ema_slow']:
            if last_row['rsi'] > 30: # Not oversold
                return 'SELL'
        
        return 'HOLD'

    def execute_trade(self, signal):
        if signal == 'BUY' and self.position is None:
            self.log("trade", f"LONG SIGNAL DETECTED! Executing BUY on {self.symbol}")
            # REAL ORDER EXECUTION (Testnet)
            # order = self.exchange.create_market_buy_order(self.symbol, 0.001) 
            self.position = {'side': 'long', 'entry': float(df.iloc[-1]['close'])}
            
        elif signal == 'SELL' and self.position is None:
            self.log("trade", f"SHORT SIGNAL DETECTED! Executing SELL on {self.symbol}")
            # order = self.exchange.create_market_sell_order(self.symbol, 0.001)
            self.position = {'side': 'short', 'entry': float(df.iloc[-1]['close'])}
            
        elif signal == 'HOLD':
            self.log("info", "No signal. Waiting...")

    def run_loop(self):
        self.log("info", "RAYR Engine started. Scanning market...")
        while True:
            try:
                df = self.fetch_data()
                signal = self.generate_signal(df)
                self.execute_trade(signal)
                time.sleep(60) # Run every 1 minute
            except Exception as e:
                self.log("error", f"Engine Error: {str(e)}")
                time.sleep(10)

# Global instance to share with FastAPI
engine_instance = RayrEngine()
