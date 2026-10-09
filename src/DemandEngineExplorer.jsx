import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BarChart3, Compass, Layers3, MousePointer2, Search, Target, TrendingUp } from 'lucide-react';

const stages = [
  {
    number: '01',
    label: 'Align',
    icon: Compass,
    headline: 'Start with the business outcome.',
    summary: 'Agree on the audience, the offer, the problem worth solving and the signal that would show progress.',
    input: 'Business goal, audience insight, offer and constraints.',
    output: 'A focused growth brief and a shared definition of success.',
    checkpoint: 'Would this work matter to the customer and the business?',
  },
  {
    number: '02',
    label: 'Discover',
    icon: Search,
    headline: 'Find where demand is forming.',
    summary: 'Understand how people search, compare, ask for help and describe the problems your service can solve.',
    input: 'Search questions, customer conversations and source-permitted market signals.',
    output: 'Priority audience questions, discovery gaps and relevant intent themes.',
    checkpoint: 'Is this a meaningful signal—or just attention?',
  },
  {
    number: '03',
    label: 'Connect',
    icon: Layers3,
    headline: 'Give every channel a role.',
    summary: 'Connect positioning, content, search, social and paid activity around one understandable journey.',
    input: 'Priority questions, message, channel capability and approved creative.',
    output: 'A joined-up message and distribution plan with useful destinations.',
    checkpoint: 'Does each activity lead somewhere useful?',
  },
  {
    number: '04',
    label: 'Convert',
    icon: MousePointer2,
    headline: 'Make the next step easier.',
    summary: 'Remove the friction between interest and action through clearer information, useful tools and accessible interfaces.',
    input: 'Visitor intent, page content, proof, service scope and CTA.',
    output: 'A focused experience, clear next step and reliable enquiry journey.',
    checkpoint: 'Can the visitor act with confidence and without unnecessary friction?',
  },
  {
    number: '05',
    label: 'Measure',
    icon: BarChart3,
    headline: 'Measure what moves the goal.',
    summary: 'Connect meaningful activity to qualified actions and business outcomes rather than relying on surface-level numbers alone.',
    input: 'Defined conversion events, baselines, CRM outcomes and agreed constraints.',
    output: 'A view of performance, lead quality and where the journey loses momentum.',
    checkpoint: 'What evidence would change our next decision?',
  },
  {
    number: '06',
    label: 'Improve',
    icon: TrendingUp,
    headline: 'Feed learning back into the system.',
    summary: 'Use evidence, user feedback and sales outcomes to remove what is not working and strengthen what is.',
    input: 'Observed results, false positives, user feedback and delivery lessons.',
    output: 'Prioritised improvements and the next experiment to run.',
    checkpoint: 'What should we keep, change, stop or test next?',
  },
];

export default function DemandEngineExplorer() {
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const Icon = stage.icon;

  function move(delta) {
    setActive((previous) => (previous + delta + stages.length) % stages.length);
  }

  return (
    <section className="section engine-explorer" id="engine" aria-labelledby="engine-explorer-title">
      <div className="container">
        <div className="engine-explorer-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> The River Ways model</div>
            <h2 id="engine-explorer-title">Explore the system.<br /><em>See how the parts connect.</em></h2>
          </div>
          <p>
            Demand Engineering is not one campaign or channel. Explore the six connected stages and see
            how each stage turns a business question into a useful output for the next.
          </p>
        </div>

        <div className="engine-explorer-layout">
          <div className="engine-stage-grid" role="group" aria-label="Demand Engineering stages">
            {stages.map((item, index) => {
              const StageIcon = item.icon;
              return (
                <button
                  type="button"
                  key={item.number}
                  className={'engine-stage-card ' + (active === index ? 'engine-stage-active' : '')}
                  aria-pressed={active === index}
                  aria-controls="engine-stage-detail"
                  onClick={() => setActive(index)}
                >
                  <span className="engine-stage-top"><span>{item.number}</span><StageIcon size={19} aria-hidden="true" /></span>
                  <strong>{item.label}</strong>
                  <span>{item.summary.split('.')[0]}.</span>
                  <span className="engine-stage-open">{active === index ? 'Viewing stage' : 'Explore stage'} <ArrowRight size={13} aria-hidden="true" /></span>
                </button>
              );
            })}
          </div>

          <article className="engine-stage-detail" id="engine-stage-detail" aria-live="polite" aria-atomic="true">
            <div className="engine-detail-head">
              <div className="engine-detail-icon"><Icon size={22} aria-hidden="true" /></div>
              <div>
                <span className="engine-detail-kicker">STAGE {stage.number} / {String(stages.length).padStart(2, '0')}</span>
                <h3>{stage.headline}</h3>
              </div>
            </div>
            <p className="engine-detail-summary">{stage.summary}</p>
            <div className="engine-input-output">
              <div>
                <span>THE INPUT</span>
                <p>{stage.input}</p>
              </div>
              <div>
                <span>THE OUTPUT</span>
                <p>{stage.output}</p>
              </div>
            </div>
            <div className="engine-checkpoint">
              <Target size={17} aria-hidden="true" />
              <div><span>THE CHECKPOINT</span><p>{stage.checkpoint}</p></div>
            </div>
            <div className="engine-explorer-controls">
              <button type="button" className="engine-control-quiet" onClick={() => move(-1)}><ArrowLeft size={15} /> Previous</button>
              <span aria-label={'Stage ' + (active + 1) + ' of ' + stages.length}>{active + 1} of {stages.length}</span>
              <button type="button" className="engine-control-next" onClick={() => move(1)}>Next stage <ArrowRight size={15} /></button>
            </div>
          </article>
        </div>
        <p className="engine-explorer-note">This model describes the working approach. It does not imply that third-party data sources, monitoring integrations or outcome tracking are already connected to this website.</p>
      </div>
    </section>
  );
}
