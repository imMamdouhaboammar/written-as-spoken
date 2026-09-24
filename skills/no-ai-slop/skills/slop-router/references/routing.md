# Routing reference

| User intent | Primary owner | Supporting Skills |
|---|---|---|
| detect slop only | slop-audit | none unless user later requests repair |
| clean a draft without flattening voice | voice-preserving-edit | slop-pattern-repair, slop-quality-gate |
| sound spoken / conversational | plain-spoken-writing | language specialist, light repair, gate |
| Egyptian Arabic / bilingual code-switching | plain-spoken-writing | arabic-style-curator, gate |
| apply my strict writing rules | strict-human-output | voice/language owner, gate |
| ad, landing page, campaign, headline, CTA | commercial-copy-director | language, strict policy, gate |
| practical marketing playbook | commercial-copy-director | plain-spoken-writing, arabic-style-curator, strict-human-output, gate |
| presentation, proposal, brochure, visual brief | visual-content-anti-slop | arabic-style-curator, strict-human-output, gate |

## House-style activation signals

Activate strict `house` mode only when the user explicitly refers to their strict rules, personal style profile, banned-word rules, terminal-period rule, em-dash ban, supplied house directive, or an established task context that already requires them.

Otherwise use the portable baseline.
