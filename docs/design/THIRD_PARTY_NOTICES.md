# Third-party notices — AI development resources

## Elaya Design — AI Design Skills and Redesign Skill

The River Ways project skills are original adaptations informed by the following MIT-licensed repositories:

- https://github.com/elayadesign/ai-design-skills
- https://github.com/elayadesign/redesign-skill

Copyright (c) 2026 Elaya

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Upstream attribution within Elaya Design material

The upstream landing-page and redesign materials acknowledge work informed by:

- Leonxlnx / Leon Lin, https://github.com/Leonxlnx/taste-skill

Copyright (c) 2026 Leonxlnx

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Agent Skills format

The project follows the public Agent Skills folder and `SKILL.md` frontmatter convention. No code or documentation from the specification repository is reproduced here.

- https://github.com/agentskills/agentskills
- Specification: https://github.com/agentskills/agentskills/blob/main/docs/specification.mdx


## Browser testing and accessibility development dependencies

The project uses the following development-only tools. They are not included in the production runtime bundle:

- Playwright Test `@playwright/test@1.64.1` — Apache-2.0. https://github.com/microsoft/playwright
- axe Playwright integration `@axe-core/playwright@4.14.0` — MPL-2.0. https://github.com/dequelabs/axe-core-npm

Retain the package-provided license files when installing dependencies. These tools are used for automated browser regression and accessibility checks; they do not replace manual accessibility review.


## Performance and SEO development dependency

- Lighthouse CI `@lhci/cli@0.16.0` — Apache-2.0. https://github.com/GoogleChrome/lighthouse-ci

Lighthouse reports are generated against the built static site. The project uses the filesystem output target; no temporary public report storage or external Lighthouse CI server is configured.
