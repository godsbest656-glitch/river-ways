import React, { useState } from "react";
import "./demand-intelligence.css";

const initial = { business: "", website: "", market: "", goal: "", challenge: "" };

export default function DemandIntelligence() {
  const [form, setForm] = useState(initial);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setAssessment(null);
    setBusy(true);
    try {
      const response = await fetch("/api/ai/demand-intelligence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || "The assessment could not be completed.");
      setAssessment(result.assessment);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rw-di" aria-labelledby="rw-di-title">
      <div className="rw-di-intro">
        <span className="rw-di-kicker">A first conversation with River Ways intelligence</span>
        <h2 id="rw-di-title">Find the pressure point.<br /><em>Decide what moves next.</em></h2>
        <p>Share a little context about your business. Demand Intelligence will help frame the challenge, identify plausible priorities and surface the questions worth answering.</p>
        <p className="rw-di-note">This is an initial AI-assisted assessment based on the information you provide—not a website audit, market-research report or verified performance review.</p>
      </div>
      <div className="rw-di-workspace">
        <form className="rw-di-form" onSubmit={submit}>
          <div className="rw-di-form-head"><span>BUSINESS CONTEXT</span><span>01 / 01</span></div>
          <label>Business or brand<input name="business" value={form.business} onChange={update} maxLength={160} required placeholder="e.g. Northstar Software" /></label>
          <label>Website <span>(optional)</span><input name="website" value={form.website} onChange={update} maxLength={240} placeholder="https://example.com" /></label>
          <label>Market or audience<input name="market" value={form.market} onChange={update} maxLength={160} required placeholder="e.g. B2B software teams in Europe" /></label>
          <label>What are you trying to achieve? <span>(optional)</span><input name="goal" value={form.goal} onChange={update} maxLength={240} placeholder="e.g. More qualified sales conversations" /></label>
          <label>What is the main growth challenge?<textarea name="challenge" value={form.challenge} onChange={update} maxLength={1200} required rows={4} placeholder="Tell us what is happening, what you have tried, and where progress feels stuck." /></label>
          <button className="button button-lime rw-di-submit" type="submit" disabled={busy}>{busy ? "Thinking through your brief…" : "Generate my first assessment"} <span aria-hidden="true">↗</span></button>
          <p className="rw-di-privacy">Your brief is processed to generate this response and is not stored as a conversation or added to the lead database. Daily usage limits apply.</p>
          {error && <p className="rw-di-error" role="alert">{error}</p>}
        </form>
        <div className="rw-di-result" aria-live="polite">
          {!assessment && !busy && <div className="rw-di-placeholder"><span className="rw-di-orbit" aria-hidden="true">✳</span><span className="rw-di-kicker">YOUR WORKING BRIEF</span><h3>Clarity starts with context.</h3><p>Your assessment will appear here, with observations, practical priorities and the questions that could sharpen the next decision.</p><div className="rw-di-placeholder-foot">CONTEXT → INTERPRETATION → NEXT MOVE</div></div>}
          {busy && <div className="rw-di-loading"><span className="rw-di-pulse" /><h3>Reading the brief</h3><p>Organising the context and evaluating possible next steps…</p></div>}
          {assessment && <div className="rw-di-output">
            <span className="rw-di-kicker">INITIAL DEMAND ASSESSMENT</span>
            <h3>{assessment.headline}</h3><p className="rw-di-summary">{assessment.summary}</p>
            {assessment.observations?.length > 0 && <div className="rw-di-output-group"><h4>What the context suggests</h4>{assessment.observations.map((item, index) => <article className="rw-di-observation" key={index}><strong>{item.point}</strong><p>{item.basis}</p><span>Confidence: {item.confidence}</span></article>)}</div>}
            {assessment.priorities?.length > 0 && <div className="rw-di-output-group"><h4>Where to start</h4>{assessment.priorities.map((item, index) => <article className="rw-di-priority" key={index}><span>0{index + 1}</span><div><strong>{item.action}</strong><p>{item.rationale}</p><small>Effort: {item.effort}</small></div></article>)}</div>}
            {assessment.questions?.length > 0 && <div className="rw-di-output-group"><h4>Questions worth answering</h4><ul>{assessment.questions.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}
            <p className="rw-di-limit">{assessment.limitations}</p>
            <a className="rw-di-next" href="#contact">Discuss this with River Ways <span aria-hidden="true">↗</span></a>
          </div>}
        </div>
      </div>
    </section>
  );
}
