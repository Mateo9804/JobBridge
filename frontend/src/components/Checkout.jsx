import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import './Pricing.css';

const PLAN_LOOKUP = {
  'user-pro': {
    name: 'Plan profesional (Usuario)',
  },
  'company-pro': {
    name: 'Plan profesional (Empresa)',
  },
};

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const planKey = location.state?.plan || 'user-pro';
  const planData = PLAN_LOOKUP[planKey] || PLAN_LOOKUP['user-pro'];

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <Header />
      <div className="checkout-page" style={{maxWidth:900, margin:'40px auto 0 auto', padding:20, background:'#f8f9fa', borderRadius:12, flex:1}}>
        <div className="summary-panel" style={{background: '#fff', borderRadius: 12, boxShadow: '0 0 4px #ccc', padding: 28, maxWidth: 720, margin: '0 auto', position:'relative'}}>
          <button
            type="button"
            onClick={() => navigate('/pricing')}
            title="Volver"
            style={{position:'absolute',right:10,top:10,background:'none',border:'none',fontSize:28,color:'#888',cursor:'pointer',fontWeight:600,lineHeight:1}}
          >
            ×
          </button>

          <h1 style={{marginTop:0, marginBottom:12, textAlign:'center', fontWeight:700}}>Plan profesional</h1>
          <p style={{margin:'0 0 22px 0', textAlign:'center', color:'#555'}}>
            {planData.name}
          </p>

          <div style={{background:'#f2f4f6', borderRadius:10, padding:'18px 18px', color:'#333', textAlign:'center', fontWeight:700}}>
            Esto todavía no está disponible.
          </div>

          <div style={{display:'flex', justifyContent:'center', marginTop:22}}>
            <button type="button" className="subscribe-btn" onClick={() => navigate('/pricing')} style={{padding:'12px 18px', borderRadius:10}}>
              Volver a Planes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
