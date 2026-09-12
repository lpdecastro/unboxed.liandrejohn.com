<!-- omit in toc -->
# Game Listing Page Content

Based on the Game Listing Page, booking flow, pricing, policies, business rules, and validation in `Plan.md`. 

> Game metadata such as player counts, play times, and recommended ages are draft content based on common editions. Check these against the exact copies you own before publishing.

- [Page Header](#page-header)
- [Rental Date Selector](#rental-date-selector)
- [Game Filters](#game-filters)
- [Game Grid](#game-grid)
  - [Monopoly](#monopoly)
  - [Exploding Kittens](#exploding-kittens)
  - [Monopoly Deal](#monopoly-deal)
  - [Game of Life](#game-of-life)
  - [Herd Mentality](#herd-mentality)
  - [Piles](#piles)
  - [RC Plane](#rc-plane)
  - [Jackstones](#jackstones)
- [Game Details Modal](#game-details-modal)
- [Sticky Booking Summary](#sticky-booking-summary)
  - [Empty State](#empty-state)
  - [Booking State](#booking-state)
- [Customer Details](#customer-details)
- [GCash Payment](#gcash-payment)
- [Rental Agreement](#rental-agreement)
- [Submit Booking](#submit-booking)
- [Booking Confirmation State](#booking-confirmation-state)
  - [Booking Details](#booking-details)
  - [What Happens Next](#what-happens-next)
- [Footer](#footer)


## Page Header

**Content**

* Eyebrow: Board Game Rentals in Metro Manila
* Heading: Choose Your Games
* Description: Pick your rental dates, see what’s available, then add the games you want to your booking. I’ll confirm everything once your GCash payment has been verified.
* Supporting Text: Rentals from ₱50/day · Refundable deposits · Delivery and return via Lalamove
* Image: [https://images.unsplash.com/photo-1640461470346-c8b56497850a](https://images.unsplash.com/photo-1640461470346-c8b56497850a)

**Section Structure**

Page Header:

* Full-width introductory section
* Heading and description as the main focus
* Supporting rental details underneath
* Optional board game image on desktop

---

## Rental Date Selector

**Content**

* Heading: When do you need the games?
* Description: Choose your rental dates first so I can show you which games are available.
* Start Date Label: Start Date
* Start Date Placeholder: Select a date
* End Date Label: End Date
* End Date Placeholder: Select a date
* Primary CTA: Check Availability
* Rental Days Label: Rental Period
* Rental Days Value: {rentalDays} days
* Supporting Text: Rental days are counted inclusively. For example, September 20–22 is 3 rental days.
* Error: Start date can’t be in the past.
* Error: End date must be on or after the start date.

**Section Structure**

Date Selector:

* Compact card near the top of the page
* Start and end date fields side by side on desktop
* Stacked fields on mobile
* Check Availability button beside or below fields
* Calculated rental days shown after valid dates are selected

---

## Game Filters

**Content**

* Filter: All Games
* Filter: Available
* Results Label: 8 games in my collection
* Before Date Selection: Choose your dates to check availability.
* Available Results: Showing games available for your selected dates.

**Section Structure**

Filters:

* Small horizontal filter bar above the game grid
* All Games selected by default
* Available filter becomes useful after dates are checked
* Keep additional filtering out of the MVP

---

## Game Grid

**Content**

### Monopoly

* Description: A classic for longer game nights where everyone buys, trades, negotiates, and tries not to go bankrupt.
* Players: 2–6
* Play Time: 60–180 min
* Recommended Age: 8+
* Rental Price: ₱150/day
* Security Deposit: ₱500 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual copy being rented

### Exploding Kittens

* Description: A quick, chaotic card game with simple rules, sneaky moves, and plenty of chances to ruin your friends’ plans.
* Players: 2–5
* Play Time: About 15 min
* Recommended Age: 7+
* Rental Price: ₱150/day
* Security Deposit: ₱500 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual copy being rented

### Monopoly Deal

* Description: All the trading and deal-making of Monopoly packed into a much faster card game.
* Players: 2–5
* Play Time: About 15 min
* Recommended Age: 8+
* Rental Price: ₱100/day
* Security Deposit: ₱100 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual copy being rented

### Game of Life

* Description: Make your way through careers, family choices, expenses, and unexpected turns in this easygoing family classic.
* Players: 2–4
* Play Time: About 45–60 min
* Recommended Age: 8+
* Rental Price: ₱150/day
* Security Deposit: ₱500 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual copy being rented

### Herd Mentality

* Description: Try to think like everyone else. The closer your answers are to the group, the better your chances of winning.
* Players: 4–20
* Play Time: About 20 min
* Recommended Age: 10+
* Rental Price: ₱150/day
* Security Deposit: ₱500 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual copy being rented

### Piles

* Description: A fast card-matching race where everyone plays at the same time. Easy to learn and great when you want something quick.
* Players: 2–8
* Play Time: 10–15 min
* Recommended Age: 8+
* Rental Price: ₱150/day
* Security Deposit: ₱500 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual copy being rented

The published Piles! edition is listed for 2–8 players, ages 8+, with a play time under 15 minutes. ([Asmodee USA][1])

### RC Plane

* Description: Something different from the tabletop—take turns flying an RC plane and see who can handle it best.
* Players: 1+ / take turns
* Play Time: Flexible
* Recommended Age: Check exact model
* Rental Price: ₱150/day
* Security Deposit: ₱200 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual RC plane being rented

### Jackstones

* Description: A simple hand-and-eye coordination classic that’s quick to set up and easy to bring anywhere.
* Players: 1+
* Play Time: 10–20 min
* Recommended Age: 6+
* Rental Price: ₱50/day
* Security Deposit: ₱50 refundable
* Availability Before Search: Select dates to check
* Available Status: Available
* Unavailable Status: Unavailable for selected dates
* Primary CTA: Add to Booking
* Secondary CTA: View Details
* Selected CTA: Added
* Photo: Use a clear photo of the actual set being rented

**Section Structure**

Game Grid:

* Responsive card grid
* 3–4 columns on large screens
* 2 columns on tablets
* 1 column on small mobile screens

Each Card:

* Game photo
* Availability badge
* Game name
* Short description
* Player count
* Play time
* Recommended age
* Price per day
* Refundable deposit
* View Details link/button
* Add to Booking button

Unavailable Cards:

* Keep visible in the grid
* Show muted Unavailable status
* Disable Add to Booking
* Keep View Details available

---

## Game Details Modal

**Content**

* Modal Heading: {Game Name}
* Description: {Full game description}
* Detail Label: Players
* Detail Label: Play Time
* Detail Label: Recommended Age
* Subheading: How to Play
* How to Play Copy: A quick overview of the goal and what you’ll be doing during the game.
* Subheading: What’s Included
* Included Copy: All game pieces and components included with my copy will be checked before delivery.
* Rental Price Label: Rental
* Security Deposit Label: Refundable Deposit
* Late Fee Label: Late Fee
* Primary CTA: Add to Booking
* Secondary CTA: Close
* Supporting Text: Please check the game when it arrives and let me know as soon as possible if anything looks damaged or missing.

**Section Structure**

Bootstrap Modal:

* Large game image at top or left
* Game description
* Quick metadata row
* How to play summary
* Included components
* Pricing block
* Add to Booking CTA
* No separate game-detail page

---

## Sticky Booking Summary

**Content**

* Heading: Your Booking

### Empty State

* Heading: No games added yet
* Description: Choose your dates and add at least one game to start your booking.

### Booking State

* Selected Games Label: Games
* Rental Dates Label: Rental Dates
* Rental Period Label: Rental Period
* Rental Subtotal Label: Rental Subtotal
* Discount Label: Multi-Game Discount
* Deposit Label: Refundable Deposits
* Total Label: Amount to Pay
* Remove Game CTA: Remove
* Discount Supporting Text: Rent 2 or more games and get 10% off the rental fees.
* Delivery Note: Delivery and return are handled through Lalamove.
* Fee Note: Lalamove delivery and return fees are paid separately by the renter.
* Deposit Note: Deposits are refunded after the games are returned and inspected.

**Section Structure**

Desktop:

* Game grid/content on the left
* Sticky booking summary card on the right

Mobile:

* Booking summary moves below selected games
* Optional collapsed summary showing game count and total

Selected Game Row:

* Game name
* Daily price × rental days
* Rental amount
* Remove button

Totals:

* Rental subtotal
* 10% discount when 2+ games are selected
* Deposit total
* Grand total emphasized

---

## Customer Details

**Content**

* Heading: Your Details
* Description: I’ll use these details to confirm your booking and coordinate delivery.
* Full Name Label: Full Name
* Full Name Placeholder: Juan Dela Cruz
* Mobile Label: Mobile Number
* Mobile Placeholder: 09XX XXX XXXX
* Address Label: Complete Delivery Address
* Address Placeholder: House/unit, street, barangay, city, Metro Manila
* Address Supporting Text: Rentals are available within Metro Manila only.
* Name Error: Please enter your full name.
* Mobile Error: Enter a valid Philippine mobile number.
* Address Error: Please enter a complete Metro Manila delivery address.

**Section Structure**

Customer Details:

* Simple card or form section
* Full name and mobile fields
* Full-width delivery address field
* Metro Manila reminder directly beneath address

---

## GCash Payment

**Content**

* Heading: Pay with GCash
* Description: Send the full amount shown below before submitting your booking.
* Amount Label: Amount to Send
* Amount Value: ₱{grandTotal}
* Supporting Text: This includes your rental fees and refundable security deposits. Lalamove fees are not included.
* QR Label: Scan to Pay
* QR Image: GCash QR code
* Instruction 1: Open GCash and scan the QR code.
* Instruction 2: Send exactly ₱{grandTotal}.
* Instruction 3: Copy the GCash reference number after your payment goes through.
* Reference Label: GCash Reference Number
* Reference Placeholder: Enter your transaction reference number
* Payment Notice: Your booking is not confirmed yet. I’ll manually verify your GCash payment after you submit.
* Error: Please enter your GCash reference number.

**Section Structure**

GCash Section:

* Amount prominently displayed
* QR code in a clear bordered container
* Three short payment steps
* Reference-number field beneath instructions
* Payment verification notice before agreement

---

## Rental Agreement

**Content**

* Heading: Before You Submit
* Checkbox: I’ve read and agree to the rental policies, including the cancellation rules, refundable deposit, late fees, damage or missing-item charges, and my responsibility for Lalamove delivery and return fees.
* Policy CTA: Read Rental Policies
* Supporting Text: Confirmed rental payments are non-refundable. Your security deposit is returned after the games are returned and inspected.

**Section Structure**

Agreement:

* Single required checkbox
* Short policy summary
* Full rental policies open in a Bootstrap modal or accordion
* Keep the full policy text out of the main booking flow

---

## Submit Booking

**Content**

* Primary CTA: Submit Booking
* Processing State: Submitting Booking…
* Supporting Text: I’ll check availability again before your booking is submitted.
* Availability Error: Sorry, one of your selected games was just booked for these dates. Please update your selection and try again.
* Form Error: Please check the highlighted fields before submitting.
* Duplicate Submission Message: Your booking is already being submitted. Please wait a moment.

**Section Structure**

Submit Area:

* Grand total repeated above CTA
* Large full-width primary button
* Supporting message below
* Disable button while submission is processing
* Recheck availability immediately before creating the booking

---

## Booking Confirmation State

**Content**

* Eyebrow: Booking Received
* Heading: Thanks! I’ve received your booking.
* Booking Number Label: Booking Number
* Booking Number: {bookingNumber}
* Status: Pending Payment Verification
* Description: I’ll check your GCash payment and booking details. I’ll text you once everything is confirmed.

### Booking Details

* Games Label: Games
* Rental Dates Label: Rental Dates
* Rental Period Label: Rental Period
* Amount Paid Label: Amount Sent
* Delivery Address Label: Delivery Address

### What Happens Next

* Step 1: I verify your GCash payment and game availability.

* Step 2: I text you once your booking is confirmed.

* Step 3: I coordinate the Lalamove delivery with you before your rental starts.

* Lalamove Reminder: You’ll pay the Lalamove delivery fee. On your return date, you’ll also arrange and pay for the Lalamove return.

* Deposit Reminder: Your security deposit will be refunded after the games are returned and inspected.

* Primary CTA: Back to Games

* Secondary CTA: Back to Home

**Section Structure**

Confirmation State:

* Replace the booking form after successful submission
* Success message and booking number at the top
* Status badge directly below
* Booking summary card
* Three-step “What Happens Next” section
* Lalamove and deposit reminders
* Navigation CTAs at the bottom

---

## Footer

**Content**

* Brand: Unboxed
* Description: A small personal collection of games available to rent around Metro Manila.
* Service Area: Metro Manila only
* Payment: GCash
* Delivery & Return: Lalamove
* Link: Home
* Link: Games
* Link: Rental Policies
* Copyright: © 2026 Unboxed

**Section Structure**

Footer:

* Compact site footer
* Brand and short description
* Essential navigation
* Metro Manila, GCash, and Lalamove reminders
* Rental policies available through modal or accordion

[1]: https://store.asmodee.com/products/piles?utm_source=chatgpt.com "Piles! Card Game – Asmodee USA"
