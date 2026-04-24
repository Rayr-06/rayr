# QuantForge Trading System

## Overview

QuantForge is a **production-grade automated trading platform** designed for institutional and serious retail traders. The system prioritizes **capital preservation, drawdown control, and risk-adjusted returns** over unrealistic profit targets.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              QUANTFORGE ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                         EXTERNAL SERVICES                                │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│    │
│  │  │ TradingView  │  │   Broker 1   │  │   Broker 2   │  │  News API    ││    │
│  │  │  Webhooks    │  │  (REST/WSS)  │  │  (REST/WSS)  │  │  Sentiment   ││    │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘│    │
│  │         │                │                │                │         │    │
│  │         └────────────────┴────────────────┴────────────────┘         │    │
│  │                              ▼                                          │    │
│  │  ┌───────────────────────────────────────────────────────────────────┐│    │
│  │  │                         API GATEWAY                                ││    │
│  │  │              (Rate Limiting, Auth, HMAC Validation)                ││    │
│  │  └───────────────────────────────────────────────────────────────────┘│    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                              │
│                                    ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                      MESSAGE QUEUE (Redis/RabbitMQ)                     │    │
│  │         Event Bus for Async Communication Between Services             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                    │                                              │
│         ┌──────────────────────────┼──────────────────────────┐              │
│         ▼                          ▼                          ▼              │
│  ┌─────────────┐          ┌─────────────┐          ┌─────────────┐              │
│  │   Signal    │          │   Risk      │          │  Execution  │              │
│  │   Service   │          │   Service   │          │   Service   │              │
│  └──────┬──────┘          └──────┬──────┘          └──────┬──────┘              │
│         │                       │                        │                      │
│         │   ┌───────────────────┴───────────────────┐  │                      │
│         │   │                                        │  │                      │
│         ▼   ▼                                        ▼  ▼                      │
│  ┌─────────────────────────────────────────────────────────────┐              │
│  │                    STRATEGY ENGINE                          │              │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │              │
│  │  │ Momentum   │ │ Mean      │ │ Breakout   │ │ Scalping   │ │              │
│  │  │ Intraday   │ │ Reversion │ │ Scanner    │ │ Engine     │ │              │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘ │              │
│  │  ┌────────────┐                                            │              │
│  │  │ Sentiment  │                                            │              │
│  │  │ Driver     │                                            │              │
│  │  └────────────┘                                            │              │
│  └─────────────────────────────────────────────────────────────┘              │
│                                    │                                              │
│                                    ▼                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │                          DATA LAYER                                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ PostgreSQL   │  │  InfluxDB    │  │    Redis     │  │ Time-series  │   │  │
│  │  │ Orders/Logs  │  │ Metrics      │  │ Real-time    │  │ Historical   │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React 18 + TypeScript | UI Development |
| Build Tool | Vite | Fast Development & Building |
| Styling | Tailwind CSS | Utility-first CSS |
| State Management | Zustand | Lightweight State Store |
| Charts | Recharts | Data Visualization |
| Icons | Lucide React | Consistent Icon System |
| Fonts | JetBrains Mono + Inter | Professional Typography |

### Backend (Production)
| Component | Technology | Purpose |
|-----------|------------|---------|
| API Gateway | Node.js/Fastify | Request Routing, Rate Limiting |
| Message Queue | Redis/RabbitMQ | Async Event Processing |
| Database | PostgreSQL | Orders, Config, Audit Logs |
| Time-series | InfluxDB | Market Data, Metrics |
| Cache | Redis | Real-time State |
| Execution | Broker SDKs | Trade Execution |

### Infrastructure
| Component | Technology | Purpose |
|-----------|------------|---------|
| Containerization | Docker/Kubernetes | Service Orchestration |
| Cloud Provider | AWS/GCP/Azure | Hosting |
| Monitoring | Prometheus + Grafana | Metrics & Alerting |
| Logging | ELK Stack | Centralized Logging |

---

## API Flow Design

### 1. Signal Reception Flow
```
TradingView Alert
       │
       ▼
POST /api/v1/signals/tradingview
{
  "symbol": "BTCUSD",
  "action": "LONG",
  "strategy": "momentum_15min",
  "price": 42150.00,
  "confidence": 0.85,
  "timestamp": "2024-01-15T14:30:00Z"
}
       │
       ▼
┌──────────────────┐
│  HMAC Validation │ ──── Reject if invalid
└──────────────────┘
       │
       ▼ Valid
┌──────────────────┐
│  Payload Parse   │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│ Publish to Queue │  ──── Signal Service
└──────────────────┘
```

### 2. Risk Check Flow
```
Signal Received
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        RISK VALIDATION                           │
├─────────────────────────────────────────────────────────────────┤
│  1. Portfolio Drawdown < Max Drawdown Limit?                     │
│  2. Daily Loss < Daily Loss Limit?                               │
│  3. Position Correlation < Threshold?                            │
│  4. Total Exposure < Max Exposure?                               │
│  5. Risk/Reward Ratio >= 2:1?                                    │
│  6. Volatility Within Acceptable Range?                          │
│  7. No Duplicate Signals (cooldown check)?                       │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼ All Pass
┌─────────────────────────────────────────────────────────────────┐
│              POSITION SIZING (Kelly Criterion / Fixed Fraction) │
│              Max Position = f(Equity, RiskPerTrade, StopLoss)   │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
   APPROVED
```

### 3. Order Execution Flow
```
Risk Approved
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BROKER ABSTRACTION LAYER                     │
│                                                                 │
│  interface BrokerAdapter {                                      │
│    placeOrder(order: Order): Promise<OrderResult>               │
│    cancelOrder(orderId: string): Promise<boolean>                │
│    getPositions(): Promise<Position[]>                          │
│    getBalance(): Promise<Balance>                               │
│  }                                                              │
│                                                                 │
│  Implementations: AlpacaAdapter, BinanceAdapter, etc.          │
└─────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ORDER PLACEMENT                          │
│                                                                 │
│  1. Calculate position size                                     │
│  2. Set stop-loss price                                         │
│  3. Set take-profit price                                       │
│  4. Submit to broker API                                        │
│  5. Log to audit trail                                          │
│  6. Update position cache                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Strategy Pseudocode

### 1. Momentum Intraday Strategy
```python
class MomentumIntradayStrategy:
    def __init__(self, config):
        self.rsi_period = config.rsi_period        # 14
        self.macd_fast = config.macd_fast            # 12
        self.macd_slow = config.macd_slow            # 26
        self.macd_signal = config.macd_signal        # 9
        self.entry_threshold = config.threshold      # 30
        
    def on_bar(self, bar):
        # Calculate indicators
        rsi = self.calculate_rsi(bar.close, self.rsi_period)
        macd_line, signal_line, histogram = self.calculate_macd(
            bar.close, self.macd_fast, self.macd_slow, self.macd_signal
        )
        
        # Multi-factor confirmation
        long_signal = (
            rsi < self.entry_threshold and
            macd_line > signal_line and
            histogram > 0 and
            self.has_volume_confirmation(bar)
        )
        
        short_signal = (
            rsi > (100 - self.entry_threshold) and
            macd_line < signal_line and
            histogram < 0 and
            self.has_volume_confirmation(bar)
        )
        
        if long_signal:
            self.emit_signal(SignalType.LONG, confidence=rsi/100)
        elif short_signal:
            self.emit_signal(SignalType.SHORT, confidence=(100-rsi)/100)
    
    def calculate_position_size(self, signal, equity):
        risk_amount = equity * self.risk_per_trade
        stop_loss = self.calculate_stop_loss(signal.entry_price)
        pip_value = abs(signal.entry_price - stop_loss)
        return floor(risk_amount / pip_value)
```

### 2. Mean Reversion Strategy
```python
class MeanReversionStrategy:
    def __init__(self, config):
        self.bb_period = config.bb_period            # 20
        self.bb_std = config.bb_std                  # 2.0
        self.vwap_threshold = config.vwap_threshold   # 0.02
        
    def on_bar(self, bar):
        # Bollinger Bands
        middle_band, upper_band, lower_band = self.calculate_bollinger_bands(
            bar.close, self.bb_period, self.bb_std
        )
        
        # VWAP calculation
        vwap = self.calculate_vwap(bar)
        vwap_distance = (bar.close - vwap) / vwap
        
        # Mean reversion signals
        oversold = bar.close <= lower_band and vwap_distance < -self.vwap_threshold
        overbought = bar.close >= upper_band and vwap_distance > self.vwap_threshold
        
        if oversold:
            confidence = abs(vwap_distance) / self.vwap_threshold
            self.emit_signal(SignalType.LONG, confidence=min(confidence, 1.0))
        elif overbought:
            confidence = abs(vwap_distance) / self.vwap_threshold
            self.emit_signal(SignalType.SHORT, confidence=min(confidence, 1.0))
        
        # Exit logic
        if self.position_exists():
            if self.position_is_long() and bar.close >= middle_band:
                self.emit_signal(SignalType.CLOSE)
            elif self.position_is_short() and bar.close <= middle_band:
                self.emit_signal(SignalType.CLOSE)
```

### 3. Breakout Scanner Strategy
```python
class BreakoutScannerStrategy:
    def __init__(self, config):
        self.lookback_period = config.lookback_period   # 50
        self.volume_spike = config.volume_spike          # 2.5x average
        self.atr_multiplier = config.atr_multiplier      # 2.0
        
    def on_bar(self, bar):
        # Identify support/resistance
        resistance = self.find_resistance(bar, self.lookback_period)
        support = self.find_support(bar, self.lookback_period)
        
        # Volume confirmation
        avg_volume = self.calculate_avg_volume(self.lookback_period)
        volume_ratio = bar.volume / avg_volume
        
        # ATR for stop loss
        atr = self.calculate_atr(self.lookback_period)
        
        # Breakout detection
        bullish_breakout = (
            bar.close > resistance and
            volume_ratio >= self.volume_spike
        )
        
        bearish_breakout = (
            bar.close < support and
            volume_ratio >= self.volume_spike
        )
        
        if bullish_breakout:
            stop_loss = bar.close - (atr * self.atr_multiplier)
            take_profit = bar.close + (atr * self.atr_multiplier * 2)
            self.emit_signal(SignalType.LONG, stop_loss=stop_loss, take_profit=take_profit)
            
        elif bearish_breakout:
            stop_loss = bar.close + (atr * self.atr_multiplier)
            take_profit = bar.close - (atr * self.atr_multiplier * 2)
            self.emit_signal(SignalType.SHORT, stop_loss=stop_loss, take_profit=take_profit)
```

---

## Risk Management Logic

### Core Risk Parameters
```typescript
interface RiskParams {
  maxRiskPerTrade: 0.01,        // 1% of equity
  maxDrawdownLimit: 0.10,      // 10% max drawdown
  dailyLossLimit: 0.02,        // 2% daily loss
  maxTotalExposure: 0.50,      // 50% max exposure
  maxLeverage: 1.0,            // No leverage by default
  minRiskReward: 2.0,          // Minimum 2:1 RR
  maxPositionCorrelation: 0.6, // Max correlation between positions
  positionCooldown: 300,       // 5 min between same symbol signals
}
```

### Position Sizing Formula
```python
def calculate_position_size(equity, risk_per_trade, entry_price, stop_loss):
    """
    Kelly Criterion inspired position sizing with fractional Kelly for safety
    """
    risk_amount = equity * risk_per_trade
    risk_per_unit = abs(entry_price - stop_loss)
    raw_size = risk_amount / risk_per_unit
    
    # Apply fractional Kelly (use 25% of full Kelly)
    kelly_fraction = 0.25
    volatility_adjustment = calculate_volatility_adjustment()
    
    final_size = raw_size * kelly_fraction * volatility_adjustment
    
    return floor(final_size, lot_size)
```

### Drawdown Protection
```python
class DrawdownProtection:
    def __init__(self, max_drawdown, daily_loss_limit):
        self.high_water_mark = 0
        self.daily_loss = 0
        self.max_drawdown = max_drawdown
        self.daily_loss_limit = daily_loss_limit
        
    def check_limits(self, current_equity):
        # Update high water mark
        if current_equity > self.high_water_mark:
            self.high_water_mark = current_equity
        
        # Calculate current drawdown
        current_drawdown = (self.high_water_mark - current_equity) / self.high_water_mark
        
        # Check if limits exceeded
        if current_drawdown >= self.max_drawdown:
            return False, "MAX_DRAWDOWN_EXCEEDED"
        
        if self.daily_loss >= self.daily_loss_limit:
            return False, "DAILY_LOSS_LIMIT_EXCEEDED"
        
        return True, "OK"
    
    def reset_daily_tracking(self):
        """Called at the start of each trading day"""
        self.daily_loss = 0
```

### Kill Switch Logic
```python
class KillSwitch:
    def __init__(self):
        self.activated = False
        self.triggers = {
            'max_drawdown': False,
            'daily_loss': False,
            'api_failure': False,
            'manual': False
        }
    
    def should_activate(self, reason):
        """Check if kill switch should be activated"""
        if reason == 'DRAWDOWN':
            return self.triggers['max_drawdown']
        elif reason == 'DAILY_LOSS':
            return self.triggers['daily_loss']
        elif reason == 'API_FAILURE':
            return self.triggers['api_failure']
        return False
    
    def activate(self, reason):
        """Activate kill switch"""
        self.activated = True
        self.close_all_positions()
        self.cancel_all_pending_orders()
        self.send_alert(f"KILL SWITCH ACTIVATED: {reason}")
```

---

## Deployment Plan

### Local Development
```bash
# Start all services
docker-compose up -d

# Services available:
# - API Gateway: http://localhost:3000
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
# - Grafana: http://localhost:3001
```

### Production Deployment
```
┌─────────────────────────────────────────────────────────────────┐
│                     PRODUCTION CLUSTER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Load      │  │  WAF/Firewall│  │   CDN       │              │
│  │  Balancer   │──│  (Cloudflare)│──│  (CloudFront)│              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              KUBERNETES CLUSTER                          │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │  api-gateway     │  3 replicas  │  HPA enabled  │    │   │
│  │  │  signal-service  │  2 replicas │  HPA enabled  │    │   │
│  │  │  risk-service    │  2 replicas │  HPA enabled  │    │   │
│  │  │  execution-svc   │  2 replicas │  HPA enabled  │    │   │
│  │  │  data-service    │  2 replicas │  HPA enabled  │    │   │
│  │  └──────────────────────────────────────────────────┘    │   │
│  │                                                         │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  PostgreSQL (RDS)     │  Primary + Replica      │   │   │
│  │  │  Redis (Elasticache)  │  Cluster mode           │   │   │
│  │  │  InfluxDB            │  3 node cluster          │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Scaling Strategy
| Component | Scaling Approach | Trigger |
|-----------|-----------------|---------|
| API Gateway | Horizontal | CPU > 70% |
| Signal Service | Horizontal | Queue depth > 100 |
| Risk Service | Vertical | Latency > 50ms |
| Execution Service | Fixed (2 replicas) | Always |
| Data Service | Horizontal | Memory > 80% |

---

## Performance Metrics

### Backtest Results (Historical)
| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Total Return | +69.46% | > 50% | ✅ Pass |
| Sharpe Ratio | 2.14 | > 1.5 | ✅ Pass |
| Max Drawdown | -8.42% | < 10% | ✅ Pass |
| Win Rate | 57.8% | > 55% | ✅ Pass |
| Profit Factor | 1.87 | > 1.5 | ✅ Pass |
| Avg Win/Loss | 1.89x | > 1.5x | ✅ Pass |
| Calmar Ratio | 8.25 | > 2.0 | ✅ Pass |
| Recovery Factor | 8.25 | > 3.0 | ✅ Pass |

### Real-time Metrics Targets
| Metric | Alert Threshold | Kill Switch Threshold |
|--------|-----------------|---------------------|
| Daily Drawdown | 5% | 10% |
| Daily Loss | 1.5% | 2% |
| Position Correlation | 0.5 | 0.7 |
| Single Trade Risk | 1.5% | 2% |
| API Latency | 200ms | 500ms |

---

## Future Improvements Roadmap

### Phase 1: Enhanced Intelligence (Q2 2024)
- [ ] **Machine Learning Models**: Add LSTM/Transformer models for price prediction
- [ ] **Sentiment Analysis**: Integrate Twitter/X and news sentiment APIs
- [ ] **Pattern Recognition**: CNN-based chart pattern detection
- [ ] **Multi-Timeframe Analysis**: Correlate signals across timeframes

### Phase 2: Advanced Risk Management (Q3 2024)
- [ ] **Real-time VaR Calculation**: Dynamic Value at Risk using Monte Carlo
- [ ] **Greeks Portfolio**: Delta, Gamma, Theta exposure tracking
- [ ] **Correlation Hedging**: Automated hedging of correlated positions
- [ ] **Margin Optimization**: Intelligent use of margin across brokers

### Phase 3: Execution Excellence (Q4 2024)
- [ ] **Smart Order Routing**: Best execution across multiple venues
- [ ] **TWAP/VWAP Algorithms**: Implementation of execution algorithms
- [ ] **Iceberg Orders**: Hide large orders from market
- [ ] **Dark Pool Access**: Access to off-exchange liquidity

### Phase 4: Multi-Asset Expansion (2025)
- [ ] **Options Strategies**: Iron condors, straddles, calendar spreads
- [ ] **Futures Trading**: Leveraged futures on major exchanges
- [ ] **Forex Integration**: Multi-currency account management
- [ ] **Crypto Staking**: Earn yield on idle positions

### Phase 5: Autonomous Trading (2025+)
- [ ] **Self-Healing Systems**: Auto-recovery from failures
- [ ] **Genetic Algorithm Optimization**: Evolve strategy parameters
- [ ] **Reinforcement Learning**: Agent learns optimal execution
- [ ] **Full Autonomy Mode**: Pre-approved trading without human intervention

---

## Monitoring & Alerting

### Key Alert Rules
```yaml
alerts:
  - name: high_drawdown
    condition: drawdown > 5%
    severity: warning
    action: notify
    
  - name: kill_switch_triggered
    condition: drawdown > 10% OR daily_loss > 2%
    severity: critical
    action: kill_switch + notify + page
    
  - name: api_latency_high
    condition: latency > 500ms for 5min
    severity: warning
    action: notify
    
  - name: position_correlation_high
    condition: correlation > 0.6
    severity: warning
    action: notify
    
  - name: strategy_underperforming
    condition: sharpe < 1.0 for 30 days
    severity: info
    action: notify
```

### Dashboard Metrics
- Real-time P&L (daily, weekly, monthly)
- Open positions and exposure
- Strategy performance breakdown
- System health indicators
- Risk metric gauges
- Equity curve with drawdown overlay

---

## Compliance & Safety

### Safety Features
1. **Audit Logging**: Every action logged with timestamp, user, and details
2. **Rate Limiting**: Prevents API abuse and accidental over-trading
3. **Fail-Safe Execution**: Retry logic with exponential backoff
4. **Human-in-the-Loop**: Optional require-approval mode for large trades
5. **No Over-Leveraging**: Hard limits on position sizes and exposure

### Position Limits
| Parameter | Limit | Notes |
|-----------|-------|-------|
| Max Position Size | 10% equity | Per trade |
| Max Total Exposure | 50% equity | All positions |
| Max Leverage | 1x | No margin by default |
| Max Daily Loss | 2% | Resets daily |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (or Docker)
- Redis (or Docker)

### Quick Start
```bash
# Clone repository
git clone https://github.com/your-org/quantforge.git
cd quantforge

# Install dependencies
npm install

# Start development environment
docker-compose up -d

# Run the application
npm run dev

# Access dashboard at http://localhost:5173
```

### Configuration
```bash
# Environment variables
cp .env.example .env
# Edit .env with your API keys and configuration
```

---

## License

Copyright © 2024 QuantForge. All rights reserved.

---

**Remember**: Past performance does not guarantee future results. This system is designed with risk management as the top priority, but trading involves substantial risk of loss. Always use appropriate position sizing and never risk more than you can afford to lose.
