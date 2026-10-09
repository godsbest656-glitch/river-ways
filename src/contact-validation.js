const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_GOALS = new Set([
  'Generate more qualified demand',
  'Improve search and AI visibility',
  'Increase website conversion',
  'Build a Demand Intelligence system',
  'Connect marketing and measurement',
  'Something else',
]);

function cleanSingleLine(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanParagraph(value, maxLength) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .replace(/\r\n?/g, '\n')
    .trim()
    .slice(0, maxLength);
}

export function validateContactPayload(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, message: 'Review the enquiry details and try again.' };
  }

  const name = cleanSingleLine(input.name, 120);
  const email = cleanSingleLine(input.email, 254).toLowerCase();
  const company = cleanSingleLine(input.company, 120);
  const goal = cleanSingleLine(input.goal, 80);
  const details = cleanParagraph(input.details, 4000);

  if (!name) return { ok: false, message: 'Add your name to continue.' };
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { ok: false, message: 'Add a valid email address to continue.' };
  }
  if (!ALLOWED_GOALS.has(goal)) {
    return { ok: false, message: 'Choose one of the available project goals.' };
  }
  if (String(input.details ?? '').length > 8000) {
    return { ok: false, message: 'Please shorten the context to 8,000 characters or fewer.' };
  }

  return {
    ok: true,
    value: { name, email, company, goal, details },
  };
}
