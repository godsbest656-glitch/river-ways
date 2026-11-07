# River Ways HyperFrames composition rules

- This directory is a local HyperFrames project. Use the pinned HyperFrames CLI installed in `creative-production/node_modules`.
- Use `hyperframes lint` and `hyperframes check` after edits. The same composition must render deterministically when seeking to any frame.
- Use GSAP timelines registered in `window.__timelines`; do not use CSS keyframe animations, wall-clock timers, random values, or non-seekable animation.
- Keep all media, fonts and scripts local and version-pinned for final rendering. The starter's GSAP CDN reference is a pinned bootstrap reference; vendor the exact GSAP file locally before a production render if the workstation is offline or the campaign requires fully self-contained assets.
- Render locally only. Do not use HyperFrames cloud, Lambda, Cloud Run, publish, hosted rendering or paid remote services.
- Never put client assets in Git. Verify image, font, footage and audio rights.
- Do not render, publish or deliver client work without explicit human approval recorded in the production brief.
- Keep the SHAPED CURRENT direction, water/sea-sky blue palette, premium editorial hierarchy and River Ways brand spelling. Avoid generic SaaS gradients and decorative motion without narrative purpose.
