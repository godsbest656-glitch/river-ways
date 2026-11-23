const SAFE_CONSTRAINTS = [
  'Draft only: requires agency and client review before use.',
  'Use verified product capabilities only; no feature claims were supplied by this adapter.',
  'Do not invent pricing, testimonials, endorsements, performance results or customer evidence.',
  'Do not publish, send outreach or commit funds without explicit approval.'
];

export async function prepareDraftArtifact(type, brief) {
  if (!['strategy', 'copy', 'concept', 'storyboard'].includes(type)) throw new Error('Unsupported draft adapter: ' + String(type));
  if (!brief || brief.approval?.status !== 'draft') throw new Error('A draft brief is required');
  if (type === 'concept') {
    return {
      schemaVersion: '1.0', artifactType: 'creative-concept-draft', status: 'draft',
      campaign: brief.campaign.name, objective: brief.objective, audience: brief.audience,
      concepts: [
        { id: 'concept-01', title: 'The clear view', premise: brief.primaryMessage,
          narrative: 'Move from fragmented context to a clearer view of the business. Use only approved interface captures and verified product facts.',
          visualDirection: 'Premium editorial composition, deliberate camera movement, restrained motion and a clear focal point.',
          emotionalArc: ['complexity', 'recognition', 'clarity', 'next action'],
          proofRequired: ['Approved product interface capture', 'Verified capability statement'],
          risk: 'Do not imply capabilities that are not visible in approved product evidence.' },
        { id: 'concept-02', title: 'The decision moment', premise: 'Make the next business decision easier to understand.',
          narrative: 'Show a decision-maker moving from a specific business question to the approved product experience.',
          visualDirection: 'Human-centred framing, precise typography and a purposeful transition into the product interface.',
          emotionalArc: ['question', 'focus', 'understanding', 'confidence'],
          proofRequired: ['Approved user journey', 'Verified product demonstration'],
          risk: 'Do not imply guaranteed outcomes or automated decisions.' },
        { id: 'concept-03', title: 'One operating picture', premise: 'Bring the approved primary message into a coherent visual story.',
          narrative: 'Connect the audience problem, verified product evidence and one approved next step.',
          visualDirection: 'Modular editorial system with consistent type, spacing, colour and motion rules.',
          emotionalArc: ['separation', 'connection', 'understanding', 'action'],
          proofRequired: ['Approved product facts', 'Approved conversion destination'],
          risk: 'Do not suggest integrations or data coverage that have not been verified.' }
      ],
      selectionRequired: true,
      requiredBeforeApproval: ['Select one concept with the client.', 'Attach approved product captures and brand assets.', 'Verify every capability and proof point.', 'Approve the CTA and destination.'],
      constraints: [...SAFE_CONSTRAINTS, ...(brief.constraints ?? [])],
      source: { type: 'saved-project-brief', client: brief.client.name, campaign: brief.campaign.name }
    };
  }
  if (type === 'storyboard') {
    const beats = [
      ['01', 'The question', 'Establish one audience-relevant business question.', 'Use approved contextual footage or a typographic opening.'],
      ['02', 'The friction', 'Show the information gap without inventing a customer scenario.', 'Use abstracted, clearly illustrative fragments; no fabricated dashboard data.'],
      ['03', 'The reveal', 'Introduce the approved product experience.', 'Use a real, permission-cleared product capture.'],
      ['04', 'The evidence', 'Explain one verified capability from the approved brief.', 'Insert an approved screen recording and exact product wording.'],
      ['05', 'The value', 'Connect the verified capability to the audience objective without promising results.', 'Use a restrained visual summary; no invented metrics or testimonials.'],
      ['06', 'The next step', 'Present the approved call to action and destination.', 'Use only the confirmed CTA, URL and contact details.']
    ];
    return {
      schemaVersion: '1.0', artifactType: 'storyboard-draft', status: 'draft',
      campaign: brief.campaign.name, title: brief.primaryMessage,
      format: { durationSeconds: 30, aspectRatios: ['16:9', '9:16', '1:1'], frameRate: 30 },
      scenes: beats.map(([id, title, narrationIntent, visualDirection]) => ({
        id, title, durationSeconds: 5, narrationIntent, narration: null,
        visualDirection, onScreenCopy: null, assetRequirements: ['Approved brand assets', 'Rights-cleared media'],
        transition: 'purposeful-cut', generationStatus: 'blocked-pending-approval'
      })),
      audio: { music: null, voiceover: null, soundDesign: null, rightsStatus: 'not-reviewed' },
      productionNotes: ['This is a timing and narrative scaffold, not a rendered film.', 'Replace all null copy with approved wording.', 'Confirm aspect ratio, voice, music and media rights before production.'],
      requiredBeforeApproval: ['Select and approve a creative concept.', 'Supply verified product captures and approved claims.', 'Approve narration, on-screen copy and CTA.', 'Clear all music, footage, talent and territory rights.'],
      constraints: [...SAFE_CONSTRAINTS, ...(brief.constraints ?? [])],
      source: { type: 'saved-project-brief', client: brief.client.name, campaign: brief.campaign.name }
    };
  }
  if (type === 'strategy') {
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
      constraints: [...SAFE_CONSTRAINTS, ...(brief.constraints ?? [])],
      source: { type: 'saved-project-brief', client: brief.client.name, campaign: brief.campaign.name }
    };
  }
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
    constraints: [...SAFE_CONSTRAINTS, ...(brief.constraints ?? [])],
    source: { type: 'saved-project-brief', client: brief.client.name, campaign: brief.campaign.name }
  };
}
