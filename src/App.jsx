import React, { lazy, Suspense, useEffect, useState } from 'react';

const LiquidCurrent = lazy(() => import('./components/LiquidCurrent.jsx'));
import { createProjectSource, projectRecords } from './portfolio/index.js';
import { ScrollGallery } from './portfolio/components/index.js';
import { LiquidGlass } from 'simple-liquid-glass';
import { LiquidGlassScene } from 'simple-liquid-glass/backdrop';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Check,
  ChevronDown, Layers3, Menu, MessageCircle,
  Search, ShieldCheck, Sparkles, Target, TrendingUp, Workflow, X, Zap
} from 'lucide-react';

const services = [
  {
    number: '01', kind: 'featured', icon: Target,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1100&q=78',
    imageAlt: 'A team working together around a strategy table',
    title: 'Creative Demand Engineering',
    description: 'Connect commercial strategy, creative direction and growth systems around one clear path from attention to action.',
    tags: ['Growth strategy', 'Demand architecture', 'Go-to-market']
  },
  {
    number: '02', kind: 'featured', icon: Layers3,
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=1100&q=78',
    imageAlt: 'A carefully composed digital interface on a workstation',
    title: 'Websites & Digital Experiences',
    description: 'Build useful, distinctive digital experiences that explain your value, earn trust and make the next step easier.',
    tags: ['Web design', 'Digital products', 'CRO']
  },
  {
    number: '03', kind: 'featured', icon: Search,
    image: 'https://images.unsplash.com/photo-1460925895917-af0d2a3f6e4d?auto=format&fit=crop&w=1100&q=78',
    imageAlt: 'A digital analytics interface showing business information',
    title: 'Search & AI Discovery',
    description: 'Make your business easier to find, understand and trust across search engines, local discovery and AI-powered answers.',
    tags: ['Technical SEO', 'GEO & AIO', 'Content architecture']
  },
  {
    number: '04', kind: 'compact', icon: Sparkles,
    title: 'Brand & Creative Systems',
    description: 'Create a recognisable point of view and a coherent visual and verbal language.',
    tags: ['Positioning', 'Art direction', 'Brand storytelling']
  },
  {
    number: '05', kind: 'compact', icon: TrendingUp,
    title: 'Performance Marketing',
    description: 'Connect media, offers, landing pages and measurement around meaningful outcomes.',
    tags: ['Paid acquisition', 'Campaigns', 'Measurement']
  },
  {
    number: '06', kind: 'compact', icon: MessageCircle,
    title: 'Content & Campaigns',
    description: 'Turn useful ideas into a consistent rhythm of content, creative and customer communication.',
    tags: ['Content systems', 'Email journeys', 'Campaign creative']
  },
  {
    number: '07', kind: 'compact', icon: Workflow,
    title: 'Demand Intelligence',
    description: 'Find relevant public intent signals and support contextual, human-reviewed follow-up.',
    tags: ['Market listening', 'Intent research', 'Lead workflows']
  }
];

const currentCards = [
  { number: '01', label: 'SIGNAL', title: 'Read the environment.', note: 'Notice what is changing.', symbol: 'signal' },
  { number: '02', label: 'STRATEGY', title: 'Find the direction.', note: 'Choose where effort matters.', symbol: 'direction' },
  { number: '03', label: 'EXPERIENCE', title: 'Shape the encounter.', note: 'Make the next step clear.', symbol: 'experience' },
  { number: '04', label: 'MOMENTUM', title: 'Keep progress moving.', note: 'Learn and improve.', symbol: 'momentum' }
];

const steps = [
  { label: 'Understand', title: 'Read the whole environment.', text: 'We examine the market, audience, offer, current channels and customer journey before prescribing more activity.' },
  { label: 'Engineer', title: 'Shape a connected route.', text: 'We bring strategy, creative, digital experience and demand channels together around a defined commercial objective.' },
  { label: 'Activate', title: 'Put the system into motion.', text: 'We build and launch the right work in deliberate stages, with clear ownership and useful measures.' },
  { label: 'Improve', title: 'Learn from what happens.', text: 'We use evidence from real behaviour and outcomes to remove friction, refine the route and improve the next cycle.' }
];

const intelligenceSteps = [
  { label: 'Discover', title: 'Find the signal.', text: 'Monitor relevant public conversations, search themes and market questions across selected sources and regions.', icon: Search },
  { label: 'Qualify', title: 'Separate intent from noise.', text: 'Use keyword context, fit criteria and human review to prioritise signals that may represent real demand.', icon: ShieldCheck },
  { label: 'Respond', title: 'Make the moment useful.', text: 'Give the right person context and a practical next step for a thoughtful, human-led response.', icon: MessageCircle },
  { label: 'Learn', title: 'Improve the system.', text: 'Review outcomes, refine the signals and feed what works back into content, campaigns and customer experience.', icon: BarChart3 }
];

const pathways = [
  { number: '01', title: 'Founders & operators', text: 'Get clear on the growth problem, the opportunity and the next move worth making.', link: 'Start with a diagnosis' },
  { number: '02', title: 'Growing teams', text: 'Connect channels, creative, digital experience and measurement that have outgrown their separate silos.', link: 'Connect the system' },
  { number: '03', title: 'Established organisations', text: 'Bring strategic clarity and joined-up execution to complex markets, teams and customer journeys.', link: 'Explore a partnership' }
];

const outputs = [
  { number: '01', title: 'A clearer opportunity', text: 'A sharper view of the audience, market conditions and commercial problem to solve.' },
  { number: '02', title: 'A designed route', text: 'A connected plan for positioning, creative, channels, experience and measurement.' },
  { number: '03', title: 'Work that ships', text: 'The pages, campaigns, content and systems required to put the plan into practice.' },
  { number: '04', title: 'A learning loop', text: 'Useful signals and reviews that show what is working and what should change next.' }
];

const faqs = [
  { q: 'What is Creative Demand Engineering?', a: 'It is River Ways’ way of connecting commercial strategy, creative thinking, digital experiences and demand generation. Rather than treating every channel as a separate task, we design a more coherent path from market attention to customer action.' },
  { q: 'What kinds of businesses do you work with?', a: 'We work with founders, growth-stage businesses and established organisations that need clearer direction, stronger digital experiences or a more connected approach to demand. The right scope depends on the problem and the team.' },
  { q: 'Can River Ways work with businesses outside Nigeria?', a: 'Yes. River Ways is built to work across markets. We consider audience, language, platform access, local context and applicable requirements when shaping the work.' },
  { q: 'Do you guarantee leads or revenue?', a: 'No responsible partner can guarantee outcomes that depend on market conditions, offer, timing and execution beyond one team’s control. We agree meaningful objectives, establish a baseline and make decisions from evidence.' },
  { q: 'Is Demand Intelligence an automated outreach service?', a: 'No. It is a way to identify and prioritise relevant public signals. Any outreach should be contextual, human-reviewed and respectful of platform rules, privacy requirements and the expectations of the people being contacted.' },
  { q: 'Can you improve an existing website or marketing setup?', a: 'Yes. Work can begin with an assessment of the current site, discovery channels, content, analytics and conversion journey. We then prioritise the most valuable improvements before expanding the system.' }
];

function DeferredLiquidCurrent() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const stage = document.querySelector('.current-stage');
    const enable = () => setEnabled(true);
    const onPointer = () => enable();
    const onFocus = () => enable();
    stage?.addEventListener('pointerenter', onPointer, { once: true, passive: true });
    stage?.addEventListener('focusin', onFocus, { once: true });

    // Keep the original SVG current as the immediate visual. Defer the 3D
    // renderer until after first paint, unless the visitor engages the hero.
    const timeout = window.setTimeout(enable, 3600);
    return () => {
      window.clearTimeout(timeout);
      stage?.removeEventListener('pointerenter', onPointer);
      stage?.removeEventListener('focusin', onFocus);
    };
  }, []);

  return enabled ? <Suspense fallback={null}><LiquidCurrent /></Suspense> : null;
}

function Brand() {
  return (
    <a className="brand" href="#home" aria-label="River Ways home">
      <svg className="brand-mark" viewBox="0 0 36 36" aria-hidden="true">
        <path d="M3 7H13L23 18H33" />
        <path d="M3 18H13L23 18" />
        <path d="M3 29H13L23 18" />
        <path d="M23 18L31 10" />
        <path d="M23 18L31 26" />
      </svg>
      <span>River Ways</span>
    </a>
  );
}

function Eyebrow({ children, light = false }) {
  return <div className={'eyebrow ' + (light ? 'eyebrow-light' : '')}><span className="eyebrow-dot" />{children}</div>;
}

const portfolioSource = createProjectSource(projectRecords);

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCurrent, setActiveCurrent] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', company: '', goal: 'Generate more qualified demand',
    details: '', website: ''
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateForm = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -28px 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  function moveCurrent(event) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const root = event.currentTarget;
    root.style.setProperty('--pointer-x', (x * 11).toFixed(2) + 'px');
    root.style.setProperty('--pointer-y', (y * 9).toFixed(2) + 'px');
    root.style.setProperty('--pointer-rotate', (x * 1.1).toFixed(2) + 'deg');
    const wave = [-0.7, 0.45, -0.4, 0.8];
    root.querySelectorAll('.current-card').forEach((card, index) => {
      card.style.setProperty('--card-pointer-x', (x * 15 * wave[index]).toFixed(2) + 'px');
      card.style.setProperty('--card-pointer-y', (y * 12 * wave[index]).toFixed(2) + 'px');
      card.style.setProperty('--glass-x', ((0.5 + x * 0.8) * 100).toFixed(1) + '%');
      card.style.setProperty('--glass-y', ((0.5 + y * 0.8) * 100).toFixed(1) + '%');
    });
  }

  function resetCurrent(event) {
    const root = event.currentTarget;
    root.style.setProperty('--pointer-x', '0px');
    root.style.setProperty('--pointer-y', '0px');
    root.style.setProperty('--pointer-rotate', '0deg');
    root.querySelectorAll('.current-card').forEach((card) => {
      card.style.setProperty('--card-pointer-x', '0px');
      card.style.setProperty('--card-pointer-y', '0px');
    });
  }

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
        landingPage: params.get('landing_page') || window.location.pathname,
        referrer: document.referrer || '',
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmContent: params.get('utm_content') || '',
        utmTerm: params.get('utm_term') || '',
        journey: params.get('journey') || '',
        engagement: params.get('engagement') || ''
      };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, ...attribution })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        setFormError(result.message || result.error || 'We could not send your brief right now. Please email akinsify0511@gmail.com.');
        return;
      }
      const successMessage = result.message || 'Thank you. Your enquiry has been received.';
      setFormSuccess(result.reference ? `${successMessage} Reference: ${result.reference}` : successMessage);
      setForm({ name: '', email: '', company: '', goal: 'Generate more qualified demand', details: '', website: '' });
    } catch {
      setFormError('We could not connect to the enquiry service. Please email akinsify0511@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container nav-wrap">
          <Brand />
          <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <nav id="site-navigation" className={'main-nav ' + (menuOpen ? 'nav-open' : '')} aria-label="Main navigation">
            <a href="#approach" onClick={closeMenu}>Approach</a>
            <a href="#services" onClick={closeMenu}>Capabilities</a>
            <a href="/work/" onClick={closeMenu}>Work</a>
            <a href="/insights/" onClick={closeMenu}>Insights</a>
            <a href="/about/" onClick={closeMenu}>About</a>
            <a className="nav-cta" href="#contact" onClick={closeMenu}>Start a conversation <ArrowUpRight size={15} /></a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero section-dark" id="home">
          <div className="hero-atmosphere" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="container hero-layout">
            <div className="hero-copy hero-copy-centered">
              <Eyebrow light>Creative demand engineering</Eyebrow>
              <h1>We engineer<br /><span>demand.</span></h1>
              <p className="hero-lede">River Ways connects strategy, creative, digital experiences and growth systems to turn market attention into meaningful business momentum.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#contact">Start a conversation <ArrowUpRight size={17} /></a>
                <a className="text-link text-link-light" href="#approach">Explore our approach <ArrowDownRight size={17} /></a>
              </div>
              <div className="hero-note"><span className="note-line" /> From attention to action. With intent.</div>
            </div>

            <div className="hero-visual current-stage" role="group" aria-label="An interactive model of how River Ways turns market signals into business momentum" onPointerMove={moveCurrent} onPointerLeave={resetCurrent}>
              <LiquidGlassScene>
              <div className="current-stage-grid" aria-hidden="true" />
              <DeferredLiquidCurrent />
              <div className="current-stage-river" aria-hidden="true">
                <svg viewBox="0 0 660 520" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="rw-flow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="#A9E8F7" stopOpacity=".04" />
                      <stop offset=".48" stopColor="#168BB7" stopOpacity=".9" />
                      <stop offset="1" stopColor="#A9E8F7" stopOpacity=".1" />
                    </linearGradient>
                    <radialGradient id="rw-current-glow"><stop stopColor="#79D5F0" stopOpacity=".24" /><stop offset="1" stopColor="#79D5F0" stopOpacity="0" /></radialGradient>
                  </defs>
                  <ellipse cx="340" cy="260" rx="235" ry="180" fill="url(#rw-current-glow)" />
                  {Array.from({ length: 13 }, (_, index) => (
                    <path key={index} d={'M-30 ' + (45 + index * 32) + ' C 95 ' + (5 + index * 25) + ', 160 ' + (150 + index * 16) + ', 285 ' + (180 + index * 10) + ' S 475 ' + (35 + index * 28) + ', 690 ' + (85 + index * 29)} stroke={index > 4 && index < 9 ? 'url(#rw-flow)' : '#A9E8F7'} strokeOpacity={index > 4 && index < 9 ? '.8' : '.15'} strokeWidth={index > 4 && index < 9 ? '1.4' : '.8'} fill="none" />
                  ))}
                </svg>
              </div>
              <div className="current-stage-meta"><span>RW / FIELD STUDY 001</span><span>THE SYSTEM IN MOTION <i /></span></div>
              <div className="current-card-stream">
                {currentCards.map((card, index) => (
                  <LiquidGlass key={card.number} className="current-card-glass" radius={15} renderer="auto" refraction="lens" lensProfile="player" lensOptions={{ strength: 0.13, depth: 0.18, curvature: 0.45, bend: 0.5, sheen: 1.1, specular: 1.2 }} quality="high" saturation={125} style={{ width: '100%', height: '100%' }}>
                  <button type="button" className={'current-card current-card-' + card.symbol + (activeCurrent === index ? ' is-current' : '')} onPointerEnter={() => setActiveCurrent(index)} onFocus={() => setActiveCurrent(index)} onClick={() => setActiveCurrent(index)} aria-pressed={activeCurrent === index}>
                    <span className="current-card-index">{card.number} <span>/ {card.label}</span></span>
                    <span className={'current-card-symbol symbol-' + card.symbol} aria-hidden="true">
                      {Array.from({ length: index === 0 ? 7 : index === 1 ? 4 : index === 2 ? 5 : 6 }, (_, i) => <i key={i} />)}
                    </span>
                    <span className="current-card-title">{card.title}</span>
                    <span className="current-card-note">{card.note}</span>
                    <span className="current-card-arrow"><ArrowUpRight size={15} /></span>
                  </button>
                  </LiquidGlass>
                ))}
              </div>
              <div className="current-stage-footer">
                <span className="current-live-dot" />
                <span>{['Notice what is changing.','Choose where effort matters.','Make the next step clear.','Learn and improve.'][activeCurrent]}</span>
                <span className="current-progress">{String(activeCurrent + 1).padStart(2, '0')} <i /> 04</span>
              </div>
              <span className="current-stage-caption">A connected system, not a collection of tactics.</span>
              </LiquidGlassScene>
            </div>
          </div>
          <div className="container hero-bottom">
            <span>BUILT AROUND YOUR BUSINESS GOALS</span>
            <div className="hero-capabilities">
              <span><Check size={14} /> Strategy</span><span><Check size={14} /> Creative</span><span><Check size={14} /> Digital</span><span><Check size={14} /> Performance</span>
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            <span>CREATIVE DEMAND ENGINEERING</span><b>✳</b><span>BRAND & CREATIVE</span><b>✳</b><span>DIGITAL EXPERIENCES</span><b>✳</b><span>SEARCH & AI DISCOVERY</span><b>✳</b><span>DEMAND INTELLIGENCE</span><b>✳</b><span>CREATIVE DEMAND ENGINEERING</span><b>✳</b><span>BRAND & CREATIVE</span><b>✳</b><span>DIGITAL EXPERIENCES</span><b>✳</b><span>SEARCH & AI DISCOVERY</span><b>✳</b>
          </div>
        </div>

        <section className="section problem-section reveal-section" id="approach" data-reveal>
          <div className="container approach-layout">
            <div className="approach-lead">
              <Eyebrow>The problem</Eyebrow>
              <h2>Good work gets lost when the parts <em>don’t connect.</em></h2>
            </div>
            <div className="approach-copy">
              <p className="large-copy">A strong offer. A campaign. A website. Content. Analytics. Each may be doing its job, yet the customer still has to make sense of the gaps between them.</p>
              <p>River Ways brings the pieces into a clearer system—so your message, discovery, experience and follow-through move in the same direction.</p>
              <a className="text-link" href="#services">Explore the capabilities <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="container principle-strip">
            <div><span>01 / CLARITY</span><strong>Know what matters.</strong><p>Start with the real commercial objective.</p></div>
            <div><span>02 / CONNECTION</span><strong>Make the parts work together.</strong><p>Join the journey from discovery to decision.</p></div>
            <div><span>03 / LEARNING</span><strong>Improve with evidence.</strong><p>Use outcomes to shape the next move.</p></div>
          </div>
        </section>

        <section className="section services-section reveal-section" id="services" data-reveal>
          <div className="container">
            <div className="section-heading-row">
              <div><Eyebrow>What we do</Eyebrow><h2>Connected capabilities.<br /><em>One direction.</em></h2></div>
              <p>Start with the problem in front of you. We shape the work to connect with the bigger picture.</p>
            </div>
            <div className="service-feature-grid">
              {services.filter((service) => service.kind === 'featured').map((service) => {
                const Icon = service.icon;
                return (
                  <article className="service-feature" key={service.number}>
                    <div className="service-image-wrap"><img src={service.image} srcSet={service.image.replace("w=1100", "w=520") + " 520w, " + service.image.replace("w=1100", "w=800") + " 800w, " + service.image + " 1100w"} sizes="(max-width: 600px) 100vw, (max-width: 1120px) 50vw, 33vw" alt={service.imageAlt} loading="lazy" decoding="async" /><span className="service-image-index">{service.number} / CAPABILITY</span></div>
                    <div className="service-feature-copy">
                      <div className="service-icon"><Icon size={20} strokeWidth={1.7} /></div>
                      <h3>{service.title}</h3><p>{service.description}</p>
                      <div className="service-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <a className="service-link" href="#contact">Discuss this capability <ArrowUpRight size={16} /></a>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="service-compact-grid">
              {services.filter((service) => service.kind === 'compact').map((service) => {
                const Icon = service.icon;
                return (
                  <article className="service-compact" key={service.number}>
                    <span className="service-compact-number">{service.number}</span>
                    <div className="service-compact-icon"><Icon size={19} /></div>
                    <h3>{service.title}</h3><p>{service.description}</p>
                    <div className="service-tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <a className="service-link" href="#contact">Explore <ArrowUpRight size={15} /></a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section studio-section reveal-section" id="studio" data-reveal>
          <div className="container">
            <div className="studio-heading">
              <div>
                <Eyebrow>Creative Studio</Eyebrow>
                <h2>Make the thinking<br /><em>impossible to ignore.</em></h2>
              </div>
              <div className="studio-intro">
                <p>Strategy needs an expression. We shape brand worlds, campaign ideas and digital experiences into work people can recognise, understand and remember.</p>
                <a className="text-link" href="#contact">Discuss a creative brief <ArrowUpRight size={16} /></a>
              </div>
            </div>
            <ScrollGallery
              source={portfolioSource}
              scope="studio"
              limit={3}
              className="studio-scroll-gallery"
              ariaLabel="River Ways creative capability studies"
              cardClassName="studio-card"
              copyClassName="studio-card-copy"
              disclaimerClassName="studio-disclaimer"
              onProjectSelect={({ slug }) => window.location.assign("/work/" + slug + "/")}
            />
            <p className="studio-disclaimer">Illustrative capability studies — not client case studies or claims of commissioned work.</p>
          </div>
        </section>

        <section className="section pathways-section reveal-section" id="pathways" data-reveal>
          <div className="container">
            <div className="section-heading-row">
              <div><Eyebrow>Different starting points</Eyebrow><h2>Meet your business<br /><em>where it is.</em></h2></div>
              <p>The right next move depends on the stage, the challenge and the people who need to make it happen.</p>
            </div>
            <div className="pathway-grid">
              {pathways.map((pathway) => (
                <article className="pathway-card" key={pathway.number}>
                  <span className="pathway-number">{pathway.number}</span>
                  <h3>{pathway.title}</h3><p>{pathway.text}</p>
                  <a href="#contact">{pathway.link} <ArrowUpRight size={15} /></a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="intelligence-section section-dark reveal-section" id="intelligence" data-reveal>
          <div className="container intelligence-layout">
            <div className="intelligence-copy">
              <Eyebrow light>Demand Intelligence</Eyebrow>
              <h2>Find the moment<br />the market <em>moves.</em></h2>
              <p>People leave clues when they compare options, ask for recommendations or describe a problem your business solves. A thoughtful listening system helps you notice relevant signals, understand their context and decide what deserves a response.</p>
              <div className="intelligence-points">
                <span><Check size={16} /> Global-ready source strategy</span>
                <span><Check size={16} /> Context-aware qualification</span>
                <span><Check size={16} /> Human-reviewed follow-up</span>
              </div>
              <a className="button button-primary" href="#contact">Discuss a listening system <ArrowRight size={17} /></a>
              <p className="small-disclaimer">Coverage depends on source access, platform policies, language and available integrations. This page describes an approach, not a claim that every source is already connected.</p>
              <a className="text-link text-link-light" href="/field-guide/">Read the Demand Engineering Field Guide <ArrowUpRight size={15} /></a>
            </div>
            <div className="signal-panel">
              <div className="panel-header"><span><i /> SYSTEM FLOW</span><span>01 — 04</span></div>
              <div className="step-tabs" role="group" aria-label="Demand Intelligence workflow">
                {intelligenceSteps.map((step, index) => (
                  <button key={step.label} type="button" aria-pressed={activeStep === index} className={activeStep === index ? 'step-tab active' : 'step-tab'} onClick={() => setActiveStep(index)}>
                    <span>0{index + 1}</span>{step.label}
                  </button>
                ))}
              </div>
              <div className="step-detail" role="region" aria-label="Selected Demand Intelligence workflow step" aria-live="polite" key={activeStep}>
                {React.createElement(intelligenceSteps[activeStep].icon, { size: 24, className: 'step-symbol' })}
                <span className="mini-label">STEP 0{activeStep + 1}</span>
                <h3>{intelligenceSteps[activeStep].title}</h3>
                <p>{intelligenceSteps[activeStep].text}</p>
              </div>
              <div className="flow-rail">{intelligenceSteps.map((step, index) => <span key={step.label} className={index <= activeStep ? 'rail-node rail-active' : 'rail-node'} />)}</div>
              <div className="panel-footer"><span>Signal → context → action</span><Zap size={15} /></div>
            </div>
          </div>
        </section>

        <section className="section method-section reveal-section" id="method" data-reveal>
          <div className="container">
            <div className="method-heading">
              <Eyebrow>How the work moves</Eyebrow>
              <h2>Read the conditions.<br /><em>Shape the current.</em></h2>
              <p>Growth is not a fixed formula. It is a system shaped by the environment around a business and the people it serves.</p>
            </div>
            <div className="method-grid">
              {steps.map((step, index) => (
                <article className="method-step" key={step.label}>
                  <span className="method-step-number">0{index + 1}</span>
                  <div className="method-step-line" />
                  <span className="method-step-label">{step.label}</span>
                  <h3>{step.title}</h3><p>{step.text}</p>
                </article>
              ))}
            </div>
            <div className="outputs-band">
              <div className="outputs-heading"><Eyebrow>What the work produces</Eyebrow><h3>From direction to something real.</h3></div>
              <div className="outputs-grid">
                {outputs.map((output) => <div className="output-item" key={output.number}><span>{output.number}</span><strong>{output.title}</strong><p>{output.text}</p></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="section principles-section reveal-section" id="principles" data-reveal>
          <div className="container principles-layout">
            <div className="principles-heading">
              <Eyebrow>The River Ways point of view</Eyebrow>
              <h2>A river does not move <em>in isolation.</em></h2>
            </div>
            <div className="principles-copy">
              <p className="principles-lede">It reads its terrain. It responds to the season. It connects ecosystems, sustains life and keeps moving toward the ocean.</p>
              <p>We believe growth works in much the same way. A business is part of an environment shaped by people, needs, timing, culture and change. The work is to understand those conditions, find a way through them and create movement that has a meaningful destination.</p>
              <div className="principle-list">
                <div><span>01</span><strong>Read the environment.</strong><small>Understand the conditions around the business.</small></div>
                <div><span>02</span><strong>Respect the season.</strong><small>Respond to people, timing and context.</small></div>
                <div><span>03</span><strong>Connect what sustains life.</strong><small>Build relationships between the parts.</small></div>
                <div><span>04</span><strong>Move toward the ocean.</strong><small>Keep the wider purpose in view.</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className="section faq-section reveal-section" id="faq" data-reveal>
          <div className="container faq-layout">
            <div><Eyebrow>Good questions</Eyebrow><h2>Before we<br /><em>get to work.</em></h2><p>Clear expectations make better partnerships.</p></div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details className="faq-item" key={faq.q} open={index === 0}>
                  <summary>{faq.q}<ChevronDown size={18} /></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="contact-section section-dark reveal-section" id="contact" data-reveal>
          <div className="container contact-layout">
            <div className="contact-copy">
              <Eyebrow light>Start a conversation</Eyebrow>
              <h2>Let’s shape<br />what <em>comes next.</em></h2>
              <p>Tell us what you are working toward. We will use the context to start a more useful conversation about the challenge, the opportunity and the next move.</p>
              <div className="contact-promise">
                <span><Check size={16} /> Start with your actual challenge</span>
                <span><Check size={16} /> Clear next steps</span>
                <span><Check size={16} /> No generic pitch deck</span>
              </div>
              <a className="contact-email" href="mailto:akinsify0511@gmail.com">Prefer email? Write to River Ways <ArrowUpRight size={15} /></a>
            </div>
            <form className="contact-form" onSubmit={submitBrief} noValidate>
              <div className="form-heading"><span>YOUR PROJECT BRIEF</span><span>01 / 01</span></div>
              <label className="honeypot-field" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateForm} /></label>
              <div className="form-row">
                <label>Your name<input name="name" autoComplete="name" value={form.name} onChange={updateForm} placeholder="Name" required /></label>
                <label>Work email<input name="email" type="email" autoComplete="email" value={form.email} onChange={updateForm} placeholder="you@company.com" required /></label>
              </div>
              <label>Company or brand<input name="company" autoComplete="organization" value={form.company} onChange={updateForm} placeholder="Your business" /></label>
              <label>What do you want to improve?
                <select name="goal" value={form.goal} onChange={updateForm}>
                  <option>Generate more qualified demand</option>
                  <option>Improve search and AI visibility</option>
                  <option>Increase website conversion</option>
                  <option>Build a Demand Intelligence system</option>
                  <option>Connect marketing and measurement</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>Anything we should know? <span className="optional">(optional)</span><textarea name="details" value={form.details} onChange={updateForm} rows="4" placeholder="Share a little context about the challenge or opportunity." /></label>
              {formError ? <p className="form-error" role="alert">{formError}</p> : null}
              {formSuccess ? <p className="form-success" role="status">{formSuccess}</p> : null}
              <button className="button button-primary form-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending your brief…' : 'Send my enquiry'} <ArrowRight size={17} /></button>
              <p className="form-note">Your brief is sent securely to River Ways. Please do not include passwords, payment details or other sensitive information. See our <a href="/privacy/">privacy notice</a>.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-top">
          <Brand />
          <p>Creative demand engineering for purposeful growth.</p>
          <a href="#home" className="back-top">Back to top <ArrowUpRight size={15} /></a>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} River Ways. All rights reserved.</span>
          <span>Find the current. Shape what follows.</span>
          <a href="/about/">About</a>
          <a href="/services/">Services</a>
          <a href="/work/">Work</a>
          <a href="/insights/">Insights</a>
          <a href="/field-guide/">Field Guide</a>
          <a href="/growth-diagnostic/">Growth Diagnostic</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <a href="/contact/">Contact</a>
        </div>
      </footer>
    </>
  );
}
