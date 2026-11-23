const SAFE_ID = /^[a-z0-9][a-z0-9-]{0,63}$/;

function requireText(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(label + ' must be a non-empty string');
  return value.trim();
}

export function createProductionHandoffManifest(storyboard, {
  clientName,
  campaignName,
  projectId = null,
  conceptId = null
} = {}) {
  if (!storyboard || storyboard.artifactType !== 'storyboard-draft' || !Array.isArray(storyboard.scenes) || storyboard.scenes.length === 0) {
    throw new Error('A storyboard with scenes is required');
  }
  const client = requireText(clientName, 'clientName');
  const campaign = requireText(campaignName, 'campaignName');
  if (projectId !== null && (typeof projectId !== 'string' || !SAFE_ID.test(projectId))) {
    throw new Error('projectId must be a safe identifier');
  }
  if (conceptId !== null && (typeof conceptId !== 'string' || !SAFE_ID.test(conceptId))) {
    throw new Error('conceptId must be a safe identifier');
  }

  const shots = storyboard.scenes.map((scene, index) => {
    const shotId = requireText(scene.id, 'scene id');
    if (!SAFE_ID.test(shotId)) throw new Error('Scene id must be a safe identifier');
    if (!Number.isFinite(scene.durationSeconds) || scene.durationSeconds <= 0) {
      throw new Error('Scene duration must be a positive number');
    }
    if (!Array.isArray(scene.assetRequirements) || scene.assetRequirements.length === 0) {
      throw new Error('Each shot requires at least one asset requirement');
    }
    const assets = scene.assetRequirements.map((asset) => {
      if (!asset || typeof asset.assetId !== 'string' || !SAFE_ID.test(asset.assetId)) {
        throw new Error('Shot asset assetId must be a safe identifier');
      }
      const role = requireText(asset.role, 'asset role');
      const mediaType = requireText(asset.mediaType, 'asset mediaType');
      const source = requireText(asset.source, 'asset source');
      return {
        assetId: asset.assetId,
        role,
        mediaType,
        required: asset.required === true,
        source,
        rightsStatus: asset.rightsStatus ?? 'not-reviewed',
        selectedAssetPath: null,
        approvedBy: null,
        approvedAt: null
      };
    });
    const prompt = scene.promptSpec;
    if (!prompt || prompt.status !== 'template-needs-approved-inputs' ||
        !Array.isArray(prompt.requiredInputs) || prompt.requiredInputs.length === 0) {
      throw new Error('Each shot requires a blocked prompt specification with required inputs');
    }
    return {
      shotNumber: index + 1,
      shotId,
      title: requireText(scene.title, 'scene title'),
      timeline: { startSeconds: storyboard.scenes.slice(0, index).reduce((sum, item) => sum + item.durationSeconds, 0), durationSeconds: scene.durationSeconds },
      visualIntent: requireText(scene.narrationIntent, 'scene intent'),
      assets,
      promptSpec: {
        status: prompt.status,
        task: prompt.task,
        subject: prompt.subject ?? null,
        sceneIntent: prompt.sceneIntent,
        composition: prompt.composition,
        styleReference: prompt.styleReference,
        cameraOrMotion: prompt.cameraOrMotion,
        lighting: prompt.lighting,
        aspectRatio: prompt.aspectRatio,
        durationSeconds: prompt.durationSeconds,
        negativePrompt: prompt.negativePrompt,
        requiredInputs: [...prompt.requiredInputs]
      },
      generation: { status: 'blocked-pending-approval', jobId: null },
      approval: { conceptApproved: false, shotApproved: false, rightsCleared: false }
    };
  });

  return {
    schemaVersion: '1.0',
    artifactType: 'creative-production-handoff',
    status: 'blocked-pending-approval',
    client,
    campaign,
    projectId,
    conceptId,
    sourceStoryboard: { artifactType: storyboard.artifactType, status: storyboard.status },
    output: { durationSeconds: storyboard.format?.durationSeconds ?? shots.reduce((sum, shot) => sum + shot.timeline.durationSeconds, 0), aspectRatios: storyboard.format?.aspectRatios ?? [], frameRate: storyboard.format?.frameRate ?? null },
    shots,
    globalRequirements: {
      approvedBrief: false,
      approvedConcept: false,
      approvedBrandKit: false,
      factualClaimsVerified: false,
      mediaRightsCleared: false,
      audioRightsCleared: false,
      finalDeliveryApproved: false
    },
    releaseGate: {
      generationAllowed: false,
      deliveryAllowed: false,
      blockingReasons: [
        'Approve the campaign brief and selected concept.',
        'Attach and approve every required shot asset.',
        'Verify all claims and clear media, talent, music and territory rights.',
        'Approve each shot prompt before generation.'
      ]
    }
  };
}

export function validateProductionHandoffManifest(manifest) {
  const errors = [];
  if (manifest?.artifactType !== 'creative-production-handoff') errors.push('artifactType must be creative-production-handoff');
  if (manifest?.status !== 'blocked-pending-approval') errors.push('handoff must remain blocked-pending-approval');
  if (!Array.isArray(manifest?.shots) || manifest.shots.length === 0) errors.push('shots must be a non-empty array');
  for (const shot of manifest?.shots ?? []) {
    if (shot.generation?.status !== 'blocked-pending-approval') errors.push('shot ' + shot.shotId + ' must remain generation-blocked');
    if (!Array.isArray(shot.assets) || shot.assets.some(asset => asset.rightsStatus !== 'approved' || !asset.selectedAssetPath)) {
      errors.push('shot ' + shot.shotId + ' has missing or unapproved assets');
    }
    if (shot.promptSpec?.status !== 'approved') errors.push('shot ' + shot.shotId + ' prompt is not approved');
  }
  if (manifest?.releaseGate?.generationAllowed !== false || manifest?.releaseGate?.deliveryAllowed !== false) {
    errors.push('generation and delivery must remain disabled in draft handoff');
  }
  return { valid: errors.length === 0, errors };
}
