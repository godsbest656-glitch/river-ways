const SAFE_CONSTRAINTS = [
  'Draft only: requires agency and client review before use.',
  'Use verified product capabilities only; no feature claims were supplied by this adapter.',
  'Do not invent pricing, testimonials, endorsements, performance results or customer evidence.',
  'Do not publish, send outreach or commit funds without explicit approval.'
];

export async function prepareDraftArtifact(type, brief) {
  if (!['strategy', 'copy'].includes(type)) throw new Error('Unsupported draft adapter: ' + String(type));
  if (!brief || brief.approval?.status !== 'draft') throw new Error('A draft brief is required');
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
