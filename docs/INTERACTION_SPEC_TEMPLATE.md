# Interaction Specification Template

**Feature name:**  
**Owner:**  
**Version/date:**  
**Status:** discovery / design / build / test / released / retired

## 1. User problem and expected value
- Target user and context:
- What the user is trying to complete:
- Current friction:
- Expected benefit:
- Why an interactive pattern is better than a simpler page or form:

## 2. Behavior
- Entry point:
- Inputs/selections:
- Main flow:
- Output/result:
- Exit/restart/cancel behavior:
- Deep-link/share/save behavior, if any:
- Does the experience use real or simulated data? How is this disclosed?

## 3. State matrix
| State | Expected behavior | User feedback | Test evidence |
|---|---|---|---|
| Initial/default | | | |
| Focus/keyboard | | | |
| Loading | | | |
| Empty/no result | | | |
| Valid result/success | | | |
| Invalid input | | | |
| Network/provider failure | | | |
| Retry/cancel | | | |
| Reduced motion | | | |
| Optional script/media unavailable | | | |

## 4. Accessibility
- Semantic HTML/control pattern:
- Keyboard operation and focus:
- Accessible name/description and state:
- Screen-reader announcement:
- Contrast/touch target:
- Text equivalent for diagrams/charts:
- Reduced-motion behavior:
- Zoom/reflow/mobile behavior:
- Alternative for gesture, drag, canvas or audio/video:

## 5. Data/privacy/security
- Data collected:
- Is any sensitive/regulated data possible?
- Data destination and provider:
- Purpose, notice/consent and retention:
- Server-side validation/authorization:
- Rate limiting/anti-abuse:
- Share URL or analytics PII risk:
- Source/license/permission for external data:
- Abuse cases and safe failure:

## 6. Performance
- JS/media/third-party dependency:
- Loading strategy:
- Image/video dimensions/poster:
- Mobile/slow-network fallback:
- Motion/frame-rate constraints:
- Performance test conditions and expected budget:

## 7. Measurement
- Hypothesis:
- Primary success metric:
- Guardrail metrics:
- Events and allowed properties:
- Baseline and evaluation window:
- Known attribution/data limitations:

## 8. Acceptance and release
- Required functional tests:
- Browser/device matrix:
- Manual review:
- Evidence links/screenshots/traces:
- Rollback/disable mechanism:
- Reviewer:
- Release decision/date:
