import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, CircleAlert, FileImage, LoaderCircle, LogOut, MessageSquare, RefreshCw, ShieldCheck } from 'lucide-react';
import './client-review-portal.css';

const API = '/api/studio/portal';

async function request(path, options = {}) {
  const response = await fetch(API + path, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error === 'client_membership_required'
      ? 'Your reviewer access is inactive or does not include this workspace.'
      : payload.error || 'The request could not be completed.';
    throw new Error(message);
  }
  return payload;
}

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function AssetCard({ asset, onRefresh }) {
  const [preview, setPreview] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadComments = useCallback(async () => {
    try {
      const [commentResult, reviewResult] = await Promise.all([
        request('/assets/' + encodeURIComponent(asset.id) + '/comments'),
        request('/assets/' + encodeURIComponent(asset.id) + '/review')
      ]);
      setComments(commentResult.comments || []);
      setReviews(reviewResult.reviews || []);
    } catch (err) {
      setError(err.message);
    }
  }, [asset.id]);

  useEffect(() => {
    let active = true;
    let objectUrl = '';
    fetch(API + '/assets/' + encodeURIComponent(asset.id) + '/file', { credentials: 'same-origin' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Preview is unavailable for this asset.');
        return response.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        if (active) setPreview(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      })
      .catch((err) => { if (active) setError(err.message); });
    loadComments();
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [asset.id, loadComments]);

  async function submitComment(event) {
    event.preventDefault();
    if (!comment.trim()) return;
    setBusy(true); setError(''); setMessage('');
    try {
      await request('/assets/' + encodeURIComponent(asset.id) + '/comments', {
        method: 'POST', body: JSON.stringify({ comment: comment.trim() })
      });
      setComment('');
      await loadComments();
      setMessage('Comment sent to the River Ways team.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function submitReview(decision) {
    setBusy(true); setError(''); setMessage('');
    try {
      await request('/assets/' + encodeURIComponent(asset.id) + '/review', {
        method: 'POST',
        body: JSON.stringify({ decision, notes: notes.trim(), assetSha256: asset.sha256 })
      });
      setMessage(decision === 'approved' ? 'Your approval has been recorded for this version.' : 'Your revision request has been sent.');
      setNotes('');
      await loadComments();
      onRefresh();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <article className="crp-asset">
      <div className="crp-asset-preview">
        {preview && asset.media_type?.startsWith('image/') ? <img src={preview} alt={asset.filename || 'Creative preview'} /> :
          preview && asset.media_type?.startsWith('video/') ? <video src={preview} controls preload="metadata" /> :
          <div className="crp-file-placeholder"><FileImage size={28} /><span>{asset.filename || 'Creative asset'}</span></div>}
      </div>
      <div className="crp-asset-content">
        <div className="crp-asset-meta"><span>{asset.asset_type || 'Creative asset'}</span><span>Version {asset.version ?? '—'}</span></div>
        <h3>{asset.filename || 'Untitled creative'}</h3>
        <p className="crp-muted">Updated {formatDate(asset.updated_at || asset.created_at)} · {asset.status || 'In review'}</p>
        <div className="crp-version-hash">Version fingerprint: {asset.sha256 ? asset.sha256.slice(0, 16) + '…' : 'Unavailable'}</div>
        <label className="crp-label" htmlFor={'review-notes-' + asset.id}>Review notes <span>(optional)</span></label>
        <textarea id={'review-notes-' + asset.id} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={2000} placeholder="Share context for your decision or requested changes." />
        <div className="crp-review-actions">
          <button type="button" className="crp-button crp-button-primary" disabled={busy || !asset.sha256} onClick={() => submitReview('approved')}><CheckCircle2 size={16} /> Approve version</button>
          <button type="button" className="crp-button crp-button-secondary" disabled={busy || !asset.sha256} onClick={() => submitReview('changes_requested')}>Request changes</button>
        </div>
        <div className="crp-comments">
          <h4><MessageSquare size={16} /> Conversation ({comments.length})</h4>
          {reviews.length > 0 && <div className="crp-review-history"><strong>Review history</strong>{reviews.map((item) => <div className="crp-review-event" key={item.id}><span>{item.decision.replaceAll('_', ' ')}</span><p>{item.notes || 'No additional notes.'}</p><small>{item.reviewer_email} · {formatDate(item.created_at)}</small></div>)}</div>}
          {comments.length ? comments.map((item) => <div className="crp-comment" key={item.id}><p>{item.comment}</p><small>{item.reviewer_email} · {formatDate(item.created_at)}</small></div>) : <p className="crp-muted">No comments on this asset yet.</p>}
          <form onSubmit={submitComment}>
            <label className="crp-label" htmlFor={'comment-' + asset.id}>Add a comment</label>
            <textarea id={'comment-' + asset.id} value={comment} onChange={(event) => setComment(event.target.value)} maxLength={4000} placeholder="Write feedback about this creative…" required />
            <button className="crp-button crp-button-secondary" type="submit" disabled={busy || !comment.trim()}>Send comment</button>
          </form>
        </div>
        {message && <p className="crp-success" role="status">{message}</p>}
        {error && <p className="crp-error" role="alert">{error}</p>}
      </div>
    </article>
  );
}

export default function ClientReviewPortal() {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [projects, setProjects] = useState([]);
  const [assets, setAssets] = useState([]);
  const [projectId, setProjectId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const selectedClient = useMemo(() => clients.find((client) => client.id === clientId), [clients, clientId]);

  const loadClients = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await request('/clients');
      setClients(result.clients || []);
      setClientId((current) => result.clients?.some((client) => client.id === current) ? current : result.clients?.[0]?.id || '');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  const loadWorkspace = useCallback(async () => {
    if (!clientId) { setProjects([]); setAssets([]); return; }
    setLoading(true); setError('');
    try {
      const [projectResult, assetResult] = await Promise.all([
        request('/projects?clientId=' + encodeURIComponent(clientId)),
        request('/assets?clientId=' + encodeURIComponent(clientId))
      ]);
      setProjects(projectResult.projects || []);
      setAssets(assetResult.assets || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [clientId]);

  useEffect(() => { loadClients(); }, [loadClients]);
  useEffect(() => { loadWorkspace(); }, [loadWorkspace]);

  const visibleAssets = useMemo(() => projectId === 'all' ? assets : assets.filter((asset) => asset.project_id === projectId), [assets, projectId]);

  return (
    <main className="crp-shell">
      <header className="crp-header">
        <a href="/" className="crp-brand"><span className="crp-brand-mark">R</span><span>River Ways <small>CLIENT REVIEW</small></span></a>
        <a href="/" className="crp-exit"><LogOut size={16} /> Exit portal</a>
      </header>
      <section className="crp-main">
        <div className="crp-intro">
          <div className="crp-eyebrow"><ShieldCheck size={15} /> PRIVATE CLIENT WORKSPACE</div>
          <h1>Review the work.<br /><em>Shape what follows.</em></h1>
          <p>Explore the latest creative, share useful feedback and record a decision against the exact version you have reviewed.</p>
        </div>
        {loading && <div className="crp-state"><LoaderCircle className="crp-spin" /> Loading your workspace…</div>}
        {error && <div className="crp-state crp-state-error"><CircleAlert /> <span>{error}</span><button onClick={loadClients} type="button">Try again</button></div>}
        {!loading && !error && !clients.length && <div className="crp-empty"><ShieldCheck size={28} /><h2>No client workspace is assigned to this account.</h2><p>Ask your River Ways contact to confirm your reviewer access.</p></div>}
        {!loading && !error && selectedClient && <>
          <div className="crp-workspace-bar">
            <div><span>YOUR WORKSPACE</span><strong>{selectedClient.name}</strong></div>
            {clients.length > 1 && <label>Workspace<select value={clientId} onChange={(event) => { setClientId(event.target.value); setProjectId('all'); }} aria-label="Choose client workspace">{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>}
            <button type="button" className="crp-refresh" onClick={loadWorkspace}><RefreshCw size={15} /> Refresh</button>
          </div>
          <div className="crp-project-filter"><label>Filter by project<select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="all">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label><span>{visibleAssets.length} {visibleAssets.length === 1 ? 'asset' : 'assets'} available</span></div>
          {visibleAssets.length ? <div className="crp-assets">{visibleAssets.map((asset) => <AssetCard key={asset.id} asset={asset} onRefresh={loadWorkspace} />)}</div> : <div className="crp-empty"><FileImage size={28} /><h2>No creative assets are ready to review.</h2><p>When River Ways shares work with this workspace, it will appear here.</p></div>}
        </>}
        <p className="crp-security-note"><ShieldCheck size={14} /> Your access is private and limited to workspaces assigned to your reviewer account.</p>
      </section>
      <footer className="crp-footer"><a href="/">River Ways</a><span>Creative work, reviewed together.</span><a href="/privacy/">Privacy</a></footer>
    </main>
  );
}
