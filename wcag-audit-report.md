# WCAG Accessibility Audit Report

**Date:** 2026-07-06
**Tool:** axe-core (WCAG 2.0 A/AA + WCAG 2.1 A/AA)
**Pages Tested:** 12

## Summary

| Page | Light Violations | Dark Violations | Pass/Fail |
|------|:-:|:-:|:-:|
| Main Portfolio (index.html) | 0 | 0 | ✅ Pass |
| H5P Interactive Timeline | 0 | 0 | ✅ Pass |
| AI Literacy Course | 0 | 0 | ✅ Pass |
| Data Privacy Compliance | 0 | 0 | ✅ Pass |
| Giving Constructive Feedback | 0 | 0 | ✅ Pass |
| Interactive Quiz (H5P) | 0 | 0 | ✅ Pass |
| IELTS Speaking Masterclass | 0 | 0 | ✅ Pass |
| IELTS Portfolio Index | 0 | 0 | ✅ Pass |
| Learning Analytics Dashboard | 4 | 4 | ⚠️ Fail |
| Customer Service De-Escalation Mastery | 0 | 0 | ✅ Pass |
| AI Ethics Training | 0 | 0 | ✅ Pass |
| Workplace Safety SCORM Course | 0 | 0 | ✅ Pass |

**Overall: 11 passed, 1 failed** (8 total violations)

## Critical & Serious Issues

### Learning Analytics Dashboard (light theme)

- **aria-command-name** (serious): ARIA commands must have an accessible name
  - Affected elements: 48
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-command-name?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#f5`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#f5`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#f5`

- **aria-required-parent** (critical): Certain ARIA roles must be contained by particular parents
  - Affected elements: 131
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-required-parent?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#fa0707" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#8b572a" fill-opacity="1" stroke="#fa`

- **color-contrast** (serious): Elements must meet minimum color contrast ratio thresholds
  - Affected elements: 12
  - Reference: https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=axeAPI
  - `<div class="MuiAlert-message css-1xsto0d"> We use cookies only for the purpose of carrying out communication or which ar`
  - `<h4 class="MuiTypography-root MuiTypography-h4 css-1jzuq4b">Portfolio Testing Overview</h4>`
  - `<p class="MuiTypography-root MuiTypography-body1 css-haezez">This dashboard will show charts across all the data in the `

- **nested-interactive** (serious): Interactive controls must not be nested
  - Affected elements: 4
  - Reference: https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=axeAPI
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-labelledby="id-606-title"`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="37" aria-valuet`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuete`

### Learning Analytics Dashboard (dark theme)

- **aria-command-name** (serious): ARIA commands must have an accessible name
  - Affected elements: 48
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-command-name?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#f5`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#f5`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#f5`

- **aria-required-parent** (critical): Certain ARIA roles must be contained by particular parents
  - Affected elements: 131
  - Reference: https://dequeuniversity.com/rules/axe/4.11/aria-required-parent?application=axeAPI
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#fa0707" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#f5a623" fill-opacity="1" stroke="#fa`
  - `<g class="amcharts-Sprite-group amcharts-Container-group" stroke-opacity="1" fill="#8b572a" fill-opacity="1" stroke="#fa`

- **color-contrast** (serious): Elements must meet minimum color contrast ratio thresholds
  - Affected elements: 12
  - Reference: https://dequeuniversity.com/rules/axe/4.11/color-contrast?application=axeAPI
  - `<div class="MuiAlert-message css-1xsto0d"> We use cookies only for the purpose of carrying out communication or which ar`
  - `<h4 class="MuiTypography-root MuiTypography-h4 css-1jzuq4b">Portfolio Testing Overview</h4>`
  - `<p class="MuiTypography-root MuiTypography-body1 css-haezez">This dashboard will show charts across all the data in the `

- **nested-interactive** (serious): Interactive controls must not be nested
  - Affected elements: 4
  - Reference: https://dequeuniversity.com/rules/axe/4.11/nested-interactive?application=axeAPI
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-labelledby="id-606-title"`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="37" aria-valuet`
  - `<g class="amcharts-Sprite-grou..." role="scrollbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuete`

## Detailed Breakdown

### Main Portfolio (index.html)
- **URL:** /
- **Tab-focusable elements:** 41

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### H5P Interactive Timeline
- **URL:** /h5p.html
- **Tab-focusable elements:** 2

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 0
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 0

### AI Literacy Course
- **URL:** /ai-literacy/index.html
- **Tab-focusable elements:** 27

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### Data Privacy Compliance
- **URL:** /data-privacy-compliance/index.html
- **Tab-focusable elements:** 8

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### Giving Constructive Feedback
- **URL:** /giving-constructive-feedback/index.html
- **Tab-focusable elements:** 19

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### Interactive Quiz (H5P)
- **URL:** /interactive-quiz/index.html
- **Tab-focusable elements:** 38

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 2
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 2

### IELTS Speaking Masterclass
- **URL:** /ielts-masterclass/index.html
- **Tab-focusable elements:** 10

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 1
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 1

### IELTS Portfolio Index
- **URL:** /ielts-masterclass/portfolio_index.html
- **Tab-focusable elements:** 6

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 0
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 0

### Learning Analytics Dashboard
- **URL:** /learning-analytics/index.html
- **Tab-focusable elements:** 119

#### ☀️ Light Theme
- Violations: 4
- Incomplete: 1

| ID | Impact | Help | Nodes |
|----|--------|------|:----:|
| aria-command-name | serious | ARIA commands must have an accessible name | 48 |
| aria-required-parent | critical | Certain ARIA roles must be contained by particular parents | 131 |
| color-contrast | serious | Elements must meet minimum color contrast ratio thresholds | 12 |
| nested-interactive | serious | Interactive controls must not be nested | 4 |

#### 🌙 Dark Theme
- Violations: 4
- Incomplete: 1

| ID | Impact | Help | Nodes |
|----|--------|------|:----:|
| aria-command-name | serious | ARIA commands must have an accessible name | 48 |
| aria-required-parent | critical | Certain ARIA roles must be contained by particular parents | 131 |
| color-contrast | serious | Elements must meet minimum color contrast ratio thresholds | 12 |
| nested-interactive | serious | Interactive controls must not be nested | 4 |


### Customer Service De-Escalation Mastery
- **URL:** /customer-service-mastery.html
- **Tab-focusable elements:** 6

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 0
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 0

### AI Ethics Training
- **URL:** /ai-ethics-training.html
- **Tab-focusable elements:** 6

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 0
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 0

### Workplace Safety SCORM Course
- **URL:** /workplace-safety-scorm/
- **Tab-focusable elements:** 8

#### ☀️ Light Theme
- Violations: 0
- Incomplete: 2
#### 🌙 Dark Theme
- Violations: 0
- Incomplete: 2

## Recommendations

- **aria-command-name**: Review axe-core documentation for remediation guidance.
- **aria-required-parent**: Ensure elements have the required parent ARIA role.
- **color-contrast**: Ensure text has sufficient contrast against background. In dark mode, use lighter text colors (e.g., #e2e8f0 on dark backgrounds). Minimum ratio: 4.5:1 for normal text, 3:1 for large text.
- **nested-interactive**: Review axe-core documentation for remediation guidance.

### Theme Toggle Accessibility

- Ensure theme toggle button has `aria-label` for screen readers (implemented)
- Verify focus indicator visible when tabbing to toggle button
- Confirm theme state is communicated (current icon: sun=light, moon=dark)
- Test keyboard operation (Enter/Space to toggle)
