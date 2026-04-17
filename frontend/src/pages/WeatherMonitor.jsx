import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import {
  CloudRain,
  CloudSun,
  Thermometer,
  Wind,
  Waves,
  Zap,
  Activity,
  RefreshCw,
  Play,
  AlertTriangle,
  CheckCircle,
  Radio,
} from 'lucide-react';

const CITIES    = ['Mumbai','Delhi','Hyderabad','Bengaluru','Chennai','Kolkata','Pune','Ahmedabad'];
const PLATFORMS = ['Swiggy','Zomato','Zepto','Blinkit','Amazon Flex','Flipkart'];

// Maps trigger/gauge names to Lucide icon components
const TRIGGER_ICONS = {
  'Heavy Rain':      CloudRain,
  'Heatwave':        Thermometer,
  'Severe AQI':      Wind,
  'Flood Alert':     Waves,
  'Platform Outage': Zap,
};

function GaugeBar({ value, threshold, unit, label, icon: Icon, triggered }) {
  const pct   = Math.min((value / (threshold * 1.5)) * 100, 100);
  const color = triggered ? 'var(--red)' : value >= threshold * 0.7 ? 'var(--yellow)' : 'var(--green)';
  return (
    <div className={`gauge-bar ${triggered ? 'triggered' : ''}`}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-8">
          <Icon size={18} />
          <span style={{fontWeight:600,fontSize:13}}>{label}</span>
        </div>
        {triggered && <span className="badge badge-red">TRIGGERED</span>}
      </div>
      <div style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:28,color,letterSpacing:'-0.5px',marginBottom:10}}>{value}{unit}</div>
      <div className="progress-track" style={{height:6,marginBottom:8}}>
        <div style={{height:'100%',borderRadius:10,background:color,width:pct+'%',transition:'width 0.6s ease'}}/>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-3">0{unit}</span>
        <span className="text-xs text-3">Trigger: {threshold}{unit}</span>
        <span className="text-xs text-3">{Math.round(threshold*1.5)}{unit}</span>
      </div>
    </div>
  );
}

function StatusCard({ icon: Icon, label, value, subvalue, color, badgeText, badgeClass }) {
  return (
    <div style={{background:color==='red'?'var(--red-bg)':color==='yellow'?'var(--yellow-bg)':'var(--green-bg)',border:'1px solid '+(color==='red'?'var(--red-border)':color==='yellow'?'var(--yellow-border)':'var(--green-border)'),borderRadius:10,padding:'16px'}}>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-8">
          <Icon size={18} />
          <span style={{fontWeight:600,fontSize:13}}>{label}</span>
        </div>
        <span className={`badge ${badgeClass}`}>{badgeText}</span>
      </div>
      <div style={{fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:20,color:color==='red'?'var(--red)':color==='yellow'?'var(--yellow)':'var(--green)',marginBottom:4}}>{value}</div>
      <div className="text-xs text-3">{subvalue}</div>
    </div>
  );
}

export default function WeatherMonitor() {
  const navigate = useNavigate();
  const { user, weatherData, platformData, floodData, activeTrigger, refreshAllData } = useApp();
  const [city,        setCity]      = useState(user?.city || 'Hyderabad');
  const [platform,    setPlatform]  = useState(user?.platform || 'Swiggy');
  const [loading,     setLoading]   = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [polling,     setPolling]   = useState(false);
  const pollRef = useRef(null);

  useEffect(() => { if (!user) { navigate('/register'); return; } doRefresh(); }, [city, platform]); // eslint-disable-line
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);
  if (!user) return null;

  const doRefresh = async () => {
    setLoading(true);
    await refreshAllData(city, platform);
    setLastUpdated(new Date());
    setLoading(false);
  };

  const startPolling = () => {
    if (polling) return;
    setPolling(true);
    pollRef.current = setInterval(doRefresh, 15000);
  };

  const TRIGGERS_REF = [
    { name:'Heavy Rain',      condition:'Rainfall > 60mm/day',     api:'OpenWeatherMap API',  impact:'40-60% order drop'   },
    { name:'Heatwave',        condition:'Temperature > 45°C',      api:'IMD + OpenWeatherMap',impact:'25-35% order drop'   },
    { name:'Severe AQI',      condition:'AQI Index > 400',         api:'CPCB AQI API',        impact:'20-30% order drop'   },
    { name:'Flood Alert',     condition:'NDMA advisory issued',     api:'NDMA API (mock)',     impact:'Near-zero deliveries' },
    { name:'Platform Outage', condition:'> 2hr app downtime',       api:'Platform Status API', impact:'Zero orders'          },
  ];

  const floodLevel = floodData?.level || 'GREEN';
  const floodColor = floodLevel==='RED'?'red':floodLevel==='ORANGE'||floodLevel==='YELLOW'?'yellow':'green';

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">

        {/* ── Page Header ── */}
        <div className="page-header" style={{borderBottom:'1px solid var(--border)',paddingBottom:20,marginBottom:24}}>
          <div className="flex items-center gap-10" style={{marginBottom:6}}>
            <Activity size={22} style={{color:'var(--primary)'}} />
            <h1 style={{fontSize:22,fontWeight:800,fontFamily:'Plus Jakarta Sans'}}>Live Disruption Monitor</h1>
            {activeTrigger && (
              <span className="badge badge-red" style={{display:'flex',alignItems:'center',gap:4}}>
                <AlertTriangle size={12} /> ALERT ACTIVE
              </span>
            )}
          </div>
          <p style={{color:'var(--text-3)',fontSize:13,marginLeft:32}}>
            5 parametric triggers monitored in real-time — auto-initiates zero-touch payouts on breach
          </p>
        </div>

        {activeTrigger && (
          <div className="trigger-banner">
            <div className="trigger-dot"/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,color:'var(--red)',fontSize:13}}>Parametric Trigger Active — {activeTrigger.type}</div>
              <div className="text-sm text-2 mt-4">Current: {activeTrigger.value} · Threshold: {activeTrigger.threshold} · Severity: {activeTrigger.severity}</div>
            </div>
            <button className="btn btn-sm" style={{background:'var(--red)',color:'white',flexShrink:0}} onClick={() => navigate('/claims')}>View Claims →</button>
          </div>
        )}

        {/* Controls */}
        <div className="card mb-20">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto auto',gap:16,alignItems:'flex-end'}}>
            <div>
              <label className="form-label">Monitor City</label>
              <select className="form-select" value={city} onChange={e => setCity(e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Platform</label>
              <select className="form-select" value={platform} onChange={e => setPlatform(e.target.value)}>
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <button className="btn btn-outline" onClick={doRefresh} disabled={loading}>
              {loading ? <span className="spinner spinner-dark"/> : <RefreshCw size={14} />} Refresh
            </button>
            <button className="btn btn-primary" onClick={startPolling} disabled={polling} style={{background:polling?'var(--green)':undefined}}>
              {polling ? <><Radio size={14} /> Polling 15s</> : <><Play size={14} /> Auto-Poll</>}
            </button>
          </div>
          {lastUpdated && <div className="text-xs text-3 mt-10">Last updated: {lastUpdated.toLocaleTimeString()}</div>}
        </div>

        {weatherData ? (
          <>
            {/* Weather gauges */}
            <div className="grid-3 mb-16">
              <GaugeBar value={weatherData.rain} threshold={60}  unit="mm" label="Rainfall"    icon={CloudRain}   triggered={weatherData.rain>=60}/>
              <GaugeBar value={weatherData.temp} threshold={45}  unit="°C" label="Temperature" icon={Thermometer} triggered={weatherData.temp>=45}/>
              <GaugeBar value={weatherData.aqi}  threshold={400} unit=""   label="AQI Index"   icon={Wind}        triggered={weatherData.aqi>=400}/>
            </div>

            {/* Flood + Platform status */}
            <div className="grid-2 mb-20">
              <StatusCard
                icon={Waves} label="NDMA Flood Advisory"
                value={floodData ? `${floodData.waterlogging} Waterlogging` : 'Loading…'}
                subvalue={floodData ? `Level: ${floodData.level} · ${city} · NDMA Mock API` : ''}
                color={floodColor}
                badgeText={floodData?.advisory ? '⚠ ADVISORY' : '✓ CLEAR'}
                badgeClass={floodData?.advisory ? 'badge-red' : 'badge-green'}
              />
              <StatusCard
                icon={Zap} label="Platform Status API"
                value={platformData ? (platformData.outageActive ? `Outage: ${platformData.outageHours}hr` : `${platform} Online`) : 'Loading…'}
                subvalue={platformData ? `Uptime: ${platformData.uptime}% · Last outage: ${platformData.lastOutage}` : ''}
                color={platformData?.outageActive ? 'red' : 'green'}
                badgeText={platformData?.outageActive ? '● OUTAGE' : '✓ ONLINE'}
                badgeClass={platformData?.outageActive ? 'badge-red' : 'badge-green'}
              />
            </div>

            {/* Current conditions */}
            <div className="card mb-20">
              <h3 style={{fontSize:15,marginBottom:14}}>Current Conditions — {city}</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
                {[
                  { label:'Condition',   value:weatherData.description, Icon:CloudSun      },
                  { label:'Temperature', value:weatherData.temp+'°C',   Icon:Thermometer   },
                  { label:'Rainfall',    value:weatherData.rain+'mm',   Icon:CloudRain     },
                  { label:'AQI Level',   value:String(weatherData.aqi), Icon:Wind          },
                ].map((x,i) => (
                  <div key={i} style={{padding:'14px',background:'var(--surface2)',borderRadius:9,textAlign:'center'}}>
                    <x.Icon size={24} style={{margin:'0 auto 6px',display:'block',color:'var(--text-2)'}} />
                    <div style={{fontFamily:'Plus Jakarta Sans',fontWeight:700,fontSize:18,color:'var(--text)',marginBottom:4}}>{x.value}</div>
                    <div className="text-xs text-3">{x.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="card mb-20" style={{textAlign:'center',padding:'48px 0'}}>
            <CloudRain size={32} style={{margin:'0 auto 10px',display:'block',color:'var(--text-3)'}} />
            <div className="text-sm text-2">Click Refresh to load live data</div>
          </div>
        )}

        {/* All 5 trigger reference */}
        <div className="card">
          <h3 style={{fontSize:15,marginBottom:14}}>All 5 Parametric Trigger Thresholds</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {TRIGGERS_REF.map((t, i) => {
              const isActive = activeTrigger?.type === t.name;
              const Icon = TRIGGER_ICONS[t.name] || Activity;
              return (
                <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'12px 14px',borderRadius:9,background:isActive?'var(--red-bg)':'var(--surface2)',border:'1px solid '+(isActive?'var(--red-border)':'var(--border)')}}>
                  <Icon size={18} style={{flexShrink:0,marginTop:1,color:isActive?'var(--red)':'var(--text-2)'}} />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13}}>
                      {t.name} {isActive && <span className="badge badge-red" style={{marginLeft:4}}>ACTIVE</span>}
                    </div>
                    <div className="text-xs text-3 mt-4">{t.condition}</div>
                    <div className="text-xs text-3 flex items-center gap-4">
                      <CheckCircle size={10}/> {t.api} · {t.impact}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}