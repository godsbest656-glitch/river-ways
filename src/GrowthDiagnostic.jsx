import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

const questions = [
  {
    title: 'How do ideal customers discover you?',
    context: 'Think about how consistently the right people find your business.',
    area: 'Discovery',
    options: [
      { label: 'We have a clear, measured mix of channels.', score: 0 },
      { label: 'Results depend on a few unpredictable activities.', score: 1 },
      { label: 'Ideal customers often struggle to find us.', score: 2 },
    ],
  },
  {
    title: 'What happens after someone visits your website?',
    context: 'Consider how easily a visitor moves from interest to a useful next step.',
    area: 'Conversion',
    options: [
      { label: 'A clear path leads visitors to a relevant next step.', score: 0 },
      { label: 'Some pages convert, but others feel disconnected.', score: 1 },
      { label: 'We have not clearly defined or measured the journey.', score: 2 },
    ],
  },
  {
    title: 'Can you connect marketing activity to outcomes?',
    context: 'Separate business results from activity and surface-level reporting.',
    area: 'Measurement',
    options: [
      { label: 'We track qualified actions and downstream outcomes.', score: 0 },
      { label: 'We report traffic and leads, but attribution is patchy.', score: 1 },
      { label: 'We mostly report activity and surface-level metrics.', score: 2 },
    ],
  },
  {
    title: 'How do you identify active market intent?',
    context: 'Think about public questions, comparison behaviour and expressed needs.',
    area: 'Demand intelligence',
    options: [
      { label: 'We monitor relevant signals with context and human review.', score: 0 },
      { label: 'We monitor selected channels, but inconsistently.', score: 1 },
      { label: 'We mostly wait for people to contact us first.', score: 2 },
    ],
  },
  {
    title: 'What happens when a potential lead appears?',
    context: 'A good system makes responsibility and follow-up predictable.',
    area: 'Follow-up',
    options: [
      { label: 'A clear owner and timely follow-up are in place.', score: 0 },
      { label: 'Follow-up depends on individual or team habits.', score: 1 },
      { label: 'We lack a dependable qualification and follow-up process.', score: 2 },
    ],
  },
];

const actionByArea = {
  Discovery: 'Map the highest-value audience questions to a clearer discovery and content plan.',
  Conversion: 'Audit one important visitor journey and remove the biggest source of friction.',
  Measurement: 'Choose one qualified business outcome and connect the activity that influences it.',
  'Demand intelligence': 'Start with a small set of permitted public signals and a human review process.',
  'Follow-up': 'Define lead ownership, qualification criteria and a dependable next-step workflow.',
};

export default function GrowthDiagnostic() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);

  const totalScore = questions.reduce((sum, question, index) => (
    sum + (answers[index] ?? 0)
  ), 0);
  const answeredCount = Object.keys(answers).length;
  const priorities = questions
    .map((question, index) => ({ ...question, score: answers[index] ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  function choose(score) {
    setAnswers((previous) => ({ ...previous, [current]: score }));
  }

  function startAgain() {
    setCurrent(0);
    setAnswers({});
    setComplete(false);
  }

  return (
    <section className="section diagnostic-section" id="diagnostic" aria-labelledby="diagnostic-title">
      <div className="container diagnostic-layout">
        <div className="diagnostic-intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> A practical starting point</div>
          <h2 id="diagnostic-title">Find the gap.<br /><em>Choose the next move.</em></h2>
          <p>
            Five quick questions to help you reflect on discovery, conversion,
            measurement, market signals and follow-up. Get a directional
            starting point—without handing over your data.
          </p>
          <div className="diagnostic-trust"><Sparkles size={17} /> Your answers stay in this page and are not submitted.</div>
        </div>

        <div className="diagnostic-card">
          {!complete ? (
            <>
              <div className="diagnostic-card-top">
                <span>GROWTH READINESS CHECK</span>
                <span>{String(current + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}</span>
              </div>
              <div
                className="diagnostic-progress"
                role="progressbar"
                aria-label="Diagnostic progress"
                aria-valuemin={0}
                aria-valuemax={questions.length}
                aria-valuenow={answeredCount}
              >
                <span style={{ width: (answeredCount / questions.length) * 100 + '%' }} />
              </div>
              <div className="diagnostic-question" key={current}>
                <span className="diagnostic-area">{questions[current].area}</span>
                <h3>{questions[current].title}</h3>
                <p>{questions[current].context}</p>
                <div className="diagnostic-options" role="group" aria-label={questions[current].title}>
                  {questions[current].options.map((option) => (
                    <button
                      type="button"
                      key={option.score}
                      className={'diagnostic-option ' + (answers[current] === option.score ? 'selected' : '')}
                      aria-pressed={answers[current] === option.score}
                      onClick={() => choose(option.score)}
                    >
                      <span className="diagnostic-option-marker" aria-hidden="true" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="diagnostic-controls">
                <button type="button" className="diagnostic-back" onClick={() => setCurrent((index) => Math.max(0, index - 1))} disabled={current === 0}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="button"
                  className="button button-lime diagnostic-next"
                  disabled={answers[current] === undefined}
                  onClick={() => current === questions.length - 1 ? setComplete(true) : setCurrent((index) => index + 1)}
                >
                  {current === questions.length - 1 ? 'See my priorities' : 'Next question'} <ArrowRight size={16} />
                </button>
              </div>
              <p className="diagnostic-disclaimer">A self-reflection tool, not an audit or a performance prediction.</p>
            </>
          ) : (
            <div className="diagnostic-result" aria-live="polite">
              <div className="diagnostic-card-top">
                <span>YOUR REFLECTION SUMMARY</span>
                <span>{answeredCount} / {questions.length} ANSWERED</span>
              </div>
              <div className="diagnostic-score-row">
                <div>
                  <span className="diagnostic-area">READINESS SIGNAL</span>
                  <h3>{totalScore <= 2 ? 'Strong foundations' : totalScore <= 6 ? 'Room to connect the system' : 'Prioritise the foundations'}</h3>
                </div>
                <div className="diagnostic-score" aria-label={'Reflection score ' + totalScore + ' out of 10'}>
                  <strong>{totalScore}</strong><span>/ 10</span>
                </div>
              </div>
              <p>
                {totalScore <= 2
                  ? 'Your answers suggest several foundations are in place. The next step is to validate consistency with real journey and outcome data.'
                  : totalScore <= 6
                    ? 'Your answers suggest some parts of the growth journey are working, while others may be disconnected. Pick one important gap and improve it end-to-end.'
                    : 'Your answers suggest the biggest gains may come from clarifying the basics before adding more channels, campaigns or automation.'}
              </p>
              <h4>Suggested areas to review</h4>
              <div className="diagnostic-priorities">
                {priorities.map((item) => (
                  <article key={item.area}>
                    <div><span>{item.area}</span><strong>{item.score === 0 ? 'Maintain' : item.score === 1 ? 'Improve' : 'Prioritise'}</strong></div>
                    <p>{item.score === 0
                      ? 'Keep this practice visible in regular reviews and validate it with real evidence.'
                      : actionByArea[item.area]}</p>
                  </article>
                ))}
              </div>
              <div className="diagnostic-result-actions">
                <a className="button button-lime" href="#contact">Discuss these priorities <ArrowRight size={16} /></a>
                <button type="button" className="diagnostic-back" onClick={startAgain}><RotateCcw size={15} /> Start again</button>
              </div>
              <p className="diagnostic-disclaimer">This score is based only on your selections. It is not benchmarked against other businesses, saved, or sent to River Ways.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
