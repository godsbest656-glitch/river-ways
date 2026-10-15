import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, AudioWaveform, BarChart3, Check, ChevronDown, Compass, Globe2, Menu, MessageCircle, MousePointer2, Search, ShieldCheck, Sparkles, Target, TrendingUp, X, Zap } from 'lucide-react';

const services = [
  { number: '01', icon: Sparkles, image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=82', imageAlt: 'Creative visual installation with bold colour and light', title: 'Content & Social Systems', description: 'Build a distinctive, sustainable rhythm across social media, content production and campaign creative—grounded in a clear point of view.', tags: ['Social media management', 'Content production', 'Creative campaigns'] },
  { number: '02', icon: MessageCircle, image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=82', imageAlt: 'Team reviewing information and discussing customer opportunities', title: 'Email & Customer Journeys', description: 'Turn attention into a relationship with useful email programmes, lifecycle journeys and thoughtful follow-up.', tags: ['Email marketing', 'Newsletters & nurture', 'Customer journeys'] },
  { number: '03', icon: Target, image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=82', imageAlt: 'Team collaborating around a strategy table', title: 'Campaigns, Leads & Conversion', description: 'Connect audience, offer, paid campaigns and landing pages around a measurable next action—not vanity metrics.', tags: ['Lead generation', 'Paid advertising', 'Conversion optimisation'] },
  { number: '04', icon: MousePointer2, image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=82', imageAlt: 'Designer working on a digital interface', title: 'Websites & Landing Pages', description: 'Create fast, considered digital experiences that explain your value, remove friction and make the next step obvious.', tags: ['Website design', 'Landing pages', 'Conversion journeys'] },
  { number: '05', icon: Search, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=82', imageAlt: 'Analytics dashboard on a laptop', title: 'Search & AI Discovery', description: 'Improve the foundations that help the right people find, understand and trust your business across search experiences.', tags: ['Technical & local SEO', 'AI-search readiness', 'Content strategy'] },
  { number: '06', icon: AudioWaveform, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=82', imageAlt: 'Business performance analytics on a screen', title: 'Automation & Marketing Operations', description: 'Reduce repetitive work and connect the tools behind your marketing, enquiry handling and follow-up—with human oversight.', tags: ['AI workflow automation', 'CRM & integrations', 'Measurement systems'] }
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

function Brand() {
  return <a className="brand" href="#home" aria-label="River Ways home"><svg className="brand-mark" viewBox="0 0 36 36" aria-hidden="true"><path d="M3 7H13L23 18H33" /><path d="M3 18H13L23 18" /><path d="M3 29H13L23 18" /><path d="M23 18L31 10" /><path d="M23 18L31 26" /></svg><span>River Ways</span></a>;
}
function Eyebrow({ children, light = false }) {
  return <div className={'eyebrow ' + (light ? 'eyebrow-light' : '')}><span className="eyebrow-dot" />{children}</div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeCurrent, setActiveCurrent] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', company: '', goal: 'Generate more qualified demand', details: '', website: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serviceGoalMap = {
      'Content & Social Systems': 'Social media and content',
      'Email & Customer Journeys': 'Email marketing and customer journeys',
      'Campaigns, Leads & Conversion': 'Campaigns and lead generation',
      'Websites & Landing Pages': 'Website or landing page conversion',
      'Search & AI Discovery': 'SEO and AI-search readiness',
      'Automation & Marketing Operations': 'Marketing automation and integrations'
    };
    const serviceGoal = serviceGoalMap[params.get('service')];
    if (params.get('diagnostic') !== '1' && !serviceGoal) return;
    const focus = params.get('diagnostic_focus') || '';
    const goalByFocus = {
      Discovery: 'SEO and AI-search readiness',
      Conversion: 'Website or landing page conversion',
      Measurement: 'Marketing automation and integrations',
      Alignment: 'Email marketing and customer journeys'
    };
    const goal = params.get('diagnostic') === '1'
      ? (goalByFocus[focus] || 'Generate more qualified demand')
      : serviceGoal;
    const score = params.get('diagnostic_score') || '';
    const title = params.get('diagnostic_title') || 'Growth Diagnostic';
    const summary = params.get('diagnostic_summary') || '';
    setForm((current) => ({
      ...current,
      goal,
      details: params.get('diagnostic') === '1'
        ? [current.details, 'Growth Diagnostic self-assessment: ' + score + '/100 — ' + title + '.', 'Priority area: ' + focus + '.', summary].filter(Boolean).join(' ')
        : current.details
    }));
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { elements.forEach((element) => element.classList.add('is-visible')); return undefined; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const field = document.querySelector('.river-card-current');
    if (!field || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let frame = 0;
    const updateFlow = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = field.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const progress = Math.max(-1, Math.min(1, (viewport * 0.72 - bounds.top) / (viewport + bounds.height)));
        field.style.setProperty('--scroll-flow', progress.toFixed(3));
        field.style.setProperty('--scroll-y', (progress * 13).toFixed(2) + 'px');
        field.style.setProperty('--scroll-y-reverse', (progress * -10).toFixed(2) + 'px');
      });
    };
    updateFlow();
    window.addEventListener('scroll', updateFlow, { passive: true });
    window.addEventListener('resize', updateFlow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateFlow);
      window.removeEventListener('resize', updateFlow);
    };
  }, []);

  async function submitBrief(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setFormError('');
    setFormSuccess('');
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setFormError('Add your name and a valid email address to continue.');
      return;
    }
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const hasCampaignTags = ['utm_source', 'utm_medium', 'utm_campaign'].some((key) => params.has(key));
      const attribution = {
        source: hasCampaignTags ? 'campaign' : (document.referrer ? 'referral' : 'website'),
        landingPage: window.location.pathname,
        referrer: document.referrer || '',
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmContent: params.get('utm_content') || '',
        utmTerm: params.get('utm_term') || ''
      };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, ...attribution })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        setFormError(result.message || 'We could not send your brief right now. Please email akinsify0511@gmail.com.');
        return;
      }
      setFormSuccess(result.message || 'Thank you. Your enquiry has been received.');
      setForm({ name: '', email: '', company: '', goal: 'Generate more qualified demand', details: '', website: '' });
    } catch {
      setFormError('We could not connect to the enquiry service. Please email akinsify0511@gmail.com.');
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
      <section className="hero section-dark" id="home"><div className="hero-atmosphere" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy"><Eyebrow light>Growth is engineered, not guessed</Eyebrow><h1>Find the current.<br /><span>Shape what follows.</span></h1>
            <p className="hero-lede">River Ways is a strategy-led creative and digital growth studio. We connect content, campaigns and customer journeys so your marketing has a clearer path from attention to action.</p>
            <div className="hero-actions"><a className="button button-lime" href="#contact">Start a project <ArrowRight size={17} /></a><a className="text-link text-link-light" href="#approach">See how we work <ArrowDownRight size={17} /></a></div>
            <div className="hero-note"><span className="note-line" /> Creative with intent.</div>
          </div>
          <div className="hero-visual river-card-current"
            aria-label="Interactive River Ways current. Select a card to explore how signals become momentum."
            onPointerMove={(event) => {
              if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              const x = (event.clientX - bounds.left) / bounds.width - 0.5;
              const y = (event.clientY - bounds.top) / bounds.height - 0.5;
              const style = event.currentTarget.style;
              style.setProperty('--pointer-x', (x * 12).toFixed(2) + 'px');
              style.setProperty('--pointer-y', (y * 10).toFixed(2) + 'px');
              style.setProperty('--pointer-rotate', (x * 1.2).toFixed(2) + 'deg');
              const waveFactors = [-0.65, 0.85, -0.9, 0.55];
              event.currentTarget.querySelectorAll('.current-card').forEach((card, index) => {
                card.style.setProperty('--card-pointer-x', (x * 18 * waveFactors[index]).toFixed(2) + 'px');
                card.style.setProperty('--card-pointer-y', (y * 14 * waveFactors[index]).toFixed(2) + 'px');
              });
            }}
            onPointerLeave={(event) => {
              const style = event.currentTarget.style;
              style.setProperty('--pointer-x', '0px');
              style.setProperty('--pointer-y', '0px');
              style.setProperty('--pointer-rotate', '0deg');
              event.currentTarget.querySelectorAll('.current-card').forEach((card) => {
                card.style.setProperty('--card-pointer-x', '0px');
                card.style.setProperty('--card-pointer-y', '0px');
              });
            }}
          >
            <div className="current-field-lines" aria-hidden="true">
              <svg viewBox="0 0 620 500" preserveAspectRatio="none">
                <defs><linearGradient id="rw-current-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#E8B76D" stopOpacity=".08"/><stop offset=".52" stopColor="#D07A53" stopOpacity=".9"/><stop offset="1" stopColor="#E8B76D" stopOpacity=".15"/></linearGradient></defs>
                {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M-35 ${42 + i * 31} C 75 ${-10 + i * 30}, 150 ${100 + i * 21}, 260 ${145 + i * 17} S 445 ${20 + i * 28}, 655 ${80 + i * 29}`} stroke={i > 4 && i < 9 ? 'url(#rw-current-gradient)' : '#F3EDE3'} strokeOpacity={i > 4 && i < 9 ? .85 : .18} strokeWidth={i > 4 && i < 9 ? 1.4 : .8} fill="none"/> )}
              </svg>
            </div>
            <div className="current-field-meta"><span>RW / FIELD STUDY 001</span><span>MOVE THROUGH THE CURRENT <i /></span></div>
            <div className="current-card-stream">
              <button type="button" className={'current-card current-card-signal ' + (activeCurrent === 0 ? 'is-current' : '')} onPointerEnter={() => setActiveCurrent(0)} onFocus={() => setActiveCurrent(0)} onClick={() => setActiveCurrent(0)} aria-pressed={activeCurrent === 0}>
                <span className="current-card-index">01 <span> / SIGNAL</span></span><span className="current-card-symbol signal-symbol" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/></span><span className="current-card-title">Find the signal.</span><span className="current-card-note">Notice what others miss.</span><span className="current-card-arrow"><ArrowUpRight size={15}/></span>
              </button>
              <button type="button" className={'current-card current-card-connect ' + (activeCurrent === 1 ? 'is-current' : '')} onPointerEnter={() => setActiveCurrent(1)} onFocus={() => setActiveCurrent(1)} onClick={() => setActiveCurrent(1)} aria-pressed={activeCurrent === 1}>
                <span className="current-card-index">02 <span> / CONNECTION</span></span><span className="current-card-symbol connect-symbol" aria-hidden="true"><i/><i/><i/><i/><i/></span><span className="current-card-title">Connect the pieces.</span><span className="current-card-note">Make every move matter.</span><span className="current-card-arrow"><ArrowUpRight size={15}/></span>
              </button>
              <button type="button" className={'current-card current-card-direction ' + (activeCurrent === 2 ? 'is-current' : '')} onPointerEnter={() => setActiveCurrent(2)} onFocus={() => setActiveCurrent(2)} onClick={() => setActiveCurrent(2)} aria-pressed={activeCurrent === 2}>
                <span className="current-card-index">03 <span> / DIRECTION</span></span><span className="current-card-symbol direction-symbol" aria-hidden="true"><i/><i/><i/></span><span className="current-card-title">Shape the route.</span><span className="current-card-note">Turn intent into action.</span><span className="current-card-arrow"><ArrowUpRight size={15}/></span>
              </button>
              <button type="button" className={'current-card current-card-momentum ' + (activeCurrent === 3 ? 'is-current' : '')} onPointerEnter={() => setActiveCurrent(3)} onFocus={() => setActiveCurrent(3)} onClick={() => setActiveCurrent(3)} aria-pressed={activeCurrent === 3}>
                <span className="current-card-index">04 <span> / MOMENTUM</span></span><span className="current-card-symbol momentum-symbol" aria-hidden="true"><i/><i/><i/><i/></span><span className="current-card-title">Create momentum.</span><span className="current-card-note">Build a system that learns.</span><span className="current-card-arrow"><ArrowUpRight size={15}/></span>
              </button>
            </div>
            <div className="current-field-footer"><span className="current-live-dot" /> <span>{['Read the environment','Connect the system','Choose a direction','Keep progress moving'][activeCurrent]}</span><span className="current-progress">{String(activeCurrent + 1).padStart(2, '0')} <i /> 04</span></div>
          </div>
        </div>
        <div className="container hero-bottom"><span>BUILT AROUND YOUR BUSINESS GOALS</span><div className="hero-capabilities"><span><Check size={14} /> Strategy</span><span><Check size={14} /> Digital</span><span><Check size={14} /> Intelligence</span><span><Check size={14} /> Performance</span></div></div>
      </section>
      <section className="ticker" aria-label="River Ways capabilities"><div className="ticker-track"><span>DEMAND STRATEGY</span><b>✳</b><span>SEARCH VISIBILITY</span><b>✳</b><span>CONVERSION DESIGN</span><b>✳</b><span>DEMAND INTELLIGENCE</span><b>✳</b><span>MEASURABLE GROWTH</span><b>✳</b><span>DEMAND STRATEGY</span><b>✳</b><span>SEARCH VISIBILITY</span><b>✳</b><span>CONVERSION DESIGN</span><b>✳</b><span>DEMAND INTELLIGENCE</span><b>✳</b></div></section>
      <section className="section problem-section reveal-section" id="approach" data-reveal><div className="container split-layout">
        <div className="section-intro"><Eyebrow>The challenge</Eyebrow><h2>More marketing activity doesn’t always mean <em>more demand.</em></h2></div>
        <div className="problem-copy"><p className="large-copy">A campaign here. A website there. Content without a clear path to conversion. Reports full of numbers that don’t explain what to do next.</p><p>When every channel works in isolation, opportunity leaks between discovery and decision. River Ways helps bring the pieces together—so each move has a purpose and each result can inform the next.</p><a className="text-link" href="#services">Explore the system <ArrowRight size={16} /></a><a className="text-link" href="/growth-diagnostic/">Take the Growth Diagnostic <ArrowUpRight size={16} /></a></div>
      </div><div className="container principle-grid">
        <article className="principle-card"><span className="principle-num">01 / CLARITY</span><Compass size={24} /><h3>Know where you’re going.</h3><p>Align your audience, offer and growth priorities before adding more activity.</p></article>
        <article className="principle-card"><span className="principle-num">02 / CONNECTION</span><Globe2 size={24} /><h3>Make every channel connect.</h3><p>Build a joined-up path from first signal to meaningful customer action.</p></article>
        <article className="principle-card"><span className="principle-num">03 / LEARNING</span><BarChart3 size={24} /><h3>Improve what matters.</h3><p>Measure outcomes, learn from the evidence and invest with more intent.</p></article>
      </div></section>
      <section className="section services-section reveal-section" id="services" data-reveal><div className="container">
        <div className="section-heading-row"><div><Eyebrow>What we do</Eyebrow><h2>One growth system.<br /><em>Connected capabilities.</em></h2></div><p>From consistent content to customer journeys, campaigns and conversion, we shape the right combination around your actual business challenge.</p></div>
        <div className="services-grid">{services.map((service) => { const Icon = service.icon; return <article className="service-card" key={service.number}><img className="service-card-image" src={service.image} alt={service.imageAlt} loading="lazy" decoding="async" /><div className="service-card-top"><span>{service.number}</span><span className="service-icon"><Icon size={22} strokeWidth={1.7} /></span></div><h3>{service.title}</h3><p>{service.description}</p><div className="service-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href={'/?service=' + encodeURIComponent(service.title) + '#contact'} className="service-link" aria-label={'Discuss ' + service.title}>Explore this service <ArrowUpRight size={16} /></a></article>; })}</div>
      </div></section>
      <section className="intelligence-section section-dark reveal-section" id="intelligence" data-reveal><div className="container intelligence-layout">
        <div className="intelligence-copy"><Eyebrow light>Demand Intelligence</Eyebrow><h2>Meet your market<br />at the <em>moment of intent.</em></h2><p>People leave clues when they’re comparing options, asking for recommendations or describing a problem your business solves. A thoughtful listening system helps you find those signals, understand context and respond usefully.</p>
          <div className="intelligence-points"><span><Check size={16} /> Global-ready source strategy</span><span><Check size={16} /> Context-aware qualification</span><span><Check size={16} /> Human-led follow-up</span></div><a className="button button-lime" href="#contact">Discuss a listening system <ArrowRight size={17} /></a><p className="small-disclaimer">Actual coverage depends on source access, platform policies, language and available integrations.</p>
        </div>
        <div className="signal-panel"><div className="panel-header"><div><span className="live-dot" /> SYSTEM FLOW</div><span>01 — 04</span></div>
          <div className="step-tabs" role="tablist" aria-label="Demand Intelligence workflow">{steps.map((step,index) => <button key={step.label} role="tab" aria-selected={activeStep === index} className={activeStep === index ? 'step-tab active' : 'step-tab'} onClick={() => setActiveStep(index)}><span>0{index+1}</span>{step.label}</button>)}</div>
          <div className="step-detail" role="tabpanel" key={activeStep}><div className="step-symbol">{activeStep===0?<Search />:activeStep===1?<ShieldCheck />:activeStep===2?<MessageCircle />:<BarChart3 />}</div><span className="mini-label">STEP 0{activeStep+1}</span><h3>{steps[activeStep].title}</h3><p>{steps[activeStep].text}</p></div>
          <div className="flow-rail">{steps.map((step,index) => <span key={step.label} className={index<=activeStep?'rail-node rail-active':'rail-node'} />)}</div><div className="panel-footer"><span>Signal → context → action</span><Zap size={15} /></div>
        </div>
      </div></section>
      <section className="section method-section reveal-section" id="about" data-reveal><div className="container"><div className="method-heading"><Eyebrow>How we work</Eyebrow><h2>Less guesswork.<br /><em>More intentional growth.</em></h2><p>A practical loop built to help your business move from scattered activity to a system that gets smarter.</p></div>
        <div className="method-steps"><article><span>01</span><div><h3>Diagnose</h3><p>Understand your market, offer, customer journey and current bottlenecks.</p></div><ArrowUpRight size={19} /></article><article><span>02</span><div><h3>Engineer</h3><p>Build a connected strategy across channels, content, conversion and measurement.</p></div><ArrowUpRight size={19} /></article><article><span>03</span><div><h3>Activate</h3><p>Launch focused initiatives with clear owners, useful signals and defined goals.</p></div><ArrowUpRight size={19} /></article><article><span>04</span><div><h3>Improve</h3><p>Review the evidence, remove friction and reinvest in what moves the objective.</p></div><ArrowUpRight size={19} /></article></div>
      </div></section>
      <section className="belief-section reveal-section" data-reveal><div className="container belief-layout"><div className="belief-mark"><svg className="brand-mark" viewBox="0 0 36 36" aria-hidden="true"><path d="M3 7H13L23 18H33" /><path d="M3 18H13L23 18" /><path d="M3 29H13L23 18" /><path d="M23 18L31 10" /><path d="M23 18L31 26" /></svg><span>R / PRINCIPLE</span></div><blockquote>“The goal isn’t to do more marketing. It’s to engineer a better path from <em>attention to action.</em>”</blockquote><p>River Ways — strategy and systems for purposeful growth.</p></div></section>
      <section className="section faq-section reveal-section" data-reveal><div className="container faq-layout"><div><Eyebrow>Good questions</Eyebrow><h2>Before we<br /><em>get to work.</em></h2><p>Clear expectations make better partnerships.</p></div><div className="faq-list">{faqs.map((faq,index) => <details className="faq-item" key={faq.q} open={index===0}><summary>{faq.q}<ChevronDown size={18} /></summary><p>{faq.a}</p></details>)}</div></div></section>
      <section className="contact-section section-dark reveal-section" id="contact" data-reveal><div className="container contact-layout">
        <div className="contact-copy"><Eyebrow light>Start a conversation</Eyebrow><h2>Let’s engineer<br />your next <em>move.</em></h2><p>Tell us what you’re working toward. We’ll use the context to start a more useful conversation about what needs to happen next.</p><div className="contact-promise"><span><Check size={16} /> No generic pitch deck</span><span><Check size={16} /> Start with your actual challenge</span><span><Check size={16} /> Clear next steps</span></div></div>
        <form className="contact-form" onSubmit={submitBrief} noValidate><div className="form-heading"><span>YOUR PROJECT BRIEF</span><span>01 / 01</span></div><label className="honeypot-field" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateForm} /></label>
          <div className="form-row"><label>Your name<input name="name" autoComplete="name" value={form.name} onChange={updateForm} placeholder="Name" required /></label><label>Work email<input name="email" type="email" autoComplete="email" value={form.email} onChange={updateForm} placeholder="you@company.com" required /></label></div>
          <label>Company or brand<input name="company" autoComplete="organization" value={form.company} onChange={updateForm} placeholder="Your business" /></label>
          <label>What do you want to improve?<select name="goal" value={form.goal} onChange={updateForm}><option>Generate more qualified demand</option><option>Social media and content</option><option>Email marketing and customer journeys</option><option>Campaigns and lead generation</option><option>Website or landing page conversion</option><option>SEO and AI-search readiness</option><option>Marketing automation and integrations</option><option>Something else</option></select></label>
          <label>Anything we should know? <span className="optional">(optional)</span><textarea name="details" value={form.details} onChange={updateForm} rows="3" placeholder="Share a little context about the challenge or opportunity." /></label>
          {formError && <p className="form-error" role="alert">{formError}</p>}{formSuccess && <p className="form-success" role="status">{formSuccess}</p>}<button className="button button-lime form-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending your brief…" : "Send my enquiry"} <ArrowRight size={17} /></button><p className="form-note">Your brief is sent securely to River Ways. Please do not include passwords, payment details or other sensitive information.</p>
        </form>
      </div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><Brand /><p>Find the current. Shape what follows.</p><a href="#home" className="back-top">Back to top <ArrowUpRight size={15} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} River Ways. All rights reserved.</span><span>Built around purposeful growth.</span><a href="/privacy/">Privacy</a><a href="mailto:akinsify0511@gmail.com">Contact River Ways</a></div></footer>
  </>;
}
