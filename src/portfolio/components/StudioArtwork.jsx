export function StudioArtwork({ variant }) {
  if (variant === "studio-brand-worlds") {
    return (
      <div className="studio-art studio-art-brand" aria-hidden="true">
        <span className="studio-art-index">STUDIO STUDY / 01</span>
        <span className="studio-brand-word">FORM<span> / </span>FIELD</span>
        <span className="studio-brand-rule" />
        <span className="studio-brand-note">IDENTITY<br />IN CONTEXT</span>
        <span className="studio-brand-disc" />
      </div>
    );
  }

  if (variant === "studio-campaign-worlds") {
    return (
      <div className="studio-art studio-art-campaign" aria-hidden="true">
        <span className="studio-art-index">STUDIO STUDY / 02</span>
        <span className="studio-campaign-small">A CLEAR IDEA<br />TRAVELS FURTHER.</span>
        <span className="studio-campaign-big">MAKE<br /><i>IT</i><br />MATTER.</span>
        <span className="studio-campaign-stamp">CAMPAIGN<br />SYSTEMS</span>
      </div>
    );
  }

  if (variant === "studio-digital-experiences") {
    return (
      <div className="studio-art studio-art-experience" aria-hidden="true">
        <span className="studio-art-index">STUDIO STUDY / 03</span>
        <div className="studio-interface">
          <div className="studio-interface-top"><i /><i /><i /><span>EXPERIENCE / 001</span></div>
          <div className="studio-interface-body">
            <span>FROM SIGNAL<br />TO <b>MEANING.</b></span>
            <div className="studio-interface-orbit"><i /><i /><i /></div>
          </div>
          <div className="studio-interface-bottom"><span>DISCOVER</span><span>EXPLORE ↗</span></div>
        </div>
        <span className="studio-experience-index">INTERACTION<br />& MOTION</span>
      </div>
    );
  }

  return null;
}
