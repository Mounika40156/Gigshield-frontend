import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import * as api from '../services/api'

const AppContext = createContext(null)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}

// ---------------------------------------------------------------------------
// Fallback data — used when backend is unreachable (graceful degradation)
// ---------------------------------------------------------------------------

const FALLBACK_WORKERS_DB = [
  {
    id: 'WRK-001', name: 'Ravi Kumar', phone: '9876543210', city: 'Delhi',
    platform: 'Swiggy', registered_zone: 'Delhi NCR', daily_earnings: 850,
    trust_score: 78, gps_active: true, login_active: true, fraud_flag: false,
    risk_profile: { zone: 'HIGH', score: 72, multiplier: 1.3, flood_risk: false },
    plan: 'Standard', premium: 99, max_payout: 2000,
  },
  {
    id: 'WRK-002', name: 'Priya Sharma', phone: '9123456780', city: 'Mumbai',
    platform: 'Zomato', registered_zone: 'Mumbai West', daily_earnings: 720,
    trust_score: 31, gps_active: false, login_active: false, fraud_flag: true,
    fraud_reason: 'GPS mismatch + no platform login detected',
    risk_profile: { zone: 'HIGH', score: 85, multiplier: 1.4, flood_risk: true },
    plan: 'Basic', premium: 49, max_payout: 1000,
  },
  {
    id: 'WRK-003', name: 'Arjun Patel', phone: '9988776655', city: 'Delhi',
    platform: 'Blinkit', registered_zone: 'Delhi NCR', daily_earnings: 900,
    trust_score: 45, gps_active: true, login_active: false, fraud_flag: true,
    fraud_reason: 'Platform login inactive - possible ghost claim',
    risk_profile: { zone: 'HIGH', score: 68, multiplier: 1.1, flood_risk: false },
    plan: 'Premium', premium: 149, max_payout: 3000,
  },
]

// Map backend snake_case keys to the camelCase the existing UI expects
function normaliseWorker(w) {
  if (!w) return w
  return {
    id: w.id,
    name: w.name,
    phone: w.phone,
    city: w.city,
    platform: w.platform,
    registeredZone: w.registered_zone ?? w.registeredZone ?? '',
    dailyEarnings: w.daily_earnings ?? w.dailyEarnings ?? 800,
    trustScore: w.trust_score ?? w.trustScore ?? 42,
    gpsActive: w.gps_active ?? w.gpsActive ?? true,
    loginActive: w.login_active ?? w.loginActive ?? true,
    fraudFlag: w.fraud_flag ?? w.fraudFlag ?? false,
    fraudReason: w.fraud_reason ?? w.fraudReason ?? null,
    riskProfile: w.risk_profile ?? w.riskProfile ?? { zone: 'MEDIUM', score: 50, multiplier: 1.0 },
    plan: w.plan,
    premium: w.premium,
    maxPayout: w.max_payout ?? w.maxPayout ?? 2000,
  }
}

function normalisePolicy(p) {
  if (!p) return p
  return {
    plan: p.plan,
    premium: p.premium,
    maxPayout: p.max_payout ?? p.maxPayout ?? 3000,
    startDate: p.start_date ?? p.startDate ?? '',
    endDate: p.end_date ?? p.endDate ?? '',
    status: p.status ?? 'ACTIVE',
    claimsUsed: p.claims_used ?? p.claimsUsed ?? 0,
  }
}

function normaliseClaim(c) {
  if (!c) return c
  return {
    id: c.id,
    date: c.date,
    trigger: c.trigger,
    amount: c.amount,
    autoTriggered: c.auto_triggered ?? c.autoTriggered ?? false,
    status: c.status,
    processedIn: c.processed_in ?? c.processedIn ?? null,
    channel: c.channel ?? 'UPI',
    fraudReason: c.fraud_reason ?? c.fraudReason ?? null,
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AppProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem('gs_theme') || 'light')

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('gs_theme', theme)
  }, [theme])

  const setTheme = (t) => {
    setThemeState(t)
    document.body.setAttribute('data-theme', t)
    localStorage.setItem('gs_theme', t)
  }

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gs_user')) || null } catch { return null }
  })

  const [policy, setPolicy] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gs_policy')) || null } catch { return null }
  })

  const [claims, setClaims] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gs_claims')) || [] } catch { return [] }
  })

  const [weatherData, setWeatherData] = useState(null)
  const [platformData, setPlatformData] = useState(null)
  const [floodData, setFloodData] = useState(null)
  const [activeTrigger, setActiveTrigger] = useState(null)
  const [autoClaim, setAutoClaim] = useState(null)

  // Workers loaded from backend
  const [FAKE_WORKERS_DB, setWorkersDB] = useState(FALLBACK_WORKERS_DB)

  // Fraud stats from backend
  const [fraudStats, setFraudStats] = useState({
    totalChecked: 0, fraudBlocked: 0, fraudPassed: 0,
    totalPremiumCollected: 0, totalClaimsPaid: 0,
  })

  const policyRef = useRef(policy)
  const userRef = useRef(user)
  useEffect(() => { policyRef.current = policy }, [policy])
  useEffect(() => { userRef.current = user }, [user])

  useEffect(() => { localStorage.setItem('gs_user', JSON.stringify(user)) }, [user])
  useEffect(() => { localStorage.setItem('gs_policy', JSON.stringify(policy)) }, [policy])
  useEffect(() => { localStorage.setItem('gs_claims', JSON.stringify(claims)) }, [claims])

  // Load workers from backend on mount
  useEffect(() => {
    api.getWorkers().then(data => {
      if (!data.error && Array.isArray(data)) {
        setWorkersDB(data.map(normaliseWorker))
      }
    })
  }, [])

  // Sync fraud stats from backend periodically
  const syncFraudStats = async () => {
    const stats = await api.getFraudStats()
    if (!stats.error) {
      setFraudStats({
        totalChecked: stats.total_checked ?? 0,
        fraudBlocked: stats.fraud_blocked ?? 0,
        fraudPassed: stats.fraud_passed ?? 0,
        totalPremiumCollected: stats.total_premium_collected ?? 0,
        totalClaimsPaid: stats.total_claims_paid ?? 0,
      })
    }
  }

  // ── Fraud detection — calls backend ML pipeline ──
  const runFraudCheck = async (workerOverride = null) => {
    const workerId = workerOverride?.id || null
    const result = await api.runFraudCheck(workerId)

    if (result.error) {
      // Fallback to local logic if backend is down
      const target = workerOverride || FAKE_WORKERS_DB[0]
      const steps = [
        { label: 'GPS Signal Validation', note: 'Cross-validating location', passed: target.gpsActive, detail: target.gpsActive ? `GPS confirmed in ${target.registeredZone}` : 'GPS mismatch' },
        { label: 'Platform Login Check', note: 'Was worker active?', passed: target.loginActive, detail: target.loginActive ? `${target.platform} login confirmed` : `No login detected` },
        { label: 'Device Fingerprint Check', note: 'One account per device', passed: !target.fraudFlag || target.gpsActive, detail: 'Device fingerprint matches' },
        { label: 'Behavioral Baseline Match', note: 'Movement pattern check', passed: target.trustScore >= 40, detail: `Trust score ${target.trustScore}/100` },
        { label: 'Trust Score Evaluation', note: 'Final gate', passed: !target.fraudFlag, detail: target.fraudFlag ? `BLOCKED: ${target.fraudReason}` : 'All checks passed' },
      ]
      return { passed: steps.every(s => s.passed), steps, worker: target }
    }

    await syncFraudStats()
    return { passed: result.passed, steps: result.steps, worker: workerOverride || FAKE_WORKERS_DB[0] }
  }

  // ── Claim processing — calls backend pipeline ──
  const addClaim = async (trigger, amount, autoTriggered = false) => {
    const newClaim = {
      id: `CLM-${Date.now()}`, date: new Date().toISOString().split('T')[0],
      trigger, amount, autoTriggered, status: 'PROCESSING', processedIn: null, channel: 'UPI',
    }
    setClaims(prev => [newClaim, ...prev])

    // Simulate UPI payout in 3 seconds
    setTimeout(() => {
      const upiSuccess = Math.random() > 0.1
      setClaims(prev => prev.map(c =>
        c.id === newClaim.id
          ? { ...c, status: 'PAID', processedIn: upiSuccess ? '3 min' : '6 min', channel: upiSuccess ? 'UPI' : 'IMPS (fallback)' }
          : c
      ))
      setFraudStats(prev => ({ ...prev, totalClaimsPaid: prev.totalClaimsPaid + amount }))
    }, 3000)

    return newClaim
  }

  const blockClaim = (trigger, worker) => {
    const blocked = {
      id: `CLM-${Date.now()}`, date: new Date().toISOString().split('T')[0],
      trigger, amount: 0, autoTriggered: false, status: 'FRAUD BLOCKED',
      processedIn: 'Instant', channel: '—',
      fraudReason: worker?.fraudReason || worker?.fraud_reason || 'Fraud detected',
    }
    setClaims(prev => [blocked, ...prev])
    return blocked
  }

  // ── Risk profile — calls backend ML model ──
  const calculateRiskProfile = async (city, platform, dailyEarnings) => {
    const result = await api.assessRisk(city, platform, dailyEarnings)
    if (result.error) {
      // Fallback
      const CITY_RISK = { Mumbai: { riskMultiplier: 1.4, zone: 'HIGH', floodRisk: true }, Delhi: { riskMultiplier: 1.3, zone: 'HIGH', floodRisk: false }, Hyderabad: { riskMultiplier: 1.1, zone: 'MEDIUM', floodRisk: false }, Bengaluru: { riskMultiplier: 1.2, zone: 'MEDIUM', floodRisk: true }, Chennai: { riskMultiplier: 1.3, zone: 'HIGH', floodRisk: true }, Kolkata: { riskMultiplier: 1.4, zone: 'HIGH', floodRisk: true }, Pune: { riskMultiplier: 1.1, zone: 'MEDIUM', floodRisk: false }, Ahmedabad: { riskMultiplier: 1.0, zone: 'LOW', floodRisk: false } }
      const cityData = CITY_RISK[city] || { riskMultiplier: 1.1, zone: 'MEDIUM' }
      const platformRisk = { Swiggy: 1.0, Zomato: 1.0, Zepto: 1.1, Blinkit: 1.1, 'Amazon Flex': 0.9, Flipkart: 0.9 }
      const pm = platformRisk[platform] || 1.0
      const score = 60 + (cityData.riskMultiplier - 1) * 80 + (pm - 1) * 20
      return { zone: cityData.zone, score: Math.min(Math.round(score), 95), multiplier: cityData.riskMultiplier * pm, floodRisk: cityData.floodRisk }
    }
    return { zone: result.zone, score: result.score, multiplier: result.multiplier, floodRisk: result.flood_risk ?? false }
  }

  // ── Premium calculation — calls backend ML model ──
  const calculatePremium = async (plan, city, platform, dailyEarnings) => {
    const result = await api.calculatePremium(plan, city, platform, dailyEarnings)
    if (result.error) {
      // Fallback
      const base = { Basic: 49, Standard: 99, Premium: 149 }[plan] || 99
      const risk = await calculateRiskProfile(city, platform, dailyEarnings)
      const adjustment = Math.round((risk.multiplier - 1) * 20)
      return Math.max(base - 5, Math.min(base + adjustment, base + 15))
    }
    return result.premium
  }

  // ── Weather data — calls backend mock downstream ──
  const fetchWeather = async (city) => {
    const data = await api.fetchWeather(city)
    if (!data.error) {
      setWeatherData(data)
      return data
    }
    // Fallback
    const WEATHER_MOCK = { Mumbai: { temp: 33, rain: 78, aqi: 142, description: 'Heavy Rain', icon: '🌧️' }, Delhi: { temp: 44, rain: 0, aqi: 385, description: 'Severe Haze', icon: '🌫️' }, Hyderabad: { temp: 38, rain: 12, aqi: 95, description: 'Partly Cloudy', icon: '⛅' }, Bengaluru: { temp: 29, rain: 45, aqi: 88, description: 'Moderate Rain', icon: '🌦️' }, Chennai: { temp: 35, rain: 62, aqi: 110, description: 'Heavy Rain', icon: '🌧️' }, Kolkata: { temp: 32, rain: 55, aqi: 198, description: 'Rain + Haze', icon: '🌧️' }, Pune: { temp: 36, rain: 20, aqi: 76, description: 'Light Rain', icon: '🌦️' }, Ahmedabad: { temp: 42, rain: 0, aqi: 155, description: 'Hot & Hazy', icon: '☀️' } }
    const fallback = WEATHER_MOCK[city] || WEATHER_MOCK.Mumbai
    setWeatherData(fallback)
    return fallback
  }

  const fetchPlatformStatus = async (platform) => {
    const data = await api.fetchPlatformStatus(platform || 'Swiggy')
    if (!data.error) {
      setPlatformData(data)
      return data
    }
    return { uptime: 99.1, lastOutage: '2026-03-28', outageHours: 2.4, outageActive: false }
  }

  const fetchFloodAdvisory = async (city) => {
    const data = await api.fetchFloodAdvisory(city || 'Mumbai')
    if (!data.error) {
      setFloodData(data)
      return data
    }
    return { level: 'GREEN', advisory: false, waterlogging: 'No' }
  }

  const refreshAllData = async (city, platform) => {
    const result = await api.fetchAllMonitoringData(city || 'Mumbai', platform || 'Swiggy')
    if (!result.error) {
      setWeatherData(result.weather)
      setPlatformData(result.platform)
      setFloodData(result.flood)
      return
    }
    // Fallback: fetch individually
    await Promise.all([
      fetchWeather(city),
      fetchPlatformStatus(platform),
      fetchFloodAdvisory(city),
    ])
  }

  // BCR — calls backend
  const getBCR = () => {
    const totalPremium = policy ? policy.premium * 4 : 396
    const totalClaims = claims.filter(c => c.status === 'PAID').reduce((s, c) => s + c.amount, 0)
    const bcr = totalPremium > 0 ? (totalClaims / totalPremium).toFixed(2) : 0
    return { bcr, totalPremium, totalClaims }
  }

  const logout = () => {
    setUser(null)
    setPolicy(null)
    setClaims([])
    localStorage.clear()
  }

  return (
    <AppContext.Provider
      value={{
        theme, setTheme,
        user, setUser,
        policy, setPolicy,
        claims, setClaims,
        weatherData, platformData, floodData,
        activeTrigger, setActiveTrigger,
        autoClaim, setAutoClaim,
        fraudStats,
        calculateRiskProfile, calculatePremium,
        addClaim, blockClaim, runFraudCheck,
        getBCR, fetchWeather, fetchPlatformStatus, fetchFloodAdvisory,
        refreshAllData, logout,
        FAKE_WORKERS_DB,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
