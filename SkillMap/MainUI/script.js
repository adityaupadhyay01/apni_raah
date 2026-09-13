const { useState, useEffect } = React;

// DATA
const ROLES = {
  "Data Analyst": {
    icon:"📊",
    skills:["SQL","Excel","Python","Statistics","Data Visualization","Data Cleaning","Tableau","Power BI","R","Business Intelligence"],
    deps:{"Data Cleaning":["SQL"],"Data Visualization":["Data Cleaning","Excel"],"Tableau":["Data Visualization"],"Power BI":["Data Visualization"],"Business Intelligence":["SQL","Tableau"]},
    priorities:{"SQL":"HIGH","Python":"HIGH","Statistics":"HIGH","Data Cleaning":"HIGH","Excel":"MEDIUM","Data Visualization":"MEDIUM","Tableau":"MEDIUM","Power BI":"MEDIUM","R":"LOW","Business Intelligence":"LOW"},
    resources:{"SQL":"Mode Analytics, W3Schools SQL","Python":"Python.org, freeCodeCamp","Statistics":"Khan Academy Stats","Data Cleaning":"Kaggle courses","Tableau":"Tableau Public free training","Data Visualization":"Storytelling with Data (book)"}
  },
  "Web Developer": {
    icon:"💻",
    skills:["HTML","CSS","JavaScript","React","Node.js","Git","REST APIs","TypeScript","Testing","Docker"],
    deps:{"CSS":["HTML"],"JavaScript":["HTML","CSS"],"React":["JavaScript"],"Node.js":["JavaScript"],"REST APIs":["JavaScript","Node.js"],"TypeScript":["JavaScript"],"Testing":["JavaScript"],"Docker":["Node.js"]},
    priorities:{"HTML":"HIGH","CSS":"HIGH","JavaScript":"HIGH","React":"HIGH","Git":"HIGH","Node.js":"MEDIUM","REST APIs":"MEDIUM","TypeScript":"MEDIUM","Testing":"LOW","Docker":"LOW"},
    resources:{"HTML":"MDN Web Docs","CSS":"CSS-Tricks, Flexbox Froggy","JavaScript":"javascript.info, Eloquent JS","React":"react.dev official docs","Node.js":"nodejs.org, The Odin Project","Git":"Oh My Git!, GitHub Learning Lab"}
  },
  "ML Engineer": {
    icon:"🤖",
    skills:["Python","Linear Algebra","Statistics","Machine Learning","Deep Learning","PyTorch","Data Preprocessing","Feature Engineering","Model Deployment","MLOps"],
    deps:{"Machine Learning":["Python","Linear Algebra","Statistics"],"Deep Learning":["Machine Learning","PyTorch"],"Feature Engineering":["Data Preprocessing","Statistics"],"Model Deployment":["Machine Learning"],"MLOps":["Model Deployment"]},
    priorities:{"Python":"HIGH","Linear Algebra":"HIGH","Statistics":"HIGH","Machine Learning":"HIGH","Data Preprocessing":"HIGH","PyTorch":"MEDIUM","Deep Learning":"MEDIUM","Feature Engineering":"MEDIUM","Model Deployment":"LOW","MLOps":"LOW"},
    resources:{"Python":"fast.ai, Python Data Science Handbook","Linear Algebra":"3Blue1Brown (YouTube)","Machine Learning":"Andrew Ng's Coursera","Deep Learning":"fast.ai part 2","PyTorch":"pytorch.org tutorials","Data Preprocessing":"Kaggle micro-courses"}
  },
  "Product Manager": {
    icon:"🎯",
    skills:["Product Strategy","User Research","Data Analysis","Roadmapping","Stakeholder Management","A/B Testing","SQL","Wireframing","Agile","Market Research"],
    deps:{"Roadmapping":["Product Strategy"],"A/B Testing":["Data Analysis","SQL"],"Stakeholder Management":["Product Strategy"],"Market Research":["User Research"]},
    priorities:{"Product Strategy":"HIGH","User Research":"HIGH","Data Analysis":"HIGH","Stakeholder Management":"HIGH","Roadmapping":"MEDIUM","A/B Testing":"MEDIUM","SQL":"MEDIUM","Wireframing":"MEDIUM","Agile":"LOW","Market Research":"LOW"},
    resources:{"Product Strategy":"Inspired by Marty Cagan","User Research":"Just Enough Research (book)","SQL":"Mode Analytics","Wireframing":"Figma free tier","A/B Testing":"Optimizely Academy"}
  },
  "DevOps Engineer": {
    icon:"⚙️",
    skills:["Linux","Docker","Kubernetes","CI/CD","Terraform","AWS","Monitoring","Scripting","Security","Networking"],
    deps:{"Docker":["Linux"],"Kubernetes":["Docker"],"CI/CD":["Docker","Scripting"],"Terraform":["AWS","Scripting"],"Monitoring":["Linux","Docker"]},
    priorities:{"Linux":"HIGH","Docker":"HIGH","Scripting":"HIGH","AWS":"HIGH","CI/CD":"MEDIUM","Kubernetes":"MEDIUM","Terraform":"MEDIUM","Monitoring":"MEDIUM","Security":"LOW","Networking":"LOW"},
    resources:{"Linux":"Linux Journey, The Linux Command Line","Docker":"Docker official docs + play-with-docker","Kubernetes":"Kubernetes.io tutorials","AWS":"AWS Free Tier + Cloud Practitioner cert","Terraform":"HashiCorp Learn","Scripting":"Bash Guide for Beginners"}
  }
};

const ALL_SKILLS = ["Python","JavaScript","SQL","HTML","CSS","React","Node.js","Git","Excel","Statistics","Machine Learning","Deep Learning","Data Visualization","Docker","Kubernetes","Linux","AWS","Tableau","Power BI","TypeScript","R","REST APIs","Agile","Wireframing","User Research","Product Strategy","Figma","Java","C++","PostgreSQL","MongoDB","Redux","GraphQL","Pandas","NumPy","PyTorch","TensorFlow","Terraform","Jenkins","Bash"];

function compareSkills(userSkills, requiredSkills) {
  return { matched: requiredSkills.filter(s => userSkills.includes(s)), missing: requiredSkills.filter(s => !userSkills.includes(s)) };
}
function calculateReadiness(matched, total) { return total===0 ? 0 : Math.round((matched/total)*100); }
function detectBlockedSkills(missingSkills, deps) {
  const blocked = new Set();
  missingSkills.forEach(skill => Object.entries(deps).forEach(([depSkill, reqs]) => { if (reqs.some(r => missingSkills.includes(r))) blocked.add(depSkill); }));
  return Array.from(blocked);
}
function generateRoadmap(missingSkills, deps, priorities, resources) {
  const steps=[], added=new Set();
  function addSkill(skill, depth=0) {
    if (added.has(skill)||depth>10) return;
    (deps[skill]||[]).forEach(r => { if (missingSkills.includes(r)) addSkill(r, depth+1); });
    if (!added.has(skill)) { added.add(skill); steps.push({ skill, type:'learn', priority:priorities[skill]||'MEDIUM', resource:resources[skill]||'Search online tutorials', deps:(deps[skill]||[]).filter(d=>missingSkills.includes(d)) }); }
  }
  ['HIGH','MEDIUM','LOW'].forEach(p => missingSkills.filter(s=>(priorities[s]||'MEDIUM')===p).forEach(s=>addSkill(s)));
  steps.push({skill:'Build a Portfolio Project',type:'project',priority:'HIGH',resource:'GitHub, personal portfolio site',deps:[]});
  steps.push({skill:'Apply & Network',type:'project',priority:'HIGH',resource:'LinkedIn, local meetups, job boards',deps:[]});
  return steps;
}

// ── COMPONENTS ───────────────────────────────────────────────────────────────
function Nav({ page, hasData }) {
  const steps = [{id:0,label:'01 / onboarding'},{id:1,label:'02 / dashboard'},{id:2,label:'03 / reality check'},{id:3,label:'04 / roadmap'}];
  return (
    <nav>
      <div className="logo">Skill<span>Map</span> AI</div>
      <div className="nav-steps">
        {steps.map(s => (
          <div key={s.id} className={`step-dot ${page===s.id?'active':''} ${(hasData&&page>s.id)?'done':''}`}>
            <span className="dot"/>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </nav>
  );
}

function Onboarding({ onComplete }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
  const [resumeActive, setResumeActive] = useState(false);

  const toggleSkill = s => setSelectedSkills(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
  const addCustom = () => { const s=customSkill.trim(); if(s&&!selectedSkills.includes(s)){setSelectedSkills(p=>[...p,s]);setCustomSkill('');} };
  const handleResume = () => {
    setResumeActive(true);
    const sim = selectedRole ? ROLES[selectedRole].skills.slice(0,3) : ['Python','SQL','Excel'];
    setTimeout(() => sim.forEach(s => { if(!selectedSkills.includes(s)) setSelectedSkills(p=>[...p,s]); }), 800);
  };

  return (
    <div className="page fade-in">
      <div className="hero-label">intelligent skill mapping</div>
      <h1 className="hero-title">Map your skills.<br/><span className="highlight">Face the truth.</span></h1>
      <p className="hero-sub">Select your target role, tell us what you know, and we'll show you exactly where you stand — no flattery, just data.</p>

      <div className="card">
        <div className="card-title">01 — Target Role</div>
        <div className="role-grid">
          {Object.entries(ROLES).map(([role,data]) => (
            <button key={role} className={`role-btn ${selectedRole===role?'selected':''}`} onClick={()=>setSelectedRole(role)}>
              <span className="role-icon">{data.icon}</span>{role}
            </button>
          ))}
        </div>
      </div>

      {selectedRole && (
        <div className="card fade-in">
          <div className="card-title">02 — Your Current Skills ({selectedSkills.length} selected)</div>
          <div className="skill-chips" style={{marginBottom:'1rem'}}>
            {ALL_SKILLS.sort().map(s => (
              <button key={s} className={`skill-chip ${selectedSkills.includes(s)?'selected':''}`} onClick={()=>toggleSkill(s)}>{s}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:'0.5rem',marginTop:'0.75rem'}}>
            <input type="text" placeholder="Add a custom skill..." value={customSkill}
              onChange={e=>setCustomSkill(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addCustom()} style={{flex:1}}/>
            <button className="btn-ghost" onClick={addCustom}>Add</button>
          </div>
          {selectedSkills.filter(s=>!ALL_SKILLS.includes(s)).length>0 && (
            <div style={{marginTop:'0.75rem',display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
              {selectedSkills.filter(s=>!ALL_SKILLS.includes(s)).map(s=>(
                <span key={s} className="skill-chip selected" style={{cursor:'pointer'}} onClick={()=>toggleSkill(s)}>{s} ×</span>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedRole && (
        <div className="card fade-in">
          <div className="card-title">03 — Resume (Optional)</div>
          <div className={`resume-zone ${resumeActive?'active':''}`} onClick={handleResume}>
            {resumeActive ? '✓ Resume parsed — skills auto-filled from simulation' : 'Click to simulate resume upload & parsing'}
            <div style={{marginTop:'0.4rem',fontSize:'0.75rem',opacity:0.6}}>Simulates NLP extraction of skills from resume text</div>
          </div>
        </div>
      )}

      <div className="actions">
        <button className="btn-primary" disabled={!selectedRole||selectedSkills.length===0} onClick={()=>onComplete(selectedRole,selectedSkills)}>
          Analyze My Skills →
        </button>
        {selectedRole&&selectedSkills.length===0&&<span style={{fontSize:'0.8rem',color:'var(--muted)'}}>Select at least one skill to continue</span>}
      </div>
    </div>
  );
}

function Dashboard({ role, userSkills, onNext, onBack }) {
  const roleData = ROLES[role];
  const { matched, missing } = compareSkills(userSkills, roleData.skills);
  const blocked = detectBlockedSkills(missing, roleData.deps);
  const [tab, setTab] = useState('all');

  const allSkills = roleData.skills.map(s => {
    const isMatched=matched.includes(s), isBlocked=blocked.includes(s);
    return {name:s, status:isMatched?'matched':isBlocked?'blocked':'missing', priority:roleData.priorities[s]||'MEDIUM'};
  });
  const filtered = tab==='all' ? allSkills : allSkills.filter(s=>s.status===tab);

  return (
    <div className="page fade-in">
      <div className="section-header">
        <div>
          <div className="hero-label">{roleData.icon} {role}</div>
          <h2 className="section-title">Skill Analysis Dashboard</h2>
        </div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <button className="btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn-primary" onClick={onNext}>Reality Check →</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-val green">{matched.length}</div>
          <div className="stat-label">Skills Matched</div>
          <div className="progress-bar" style={{marginTop:'0.75rem'}}>
            <div className="progress-fill" style={{width:`${(matched.length/roleData.skills.length)*100}%`,background:'var(--emerald-lit)'}}/>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-val red">{missing.length}</div>
          <div className="stat-label">Skills Missing</div>
          <div className="progress-bar" style={{marginTop:'0.75rem'}}>
            <div className="progress-fill" style={{width:`${(missing.length/roleData.skills.length)*100}%`,background:'var(--scarlet-lit)'}}/>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-val amber">{blocked.length}</div>
          <div className="stat-label">Blocked Skills</div>
          <div className="progress-bar" style={{marginTop:'0.75rem'}}>
            <div className="progress-fill" style={{width:`${blocked.length>0?(blocked.length/missing.length)*100:0}%`,background:'var(--gold-bright)'}}/>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="tabs">
          {['all','matched','missing','blocked'].map(t=>(
            <button key={t} className={`tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)} ({t==='all'?allSkills.length:allSkills.filter(s=>s.status===t).length})
            </button>
          ))}
        </div>
        {filtered.length===0
          ?<div className="empty-state">No skills in this category</div>
          :filtered.map(s=>(
            <div key={s.name} className="skill-row">
              <span className={`glow-dot ${s.status==='matched'?'green':s.status==='blocked'?'amber':'red'}`}/>
              <span className="skill-name">{s.name}</span>
              <span className={`badge ${s.status}`}>{s.status}</span>
              {s.status!=='matched'&&<span className={`badge ${s.priority.toLowerCase()}`}>{s.priority}</span>}
            </div>
          ))
        }
      </div>

      {blocked.length>0&&(
        <div className="card" style={{borderColor:'rgba(184,134,11,0.4)',background:'rgba(184,134,11,0.05)'}}>
          <div className="card-title" style={{color:'var(--gold)'}}>⚡ Dependency Alert</div>
          <p style={{fontSize:'0.88rem',color:'var(--muted)',lineHeight:'1.7'}}>
            {blocked.length} skill{blocked.length>1?'s are':' is'} blocked because prerequisite skills are missing.
            You must learn the foundational skills first before these will unlock.
          </p>
        </div>
      )}
    </div>
  );
}

function RealityCheck({ role, userSkills, onNext, onBack }) {
  const roleData = ROLES[role];
  const { matched, missing } = compareSkills(userSkills, roleData.skills);
  const score = calculateReadiness(matched.length, roleData.skills.length);
  const [animated, setAnimated] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const t=setTimeout(()=>setAnimated(score),300);
    const t2=setTimeout(()=>setShowBreakdown(true),900);
    return ()=>{clearTimeout(t);clearTimeout(t2);};
  }, []);

  const status = score<40?'not-ready':score<70?'almost':'ready';
  const statusConfig = {
    'not-ready':{emoji:'🚨',label:'Not Ready',desc:`You have ${missing.length} critical gaps to close before you're employable in this role. The system is being honest so you don't have to learn the hard way.`,color:'var(--scarlet)'},
    'almost':   {emoji:'⚡',label:'Almost Ready',desc:`You're making real progress. ${matched.length} skills check out, but ${missing.length} gaps remain — some of them blockers. Close the HIGH priority ones first.`,color:'var(--gold-bright)'},
    'ready':    {emoji:'🎯',label:'Job Ready',desc:`Strong foundation. ${matched.length}/${roleData.skills.length} required skills covered. Focus on the remaining gaps to hit 100% and stand out.`,color:'var(--emerald-lit)'},
  };
  const cfg = statusConfig[status];
  const r=76, circ=2*Math.PI*r, fill=(animated/100)*circ;
  const highMissing=missing.filter(s=>(roleData.priorities[s]||'MEDIUM')==='HIGH');
  const medMissing =missing.filter(s=>(roleData.priorities[s]||'MEDIUM')==='MEDIUM');

  return (
    <div className="page fade-in">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'0.5rem'}}>
        <div className="hero-label">reality check engine</div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <button className="btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn-primary" onClick={onNext}>See Roadmap →</button>
        </div>
      </div>

      <div className="reality-hero">
        <div style={{fontSize:'0.7rem',color:'var(--muted)',fontFamily:'Lato',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:'1.5rem'}}>
          {roleData.icon} Target: {role}
        </div>
        <div className="score-ring">
          <svg width="185" height="185" viewBox="0 0 185 185">
            <circle cx="92" cy="92" r={r} fill="none" stroke="rgba(184,134,11,0.15)" strokeWidth="10"/>
            <circle cx="92" cy="92" r={r} fill="none" stroke={cfg.color} strokeWidth="10"
              strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
              style={{transition:'stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1)'}}/>
          </svg>
          <div className="score-text">
            <div className="score-num" style={{color:cfg.color}}>{animated}%</div>
            <div className="score-pct">readiness</div>
          </div>
        </div>
        <div style={{fontSize:'0.7rem',fontFamily:'Lato',color:'var(--muted)',letterSpacing:'0.12em',marginBottom:'0.5rem',textTransform:'uppercase'}}>
          You think you're ready. System says:
        </div>
        <div className="reality-msg" style={{color:cfg.color}}>{animated}% — {cfg.label}</div>
        <div className="reality-sub">{matched.length} of {roleData.skills.length} required skills matched</div>
      </div>

      <div className={`status-banner ${status}`}>
        <div className="status-icon">{cfg.emoji}</div>
        <div>
          <div className="status-title" style={{color:cfg.color}}>{cfg.label}</div>
          <div className="status-desc">{cfg.desc}</div>
        </div>
      </div>

      {showBreakdown&&(
        <div className="fade-in">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.75rem',marginBottom:'1.25rem'}}>
            <div className="stat-card">
              <div style={{fontSize:'0.68rem',color:'var(--muted2)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.4rem'}}>HIGH priority gaps</div>
              <div style={{fontSize:'1.8rem',fontFamily:'Playfair Display',fontWeight:'900',color:highMissing.length>0?'var(--scarlet)':'var(--emerald-lit)'}}>{highMissing.length}</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize:'0.68rem',color:'var(--muted2)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.4rem'}}>MEDIUM priority gaps</div>
              <div style={{fontSize:'1.8rem',fontFamily:'Playfair Display',fontWeight:'900',color:medMissing.length>0?'var(--gold-bright)':'var(--emerald-lit)'}}>{medMissing.length}</div>
            </div>
            <div className="stat-card">
              <div style={{fontSize:'0.68rem',color:'var(--muted2)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.4rem'}}>Skills you have</div>
              <div style={{fontSize:'1.8rem',fontFamily:'Playfair Display',fontWeight:'900',color:'var(--emerald-lit)'}}>{matched.length}</div>
            </div>
          </div>
          {highMissing.length>0&&(
            <div className="card" style={{borderColor:'rgba(139,26,26,0.3)',background:'rgba(139,26,26,0.04)'}}>
              <div className="card-title" style={{color:'var(--scarlet)'}}>🚫 Blocking Skills — Learn These First</div>
              <div className="skill-chips">
                {highMissing.map(s=><span key={s} className="badge missing" style={{fontSize:'0.8rem',padding:'0.3rem 0.8rem'}}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Roadmap({ role, userSkills, onBack, onRestart }) {
  const roleData = ROLES[role];
  const { matched, missing } = compareSkills(userSkills, roleData.skills);
  const roadmap = generateRoadmap(missing, roleData.deps, roleData.priorities, roleData.resources);
  const score = calculateReadiness(matched.length, roleData.skills.length);

  return (
    <div className="page fade-in">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
        <div>
          <div className="hero-label">learning roadmap generator</div>
          <h2 className="section-title">{missing.length} steps to {role}</h2>
        </div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <button className="btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn-ghost" onClick={onRestart}>Start Over</button>
        </div>
      </div>

      {missing.length===0 ? (
        <div className="card" style={{textAlign:'center',padding:'3rem',borderColor:'rgba(26,74,46,0.35)',background:'rgba(26,74,46,0.05)'}}>
          <div style={{fontSize:'3rem',marginBottom:'1rem'}}>🏆</div>
          <div style={{fontFamily:'Playfair Display',fontSize:'1.5rem',fontWeight:'700',color:'var(--emerald-lit)',marginBottom:'0.5rem'}}>You already have all required skills!</div>
          <div style={{color:'var(--muted)',fontSize:'0.9rem'}}>You're fully equipped for the {role} role. Start applying and building your portfolio.</div>
        </div>
      ):(
        <>
          <div className="card" style={{marginBottom:'1.5rem',padding:'1rem 1.25rem',display:'flex',alignItems:'center',gap:'1.5rem'}}>
            <div style={{flex:1}}>
              <div style={{fontSize:'0.68rem',color:'var(--muted2)',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.3rem'}}>Current Readiness</div>
              <div className="progress-bar" style={{height:'8px',margin:'0'}}>
                <div className="progress-fill" style={{width:`${score}%`,background:'linear-gradient(90deg,var(--scarlet),var(--gold-bright))'}}/>
              </div>
            </div>
            <div style={{fontFamily:'Playfair Display',fontWeight:'900',fontSize:'1.5rem',color:'var(--gold-bright)',minWidth:'60px',textAlign:'right'}}>{score}%</div>
          </div>

          <div className="roadmap-list">
            {roadmap.map((step,i)=>(
              <div key={i} className="roadmap-item">
                <div className="roadmap-left">
                  <div className={`roadmap-num ${step.type==='project'?'project':'skill-step'}`}>{i+1}</div>
                  {i<roadmap.length-1&&<div className="roadmap-line"/>}
                </div>
                <div className="roadmap-content" style={{paddingBottom:i<roadmap.length-1?'0.5rem':'0'}}>
                  <div className="roadmap-label">{step.type==='project'?'milestone':`step ${i+1} · ${step.priority} priority`}</div>
                  <div className="roadmap-title">{step.type==='learn'?`Learn ${step.skill}`:step.skill}</div>
                  <div className="roadmap-desc">{step.type==='learn'?`Resource: ${step.resource}`:step.resource}</div>
                  {step.deps&&step.deps.length>0&&(
                    <div className="roadmap-tags">
                      <span style={{fontSize:'0.7rem',color:'var(--muted)'}}>requires:</span>
                      {step.deps.map(d=><span key={d} className="tag">{d}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="divider"/>
      <div style={{textAlign:'center',padding:'1rem 0'}}>
        <div style={{fontSize:'0.75rem',color:'var(--muted)',letterSpacing:'0.12em',marginBottom:'1rem',textTransform:'uppercase'}}>
          {missing.length} skills to learn · {matched.length} already mastered
        </div>
        <button className="btn-primary" onClick={onRestart}>Analyze Another Role →</button>
      </div>
    </div>
  );
}

function App() {
  const [page, setPage] = useState(0);
  const [role, setRole] = useState(null);
  const [skills, setSkills] = useState([]);

  const handleOnboard = (r,s) => { setRole(r); setSkills(s); setPage(1); };
  const restart = () => { setPage(0); setRole(null); setSkills([]); };

  return (
    <div className="app">
      <Nav page={page} hasData={!!role}/>
      {page===0&&<Onboarding onComplete={handleOnboard}/>}
      {page===1&&<Dashboard role={role} userSkills={skills} onNext={()=>setPage(2)} onBack={()=>setPage(0)}/>}
      {page===2&&<RealityCheck role={role} userSkills={skills} onNext={()=>setPage(3)} onBack={()=>setPage(1)}/>}
      {page===3&&<Roadmap role={role} userSkills={skills} onBack={()=>setPage(2)} onRestart={restart}/>}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
