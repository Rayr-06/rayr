import React from 'react';
import { useTradingStore } from './store';
import {
  LayoutDashboard,
  Brain,
  TrendingUp,
  FileText,
  ShieldAlert,
  FlaskConical,
  ScrollText,
  Settings,
  Activity,
  Wifi,
  AlertTriangle,
  Power,
  TrendingUp as TrendUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Target,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Play,
  Pause,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

// Utility Components
const StatusBadge: React.FC<{ status: 'connected' | 'disconnected' | 'error' | 'running' | 'stopped' | 'pending' | 'filled' | 'cancelled' | 'rejected' | 'info' | 'warning' | 'error' | 'critical' }> = ({ status }) => {
  const config: Record<string, { bg: string; text: string; dot?: boolean }> = {
    connected: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: true },
    running: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: true },
    filled: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: true },
    stopped: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    cancelled: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
    disconnected: { bg: 'bg-red-500/20', text: 'text-red-400', dot: true },
    error: { bg: 'bg-red-500/20', text: 'text-red-400', dot: true },
    rejected: { bg: 'bg-red-500/20', text: 'text-red-400' },
    info: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    critical: { bg: 'bg-red-500/20', text: 'text-red-400' },
  };
  const { bg, text, dot } = config[status] || config.info;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color?: string;
}> = ({ title, value, subValue, trend = 'neutral', icon, color = 'text-blue-400' }) => {
  const trendIcon = {
    up: <ArrowUpRight className="w-4 h-4 text-emerald-400" />,
    down: <ArrowDownRight className="w-4 h-4 text-red-400" />,
    neutral: <Minus className="w-4 h-4 text-gray-400" />,
  }[trend];
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg bg-gray-700/50 ${color}`}>{icon}</div>
        {trendIcon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-semibold text-white font-mono">{value}</p>
      {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection } = useTradingStore();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'strategies', label: 'Strategies', icon: Brain },
    { id: 'positions', label: 'Positions', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: FileText },
    { id: 'risk', label: 'Risk Management', icon: ShieldAlert },
    { id: 'backtest', label: 'Backtesting', icon: FlaskConical },
    { id: 'logs', label: 'Trade Console', icon: ScrollText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm">QuantForge</h1>
            <p className="text-xs text-gray-500">Trading System</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeSection === id
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          System Online
        </div>
      </div>
    </aside>
  );
};

const Header: React.FC = () => {
  const { portfolio, killSwitchActive, toggleKillSwitch, alerts } = useTradingStore();
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length;
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-400">System Status</span>
          <StatusBadge status={killSwitchActive ? 'error' : 'connected'} />
        </div>
        <div className="h-6 w-px bg-gray-700" />
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-gray-400">Broker</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-gray-400">Data Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-gray-400">TradingView</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-gray-500">Portfolio Value</p>
          <p className="text-lg font-semibold text-white font-mono">${portfolio.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="h-8 w-px bg-gray-700" />
        <div className="text-right">
          <p className="text-xs text-gray-500">Today's P&L</p>
          <p className={`text-sm font-semibold font-mono ${portfolio.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {portfolio.dailyPnL >= 0 ? '+' : ''}${portfolio.dailyPnL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        {unacknowledgedAlerts > 0 && (
          <div className="relative">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-xs rounded-full flex items-center justify-center font-bold">
              {unacknowledgedAlerts}
            </span>
          </div>
        )}
        <button
          onClick={toggleKillSwitch}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
            killSwitchActive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
          }`}
        >
          <Power className="w-4 h-4" />
          {killSwitchActive ? 'Resume' : 'Kill Switch'}
        </button>
      </div>
    </header>
  );
};

// Dashboard Section
const Dashboard: React.FC = () => {
  const { portfolio, positions, riskMetrics, connectionStatus } = useTradingStore();
  const equityCurveData = [
    { date: 'Jan 1', value: 50000 }, { date: 'Jan 5', value: 51200 }, { date: 'Jan 10', value: 52800 },
    { date: 'Jan 15', value: 51500 }, { date: 'Jan 20', value: 54300 }, { date: 'Jan 25', value: 56700 },
    { date: 'Jan 30', value: 55200 }, { date: 'Feb 5', value: 58900 }, { date: 'Feb 10', value: 61200 },
    { date: 'Feb 15', value: 63500 }, { date: 'Feb 20', value: 62100 }, { date: 'Feb 25', value: 65800 },
    { date: 'Mar 1', value: 68200 }, { date: 'Mar 5', value: 70500 }, { date: 'Mar 10', value: 73100 },
    { date: 'Mar 15', value: 71800 }, { date: 'Mar 20', value: 75600 }, { date: 'Jan 15', value: 84732 },
  ];
  const recentTrades = [
    { symbol: 'BTC/USD', side: 'long', pnl: 162.61, time: '5h ago' },
    { symbol: 'ETH/USD', side: 'long', pnl: 38.25, time: '4h ago' },
    { symbol: 'SOL/USD', side: 'short', pnl: 65.00, time: '3h ago' },
    { symbol: 'NVDA/USDT', side: 'long', pnl: 101.25, time: '47m ago' },
    { symbol: 'TSLA/USDT', side: 'short', pnl: -54.00, time: '32m ago' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Dashboard Overview</h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-4 h-4" />
          Last updated: {new Date(connectionStatus.lastUpdate).toLocaleTimeString()}
        </div>
      </div>
      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Portfolio Equity"
          value={`$${portfolio.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`High: $${portfolio.highWaterMark.toLocaleString()}`}
          trend={portfolio.dailyPnL >= 0 ? 'up' : 'down'}
          icon={<DollarSign className="w-5 h-5" />}
          color="text-blue-400"
        />
        <MetricCard
          title="Daily P&L"
          value={`${portfolio.dailyPnL >= 0 ? '+' : ''}$${portfolio.dailyPnL.toFixed(2)}`}
          subValue={`${portfolio.dailyPnLPercent >= 0 ? '+' : ''}${portfolio.dailyPnLPercent.toFixed(2)}%`}
          trend={portfolio.dailyPnL >= 0 ? 'up' : 'down'}
          icon={<TrendingUp className="w-5 h-5" />}
          color={portfolio.dailyPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}
        />
        <MetricCard
          title="Win Rate"
          value="57.8%"
          subValue="Last 30 days"
          trend="up"
          icon={<Target className="w-5 h-5" />}
          color="text-purple-400"
        />
        <MetricCard
          title="Sharpe Ratio"
          value="2.14"
          subValue="Risk-adjusted return"
          trend="up"
          icon={<BarChart3 className="w-5 h-5" />}
          color="text-amber-400"
        />
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">Equity Curve</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={equityCurveData}>
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Equity']}
              />
              <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#equityGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">Risk Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Current Drawdown</span>
                <span className="text-white font-mono">{riskMetrics.currentDrawdown.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    riskMetrics.currentDrawdown < 3 ? 'bg-emerald-400' : riskMetrics.currentDrawdown < 7 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${(riskMetrics.currentDrawdown / riskMetrics.maxDrawdownLimit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Max: {riskMetrics.maxDrawdownLimit}%</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Daily Loss Limit</span>
                <span className="text-white font-mono">{riskMetrics.dailyLossUsed.toFixed(2)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-blue-400 transition-all`}
                  style={{ width: `${(riskMetrics.dailyLossUsed / riskMetrics.dailyLossLimit) * 100}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Limit: {riskMetrics.dailyLossLimit}%</p>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-400">Total Exposure</span>
                <span className="text-white font-mono">{riskMetrics.totalExposure}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-purple-400 transition-all`}
                  style={{ width: `${(riskMetrics.totalExposure / riskMetrics.maxExposure) * 100}%` }}
                />
              </div>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">VaR 95%</p>
                  <p className="text-sm font-mono text-yellow-400">${riskMetrics.var95.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Leverage</p>
                  <p className="text-sm font-mono text-white">{riskMetrics.leverage}x</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Positions and Recent Trades */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">Active Positions</h3>
          <div className="space-y-2">
            {positions.slice(0, 4).map((pos) => (
              <div key={pos.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${pos.side === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {pos.side === 'long' ? <TrendUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{pos.symbol}</p>
                    <p className="text-xs text-gray-500">{pos.strategy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-mono ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">Recent Trades</h3>
          <div className="space-y-2">
            {recentTrades.map((trade, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${trade.side === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {trade.side === 'long' ? <TrendUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{trade.symbol}</p>
                    <p className="text-xs text-gray-500">{trade.time}</p>
                  </div>
                </div>
                <p className={`text-sm font-mono ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Strategies Section
const Strategies: React.FC = () => {
  const { strategies, toggleStrategy } = useTradingStore();
  const strategyTypeLabels: Record<string, string> = {
    momentum: 'Momentum',
    mean_reversion: 'Mean Reversion',
    breakout: 'Breakout',
    scalping: 'Scalping',
    sentiment: 'Sentiment',
  };
  const strategyColors: Record<string, string> = {
    momentum: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    mean_reversion: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    breakout: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    scalping: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    sentiment: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Trading Strategies</h2>
        <button className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors">
          + Add Strategy
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {strategies.map((strategy) => (
          <div key={strategy.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${strategyColors[strategy.type]}`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">{strategy.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${strategyColors[strategy.type]}`}>
                    {strategyTypeLabels[strategy.type]}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleStrategy(strategy.id)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  strategy.enabled ? 'bg-emerald-500' : 'bg-gray-600'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  strategy.enabled ? 'left-6 translate-x-1' : 'left-1'
                }`} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Win Rate</p>
                <p className="text-sm font-mono text-emerald-400">{strategy.performance.winRate.toFixed(1)}%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Profit Factor</p>
                <p className="text-sm font-mono text-white">{strategy.performance.profitFactor.toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Sharpe</p>
                <p className="text-sm font-mono text-purple-400">{strategy.performance.sharpeRatio.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-700">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{strategy.performance.totalTrades} trades</span>
                <span>Signals: {strategy.signalCount}</span>
              </div>
              <StatusBadge status={strategy.status} />
            </div>
            {strategy.todayPnL !== 0 && (
              <div className="mt-3 flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                <span className="text-xs text-gray-500">Today's P&L</span>
                <span className={`text-sm font-mono ${strategy.todayPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {strategy.todayPnL >= 0 ? '+' : ''}${strategy.todayPnL.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Positions Section
const Positions: React.FC = () => {
  const { positions, closePosition } = useTradingStore();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Open Positions</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            Filter
          </button>
          <button className="px-3 py-1.5 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors">
            Export
          </button>
        </div>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Symbol</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Side</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Size</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Entry</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Current</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">P&L</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">SL</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">TP</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Age</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{pos.symbol}</p>
                    <p className="text-xs text-gray-500">{pos.strategy}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${pos.side === 'long' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {pos.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-white">{pos.size}</td>
                <td className="px-4 py-3 text-right text-sm font-mono text-white">${pos.entryPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm font-mono text-white">${pos.currentPrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  <p className={`text-sm font-mono ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                  </p>
                  <p className={`text-xs ${pos.pnlPercent >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                    {pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                  </p>
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-red-400">${pos.stopLoss.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm font-mono text-emerald-400">${pos.takeProfit.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-400">{pos.age}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => closePosition(pos.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                  >
                    Close
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Orders Section
const Orders: React.FC = () => {
  const { orders } = useTradingStore();
  const [activeTab, setActiveTab] = React.useState<'pending' | 'history'>('pending');
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const filledOrders = orders.filter((o) => ['filled', 'cancelled', 'rejected'].includes(o.status));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Orders</h2>
        <div className="flex gap-2">
          {(['pending', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'pending' ? `Pending (${pendingOrders.length})` : `History (${filledOrders.length})`}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Symbol</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Side</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Type</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Qty</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Price</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Filled</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-400">Status</th>
              <th className="text-right px-4 py-3 text-xs font-medium text-gray-400">Created</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'pending' ? pendingOrders : filledOrders).map((order) => (
              <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-white">{order.symbol}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${order.side === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {order.side.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{order.type.toUpperCase()}</td>
                <td className="px-4 py-3 text-right text-sm font-mono text-white">{order.quantity}</td>
                <td className="px-4 py-3 text-right text-sm font-mono text-white">
                  {order.price ? `$${order.price.toLocaleString()}` : 'MARKET'}
                </td>
                <td className="px-4 py-3 text-right text-sm font-mono text-white">
                  {order.filledPrice ? `$${order.filledPrice.toLocaleString()}` : '-'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Risk Management Section
const RiskManagement: React.FC = () => {
  const { riskMetrics, killSwitchActive, toggleKillSwitch } = useTradingStore();
  const correlationData = [
    { name: 'BTC', values: [1, 0.45, 0.32, 0.28, 0.15] },
    { name: 'ETH', values: [0.45, 1, 0.52, 0.38, 0.22] },
    { name: 'SOL', values: [0.32, 0.52, 1, 0.41, 0.18] },
    { name: 'NVDA', values: [0.28, 0.38, 0.41, 1, 0.35] },
    { name: 'TSLA', values: [0.15, 0.22, 0.18, 0.35, 1] },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Risk Management</h2>
        <button
          onClick={toggleKillSwitch}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
            killSwitchActive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
          }`}
        >
          <Power className="w-4 h-4" />
          {killSwitchActive ? 'Resume Trading' : 'Activate Kill Switch'}
        </button>
      </div>
      {/* Risk Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Max Drawdown"
          value={`${riskMetrics.currentDrawdown.toFixed(2)}%`}
          subValue={`Limit: ${riskMetrics.maxDrawdownLimit}%`}
          trend={riskMetrics.currentDrawdown > 5 ? 'down' : 'up'}
          icon={<AlertTriangle className="w-5 h-5" />}
          color={riskMetrics.currentDrawdown > 7 ? 'text-red-400' : riskMetrics.currentDrawdown > 4 ? 'text-yellow-400' : 'text-emerald-400'}
        />
        <MetricCard
          title="Daily Loss Used"
          value={`${riskMetrics.dailyLossUsed.toFixed(2)}%`}
          subValue={`Limit: ${riskMetrics.dailyLossLimit}%`}
          trend={riskMetrics.dailyLossUsed > 1.5 ? 'down' : 'up'}
          icon={<Clock className="w-5 h-5" />}
          color={riskMetrics.dailyLossUsed > 1.5 ? 'text-red-400' : 'text-blue-400'}
        />
        <MetricCard
          title="Position Correlation"
          value={riskMetrics.positionCorrelation.toFixed(2)}
          subValue="Avg correlation"
          trend={riskMetrics.positionCorrelation > 0.5 ? 'down' : 'neutral'}
          icon={<Activity className="w-5 h-5" />}
          color={riskMetrics.positionCorrelation > 0.6 ? 'text-yellow-400' : 'text-blue-400'}
        />
        <MetricCard
          title="Total Exposure"
          value={`${riskMetrics.totalExposure}%`}
          subValue={`Max: ${riskMetrics.maxExposure}%`}
          trend="neutral"
          icon={<BarChart3 className="w-5 h-5" />}
          color="text-purple-400"
        />
      </div>
      {/* Correlation Heatmap */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">Position Correlation Matrix</h3>
          <div className="space-y-2">
            <div className="flex gap-2 text-xs text-gray-500 pl-16">
              {['BTC', 'ETH', 'SOL', 'NVDA', 'TSLA'].map((s) => (
                <div key={s} className="w-16 text-center">{s}</div>
              ))}
            </div>
            {correlationData.map((row) => (
              <div key={row.name} className="flex gap-2 items-center">
                <div className="w-14 text-xs text-gray-500 text-right pr-2">{row.name}</div>
                {row.values.map((val, j) => {
                  const intensity = Math.abs(val);
                  const color = val > 0.6 ? 'bg-red-500' : val > 0.3 ? 'bg-yellow-500' : val > 0 ? 'bg-emerald-500' : 'bg-gray-600';
                  return (
                    <div
                      key={j}
                      className={`w-16 h-8 rounded flex items-center justify-center text-xs font-mono text-white ${color}`}
                      style={{ opacity: 0.3 + intensity * 0.7 }}
                      title={`${row.name} vs ${['BTC', 'ETH', 'SOL', 'NVDA', 'TSLA'][j]}: ${val}`}
                    >
                      {val.toFixed(2)}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-white mb-4">Drawdown History</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={[
              { date: 'Jan', value: -2.1 }, { date: 'Feb', value: -5.3 }, { date: 'Mar', value: -3.8 },
              { date: 'Apr', value: -1.2 }, { date: 'May', value: -4.5 }, { date: 'Jun', value: -8.4 },
              { date: 'Jul', value: -6.2 }, { date: 'Aug', value: -3.1 }, { date: 'Sep', value: -1.5 },
              { date: 'Oct', value: -0.8 }, { date: 'Nov', value: -2.3 }, { date: 'Dec', value: -1.1 },
            ]}>
              <defs>
                <linearGradient id="ddGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
              <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                formatter={(value) => [`${Number(value)}%`, 'Drawdown']}
              />
              <Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} fill="url(#ddGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Backtesting Section
const Backtesting: React.FC = () => {
  const { strategies } = useTradingStore();
  const [selectedStrategy, setSelectedStrategy] = React.useState(strategies[0]?.id || '');
  const [isRunning, setIsRunning] = React.useState(false);
  const backtestResults = [
    { label: 'Total Return', value: '+69.46%', trend: 'up' },
    { label: 'Sharpe Ratio', value: '2.14', trend: 'up' },
    { label: 'Max Drawdown', value: '-8.42%', trend: 'down' },
    { label: 'Win Rate', value: '57.8%', trend: 'up' },
    { label: 'Profit Factor', value: '1.87', trend: 'up' },
    { label: 'Total Trades', value: '847', trend: 'neutral' },
  ];
  const monthlyReturns = [
    { month: 'Jan', return: 8.2 }, { month: 'Feb', return: 5.4 }, { month: 'Mar', return: -2.1 },
    { month: 'Apr', return: 12.3 }, { month: 'May', return: 3.8 }, { month: 'Jun', return: -4.2 },
    { month: 'Jul', return: 7.6 }, { month: 'Aug', return: 4.2 }, { month: 'Sep', return: 6.8 },
    { month: 'Oct', return: 9.1 }, { month: 'Nov', return: 11.4 }, { month: 'Dec', return: 5.8 },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Backtesting Engine</h2>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {/* Configuration */}
        <div className="col-span-1 space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-medium text-white">Configuration</h3>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Strategy</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
              >
                {strategies.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Date Range</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>Last 3 months</option>
                <option>Custom range</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Initial Capital</label>
              <input
                type="text"
                defaultValue="$50,000"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Commission</label>
              <input
                type="text"
                defaultValue="0.1%"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                isRunning
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
              }`}
            >
              {isRunning ? (
                <><Pause className="w-4 h-4" /> Stop</>
              ) : (
                <><Play className="w-4 h-4" /> Run Backtest</>
              )}
            </button>
          </div>
        </div>
        {/* Results */}
        <div className="col-span-3 space-y-6">
          <div className="grid grid-cols-6 gap-4">
            {backtestResults.map((r) => (
              <div key={r.label} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">{r.label}</p>
                <p className={`text-lg font-semibold font-mono ${
                  r.trend === 'up' ? 'text-emerald-400' : r.trend === 'down' ? 'text-red-400' : 'text-white'
                }`}>
                  {r.value}
                </p>
              </div>
            ))}
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-4">Equity Curve</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={[
                { date: 'Jan', value: 50000 }, { date: 'Feb', value: 54100 }, { date: 'Mar', value: 57000 },
                { date: 'Apr', value: 64000 }, { date: 'May', value: 66400 }, { date: 'Jun', value: 63600 },
                { date: 'Jul', value: 68400 }, { date: 'Aug', value: 71200 }, { date: 'Sep', value: 76000 },
                { date: 'Oct', value: 82900 }, { date: 'Nov', value: 92500 }, { date: 'Dec', value: 84732 },
              ]}>
                <defs>
                  <linearGradient id="btGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Equity']}
                />
                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#btGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-4">Monthly Returns</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  formatter={(value) => [`${Number(value)}%`, 'Return']}
                />
                <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                  {monthlyReturns.map((entry, index) => (
                    <Cell key={index} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trade Console Section
const TradeConsole: React.FC = () => {
  const { logs } = useTradingStore();
  const logLevelColors: Record<string, string> = {
    debug: 'text-gray-500',
    info: 'text-blue-400',
    warn: 'text-yellow-400',
    error: 'text-red-400',
    trade: 'text-emerald-400',
  };
  const [filter, setFilter] = React.useState<string>('all');
  const filteredLogs = filter === 'all' ? logs : logs.filter((l) => l.level === filter);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Trade Console</h2>
        <div className="flex gap-2">
          {['all', 'trade', 'info', 'warn', 'error'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === level ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-[500px] overflow-y-auto font-mono text-sm">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex gap-4 py-2 border-b border-gray-800 hover:bg-gray-800/30 px-2">
            <span className="text-gray-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
            <span className={`shrink-0 ${logLevelColors[log.level]}`}>[{log.level.toUpperCase()}]</span>
            <span className="text-gray-400 shrink-0">{log.source}</span>
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings Section
const SettingsPage: React.FC = () => {
  const { connectionStatus } = useTradingStore();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Settings</h2>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-medium text-white">Broker Configuration</h3>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">API Key</label>
            <input
              type="password"
              placeholder="Enter API key"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">API Secret</label>
            <input
              type="password"
              placeholder="Enter API secret"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus.broker === 'connected' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-sm text-gray-300">Connection Status</span>
            </div>
            <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30">
              Test Connection
            </button>
          </div>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-medium text-white">Risk Parameters</h3>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Risk Per Trade (%)</label>
            <input
              type="number"
              defaultValue="1"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Drawdown Limit (%)</label>
            <input
              type="number"
              defaultValue="10"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Daily Loss Limit (%)</label>
            <input
              type="number"
              defaultValue="2"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Max Total Exposure (%)</label>
            <input
              type="number"
              defaultValue="50"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
          <button className="w-full py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm font-medium hover:bg-blue-500/30">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const { activeSection } = useTradingStore();
  const [lastUpdate, setLastUpdate] = React.useState(new Date());
  
  // Simulate real-time data updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'strategies': return <Strategies />;
      case 'positions': return <Positions />;
      case 'orders': return <Orders />;
      case 'risk': return <RiskManagement />;
      case 'backtest': return <Backtesting />;
      case 'logs': return <TradeConsole />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-white flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {renderSection()}
        </main>
        <footer className="h-10 bg-gray-900 border-t border-gray-700 flex items-center justify-between px-6 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </div>
            <span>Last update: {lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div>QuantForge v1.0.0 | Build 2024.01.15</div>
        </footer>
      </div>
    </div>
  );
};

export default App;
