# ProcureChain Signup Email & Conversation AI Playbook

## 1. Purpose

This playbook gives ProcureChain a complete post-signup communication system:

- an immediate onboarding email;
- a personalised follow-up sequence;
- behavioural branches for active and inactive users;
- a knowledge base for a Conversation AI agent;
- a production-ready system prompt;
- reply-routing rules and ready-to-use response templates.

The sequence is designed around the profile data currently collected by ProcureChain and stored in the application.

## 2. Contact data and merge fields

Map the following values to the exact merge-field names used in GoHighLevel before publishing the workflow.

| ProcureChain value | Suggested merge token | Use |
|---|---|---|
| First name | `{{contact.first_name}}` | Greeting |
| Last name | `{{contact.last_name}}` | Formal replies if needed |
| Email | `{{contact.email}}` | Account lookup only; do not repeat unnecessarily |
| Company | `{{contact.company_name}}` | Company-specific context |
| Job title | `{{contact.job_title}}` | Role-specific examples |
| Country | `{{contact.country}}` | Regional market context |
| Region / city | `{{contact.region_state_province}}` | Regional context |
| Industry | `{{contact.industry_1}}` | Industry-specific examples |
| Preferred currency | `{{contact.preferred_currency}}` | FX and cost examples |
| Procurement interests | `{{contact.procurement_interests}}` | Recommended tools and content |
| Commodity interests | `{{contact.commodity_interests}}` | Commodity tracking examples |
| Newsletter consent | `{{contact.newsletter_opt_in}}` | Marketing eligibility |

Additional profile values available in the ProcureChain data model should be synced to GoHighLevel when they begin being collected:

- purchase mix;
- sourcing countries;
- trade lanes;
- procurement challenges.

### Fallback rules

Never expose an empty merge field. Apply these fallbacks before sending:

- Missing first name: use `Hello,`.
- Missing company: say `your organisation`.
- Missing industry: say `your market`.
- Missing country: omit regional wording.
- Missing currency: say `your preferred currency`.
- No commodity interests: use the selected procurement categories.
- No interests at all: recommend Market Intelligence, Ask the Market, and Procurement Tools.

## 3. Consent and sending rules

1. The verification-code email is transactional. It must contain only the login code, expiry, and security guidance.
2. The immediate account/profile confirmation is transactional and may be sent after successful onboarding.
3. Days 1 onward are marketing or educational follow-ups. Send them only when newsletter consent is true or another valid marketing permission exists.
4. Every marketing email must include the organisation's postal details and a working unsubscribe link.
5. An unsubscribe request must be honoured immediately. Do not ask the person to confirm it.
6. If a person replies, pause the automated sequence for 72 hours while the AI or a human handles the conversation.
7. Stop sales follow-ups when a demo is booked, the user opts out, or a team member takes ownership.

## 4. Recommended workflow

| Timing | Trigger/condition | Communication | Primary goal |
|---|---|---|---|
| Immediately | Email login requested | Verification code | Secure sign-in |
| Immediately after onboarding | Profile successfully saved | Welcome email | First useful action |
| Day 1 | Opted in; no demo booked | Personalised starting point | First value moment |
| Day 3 | Opted in | Ask the Market use case | Product activation |
| Day 7 | Opted in | Personalised Market Brief | Repeat visit |
| Day 14 | Opted in | Health check or calculator | Deeper engagement |
| Day 21 | Opted in; no demo booked | Help/demo offer | Start a conversation |
| Day 30 | Opted in; low activity | Preference check | Re-engage or suppress |

Recommended exit events:

- unsubscribe;
- hard bounce;
- spam complaint;
- demo booked;
- contact asks not to be contacted;
- sales or support owner assigned;
- account deleted.

## 5. Transactional verification email

**Subject:** Your ProcureChain sign-in code

Hello{{#if contact.first_name}} {{contact.first_name}}{{/if}},

Your ProcureChain sign-in code is:

**{{login_code}}**

It expires in 10 minutes. If you did not request this code, you can safely ignore this email. Never share the code with anyone, including someone claiming to be from ProcureChain.

ProcureChain Team

## 6. Email 1 — immediate welcome

**Subject:** Your ProcureChain workspace is ready

Hi {{contact.first_name}},

Your ProcureChain profile is ready. We have set up your experience around {{contact.industry_1}}, with a focus on {{contact.procurement_interests}}{{#if contact.commodity_interests}} and the markets you selected: {{contact.commodity_interests}}{{/if}}.

A useful first step is to open your Market Intelligence view and see the signals most relevant to your profile. You can also ask the AI assistant a practical question such as:

“What recent market movements could affect {{contact.procurement_interests}} in {{contact.country}}?”

**CTA: Open my dashboard**  
`https://procurechain.online/`

If you reply and tell us the decision you are working on, we will point you to the most useful part of ProcureChain.

Best,  
The ProcureChain Team

### Conditional opening lines

Use only one of these when the relevant field exists:

- Commodity selected: `We will prioritise signals related to {{contact.commodity_interests}}.`
- Country selected: `Your regional context is set to {{contact.country}}.`
- Currency selected: `FX views will use {{contact.preferred_currency}} where supported.`
- Job title selected: `We have tailored the starting points for your work as {{contact.job_title}}.`

## 7. Email 2 — Day 1 personalised starting point

**Subject:** Start with the signals that matter

Hi {{contact.first_name}},

Procurement teams rarely need more information. They need the right signal at the right time.

Based on your interest in {{contact.procurement_interests}}, start with these three actions:

1. Review the latest commodity and FX movements.
2. Check what changed and why it may matter to {{contact.industry_1}}.
3. Save the markets you want to revisit.

**CTA: View market intelligence**  
`https://procurechain.online/market-intelligence`

Reply with one category, commodity, or sourcing market you are watching. We will suggest a useful question to ask.

Best,  
The ProcureChain Team

## 8. Email 3 — Day 3 Ask the Market activation

**Subject:** Try this procurement question

Hi {{contact.first_name}},

The fastest way to use ProcureChain is to bring it a real decision.

Try this in Ask the Market:

“For a {{contact.industry_1}} buyer in {{contact.country}}, what should I watch before making a sourcing decision involving {{contact.commodity_interests}}?”

You can also ask about a commodity movement, exchange-rate change, freight availability, or the procurement implications of a recent market signal. Answers identify the available data context and should be verified before a material commercial decision.

**CTA: Ask the Market**  
`https://procurechain.online/assistant`

If you prefer, reply with your question and we will help you phrase it.

Best,  
The ProcureChain Team

### Prompt fallbacks

- No commodity: `What cost and supply signals should a {{contact.industry_1}} buyer in {{contact.country}} monitor this month?`
- No industry: `What recent commodity, FX, or freight movements could affect my selected procurement categories?`
- Minimal profile: `What are the most important market signals for a procurement team to monitor this month?`

## 9. Email 4 — Day 7 Market Brief

**Subject:** Your weekly procurement view

Hi {{contact.first_name}},

Your Market Brief brings the important movements together: commodities, FX, freight, suppliers, and industry developments. It is designed to answer three questions:

- What changed?
- Why could it matter?
- What should a procurement team watch next?

Your profile helps prioritise items connected to {{contact.industry_1}}, {{contact.country}}, and {{contact.procurement_interests}}.

**CTA: Read my Market Brief**  
`https://procurechain.online/market-brief`

Is there a market or category you want covered more closely? Reply and tell us.

Best,  
The ProcureChain Team

## 10. Email 5 — Day 14 decision tools

**Subject:** Put a live decision to work

Hi {{contact.first_name}},

When you need to move from market context to a decision, ProcureChain includes practical tools for areas such as landed cost, total cost of ownership, supplier comparison, bid evaluation, RFQ efficiency, working capital, and procurement ROI.

Choose one current decision and test the assumptions. The results are decision support, not a substitute for validated supplier quotes, contracts, audited data, or professional advice.

**CTA: Explore procurement tools**  
`https://procurechain.online/calculators`

Reply with the decision you are trying to make and we will suggest the best starting tool.

Best,  
The ProcureChain Team

### Optional health-check variant

Use this version for contacts whose stated challenge is procurement maturity, capability, process, or performance.

**Subject:** Where is your biggest procurement gap?

Hi {{contact.first_name}},

Procurement improvement is easier when the starting point is clear. The Procurement Health Check helps you assess your operation and identify the capability areas that deserve attention first.

**CTA: Take the health check**  
`https://procurechain.online/health-check`

When you finish, reply with the area you want to improve. We can point you to a relevant tool or learning resource.

Best,  
The ProcureChain Team

## 11. Email 6 — Day 21 human help or demo

**Subject:** What are you working on?

Hi {{contact.first_name}},

You joined ProcureChain with an interest in {{contact.procurement_interests}}. I wanted to ask one simple question: what procurement decision or market risk are you trying to understand right now?

Reply with a sentence or two. We can suggest the right market view, calculator, or AI question. If it would be easier to walk through it together, you can also book a demo.

**CTA: Book a ProcureChain demo**  
`https://procurechain.online/book-demo`

Best,  
The ProcureChain Team

## 12. Email 7 — Day 30 preference check

**Subject:** Should we keep sending these?

Hi {{contact.first_name}},

We want ProcureChain emails to be useful, not just frequent.

Reply with the topic you want to receive:

- commodity and input-cost movements;
- FX and currency risk;
- freight and sourcing conditions;
- procurement tools and benchmarks;
- product updates.

If none of these are useful, use the unsubscribe link below and we will stop marketing emails immediately. Your account access will not be affected.

Best,  
The ProcureChain Team

## 13. Behavioural branches

### A. Profile incomplete

Send 24 hours after account verification if onboarding is not complete.

**Subject:** Finish setting up ProcureChain

Hi {{contact.first_name}},

Your ProcureChain account is active, but your market profile is not complete yet. The profile tells us which industries, categories, commodities, countries, and currencies should be prioritised for you.

**CTA: Complete my profile**  
`https://procurechain.online/onboarding`

It should only take a few minutes. If something is preventing you from finishing, reply and tell us what happened.

Best,  
The ProcureChain Team

### B. Onboarded but no first visit

**Subject:** Your dashboard is waiting

Hi {{contact.first_name}},

Your profile is ready, but it looks like you have not opened the dashboard yet. Start with the market signals selected for {{contact.industry_1}} and {{contact.country}}.

**CTA: Open my dashboard**  
`https://procurechain.online/`

If you ran into a login or access problem, reply here and we will help.

Best,  
The ProcureChain Team

### C. Active user

Do not send generic activation reminders. Replace them with a weekly personalised brief based on saved watchlist items, selected markets, and recent product activity.

### D. Demo booked

Stop the nurture sequence and send the appointment confirmation plus a short preparation email asking:

- What outcome would make the session useful?
- Which categories, commodities, countries, or trade lanes matter most?
- Who else will join?

### E. Re-engagement after 30 days of inactivity

**Subject:** Want to reset your market view?

Hi {{contact.first_name}},

Your procurement priorities may have changed since you joined. If {{contact.procurement_interests}} is no longer the right focus, reply with the categories or markets you are watching now and we will help you reset your starting point.

**CTA: Return to ProcureChain**  
`https://procurechain.online/`

Best,  
The ProcureChain Team

## 14. Conversation AI knowledge base

### Company and product

ProcureChain Intelligence Hub is an AI-powered procurement intelligence, market-insight, and decision-support platform. It helps procurement professionals understand market changes, explore verified information, and apply structured tools to procurement decisions.

The platform currently includes:

- a Market Intelligence Centre for available commodity, FX, and market observations;
- commodity and FX views with historical trends where supported by active data sources;
- a Market Brief covering priority movements and procurement implications;
- Ask the Market, an AI procurement intelligence assistant;
- procurement calculators and decision tools;
- a Procurement Health Check and benchmarking experience;
- a Knowledge Centre with curated resources;
- approved-data-source visibility;
- personalised ordering based on the user's profile and interests;
- demo booking and support through the ProcureChain team.

### Product positioning

ProcureChain is decision support. It does not guarantee savings, supplier performance, market outcomes, or future prices. It does not replace supplier due diligence, legal review, financial advice, audited ESG data, validated quotations, contracts, or professional judgement.

### Data principles

- Never invent prices, market events, suppliers, customer results, testimonials, or data coverage.
- Clearly state when data is delayed, unavailable, or requires configuration.
- Refer users to the Data Sources view when they ask where information comes from.
- If live data is unavailable, explain the limitation and offer a framework for evaluating the decision without fabricating numbers.
- Use the user's selected country, currency, industry, procurement categories, commodities, sourcing countries, and trade lanes only when those values are present.

### Key destinations

| User need | Destination |
|---|---|
| General dashboard | `https://procurechain.online/` |
| Market intelligence | `https://procurechain.online/market-intelligence` |
| AI assistant | `https://procurechain.online/assistant` |
| Market Brief | `https://procurechain.online/market-brief` |
| Procurement tools | `https://procurechain.online/calculators` |
| Health Check | `https://procurechain.online/health-check` |
| Knowledge Centre | `https://procurechain.online/knowledge-centre` |
| Approved data sources | `https://procurechain.online/data-sources` |
| Book a demo | `https://procurechain.online/book-demo` |
| Login | `https://procurechain.online/login` |

### Supported question types

The agent may help with:

- choosing where to start in ProcureChain;
- framing a procurement or market question;
- explaining platform features;
- suggesting the right calculator or platform section;
- basic account navigation;
- arranging a demo or human follow-up;
- capturing feedback;
- answering general product questions using this knowledge base.

The agent must hand off rather than improvise when asked about:

- a disputed charge, refund, or billing adjustment;
- account deletion or a formal data-subject request;
- legal terms, contracts, security questionnaires, or compliance assurances;
- enterprise pricing, negotiated pricing, or binding commercial commitments;
- a technical fault it cannot resolve from known troubleshooting steps;
- missing or questionable market data that may affect a material decision;
- an angry customer, complaint, threat, or repeated unresolved issue.

### Privacy and security

- Do not reveal one user's information to another person.
- Do not ask for passwords, verification codes, card numbers, API keys, or other secrets.
- Never request sensitive commercial documents through an unapproved channel.
- For identity-sensitive requests, say that a team member will complete verification through the approved process.
- An unsubscribe request affects marketing email only unless the user explicitly requests account deletion.

## 15. Conversation AI system prompt

Paste the following into the Conversation AI agent instructions and replace bracketed business details before activation.

```text
You are the ProcureChain Conversation Assistant. You answer email and chat messages from people who created a ProcureChain account, requested information, or replied to an approved ProcureChain email.

YOUR PURPOSE
1. Understand what the person needs.
2. Give a short, accurate, genuinely useful answer.
3. Guide them to the most relevant ProcureChain page or next step.
4. Book or offer human help when the request needs a person.

VOICE
- Warm, calm, capable, and concise.
- Write like a knowledgeable procurement colleague.
- Use plain English and short paragraphs.
- Match the user's language when you can do so reliably.
- Do not use hype, fake urgency, excessive enthusiasm, or corporate filler.
- Do not begin with “I hope this email finds you well.”
- Do not repeatedly say “great question.”

PERSONALISATION
You may use the contact's first name, company, role, country, region, industry, preferred currency, procurement interests, commodity interests, sourcing countries, trade lanes, procurement challenges, and recent ProcureChain activity when the field is present and relevant.
Never mention a missing field, expose a merge token, or guess a profile value.
Use no more than two profile details in a single short reply unless the user asks for a detailed recommendation.

ACCURACY
- Use only the approved ProcureChain knowledge base and verified conversation context.
- Never invent product capabilities, live prices, data sources, customer names, testimonials, discounts, timelines, or outcomes.
- ProcureChain provides decision support; it does not guarantee savings, supplier performance, availability, or future market movements.
- If information is unavailable or uncertain, say so clearly and offer the safest next step.
- Do not present general procurement information as legal, financial, compliance, or investment advice.

REPLY METHOD
1. Identify the intent: product question, how-to, procurement question, demo, pricing, technical issue, feedback, unsubscribe, not interested, complaint, account/data request, or other.
2. Answer the direct question first.
3. Ask at most one useful follow-up question.
4. Include only one main call to action.
5. Keep normal replies between 40 and 120 words. Use more only when the question genuinely needs it.
6. Do not resend a generic pitch after the person has asked a specific question.

EMAIL-SPECIFIC RULES
- Preserve the existing subject thread.
- Sign off as “The ProcureChain Team” unless a named human owner is assigned.
- Do not add an unsubscribe link to a one-to-one service reply, but immediately honour any opt-out request in the CRM.
- Pause automated follow-ups for 72 hours after a meaningful inbound reply.

UNSUBSCRIBE
If the user says stop, unsubscribe, remove me, no more emails, or equivalent:
1. Mark the contact as opted out of marketing immediately.
2. Reply once: “You have been unsubscribed from ProcureChain marketing emails. Your account access is unchanged.”
3. Do not ask why and do not include another promotional CTA.

DEMO INTENT
If the user asks for a demo, call, meeting, walkthrough, consultation, or human conversation:
1. Offer https://procurechain.online/book-demo.
2. If booking tools are available, collect only the details required to schedule.
3. Ask what outcome they want from the session.
4. Stop the nurture sequence once the appointment is booked.

HUMAN HANDOFF
Escalate billing disputes, refunds, deletion/privacy requests, legal/security/compliance questions, negotiated commercial terms, serious complaints, unresolved technical faults, or any request where the approved knowledge base is insufficient.
Tell the user why a person is needed and when they can expect a response using only the approved service-level time. If no service-level time is configured, say “A member of the team will follow up as soon as possible.”
Do not promise a resolution or exact response time you cannot verify.

SECURITY
Never ask for or repeat passwords, login codes, card numbers, secret keys, or confidential credentials. If a user shares one, tell them to rotate or secure it and escalate appropriately.

AVAILABLE LINKS
Dashboard: https://procurechain.online/
Market Intelligence: https://procurechain.online/market-intelligence
Ask the Market: https://procurechain.online/assistant
Market Brief: https://procurechain.online/market-brief
Procurement Tools: https://procurechain.online/calculators
Health Check: https://procurechain.online/health-check
Knowledge Centre: https://procurechain.online/knowledge-centre
Data Sources: https://procurechain.online/data-sources
Book a Demo: https://procurechain.online/book-demo
Login: https://procurechain.online/login

FINAL CHECK BEFORE SENDING
- Did I answer the actual question?
- Is every factual statement supported by the knowledge base or conversation?
- Did I avoid exposing missing merge fields?
- Is there one clear next step at most?
- Should this be handed to a person?
```

## 16. Inbound reply classification and actions

| Intent | AI action | Workflow action |
|---|---|---|
| Positive interest | Answer and ask one discovery question | Pause nurture 72 hours |
| Product/how-to question | Give steps and one relevant link | Pause nurture 72 hours |
| Procurement question | Give bounded guidance or suggest Ask the Market | Pause nurture 72 hours |
| Demo/call request | Share booking link or schedule | Stop nurture when booked |
| Pricing question | Give only approved public pricing; otherwise hand off | Create sales task if qualified |
| Technical issue | Collect safe diagnostic details; attempt known fix | Open support task if unresolved |
| Data/source concern | Explain source transparency; never invent | Escalate if decision-critical |
| Not interested | Acknowledge; ask no sales question | Suppress sales sequence |
| Unsubscribe | Confirm completion | Opt out immediately |
| Wrong person | Apologise and stop outreach | Suppress or correct contact |
| Complaint | Acknowledge impact; do not argue | Urgent human handoff |
| Billing/refund | Do not promise outcome | Human handoff |
| Privacy/deletion | Acknowledge and start verified process | Human/privacy handoff |
| Out-of-office | Do not respond conversationally | Resume after return date if allowed |
| Spam/automated bounce | Do not reply | Suppress according to deliverability policy |

## 17. Ready-to-use inbound replies

### A. “Tell me more”

Hi {{contact.first_name}},

ProcureChain helps procurement teams connect market movements with practical decisions. You can monitor available commodity and FX signals, read a prioritised Market Brief, ask procurement questions, and use decision tools such as landed-cost or supplier-comparison calculators.

Which is more useful to you right now: tracking a market risk or working through a specific procurement decision?

Best,  
The ProcureChain Team

### B. “How can this help my company?”

Hi {{contact.first_name}},

For {{contact.company_name}}, the best starting point depends on the decision you are trying to improve. ProcureChain can help organise relevant market signals, frame their procurement implications, and test assumptions with structured tools.

What is the current priority: input costs, FX exposure, supplier evaluation, freight, or procurement performance?

Best,  
The ProcureChain Team

### C. “Is the data live?”

Hi {{contact.first_name}},

ProcureChain uses approved data sources and shows the latest available observation for supported markets. Coverage and update frequency vary by source and instrument. When data is delayed, unavailable, or not configured, the platform should show that status rather than generate a substitute value.

You can review the source registry here: https://procurechain.online/data-sources

Best,  
The ProcureChain Team

### D. “Can the AI tell me what to buy or when?”

Hi {{contact.first_name}},

The AI can help you understand available market signals, risks, and procurement implications, but it should not make an autonomous buying decision or guarantee a future price. Material decisions should still be checked against current supplier quotes, contracts, internal policy, and professional judgement.

If you share the category and decision horizon, we can suggest a useful question to ask.

Best,  
The ProcureChain Team

### E. Demo request

Hi {{contact.first_name}},

Absolutely. You can choose a suitable time here:

https://procurechain.online/book-demo

What would make the session most useful for you—market monitoring, a particular procurement decision, or a walkthrough of the full platform?

Best,  
The ProcureChain Team

### F. Pricing question when no approved price list is in the knowledge base

Hi {{contact.first_name}},

Pricing depends on the access and support your team needs, and I do not want to give you an unverified figure. I can arrange for the team to provide the current options.

Would you like a pricing follow-up by email, or would you prefer to book a short demo?

Best,  
The ProcureChain Team

### G. Login code not received

Hi {{contact.first_name}},

Please check your spam or junk folder and confirm that you entered the correct email address. You can then request a new code from https://procurechain.online/login. A code is valid for 10 minutes, and a new request may require a one-minute wait.

Do not share the code with anyone. If it still does not arrive, reply here and the team will investigate delivery.

Best,  
The ProcureChain Team

### H. Technical issue

Hi {{contact.first_name}},

Sorry you ran into this. Please send the page you were using, what you expected to happen, and the exact error message. A screenshot is helpful, but please remove any passwords, login codes, API keys, or confidential commercial information first.

Once we have that, we can investigate or pass it to the right team member.

Best,  
The ProcureChain Team

### I. Not interested

Hi {{contact.first_name}},

Understood—thanks for letting us know. We will stop the ProcureChain sales follow-ups.

Best,  
The ProcureChain Team

### J. Unsubscribe

Hi {{contact.first_name}},

You have been unsubscribed from ProcureChain marketing emails. Your account access is unchanged.

The ProcureChain Team

### K. Wrong person

Hi,

Thanks for letting us know, and apologies for the irrelevant message. We have stopped this outreach to your address.

The ProcureChain Team

### L. Complaint

Hi {{contact.first_name}},

I am sorry this caused frustration. I have recorded the issue and passed it to a member of the team for review. They will follow up as soon as possible.

If there is one detail that will help them understand the impact, please reply with it here. You do not need to repeat information you have already sent.

Best,  
The ProcureChain Team

### M. Account deletion or personal-data request

Hi {{contact.first_name}},

We have received your request. Because it concerns your account or personal data, a team member needs to verify and process it through the approved procedure. They will follow up as soon as possible.

Please do not send a password, login code, or identity document in reply unless the team provides an approved secure method.

Best,  
The ProcureChain Team

### N. Human request

Hi {{contact.first_name}},

Of course. I will pass this conversation to a member of the ProcureChain team. They will follow up as soon as possible.

The ProcureChain Team

## 18. Suggested CRM tags and fields

### Tags

- `pc-account-created`
- `pc-onboarding-complete`
- `pc-profile-incomplete`
- `pc-email-engaged`
- `pc-product-active`
- `pc-demo-intent`
- `pc-demo-booked`
- `pc-support-needed`
- `pc-human-handoff`
- `pc-not-interested`
- `pc-marketing-opt-out`
- `pc-data-request`

### Operational fields

- lifecycle stage;
- onboarding completed date;
- last login date;
- last meaningful activity date;
- last inbound reply date;
- primary interest;
- primary procurement challenge;
- AI reply confidence;
- handoff reason;
- human owner;
- nurture paused until;
- demo booked date;
- marketing consent source and timestamp.

## 19. Quality checklist before launch

- Replace all sample merge fields with the exact GoHighLevel field tokens.
- Test every missing-field fallback.
- Confirm the first welcome email fires only after profile data is successfully saved.
- Confirm follow-ups require marketing consent.
- Confirm replies pause the automation.
- Confirm demo booking stops the nurture workflow.
- Confirm unsubscribe works from both the email link and plain-language replies.
- Confirm bounces and spam complaints are suppressed.
- Confirm the agent cannot quote unapproved pricing or fabricate data.
- Confirm human handoff creates an owner/task and includes the conversation history.
- Send test messages for positive interest, support, complaint, unsubscribe, deletion, and demo booking.
- Review AI replies weekly during the initial launch and add approved answers to the knowledge base.

## 20. Recommended first implementation

Launch in this order:

1. Transactional verification and onboarding-confirmation emails.
2. Welcome, Day 3, Day 7, and Day 21 emails.
3. Reply classification, unsubscribe handling, and human handoff.
4. Behavioural branches using login and product-activity events.
5. Weekly personalised briefs using watchlist and verified market data.

This order gives users useful communication quickly while keeping consent, accuracy, and escalation controls in place from the start.
