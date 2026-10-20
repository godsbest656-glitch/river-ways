import React, { useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, AudioWaveform, BarChart3, Check, ChevronDown, Compass, Globe2, Menu, MessageCircle, MousePointer2, Search, ShieldCheck, Sparkles, Target, TrendingUp, X, Zap } from 'lucide-react';

const services = [
  { number: '01', icon: Target, title: 'Demand Engineering', description: 'Build the strategy, signals and systems that turn attention into a repeatable path to revenue.', tags: ['Go-to-market strategy', 'Demand architecture', 'Growth planning'] },
  { number: '02', icon: Search, title: 'Search & AI Discovery', description: 'Make your business easier to discover across search engines, local results and AI-powered answers.', tags: ['Technical SEO', 'GEO & AIO', 'Content strategy'] },
  { number: '03', icon: TrendingUp, title: 'Performance Marketing', description: 'Connect paid media, landing pages and measurement around business outcomes—not vanity metrics.', tags: ['Paid acquisition', 'Conversion optimization', 'Measurement'] },
  { number: '04', icon: MousePointer2, title: 'Websites That Convert', description: 'Create fast, useful digital experiences that make the next step obvious and friction-free.', tags: ['Web design', 'Landing pages', 'CRO'] },
  { number: '05', icon: Sparkles, title: 'Content & Creative', description: 'Turn your point of view into distinctive creative that earns attention and helps buyers decide.', tags: ['Brand storytelling', 'Creative systems', 'Campaigns'] },
  { number: '06', icon: AudioWaveform, title: 'Demand Intelligence', description: 'Identify public intent signals, qualify opportunities and help your team respond while interest is fresh.', tags: ['Social listening', 'Intent monitoring', 'Lead workflows'] }
];
const steps = [
  { label: 'Discover', title: 'Find the signal.', text: 'Monitor relevant public conversations, search themes and market questions across selected sources and regions.' },
  { label: 'Qualify', title: 'Separate intent from noise.', text: 'Use keyword context, fit criteria and human review to prioritize conversations that may represent real demand.' },
  { label: 'Respond', title: 'Make the moment useful.', text: 'Route qualified signals to the right person with context, suggested next steps and a clear follow-up trail.' },
  { label: 'Learn', title: 'Improve the system.', text: 'Review outcomes, refine terms and feed what works back into your content, campaigns and customer experience.' }
];
const faqs = [
  { q: 'What does Demand Engineering mean?', a: 'Demand Engineering connects positioning, discovery, content, campaigns, conversion and measurement into one operating system. The goal is to make demand creation more intentional, observable and improvable—not to promise that every activity will produce a lead.' },
  { q: 'Can River Ways work with businesses outside Nigeria?', a: 'Yes. The approach can support businesses serving local, regional or international markets. Source availability, language, platform access and local regulations are considered when designing campaigns and listening workflows.' },
  { q: 'Does Demand Intelligence automatically message every prospect?', a: 'No. A responsible system detects and prioritizes relevant public signals, then supports contextual, human-led outreach. Any automation should respect platform rules, privacy requirements and the expectations of the people being contacted.' },
  { q: 'How do you measure success?', a: 'Measurement is agreed around the business objective: qualified enquiries, conversion rate, acquisition efficiency, search visibility, pipeline contribution or another meaningful outcome. We establish a baseline before making performance claims.' },
  { q: 'Can you improve an existing website or marketing setup?', a: 'Yes. Work can begin with an audit of the current site, discovery channels, analytics and conversion journey, then prioritize the highest-impact improvements before expanding the system.' }
];

function RiverMark({ large = false }) {
  return <svg className={large ? 'river-mark river-mark-large' : 'river-mark'} viewBox="0 0 44 32" role="img" aria-label="River Ways river-path symbol">
    <path d="M2 7 C11 7 13 25 23 25 S35 7 42 7" />
    <path d="M2 16 C9 16 13 3 22 3 S34 16 42 16" />
    <path d="M2 25 C11 25 13 12 22 12 S34 25 42 25" />
  </svg>;
}
function Brand() {
  return <a className="brand" href="#home" aria-label="River Ways home"><RiverMark /><span>River Ways</span></a>;
}
function Eyebrow({ children, light = false }) {
  return <div className={'eyebrow ' + (light ? 'eyebrow-light' : '')}><span className="eyebrow-dot" />{children}</div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', company: '', goal: 'Generate more qualified demand', details: '', website: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const closeMenu = () => setMenuOpen(false);

  async function submitBrief(event) {
    event.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (isSubmitting) return;
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError('Add your name and a valid email address to continue.');
      return;
    }
    setIsSubmitting(true);
    try {
      const query = new URLSearchParams(window.location.search);
      const rawLandingPage = query.get('rw_landing_page') || window.location.pathname || '/';
      const landingPage = rawLandingPage.startsWith('/') && !rawLandingPage.startsWith('//')
        ? rawLandingPage.split(/[?#]/, 1)[0].slice(0, 240) || '/'
        : '/';
      const attribution = {
        landingPage,
        utmSource: query.get('utm_source') || '',
        utmMedium: query.get('utm_medium') || '',
        utmCampaign: query.get('utm_campaign') || '',
        utmContent: query.get('utm_content') || '',
        utmTerm: query.get('utm_term') || ''
      };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...attribution })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'We could not send your enquiry. Please email us directly.');
      }
      if (result.notification === 'sent') {
        setFormSuccess('Your enquiry has been received and the River Ways team has been notified. We will follow up using the email address you provided.');
      } else if (result.notification === 'failed') {
        setFormSuccess('Your enquiry has been saved, but we could not confirm the email notification to our team. For a prompt response, email akinsify0511@gmail.com and mention that you submitted the website form.');
      } else {
        setFormSuccess('Your enquiry has been saved, but email notifications are not fully configured yet. For a prompt response, email akinsify0511@gmail.com and mention that you submitted the website form.');
      }
      setForm({ name: '', email: '', company: '', goal: 'Generate more qualified demand', details: '', website: '' });
    } catch (error) {
      setFormError((error instanceof Error ? error.message : 'Something went wrong.') + ' Email akinsify0511@gmail.com if you need another way to reach us.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="container nav-wrap">
      <Brand />
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      <nav className={'main-nav ' + (menuOpen ? 'nav-open' : '')} aria-label="Main navigation">
        <a href="#approach" onClick={closeMenu}>Our approach</a><a href="#services" onClick={closeMenu}>What we do</a><a href="#intelligence" onClick={closeMenu}>Demand intelligence</a><a href="#about" onClick={closeMenu}>Why River Ways</a><a className="nav-cta" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={15} /></a>
      </nav>
    </div></header>
    <main id="main">
      <section className="hero section-dark" id="home"><div className="hero-grid" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy"><Eyebrow light>Direction for complex growth</Eyebrow><h1>Find the current.<br /><span>Shape what follows.</span></h1>
            <p className="hero-lede">River Ways engineers the path between market signals and meaningful action—connecting strategy, discovery, creative, conversion and measurement into one coherent system.</p>
            <div className="hero-actions"><a className="button button-lime" href="#contact">Build your growth system <ArrowRight size={17} /></a><a className="text-link text-link-light" href="#approach">See how we work <ArrowDownRight size={17} /></a></div>
            <div className="hero-note"><span className="note-line" /> Read the conditions. Set the direction. Build momentum.</div>
          </div>
          <div className="hero-visual river-visual" aria-label="Geometric river system showing signals converging into a directed path">
            <div className="river-visual-meta river-meta-top"><span>01 / READ THE FIELD</span><span>INPUTS</span></div>
            <svg className="river-diagram" viewBox="0 0 560 470" role="img" aria-labelledby="river-diagram-title">
              <title id="river-diagram-title">Separate market signals converge into a single path, then branch into measurable outcomes.</title>
              <defs><linearGradient id="river-flow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#D56A48"/><stop offset=".55" stopColor="#E8B76D"/><stop offset="1" stopColor="#C8D5A0"/></linearGradient></defs>
              <g className="river-contours" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M16 64 C102 20 114 114 178 112 S256 55 303 105 S380 178 536 119"/>
                <path d="M16 84 C100 40 112 134 177 132 S259 75 300 125 S385 198 536 139"/>
                <path d="M16 104 C98 60 110 154 176 152 S262 95 297 145 S390 218 536 159"/>
                <path d="M16 366 C104 410 125 318 194 330 S278 397 332 342 S416 272 536 314"/>
                <path d="M16 386 C102 430 127 338 192 350 S281 417 329 362 S419 292 536 334"/>
                <path d="M16 406 C100 450 129 358 190 370 S284 437 326 382 S422 312 536 354"/>
              </g>
              <g className="river-channels" fill="none" stroke="url(#river-flow)" strokeLinecap="round">
                <path d="M20 140 C105 140 113 210 190 210 S282 145 333 210 S415 262 536 220" strokeWidth="7"/>
                <path d="M20 236 C104 236 126 180 190 210 S284 275 333 210 S430 170 536 190" strokeWidth="3"/>
                <path d="M20 292 C112 292 122 244 190 210 S285 145 333 210 S425 284 536 260" strokeWidth="2"/>
                <path d="M20 140 C105 140 113 210 190 210 S282 145 333 210 S415 262 536 220" className="river-current" strokeWidth="2"/>
              </g>
              <g className="river-nodes">
                <circle cx="190" cy="210" r="20"/><circle cx="190" cy="210" r="7"/>
                <circle cx="333" cy="210" r="16"/><circle cx="333" cy="210" r="4"/>
                <circle cx="536" cy="220" r="5"/>
              </g>
              <g className="river-diagram-labels" fill="currentColor">
                <text x="22" y="126">MARKET SIGNALS</text><text x="151" y="255">INTERPRET</text>
                <text x="303" y="244">DIRECT</text><text x="432" y="204">ACTION</text>
                <text x="22" y="450">NOISE → CONTEXT → MOMENTUM</text>
              </g>
            </svg>
            <div className="river-visual-meta river-meta-bottom"><span>02 / FIND THE LEVER</span><span>03 / CREATE MOVEMENT</span></div>
            <span className="visual-caption">A direction, not a template.</span>
          </div>
        </div>
        <div className="container hero-bottom"><span>BUILT AROUND YOUR BUSINESS GOALS</span><div className="hero-capabilities"><span><Check size={14} /> Strategy</span><span><Check size={14} /> Digital</span><span><Check size={14} /> Intelligence</span><span><Check size={14} /> Performance</span></div></div>
      </section>
      <section className="ticker" aria-label="River Ways capabilities"><div className="ticker-track"><span>DEMAND STRATEGY</span><b>✳</b><span>SEARCH VISIBILITY</span><b>✳</b><span>CONVERSION DESIGN</span><b>✳</b><span>DEMAND INTELLIGENCE</span><b>✳</b><span>MEASURABLE GROWTH</span><b>✳</b><span>DEMAND STRATEGY</span><b>✳</b><span>SEARCH VISIBILITY</span><b>✳</b><span>CONVERSION DESIGN</span><b>✳</b><span>DEMAND INTELLIGENCE</span><b>✳</b></div></section>
      <section className="section problem-section" id="approach"><div className="container split-layout">
        <div className="section-intro"><Eyebrow>The challenge</Eyebrow><h2>More marketing activity doesn’t always mean <em>more demand.</em></h2></div>
        <div className="problem-copy"><p className="large-copy">A campaign here. A website there. Content without a clear path to conversion. Reports full of numbers that don’t explain what to do next.</p><p>When every channel works in isolation, opportunity leaks between discovery and decision. River Ways helps bring the pieces together—so each move has a purpose and each result can inform the next.</p><a className="text-link" href="#services">Explore the system <ArrowRight size={16} /></a></div>
      </div><div className="container principle-grid">
        <article className="principle-card"><span className="principle-num">01 / CLARITY</span><Compass size={24} /><h3>Know where you’re going.</h3><p>Align your audience, offer and growth priorities before adding more activity.</p></article>
        <article className="principle-card"><span className="principle-num">02 / CONNECTION</span><Globe2 size={24} /><h3>Make every channel connect.</h3><p>Build a joined-up path from first signal to meaningful customer action.</p></article>
        <article className="principle-card"><span className="principle-num">03 / LEARNING</span><BarChart3 size={24} /><h3>Improve what matters.</h3><p>Measure outcomes, learn from the evidence and invest with more intent.</p></article>
      </div></section>
      <section className="section services-section" id="services"><div className="container">
        <div className="section-heading-row"><div><Eyebrow>What we do</Eyebrow><h2>One growth system.<br /><em>Connected capabilities.</em></h2></div><p>Choose the capability you need now. We design the work to connect with the bigger picture.</p></div>
        <div className="services-grid">{services.map((service) => { const Icon = service.icon; return <article className="service-card" key={service.number}><div className="service-card-top"><span>{service.number}</span><span className="service-icon"><Icon size={22} strokeWidth={1.7} /></span></div><h3>{service.title}</h3><p>{service.description}</p><div className="service-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href="#contact" className="service-link" aria-label={'Discuss ' + service.title}>Explore this service <ArrowUpRight size={16} /></a></article>; })}</div>
      </div></section>
      <section className="intelligence-section section-dark" id="intelligence"><div className="container intelligence-layout">
        <div className="intelligence-copy"><Eyebrow light>Demand Intelligence</Eyebrow><h2>Meet your market<br />at the <em>moment of intent.</em></h2><p>People leave clues when they’re comparing options, asking for recommendations or describing a problem your business solves. A thoughtful listening system helps you find those signals, understand context and respond usefully.</p>
          <div className="intelligence-points"><span><Check size={16} /> Global-ready source strategy</span><span><Check size={16} /> Context-aware qualification</span><span><Check size={16} /> Human-led follow-up</span></div><a className="button button-lime" href="#contact">Discuss a listening system <ArrowRight size={17} /></a><a className="text-link text-link-light field-guide-link" href="/field-guide/">Read the Demand Engineering field guide <ArrowUpRight size={15} /></a><p className="small-disclaimer">Actual coverage depends on source access, platform policies, language and available integrations.</p>
        </div>
        <div className="signal-panel"><div className="panel-header"><div><span className="live-dot" /> SYSTEM FLOW</div><span>01 — 04</span></div>
          <div className="step-tabs" role="tablist" aria-label="Demand Intelligence workflow">{steps.map((step,index) => <button key={step.label} role="tab" aria-selected={activeStep === index} className={activeStep === index ? 'step-tab active' : 'step-tab'} onClick={() => setActiveStep(index)}><span>0{index+1}</span>{step.label}</button>)}</div>
          <div className="step-detail" role="tabpanel" key={activeStep}><div className="step-symbol">{activeStep===0?<Search />:activeStep===1?<ShieldCheck />:activeStep===2?<MessageCircle />:<BarChart3 />}</div><span className="mini-label">STEP 0{activeStep+1}</span><h3>{steps[activeStep].title}</h3><p>{steps[activeStep].text}</p></div>
          <div className="flow-rail">{steps.map((step,index) => <span key={step.label} className={index<=activeStep?'rail-node rail-active':'rail-node'} />)}</div><div className="panel-footer"><span>Signal → context → action</span><Zap size={15} /></div>
        </div>
      </div></section>
      <section className="section method-section" id="about"><div className="container"><div className="method-heading"><Eyebrow>How we work</Eyebrow><h2>Less guesswork.<br /><em>More intentional growth.</em></h2><p>A practical loop built to help your business move from scattered activity to a system that gets smarter.</p></div>
        <div className="method-steps"><article><span>01</span><div><h3>Diagnose</h3><p>Understand your market, offer, customer journey and current bottlenecks.</p></div><ArrowUpRight size={19} /></article><article><span>02</span><div><h3>Engineer</h3><p>Build a connected strategy across channels, content, conversion and measurement.</p></div><ArrowUpRight size={19} /></article><article><span>03</span><div><h3>Activate</h3><p>Launch focused initiatives with clear owners, useful signals and defined goals.</p></div><ArrowUpRight size={19} /></article><article><span>04</span><div><h3>Improve</h3><p>Review the evidence, remove friction and reinvest in what moves the objective.</p></div><ArrowUpRight size={19} /></article></div>
      </div></section>
      <section className="belief-section"><div className="container belief-layout"><div className="belief-mark"><RiverMark large /><span>RIVER SYSTEMS / PRINCIPLE</span></div><blockquote>“The goal isn’t to do more marketing. It’s to engineer a better path from <em>attention to action.</em>”</blockquote><p>River Ways — strategy and systems for purposeful growth.</p></div></section>
      <section className="section faq-section"><div className="container faq-layout"><div><Eyebrow>Good questions</Eyebrow><h2>Before we<br /><em>get to work.</em></h2><p>Clear expectations make better partnerships.</p></div><div className="faq-list">{faqs.map((faq,index) => <details className="faq-item" key={faq.q} open={index===0}><summary>{faq.q}<ChevronDown size={18} /></summary><p>{faq.a}</p></details>)}</div></div></section>
      <section className="contact-section section-dark" id="contact"><div className="container contact-layout">
        <div className="contact-copy"><Eyebrow light>Start a conversation</Eyebrow><h2>Let’s engineer<br />your next <em>move.</em></h2><p>Tell us what you’re working toward. We’ll use the context to start a more useful conversation about what needs to happen next.</p><div className="contact-promise"><span><Check size={16} /> No generic pitch deck</span><span><Check size={16} /> Start with your actual challenge</span><span><Check size={16} /> Clear next steps</span></div></div>
        <form className="contact-form" onSubmit={submitBrief} noValidate><div className="form-heading"><span>YOUR PROJECT BRIEF</span><span>01 / 01</span></div>
          <div className="form-row"><label>Your name<input name="name" autoComplete="name" value={form.name} onChange={updateForm} placeholder="Name" required /></label><label>Work email<input name="email" type="email" autoComplete="email" value={form.email} onChange={updateForm} placeholder="you@company.com" required /></label></div>
          <label>Company or brand<input name="company" autoComplete="organization" value={form.company} onChange={updateForm} placeholder="Your business" /></label>
          <label>What do you want to improve?<select name="goal" value={form.goal} onChange={updateForm}><option>Generate more qualified demand</option><option>Improve search and AI visibility</option><option>Increase website conversion</option><option>Build a Demand Intelligence system</option><option>Connect marketing and measurement</option><option>Something else</option></select></label>
          <label>Anything we should know? <span className="optional">(optional)</span><textarea name="details" value={form.details} onChange={updateForm} rows="3" maxLength="3000" placeholder="Share a little context about the challenge or opportunity." /></label>
          <div className="contact-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateForm} /></label></div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          {formSuccess && <p className="form-success" role="status">{formSuccess}</p>}
          <button className="button button-lime form-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending enquiry…' : 'Send my enquiry'} <ArrowRight size={17} /></button>
          <p className="form-note">We use your brief to respond to your enquiry. A submission is confirmed only when you see a status message. Please do not include passwords, financial account details or confidential third-party information. See our <a href="/privacy/">privacy notice</a>.</p>
        </form>
      </div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><Brand /><p>Find the current. Shape what follows.</p><a href="#home" className="back-top">Back to top <ArrowUpRight size={15} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} River Ways. All rights reserved.</span><span>Built around purposeful growth.</span><a href="mailto:akinsify0511@gmail.com">Contact River Ways</a></div></footer>
  </>;
}
