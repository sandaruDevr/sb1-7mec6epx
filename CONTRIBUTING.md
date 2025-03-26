# Contributing Guidelines

## Element ID Convention

Every element in the project MUST have a unique ID attribute following these rules:

1. IDs should be descriptive and reflect the element's purpose
2. Use kebab-case for ID names (e.g., `nav-menu-button`)
3. Follow this pattern: `{section/component}-{element-type}-{descriptor}`

Examples:
- `dashboard-title-welcome`
- `nav-button-settings`
- `stats-card-total-summaries`
- `form-input-video-url`

This convention ensures:
- Better communication between team members
- Easier testing and debugging
- Consistent element targeting
- Clear component hierarchy