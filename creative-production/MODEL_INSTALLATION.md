# Video model installation and activation runbook

**Purpose:** install and benchmark the named open-weight candidates locally without introducing paid inference services or exposing client assets.

## Global rules

1. Do not download model weights until the workstation's GPU, VRAM, RAM, free disk, OS, driver and CUDA/Python versions have been captured with `npm run creative:doctor`.
2. Keep each model's code, weights, VAE, text encoders, LoRAs and custom ComfyUI nodes in a separately inventoried directory. Record the exact upstream source, version, checkpoint filename, file size and SHA-256.
3. Review the model-weight licence independently from the inference code, ComfyUI nodes, VAE, text encoder and other bundled components.
4. Do not use remote inference or paid APIs. Keep ComfyUI bound to loopback; the adapter rejects non-loopback hosts.
5. Never place model weights, API credentials, client source files or private campaign assets in Git.
6. Keep `enabled: false` in `config/models.json` until the activation gates below are complete. `benchmarkAllowed: true` only permits a reviewed, explicit benchmark-only run; it does not grant client-delivery approval.

## Candidate matrix

| Candidate | Official minimum / notes | River Ways role |
|---|---|---|
| Wan 2.2 TI2V-5B | 24GB NVIDIA VRAM for the documented 720p single-GPU setup with memory-saving offload flags; 80GB-class GPUs can run faster without them | First benchmark on a 24GB+ NVIDIA workstation |
| HunyuanVideo 1.5 | 14GB NVIDIA VRAM with model offloading; Linux, Python 3.10+ and compatible CUDA/PyTorch | Conditional benchmark only; territory and distribution obligations must be cleared |
| LTX-2.5 | 32GB+ NVIDIA VRAM, 32GB RAM, 100GB free disk, CUDA 12.7+, Python 3.12+; recommended A100 80GB/H100, 64GB+ RAM, 200GB SSD | Benchmark only on a workstation that meets the minimum |

### Wan 2.2

- Upstream: https://github.com/Wan-Video/Wan2.2
- Start with TI2V-5B. Do not assume the A14B T2V/I2V variants have the same resource profile.
- Upstream example for TI2V-5B uses `--offload_model True --convert_model_dtype --t5_cpu` for 24GB-class single-GPU use.
- Model code/weights are described as Apache-2.0 upstream; verify the exact Hugging Face/ModelScope checkpoint card and every auxiliary component before activation.
- Official documentation: https://github.com/Wan-Video/Wan2.2

### HunyuanVideo 1.5

- Upstream: https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5
- Minimum documented GPU memory is 14GB with model offloading; upstream install is Linux, Python 3.10+ and CUDA/PyTorch compatible.
- Licence: Tencent Hunyuan Community License, not a generic OSI open-source licence. Territory excludes the EU, UK and South Korea.
- Distribution to third parties requires providing the licence; service deployment requires clear disclosure of the actual service provider and Tencent non-affiliation. The model/output may not be used outside the defined territory.
- Do not activate for global client campaigns. Obtain legal review of territory, client locations, end-user access and service disclosures first.
- Official licence: https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5/blob/main/LICENSE

### LTX-2.5

- Upstream: https://github.com/Lightricks/LTX-2
- Official minimum is 32GB+ NVIDIA VRAM, 32GB system RAM, 100GB free disk, CUDA 12.7+ and Python 3.12+.
- Repository code is Apache-2.0; model weights use the separate LTX-2.x Community License.
- Commercial use without a paid model licence is limited to entities below USD 10 million annual revenue; at/above the threshold, a paid agreement is required. Check current terms and all component licences.
- Official system requirements: https://docs.ltx.io/open-source-model/getting-started/system-requirements

## ComfyUI workflow handoff

For each model, create a workflow using the official model nodes/workflow instructions for the exact checkpoint and ComfyUI/custom-node versions. Export it as **API format** (not the UI workflow graph) and save it under:

```text
production/<campaign>/workflows/<model>-<checkpoint-version>.json
```

The workflow must reference the exact checkpoint filename passed to the runner. The runner records its SHA-256 and model metadata. It does not silently download weights or install custom nodes.

Example, after the model is enabled for benchmark-only use and the brief's hardware review is recorded:

```bash
node creative-production/bin/generate.mjs \
  --project ./production/<campaign> \
  --workflow workflows/wan-2.2-ti2v-5b.json \
  --model-id wan-2.2-ti2v-5b \
  --checkpoint <exact-checkpoint-filename> \
  --benchmark-only \
  --approved
```

The approved brief must record:
- `approval.status = approved`, `approvedBy` and `approvedAt`;
- `rights.clientAssetsApprovedForGeneration = true`;
- `rights.modelLicenseReviewed = true`;
- for benchmark-only inference, `rights.hardwareCompatibilityReviewed = true`.

## Benchmark protocol

Use one fixed prompt, seed, input image (if applicable), aspect ratio, resolution, duration, frame rate, sampler/scheduler, step count and output codec across models where the models permit equivalent settings. Record unavoidable differences.

Run at least three measured samples per model. Capture:
- exact checkpoint, workflow SHA-256 and ComfyUI/custom-node versions;
- GPU name, total VRAM, sampled peak VRAM, utilization and temperature;
- system RAM, generation duration, output bytes, failures and OOMs;
- human scores from 1–5 for visual quality, motion coherence, prompt fidelity, temporal stability and artifact cleanliness.

Use `npm run creative:benchmark -- validate <results.json>` to validate and score. A model with fewer than three runs is not eligible for ranking. Benchmark scores are decision support, not proof of licence compliance or client suitability.

## Activation gates

A model can be switched to `enabled: true` for production only after all are true:

- the actual workstation meets the exact model/checkpoint requirements;
- model, VAE, text encoder, LoRA and custom-node licences have been reviewed;
- client territory and campaign rights are compatible;
- three or more benchmark runs have been recorded and reviewed;
- outputs pass the FFprobe media QA and human creative review;
- the owner explicitly approves activation.

Benchmark-only generation remains marked `deliveryApproved: false`. Production generation also remains unapproved for delivery until a separate human review occurs.
