# HubSpot Booking Sync Spec

## Why This Feature Exists

This is a practice feature — not a real business need for an 8-game solo rental site — built to learn how CRM tools work and why marketing teams rely on them, ahead of client work that requires connecting CRM/marketing tools together.

**What a CRM solves:** it's just "one place to see everything about a customer and act on it," instead of pinging data across a database record, someone's memory, a WhatsApp thread, and a spreadsheet. The value isn't the tool — it's what it enables:

- **Follow-up without relying on memory.** Right now, if a customer completes a rental, the only trace is a MongoDB `Booking` document nobody but the dev looks at. There's no view like "who rented from us before" to text when new games arrive, or to nudge for a repeat booking. A CRM (or CRM-lite view) turns booking history into something a non-technical person (the business owner, a future VA) can browse and act on.
- **Marketing needs a list to talk to.** A marketer can't run a "win-back past renters" campaign or track which customers came from Instagram vs. Google if the data lives only inside app code. CRM tools are the interface marketing people already know how to use — that's why client work like this asks for someone who can *connect* CRM tools, not rebuild them: the business already has non-engineers who need to touch this data without asking a developer to query Mongo for them.
- **What happens without one:** nothing breaks technically — Unboxed works fine today. What's missing is visibility for humans who aren't reading code. The owner already does manual GCash verification and manual texting; a synced HubSpot view is what makes that manual work sustainable as volume grows, because you're scanning one table instead of a database console.

**Why HubSpot over Notion for this practice:** Notion is a flexible database being used *as* a CRM — flat rows, no real CRM concepts. HubSpot is an actual CRM: Contacts and Deals are distinct objects, Deals move through pipeline stages, records associate with each other, and Contacts dedupe on a unique property. That object model — not a spreadsheet — is what real marketing CRMs (and this client work) actually look like, so mapping a `Booking` onto it is the more useful rep.

## Task

When a new booking is created, sync it into HubSpot as a Contact (the customer, deduplicated by mobile number) and an associated Deal (the booking), so the booking is visible and actionable inside a real CRM.

## HubSpot Data Model

- **Contact** — search by `phone` (HubSpot Contacts Search API); if found, reuse it; if not, create one.
  - `firstname`: `customerName`
  - `phone`: `customerMobile`
  - `address`: `customerAddress`
- **Deal** — always created new (each booking is a distinct transaction, not a dedup target).
  - `dealname`: `` `Booking ${bookingNumber} — ${customerName}` ``
  - `amount`: raw `grandTotal` (not the peso-formatted display string) — **but stringified**: the SDK's `properties` object is `Record<string, string>`, so every value, including numbers, must be sent as a string (`String(grandTotal)`). Sending a raw JS number works by accident in JSON but isn't the documented contract — don't rely on it.
  - `pipeline`: `HUBSPOT_PIPELINE_ID`
  - `dealstage`: `HUBSPOT_DEALSTAGE_ID`
  - `booking_details` (custom property, must exist in the HubSpot portal beforehand — see Setup Prerequisites): free text combining `gamesText`, `datesText`, and `gcashReferenceNumber`, so a marketer opening the deal sees the booking without cross-referencing the app.
  - Associated to the Contact in the *same* create call (see below) — not a separate association request.

## Server Action Integration

- Add `src/lib/hubspot.js`, exporting `syncBookingToHubSpot({ bookingNumber, customerName, customerMobile, customerAddress, gamesText, datesText, grandTotal, gcashReferenceNumber })`.
- Uses the official `@hubspot/api-client` SDK, authenticated with a server-only `HUBSPOT_ACCESS_TOKEN` (a HubSpot private app token, not OAuth — simplest path for a single-portal integration like this).
  ```js
  import { Client, AssociationTypes } from "@hubspot/api-client";

  const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });
  ```
- **Contact lookup/create**:
  - Search: `hubspotClient.crm.contacts.searchApi.doSearch({ filterGroups: [{ filters: [{ propertyName: "phone", operator: "EQ", value: customerMobile }] }] })`. If `results.length > 0`, reuse `results[0].id`.
  - Otherwise create: `hubspotClient.crm.contacts.basicApi.create({ properties: { firstname: customerName, phone: customerMobile, address: customerAddress } })`.
- **Deal create + associate in one call** (not a separate association request):
  ```js
  await hubspotClient.crm.deals.basicApi.create({
    properties: {
      dealname: `Booking ${bookingNumber} — ${customerName}`,
      amount: String(grandTotal),
      pipeline: process.env.HUBSPOT_PIPELINE_ID,
      dealstage: process.env.HUBSPOT_DEALSTAGE_ID,
      booking_details: `${gamesText} | ${datesText} | GCash ref: ${gcashReferenceNumber}`,
    },
    associations: [
      {
        to: { id: contactId },
        types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: AssociationTypes.dealToContact }],
      },
    ],
  });
  ```
  `AssociationTypes.dealToContact` (value `3`) is exported by `@hubspot/api-client` — import it rather than hardcoding the numeric ID.
- No-ops immediately if `HUBSPOT_ACCESS_TOKEN`, `HUBSPOT_PIPELINE_ID`, or `HUBSPOT_DEALSTAGE_ID` is unset — same degrade-gracefully pattern as `sendBookingNotificationEmail` when `RESEND_API_KEY` is unset. Pipeline/stage are required (not optional) because a Deal can't be created without a valid stage, and there's no safe default across HubSpot portals.
- Called from `createBooking` (`src/app/actions/bookings.js`), right after the existing `sendBookingNotificationEmail` call, reusing the already-computed `gamesText`/`datesText`/`gcashReferenceNumber` and the raw `grandTotal` (before it's formatted into `amountText`).
- Wrapped in its own `try/catch` with `console.error`, independent of the email's try/catch, so a HubSpot failure never affects the email send or the booking response, and vice versa.

## Setup Prerequisites (Manual, One-Time)

These must exist in the HubSpot portal before the sync will work — analogous to sharing a Notion integration with a database. Do these once, by hand, in the HubSpot UI, before any code is written.

**Note on "Legacy Apps":** HubSpot's newer Developer Platform (project version `2025.2`+) builds apps via the `hs` CLI and supports things this feature doesn't need — UI extensions, OAuth, CLI-managed deploys. The UI now nudges toward that path and labels the old private-app flow "Legacy Apps." Per HubSpot's own docs, legacy private apps are fully supported and maintained indefinitely, and are explicitly called out as the right choice "for users who prefer not to use the CLI and only require an access token for specific APIs" — exactly this feature's case (one server-only static token, no CLI project to maintain). Use the legacy flow below; don't migrate to the CLI-based platform for this.

### Step 1 — Have a HubSpot account

If you don't already have one, sign up for the free HubSpot CRM at hubspot.com. No paid plan is required for what this feature needs.

### Step 2 — Create a private app and get `HUBSPOT_ACCESS_TOKEN`

1. In HubSpot, click the **settings gear icon** (top nav bar).
2. In the left sidebar, go to **Integrations → Private Apps** (some portals now show this as **Development → Legacy Apps** — same feature, just relabeled; see the note above).
3. Click **Create a private app**.
4. On the **Basic Info** tab, give it a name, e.g. `Unboxed Booking Sync` (description optional).
5. Go to the **Scopes** tab. Under CRM scopes, search for and check all four:
   - `crm.objects.contacts.read`
   - `crm.objects.contacts.write`
   - `crm.objects.deals.read`
   - `crm.objects.deals.write`
6. Click **Create app** (top right), then confirm in the dialog that appears.
7. HubSpot shows the **access token** once — click **Show token**, copy it immediately, and save it somewhere safe. This value is `HUBSPOT_ACCESS_TOKEN`.

### Step 3 — Get `HUBSPOT_PIPELINE_ID` and `HUBSPOT_DEALSTAGE_ID`

You can reuse HubSpot's default deal pipeline, or make a dedicated one for bookings — either works. **Note: creating a second/new pipeline requires a paid Sales Hub plan.** The free CRM is limited to one deal pipeline, but that one pipeline's name and stages are fully editable on free — so on free, repurpose the default pipeline instead of trying to create a new one.

1. Pick one, depending on your plan:
   - **Paid plan** — go to **settings gear → Objects → Deals → Pipelines**, click **Create pipeline**, name it e.g. `Rental Bookings`, and add a stage named e.g. `New Booking (Pending)`. Only one stage is needed for now, since this feature only syncs bookings at creation time.
   - **Free plan** — go to **settings gear → Objects → Deals → Pipelines**, select the existing default pipeline (e.g. `Entertainment Sales Pipeline`). Rename the pipeline itself via its edit/pencil icon next to the pipeline name (e.g. → `Rental Bookings`), then rename one of its existing stages inline (pick one that isn't a `Closed Won`/`Closed Lost` stage, e.g. the first one) to something like `New Booking (Pending)`. Renaming a pipeline or stage only changes its label, not its internal `id` — so if you already fetched IDs before renaming, they're still valid after.
     - **Probability** (shown per stage) only affects forecast-report math (`deal amount × probability`) — irrelevant to this feature, leave it as-is.
     - **Used in** (shown per stage) is a count of existing deals currently sitting in that stage — check it's 0 (or that you don't mind reassigning those deals) before repurposing a stage that already has deals in it.
2. Pipelines and stages don't show their internal IDs in the UI — you fetch them via the API you just got a token for. Run this in a terminal (replace `YOUR_TOKEN`):
   ```
   curl https://api.hubapi.com/crm/v3/pipelines/deals \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```
   HubSpot has since moved new APIs to date-based versioning (e.g. `/crm/pipelines/2026-03/deals`), but per their versioning policy legacy semantic-versioned URLs like this `v3` one "remain fully supported at their existing URLs" — no need to chase the newer path for a one-off manual lookup.
3. In the JSON response, find the pipeline you want under `results` — its `"id"` field is `HUBSPOT_PIPELINE_ID`. Inside that same pipeline object, find the stage you want under `"stages"` — its `"id"` field is `HUBSPOT_DEALSTAGE_ID`.

### Step 4 — Create the custom Deal property `booking_details`

1. Go to **settings gear → Objects → Deals → Properties**.
2. Click **Create property**.
3. Object type is already **Deal** in this section — leave it.
4. **Label**: `Booking Details`. HubSpot auto-generates the internal name from this as `booking_details` — after typing the label, confirm the internal name shown matches exactly (case-sensitive); if it doesn't, edit it directly to `booking_details`.
5. **Field type**: choose **Multi-line text**.
6. Group can stay as the default (Deal information). Click **Next**, review, then **Create**.

### Step 5 — Collect the values

You should now have three values to put in `.env`:

- `HUBSPOT_ACCESS_TOKEN` — from Step 2.7
- `HUBSPOT_PIPELINE_ID` — from Step 3.3
- `HUBSPOT_DEALSTAGE_ID` — from Step 3.3

## After It's Built — What You'll Actually Do With This

Short answer: **yes, mostly for viewing.** This feature's job stops at "the booking shows up in HubSpot." What you do with that view afterward is up to you, and you're not obligated to touch any of HubSpot's marketing tooling to get value out of it.

**What actually happens each time someone books:**

1. A customer submits a booking on `/games` → MongoDB gets the `Booking` document (same as today, unchanged).
2. In the background, HubSpot gets a Contact (new or reused) and a Deal, linked together.
3. Nothing on the website changes — the customer never sees HubSpot, and the booking flow doesn't wait on it (it's fire-and-log, per the try/catch in Server Action Integration).

**What you'll check, and where:**

- **Contacts** (left sidebar in HubSpot → **CRM → Contacts**): search by name or phone. Each renter shows up once, even across repeat bookings — this is the "who has rented from me before" view that doesn't exist today (right now that question means opening MongoDB Compass and reading raw documents).
- **Deals** (**CRM → Deals**): one row per booking, in whatever pipeline you configured. Since this feature only creates one stage, every deal sits in that single column — it's a list, not really a "pipeline" yet, until/unless you manually add and drag deals through more stages later (see below).
- Click into a Deal to see `booking_details` (games, dates, GCash ref) and the associated Contact card — that's the whole point of the custom property: you shouldn't need to tab back to MongoDB to know what was booked.

**What "it's working" looks like:** submit a test booking → within a few seconds, refresh HubSpot's Deals list → the new Deal is there, `amount` matches the grand total, and clicking it shows the right Contact. That's the entire feedback loop — no dashboards or reports required to confirm it's functioning.

**What you don't have to do:** lists, workflows, sequences, email campaigns, lead scoring — none of that is needed for this feature to be "done" or useful. A synced Contacts/Deals view is already the upgrade over "data trapped in Mongo," independent of whether anyone ever builds a campaign on top of it. Treat HubSpot here the way you'd treat a read-mostly admin panel, not a marketing engine you're obligated to operate.

### Is the end goal "just to close another deal"?

Honestly — no, and it's worth being explicit that the fit is a little awkward here. HubSpot's whole Deal/pipeline vocabulary comes from B2B sales: a rep nurtures a lead, the deal moves through stages, it "closes" when the customer agrees to pay. That's not this business. By the time a Deal gets created here, **the customer has already paid via GCash** — there's no persuasion step left, nothing to "close." So a Deal in this system isn't a sales opportunity, it's a transaction receipt that happens to live in a CRM. Don't let the word "Deal" or "pipeline" imply a sales funnel that isn't really there.

The actual end goal is **retention infrastructure**, not new-deal acquisition:

- Turning "who has rented before" from a question only a developer can answer (query Mongo) into one anyone can answer (search HubSpot).
- Making repeat-rental follow-up possible without relying on memory — e.g. "these 6 people rented Monopoly, text them when I get a second copy."
- If this were a real, growing business: giving a future non-technical hire (VA, marketer) a place to work from, instead of every customer touchpoint requiring a developer.

### What would a marketing person actually do with this (and what's missing for them)

If you handed this HubSpot portal to a marketer today, here's the kind of thing they'd eventually reach for, and honestly, most of it isn't buildable yet with only what this feature ships:

- **Segmentation (Lists).** Build a list like "rented 2+ times" or "hasn't booked in 60 days" to target for a win-back nudge. This part *would* work — it's just filtering on Contacts/Deals this feature already creates.
- **Lifecycle automation (Workflows).** E.g., auto-enroll a Contact in a "thanks for renting, here's 10% off next time" sequence a few days after a Deal is created. Technically possible with what's synced, though see the email gap below.
- **Lifetime value / popularity reporting.** Which games get rented most, average spend per customer, repeat-rental rate — all derivable from Deal `amount` + `booking_details` over time.
- **A pipeline that mirrors the real booking lifecycle** (pending → confirmed → delivered → returned → completed), so a marketer or the owner can see funnel health without a database. **This is explicitly not what this feature does** — the Deal is created once, frozen at whatever stage it started in (see the "honest limit" below). A marketer would ask for status-sync as the very next feature, not this one.
- **Channel attribution** ("which customers came from Instagram vs. Google," mentioned back in Why This Feature Exists). **Not possible with this feature as spec'd** — nothing here captures where a customer came from. That'd need a new field (e.g. a "How did you hear about us?" question on the booking form, or UTM capture) synced into a Contact property that doesn't exist yet.
- **Email campaigns.** The booking form only collects **name, mobile number, and address — no email**. Most of HubSpot's marketing tooling (sequences, newsletters, nurture emails) is email-first. Without an email field added to the booking form, a marketer here is functionally limited to SMS/manual outreach using the phone number — which, for a Philippines/GCash-centric audience, may honestly be the more realistic channel anyway, but it's worth knowing HubSpot's marketing features assume email by default.
- **Consent/opt-in tracking.** Any real marketing outreach (email or SMS) needs a documented opt-in per applicable law — no such field exists in the current `Booking`/`Contact` model. Another prerequisite before "a marketer does campaigns off this," not something this feature adds.

**Net:** this feature gets the data *into* the room. It does not set the table for automated marketing — that's several more deliberate features away (status sync, an email/consent field, attribution data), each of which you'd only build if a real future need justified it, not by default.

### The honest limit

It's one-directional and frozen at creation. If a booking's status later changes in MongoDB (`confirmed`, `rented`, etc. — still a manual DB edit per the MVP process), the HubSpot Deal does **not** follow along; it stays in whatever stage it was created in. So HubSpot reliably answers "who booked, and what did they book," but it will silently drift out of sync with a booking's *current* real-world status. Don't use it as the source of truth for "is this booking still active" — MongoDB still is.

## Out of Scope

- Two-way sync: HubSpot edits never write back to MongoDB.
- Syncing later status changes (`confirmed`, `out-for-delivery`, etc.) as deal-stage moves — those remain manual DB edits per the existing MVP process; the Deal reflects booking state only at creation time.
- Marketing automation itself (sequences, lists, campaigns) — this feature only gets the data into HubSpot; acting on it is a separate, later exercise.
- Any UI changes — purely a server-side integration, invisible to the customer.

## Environment / Documentation

- Add `HUBSPOT_ACCESS_TOKEN`, `HUBSPOT_PIPELINE_ID`, and `HUBSPOT_DEALSTAGE_ID` to `.env.example`, following the existing comment style (what each is for, that the token is server-only, that leaving any unset skips the sync), and note the Setup Prerequisites above inline.

## Acceptance Criteria

- [ ] `src/lib/hubspot.js` exports `syncBookingToHubSpot`, no-ops when any of `HUBSPOT_ACCESS_TOKEN` / `HUBSPOT_PIPELINE_ID` / `HUBSPOT_DEALSTAGE_ID` is unset.
- [ ] `createBooking` calls `syncBookingToHubSpot` after the booking is created, in its own try/catch, logging failures without affecting the booking response or the email send.
- [ ] A successful booking still returns the same shape and behavior as today when HubSpot env vars are unset (no regression).
- [ ] With valid HubSpot credentials: a repeat booking from the same mobile number reuses the existing Contact rather than creating a duplicate; a new mobile number creates a new Contact.
- [ ] With valid HubSpot credentials: a Deal is created with correct `dealname`/`amount`/`booking_details`, in the configured pipeline/stage, associated with the correct Contact.
- [ ] An invalid `HUBSPOT_ACCESS_TOKEN` is caught and logged; booking creation still succeeds.
- [ ] `.env.example` documents all three HubSpot env vars and the manual setup prerequisites.
- [ ] Production build passes.
