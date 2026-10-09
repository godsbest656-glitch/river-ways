import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, AudioWaveform, BarChart3, Check, ChevronDown, Compass, Globe2, Menu, MessageCircle, MousePointer2, Search, ShieldCheck, Sparkles, Target, TrendingUp, X, Zap } from 'lucide-react';
import GrowthDiagnostic from './GrowthDiagnostic.jsx';
import DemandEngineExplorer from './DemandEngineExplorer.jsx';

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

function Brand() {
  return <a className="brand" href="#home" aria-label="River Ways home"><span className="brand-mark"><span /><span /><span /></span><span>River Ways</span></a>;
}
function Eyebrow({ children, light = false }) {
  return <div className={'eyebrow ' + (light ? 'eyebrow-light' : '')}><span className="eyebrow-dot" />{children}</div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const initialForm = { name: '', email: '', company: '', goal: 'Generate more qualified demand', details: '' };
  const [form, setForm] = useState(initialForm);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [websiteConfirm, setWebsiteConfirm] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
  const turnstileContainerRef = useRef(null);
  const turnstileWidgetIdRef = useRef(null);
  const updateForm = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) return undefined;
    let cancelled = false;
    let script = document.querySelector('script[data-turnstile-script="true"]');

    const onScriptError = () => {
      setFormStatus({ type: 'error', message: 'Security verification could not load. Use the direct email option below.' });
    };
    const renderWidget = () => {
      if (cancelled || !window.turnstile || !turnstileContainerRef.current || turnstileWidgetIdRef.current !== null) return;
      turnstileWidgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: (token) => {
          setTurnstileToken(token);
          setFormStatus({ type: '', message: '' });
        },
        'expired-callback': () => {
          setTurnstileToken('');
          setFormStatus({ type: 'error', message: 'Verification expired. Please complete it again.' });
        },
        'error-callback': () => {
          setTurnstileToken('');
          setFormStatus({ type: 'error', message: 'Security verification could not complete. Please try again or use email.' });
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.dataset.turnstileScript = 'true';
        script.addEventListener('load', () => {
          script.dataset.loaded = 'true';
          renderWidget();
        }, { once: true });
        script.addEventListener('error', onScriptError, { once: true });
        document.head.appendChild(script);
      } else {
        script.addEventListener('load', renderWidget, { once: true });
        script.addEventListener('error', onScriptError, { once: true });
        if (script.dataset.loaded === 'true') renderWidget();
      }
    }

    return () => {
      cancelled = true;
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(turnstileWidgetIdRef.current);
      }
      turnstileWidgetIdRef.current = null;
    };
  }, [turnstileSiteKey]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeMenu();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const directEmailSubject = encodeURIComponent('River Ways website enquiry — ' + (form.company || form.name || 'New enquiry'));
  const directEmailBody = encodeURIComponent(
    'Name: ' + (form.name || 'Not provided') +
    '\nEmail: ' + (form.email || 'Not provided') +
    '\nCompany: ' + (form.company || 'Not provided') +
    '\nPrimary goal: ' + form.goal +
    '\n\nContext:\n' + (form.details || 'Not provided')
  );
  const directEmailHref = 'mailto:oluwafemi@riverwayse.com?subject=' + directEmailSubject + '&body=' + directEmailBody;

  async function submitBrief(event) {
    event.preventDefault();
    if (submitting) return;
    setFormStatus({ type: '', message: '' });

    if (!form.name.trim()) {
      setFormStatus({ type: 'error', message: 'Add your name to continue.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormStatus({ type: 'error', message: 'Add a valid email address to continue.' });
      return;
    }
    if (!turnstileSiteKey) {
      setFormStatus({ type: 'error', message: 'Direct submission is not enabled on this preview yet. Please use the direct email option below.' });
      return;
    }
    if (!turnstileToken) {
      setFormStatus({ type: 'error', message: 'Complete the security verification before submitting.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website_confirm: websiteConfirm, turnstileToken }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.ok) {
        setFormStatus({
          type: 'error',
          message: result?.message || 'We could not submit the enquiry. Please use the direct email option below.',
        });
        setTurnstileToken('');
        if (turnstileWidgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(turnstileWidgetIdRef.current);
        }
        return;
      }

      setFormStatus({ type: 'success', message: result.message || 'Your enquiry has been sent to River Ways.' });
      setForm(initialForm);
      setWebsiteConfirm('');
      setTurnstileToken('');
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } catch {
      setFormStatus({ type: 'error', message: 'We could not reach the enquiry service. Please use the direct email option below.' });
      setTurnstileToken('');
      if (turnstileWidgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    } finally {
      setSubmitting(false);
    }
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="container nav-wrap">
      <Brand />
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      <nav className={'main-nav ' + (menuOpen ? 'nav-open' : '')} aria-label="Main navigation">
        <a href="#approach" onClick={closeMenu}>Our approach</a><a href="#services" onClick={closeMenu}>What we do</a><a href="#diagnostic" onClick={closeMenu}>Growth check</a><a href="#intelligence" onClick={closeMenu}>Demand intelligence</a><a href="#about" onClick={closeMenu}>Why River Ways</a><a className="nav-cta" href="#contact" onClick={closeMenu}>Let’s talk <ArrowUpRight size={15} /></a>
      </nav>
    </div></header>
    <main id="main">
      <section className="hero section-dark" id="home"><div className="hero-grid" aria-hidden="true" />
        <div className="container hero-layout">
          <div className="hero-copy"><Eyebrow light>Growth is engineered, not guessed</Eyebrow><h1>Engineer demand.<br /><span>Create momentum.</span></h1>
            <p className="hero-lede">We connect strategy, discovery and digital experiences into a system that helps the right people find you—and gives them a reason to act.</p>
            <div className="hero-actions"><a className="button button-lime" href="#contact">Build your growth system <ArrowRight size={17} /></a><a className="text-link text-link-light" href="#approach">See how we work <ArrowDownRight size={17} /></a></div>
            <div className="hero-note"><span className="note-line" /> Strategy-led. Signal-informed. Outcome-focused.</div>
          </div>
          <div className="hero-visual" aria-label="Abstract illustration of a connected demand system">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-glow" />
            <div className="visual-card visual-card-top"><span className="mini-label"><span className="live-dot" /> SIGNAL PREVIEW</span><div className="signal-bars">{Array.from({length:12}, (_,i) => <i key={i} />)}</div><div className="signal-footer"><span>Illustrative signal</span><span className="signal-status">SAMPLE</span></div></div>
            <div className="visual-core"><div className="core-ring"><Target size={37} strokeWidth={1.35} /></div><span>DEMAND<br />ENGINE</span></div>
            <div className="visual-card visual-card-bottom"><div className="conversion-icon"><TrendingUp size={19} /></div><div><span className="mini-label">THE OUTCOME</span><strong>Connected growth</strong><small>Discover → Convert → Learn</small></div></div><span className="visual-caption">A system, not a silo.</span>
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
      <DemandEngineExplorer />
      <section className="section services-section" id="services"><div className="container">
        <div className="section-heading-row"><div><Eyebrow>What we do</Eyebrow><h2>One growth system.<br /><em>Connected capabilities.</em></h2></div><p>Choose the capability you need now. We design the work to connect with the bigger picture.</p></div>
        <div className="services-grid">{services.map((service) => { const Icon = service.icon; return <article className="service-card" key={service.number}><div className="service-card-top"><span>{service.number}</span><span className="service-icon"><Icon size={22} strokeWidth={1.7} /></span></div><h3>{service.title}</h3><p>{service.description}</p><div className="service-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a href="#contact" className="service-link" aria-label={'Discuss ' + service.title}>Explore this service <ArrowUpRight size={16} /></a></article>; })}</div>
      </div></section>
      <GrowthDiagnostic />
      <section className="intelligence-section section-dark" id="intelligence"><div className="container intelligence-layout">
        <div className="intelligence-copy"><Eyebrow light>Demand Intelligence</Eyebrow><h2>Meet your market<br />at the <em>moment of intent.</em></h2><p>People leave clues when they’re comparing options, asking for recommendations or describing a problem your business solves. A thoughtful listening system helps you find those signals, understand context and respond usefully.</p>
          <div className="intelligence-points"><span><Check size={16} /> Global-ready source strategy</span><span><Check size={16} /> Context-aware qualification</span><span><Check size={16} /> Human-led follow-up</span></div><a className="button button-lime" href="#contact">Discuss a listening system <ArrowRight size={17} /></a><p className="small-disclaimer">Actual coverage depends on source access, platform policies, language and available integrations.</p>
        </div>
        <div className="signal-panel"><div className="panel-header"><div><span className="live-dot" /> SYSTEM FLOW</div><span>01 — 04</span></div>
          <div className="step-tabs" role="tablist" aria-label="Demand Intelligence workflow">{steps.map((step,index) => <button key={step.label} id={"intelligence-tab-" + index} role="tab" aria-controls="intelligence-step-panel" aria-selected={activeStep === index} tabIndex={activeStep === index ? 0 : -1} className={activeStep === index ? 'step-tab active' : 'step-tab'} onKeyDown={(event) => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const delta = event.key === 'ArrowRight' ? 1 : -1; const next = (index + delta + steps.length) % steps.length; setActiveStep(next); event.currentTarget.parentElement?.querySelectorAll('[role="tab"]')[next]?.focus(); } }} onClick={() => setActiveStep(index)}><span>0{index+1}</span>{step.label}</button>)}</div>
          <div className="step-detail" id="intelligence-step-panel" role="tabpanel" aria-labelledby={"intelligence-tab-" + activeStep} key={activeStep}><div className="step-symbol">{activeStep===0?<Search />:activeStep===1?<ShieldCheck />:activeStep===2?<MessageCircle />:<BarChart3 />}</div><span className="mini-label">STEP 0{activeStep+1}</span><h3>{steps[activeStep].title}</h3><p>{steps[activeStep].text}</p></div>
          <div className="flow-rail">{steps.map((step,index) => <span key={step.label} className={index<=activeStep?'rail-node rail-active':'rail-node'} />)}</div><div className="panel-footer"><span>Signal → context → action</span><Zap size={15} /></div>
        </div>
      </div></section>
      <section className="section method-section" id="about"><div className="container"><div className="method-heading"><Eyebrow>How we work</Eyebrow><h2>Less guesswork.<br /><em>More intentional growth.</em></h2><p>A practical loop built to help your business move from scattered activity to a system that gets smarter.</p></div>
        <div className="method-steps"><article><span>01</span><div><h3>Diagnose</h3><p>Understand your market, offer, customer journey and current bottlenecks.</p></div><ArrowUpRight size={19} /></article><article><span>02</span><div><h3>Engineer</h3><p>Build a connected strategy across channels, content, conversion and measurement.</p></div><ArrowUpRight size={19} /></article><article><span>03</span><div><h3>Activate</h3><p>Launch focused initiatives with clear owners, useful signals and defined goals.</p></div><ArrowUpRight size={19} /></article><article><span>04</span><div><h3>Improve</h3><p>Review the evidence, remove friction and reinvest in what moves the objective.</p></div><ArrowUpRight size={19} /></article></div>
      </div></section>
      <section className="belief-section"><div className="container belief-layout"><div className="belief-mark"><span className="brand-mark"><span /><span /><span /></span><span>R / PRINCIPLE</span></div><blockquote>“The goal isn’t to do more marketing. It’s to engineer a better path from <em>attention to action.</em>”</blockquote><p>River Ways — strategy and systems for purposeful growth.</p></div></section>
      <section className="section faq-section"><div className="container faq-layout"><div><Eyebrow>Good questions</Eyebrow><h2>Before we<br /><em>get to work.</em></h2><p>Clear expectations make better partnerships.</p></div><div className="faq-list">{faqs.map((faq,index) => <details className="faq-item" key={faq.q} open={index===0}><summary>{faq.q}<ChevronDown size={18} /></summary><p>{faq.a}</p></details>)}</div></div></section>
      <section className="contact-section section-dark" id="contact"><div className="container contact-layout">
        <div className="contact-copy"><Eyebrow light>Start a conversation</Eyebrow><h2>Let’s engineer<br />your next <em>move.</em></h2><p>Tell us what you’re working toward. We’ll use the context to start a more useful conversation about what needs to happen next.</p><div className="contact-promise"><span><Check size={16} /> No generic pitch deck</span><span><Check size={16} /> Start with your actual challenge</span><span><Check size={16} /> Clear next steps</span></div></div>
        <form className="contact-form" onSubmit={submitBrief} noValidate>
          <div className="form-heading"><span>YOUR PROJECT BRIEF</span><span>SECURE ENQUIRY</span></div>
          <div className="form-row">
            <label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" value={form.name} onChange={updateForm} placeholder="Name" required maxLength={120} /></label>
            <label htmlFor="contact-email">Work email<input id="contact-email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateForm} placeholder="you@company.com" required maxLength={254} /></label>
          </div>
          <label htmlFor="contact-company">Company or brand<input id="contact-company" name="company" autoComplete="organization" value={form.company} onChange={updateForm} placeholder="Your business" maxLength={120} /></label>
          <label htmlFor="contact-goal">What do you want to improve?
            <select id="contact-goal" name="goal" value={form.goal} onChange={updateForm}>
              <option>Generate more qualified demand</option>
              <option>Improve search and AI visibility</option>
              <option>Increase website conversion</option>
              <option>Build a Demand Intelligence system</option>
              <option>Connect marketing and measurement</option>
              <option>Something else</option>
            </select>
          </label>
          <label htmlFor="contact-details">Anything we should know? <span className="optional">(optional)</span>
            <textarea id="contact-details" name="details" value={form.details} onChange={updateForm} rows="3" maxLength={4000} placeholder="Share a little context about the challenge or opportunity." />
          </label>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website-confirm">Leave this field empty</label>
            <input id="website-confirm" name="website_confirm" type="text" tabIndex="-1" autoComplete="off" value={websiteConfirm} onChange={(event) => setWebsiteConfirm(event.target.value)} />
          </div>
          {turnstileSiteKey
            ? <div className="form-security"><div ref={turnstileContainerRef} className="turnstile-widget" aria-label="Security verification" /><p className="form-note">Protected by Cloudflare Turnstile. Verification is checked by the server.</p></div>
            : <p className="form-note setup-notice" role="status">Direct submission is still being configured for this preview. Your details are not sent when you use this page. Use the email option below to continue.</p>}
          {formStatus.message && <p className={'form-status form-status-' + formStatus.type} role={formStatus.type === 'success' ? 'status' : 'alert'} aria-live="polite">{formStatus.message}</p>}
          <button className="button button-lime form-submit" type="submit" disabled={submitting || !turnstileSiteKey}>
            {submitting ? 'Sending enquiry…' : turnstileSiteKey ? 'Send enquiry securely' : 'Direct submission is being set up'} <ArrowRight size={17} />
          </button>
          <p className="form-note"><a href={directEmailHref}>Prefer email? Send your brief directly.</a></p>
          <p className="form-note">Please do not include passwords, payment details or sensitive personal information. Read the <a href="/privacy/">Privacy Notice</a> for how enquiry information is handled.</p>
        </form>
      </div></section>
    </main>
    <footer className="site-footer"><div className="container footer-top"><Brand /><p>Engineer demand. Create momentum.</p><a href="#home" className="back-top">Back to top <ArrowUpRight size={15} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} River Ways. All rights reserved.</span><span>Built around purposeful growth.</span><a href="/privacy/">Privacy</a><a href="mailto:oluwafemi@riverwayse.com">Contact River Ways</a></div></footer>
  </>;
}
