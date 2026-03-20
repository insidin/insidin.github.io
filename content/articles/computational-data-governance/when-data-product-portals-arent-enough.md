---
title: "When Data Product Portals and Workflow Engines Aren't Enough: Embedding Data Governance in the Way People Work"
date: 2024-06-07
topic: "computational-data-governance"
tags: ["data governance", "portals", "workflow", "conversational AI"]
readTime: "8 min"
draft: false
---

_This is the third post of a series on Conversational Data Governance: The Next Wave of Adoption and Participation._

In the preceding articles, we highlighted the [limitations of traditional governance approaches](/topics/computational-data-governance/conversational-data-governance-part-1) and the [necessity for conversational interfaces to enhance governance adoption](/topics/computational-data-governance/from-data-intent-to-data-governance-action). While data product portals and workflow engines play critical roles in managing data governance and data products, relying on these tools alone is insufficient. These systems typically assume users possess a clear understanding of available data products, their structures, and the appropriate times to initiate governance processes. However, this assumption often doesn't hold true, limiting their effectiveness and the value they deliver.

Portals often become overly complex as organizations expand their governance capabilities, making them **challenging to navigate**. Users must sift through extensive metadata, definitions, lineage information, and data product documentation, often without context or guidance. Workflow engines compound this problem by expecting users to **initiate processes proactively**. If users don't know that these processes exist, or how and when to trigger them, the value of these tools diminishes significantly.

The role of a portal remains valuable — but primarily for **visibility** , documentation, and access to static or structured information. It allows users to explore available data products, view associated metadata, and browse product catalogs. However, portals lack contextual understanding and proactive engagement. They depend on users knowing what they are looking for, and where to find it.

In contrast, workflow engines are essential for achieving **computational data governance**. They move governance from a descriptive state into an executable model — where access requests, quality incident handling, ownership validation, and even product lifecycle decisions are formalized as repeatable, auditable processes. Governance maturity increasingly depends on the ability to design and execute such workflows. Yet their usability depends on how discoverable and intuitive those processes are for users.

This is where **conversational interfaces play a bridging role**. Consider practical scenarios: a user needs data for an urgent analysis but isn't sure which data product to choose. They might wonder about the maturity and trustworthiness of available data. Or perhaps they need access to a dataset but don't know the required steps or approvals. Another scenario arises when the needed data isn't currently packaged into a data product — prompting the user to initiate a request to create a new one. All these tasks involve governance processes that users might find opaque or cumbersome.

A conversational interface provides a **streamlined, context-sensitive entry point** to these governance actions. Users can easily ask, "Where can I find reliable sales data for Q1?" or "Can I access customer feedback data for my application?" The chatbot then engages with relevant metadata, assesses maturity or trust indicators, manages access requests, and can even trigger workflows to request new data products. Importantly, it shields users from the complexity of the underlying processes while still transparently explaining each step.

It can also guide users through data discovery, maturity assessment, access workflows, or even the initiation of a request to a domain owner for creating a missing data product — all driven by conversational input. Behind the scenes, the conversational interface interacts with metadata catalogs, governance repositories, and workflow engines. It can link users directly to a detailed product view or "product sheet" within the portal when deeper exploration is needed. It handles form filling, role-based routing, and status updates — all without exposing that complexity to the user.

In essence, conversational interfaces **complement and enhance** portals and workflow engines by making their powerful governance functionalities accessible, intuitive, and practical for all users, ensuring governance delivers genuine and widespread value.

Next in this series: [Embedding Data Governance Within Conversational AI: What Platforms Must Provide to Make It Work](/topics/computational-data-governance/embedding-data-governance-within-conversational-ai)
