---
title: "Since When Does a Business Decision Have to Be Deterministic?"
date: 2026-10-22
topic: "ai-strategy"
tags: ["ai-strategy", "ai-governance", "decision rights", "ai risk", "enterprise architecture"]
readTime: "6 min"
draft: false
---

I regularly see discussions about the risks of AI, and particularly the fact that AI is not deterministic. As if that, by itself, makes AI unsuitable for enterprise use.

I think we are missing some nuance here.

Organizations have always relied on decisions that are not entirely predictable or reproducible. Human judgment, experience, statistical models, risk assessments, forecasts. None of these guarantee the same outcome every time.

Yet we use them, because they provide value. We understand, or at least try to understand, their limitations, assess the risks, and put controls in place where needed.

So why should we approach AI fundamentally differently?

There is a difference, of course. AI allows us to scale decision-making and automate actions at a speed and volume that was previously impossible. A wrong judgment is one thing. Thousands of wrong judgments, automatically translated into actions, are something else.

But that does not make non-determinism inherently unacceptable. It makes the architecture, governance and controls around it much more important.

We should also stop treating AI as if it were one technology with one set of characteristics. Generative LLMs, traditional machine learning, specialized decision models, deterministic business rules and optimization algorithms each have different strengths and limitations. Decision models such as Jev from TypeSafe AI are particularly interesting here. They are designed to evaluate predefined choices and return structured, probability-based judgments, rather than generating free-form responses. They do not remove uncertainty, nor do they guarantee correct decisions. But they provide another building block for enterprise AI architectures.

This brings me to what I consider the more important discussion, and one I increasingly encounter when working on enterprise AI architectures and governance. There is a fundamental difference between determining what should happen, and determining what is allowed to happen.

An AI system can evaluate a situation, propose an action, or even autonomously select a course of action. That does not mean it should be allowed to define its own decision rights. Those boundaries need to be explicit. What can the system decide? Under which conditions? What constraints apply? When is additional validation required? When does a human need to intervene? And importantly, how do we enforce those boundaries, rather than merely instructing an AI model to respect them?

This is not just a conceptual governance question. It has concrete implications for how we design and implement AI solutions. In practice, it means making deliberate architectural choices about where probabilistic judgment is appropriate, where deterministic enforcement is required, and how the two interact. It means translating policies into enforceable controls, defining decision rights, and designing mechanisms to validate outcomes and deal with exceptions.

We need systems in which autonomy is possible, but not unlimited. Where controls are proportional to the risk and impact of a decision. And where we measure how these systems actually behave, rather than assuming they are trustworthy because we designed them to be.

The objective should not be to eliminate uncertainty everywhere. It should be to understand where uncertainty is acceptable, where it is not, and how to manage it. For me, that is a much more useful discussion than whether AI is deterministic or not.

Ulrich Homann makes a closely related argument in his article *Stop Asking Whether AI Is Deterministic*, particularly around the separation of judgment, decision rights and enforcement. Worth reading if you are thinking about how to architect AI into enterprise environments: [Stop Asking Whether AI Is Deterministic](https://www.linkedin.com/pulse/stop-asking-whether-ai-deterministic-ulrich-homann-3fjgc).

Are we trying to make AI behave like traditional software, or should we rethink how we architect systems that can work with uncertainty?

Related reading: [Delegation in the Age of Agentic AI](/topics/agentic-ai/delegation-in-the-age-of-agentic-ai) on who may decide and who may act, and [Before You Automate, Question the Process](/topics/ai-strategy/question-the-process-before-automating).
