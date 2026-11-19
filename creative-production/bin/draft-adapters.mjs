const SAFE_CONSTRAINTS = [
  'Draft only: requires agency and client review before use.',
  'Use verified product capabilities only; no feature claims were supplied by this adapter.',
  'Do not invent pricing, testimonials, endorsements, performance results or customer evidence.',
  'Do not publish, send outreach or commit funds without explicit approval.'
];

function sourceOf(brief) {
  return { type: 'saved-project-brief', client: brief.client.name, campaign: brief.campaign.name };
}

function constraintsOf(brief) {
  return [...SAFE_CONSTRAINTS, ...(Array.isArray(brief.constraints) ? brief.constraints : [])];
}

function strategyDraft(brief) {
  return {
    schemaVersion: '1.0', artifactType: 'strategy-draft', status: 'draft',
    campaign: brief.campaign.name, objective: brief.objective, audience: brief.audience,
    primaryMessage: brief.primaryMessage, platforms: brief.platforms, deliverables: brief.deliverables,
    marketInputs: { targetTerritories: brief.campaign.targetTerritories ?? [], launchMarket: brief.campaign.launchMarket ?? null },
    requiredBeforeApproval: [
      'Verify product capabilities with the product owner.',
      'Prioritise audience segments using customer and market evidence.',
      'Confirm channel roles, cadence, conversion path and measurement owner.',
      'Confirm the demo destination, contact details and approved call to action.'
    ],
    constraints: constraintsOf(brief), source: sourceOf(brief)
  };
}

function copyDraft(brief) {
  return {
    schemaVersion: '1.0', artifactType: 'copy-foundation-draft', status: 'draft',
    campaign: brief.campaign.name,
    messageArchitecture: { approvedInput: brief.primaryMessage, supportingPillars: [], featureClaims: [], proofPoints: [], callsToAction: [] },
    channelInputs: brief.platforms.map(platform => ({
      platform, draftStatus: 'needs-human-copy',
      instruction: 'Create platform-native copy only after approved product facts, proof and CTA are supplied.'
    })),
    requiredBeforeApproval: [
      'Attach the verified product feature inventory.',
      'Supply approved product screenshots or demo evidence.',
      'Confirm contact details, destination URLs and conversion CTA.',
      'Review every claim and platform adaptation with the client.'
    ],
    constraints: constraintsOf(brief), source: sourceOf(brief)
  };
}

function conceptDraft(brief) {
  const territories = [
    { id: 'clarity-at-a-glance', title: 'Clarity at a glance', angle: 'Make the supplied primary message the organising idea; show clarity through composition, hierarchy and pacing.' },
    { id: 'the-business-picture', title: 'The business picture', angle: 'Explore a connected visual system that represents the audience context without inventing product screens or capabilities.' },
    { id: 'from-signal-to-action', title: 'From signal to action', angle: 'Build a narrative progression from the audience challenge to the supplied message and an approved next step.' }
  ];
  return {
    schemaVersion: '1.0', artifactType: 'creative-concept-draft', status: 'draft',
    campaign: brief.campaign.name, objective: brief.objective, audience: brief.audience,
    messageAnchor: brief.primaryMessage,
    conceptOptions: territories.map(option => ({
      ...option, status: 'needs-creative-director-review',
      visualGuardrails: [
        'Do not depict unverified product interfaces, metrics or capabilities.',
        'Use only client-approved logos, product captures and licensed assets.',
        'Treat any illustrative UI as clearly labelled conceptual artwork.'
      ],
      proofRequired: ['Approved product screenshots or demo capture', 'Verified feature inventory', 'Approved CTA and destination']
    })),
    selectionRequired: true, productionAllowed: false,
    requiredBeforeApproval: ['Select or revise one territory with the client.', 'Attach verified product evidence.', 'Confirm deliverables, aspect ratios, channels and CTA.'],
    constraints: constraintsOf(brief), source: sourceOf(brief)
  };
}

function storyboardDraft(brief) {
  const videoDeliverables = brief.deliverables.filter(item => /video|motion|film|reel|animation/i.test(String(item.type || '')));
  const sequence = [
    { beat: 'opening', purpose: 'Establish the audience context or tension.', visualDirection: 'Use an approved contextual visual; do not imply an unverified product result.' },
    { beat: 'message', purpose: 'Introduce the supplied campaign message.', visualDirection: 'Use the exact approved message and deliberate typographic composition.' },
    { beat: 'evidence', purpose: 'Show a verified product fact or approved demonstration.', visualDirection: 'Placeholder until product screenshots, demo footage or verified evidence are supplied.' },
    { beat: 'next-step', purpose: 'Present the approved conversion action.', visualDirection: 'Placeholder until the client approves the CTA, destination and contact details.' }
  ];
  return {
    schemaVersion: '1.0', artifactType: 'storyboard-outline-draft', status: 'draft',
    campaign: brief.campaign.name, messageAnchor: brief.primaryMessage,
    videoDeliverables: videoDeliverables.map((deliverable, index) => ({
      deliverableIndex: index, specification: deliverable,
      scenes: sequence.map((scene, sceneIndex) => ({ scene: sceneIndex + 1, ...scene, status: 'needs-human-development' }))
    })),
    note: videoDeliverables.length ? 'This is a structural outline, not a production-ready storyboard.' : 'No video or motion deliverable was identified in the saved brief; no scenes have been assigned.',
    productionAllowed: false,
    requiredBeforeApproval: ['Confirm video deliverable, duration and aspect ratio.', 'Attach verified product footage or screenshots for the evidence beat.', 'Approve script, voice, music, captions, CTA and usage rights.'],
    constraints: constraintsOf(brief), source: sourceOf(brief)
  };
}

export async function prepareDraftArtifact(type, brief) {
  if (!['strategy', 'copy', 'concept', 'storyboard'].includes(type)) {
    throw new Error('Unsupported draft adapter: ' + String(type));
  }
  if (!brief || brief.approval?.status !== 'draft') throw new Error('A draft brief is required');
  if (!brief.client?.name || !brief.campaign?.name || !Array.isArray(brief.platforms) || !Array.isArray(brief.deliverables)) {
    throw new Error('Draft brief is missing required source fields');
  }
  if (type === 'strategy') return strategyDraft(brief);
  if (type === 'copy') return copyDraft(brief);
  if (type === 'concept') return conceptDraft(brief);
  return storyboardDraft(brief);
}
