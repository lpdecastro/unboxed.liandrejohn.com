# Customer Bookings Are Now Visible in HubSpot

## What this is

Every time a customer books a game rental on the website, their info now also shows up automatically in HubSpot — the same customer database/CRM tool sales and marketing teams normally use. You no longer need to ask a developer to look up "who has rented from us before" — you can just search HubSpot yourself.

Two things get created for every booking:

- A **Contact** — the customer's own record. If the same customer books again later, they don't get a second, duplicate record — HubSpot recognizes them by phone number and reuses the existing one.
- A **Deal** — one record per booking, linked to that customer's Contact.

## Where to see it

1. Log in to HubSpot.
2. In the left sidebar, click **Contacts** → **Contacts**. Search by the customer's name or phone number to find them and see their info.
3. In the left sidebar, click **Sales** (or **CRM**) → **Deals**. Each row here is one booking. Click into any Deal to open it.

## What you'll see on each record

**On a Contact:**
- First name
- Phone number
- Delivery address

**On a Deal:**
- The deal name, formatted like `Booking BG-1234 — Jane Dela Cruz` — so you can tell at a glance which booking it is and who it's for.
- The amount — the total the customer paid (rental fee + security deposit, discount already applied).
- A "Booking Details" field with the games rented, the rental dates, and the GCash reference number, so you can see the full booking without asking anyone.
- A link to the customer's Contact card, right there on the Deal.

## What happens automatically

The moment a customer finishes booking on the website and submits it, a Contact (new, or the customer's existing one) and a new Deal appear in HubSpot within seconds — no one has to type this in by hand.

## What you still have to do manually

Nothing changes about how bookings are actually run. Payment verification, texting the customer to confirm, and arranging delivery/return are all still done the same way as before, outside of HubSpot. This feature doesn't touch any of that — it only makes the booking *visible* in HubSpot, it doesn't manage the booking process for you.

## What this does NOT do (yet)

- **The Deal doesn't update as the booking moves along.** It's created once, at the moment the customer submits their booking, and stays exactly as it was. If a booking later gets confirmed, delivered, or returned, HubSpot won't reflect that — so don't use HubSpot to check whether a booking is "still pending" or "done." Every Deal will effectively look like a fresh, brand-new booking, even old ones. That means this is best used as a running list/log of all bookings and customers, not a status tracker — for the moment, right now, it's really just a single column of every booking ever made, not yet a true multi-stage pipeline.
- **No email address is collected.** The booking form only asks for name, phone number, and address — so email campaigns, newsletters, and most of HubSpot's built-in marketing tools (which assume an email address) won't work off this data as-is. Phone-based outreach (texting) is the realistic option today.
- **No marketing consent/opt-in is tracked.** Before running any real outreach campaign (text or email) to these customers, check that you have proper consent to contact them for marketing — that isn't captured anywhere yet.
- **No source/channel tracking.** There's no way yet to tell from HubSpot whether a customer came from Instagram, Google, or somewhere else.
- **This needs a one-time setup by the developer/site owner before it works at all.** If you open HubSpot and don't see any bookings showing up, ask them to confirm the HubSpot connection has been switched on.
