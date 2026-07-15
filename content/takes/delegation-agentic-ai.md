---
hook: "Your AI agent has a valid token. That does not mean it has permission to do what it is about to do."
date: 2026-10-07
tags: ["agentic AI", "delegation", "identity", "governance"]
linkedArticle: "agentic-ai/delegation-in-the-age-of-agentic-ai"
draft: false
---

Enterprise conversations about AI agents conflate four very different things: who can decide, who can access, whose name is on it, and who is being impersonated. These are not interchangeable. They answer different questions, carry different risks, and require different controls.

The most dangerous conflation is between "on behalf of" (where both identities are visible and the proxy is scoped) and identity delegation (where the agent becomes indistinguishable from the human). When agents chain actions across systems, identity delegation means the database sees a human where there is actually a chain of autonomous software. If any link is compromised, the attacker inherits everything that human can do, and nobody can trace what happened.

I wrote a paper on this: the formal distinctions, the threat model, and a zero-trust agent framework that separates mandate from identity from capability from execution. Because IAM is necessary, but a valid token alone cannot tell you whether the action is appropriate.
