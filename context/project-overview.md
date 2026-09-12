<!-- omit in toc -->
# Unboxed Board Game Rental

I have 8 personal board games that I want to rent out to others. I want to build a website for it so that they know I exists and be able to rent out the board game using the website. They can pay via GCash and they can receive and return back via Lalamove. Available only within Metro Manila. My board games are Monopoly, Exploding Kittens, Monopoly Deal, Game of Life, Herd Mentality, Piles, RC Plane, and Jackstones.

- [Plan](#plan)
- [Rental Model](#rental-model)
- [Policies](#policies)
- [Booking Flow](#booking-flow)
- [GCash Payment Process](#gcash-payment-process)
- [Lalamove Rules](#lalamove-rules)
- [Game Information](#game-information)
- [Website Pages](#website-pages)
  - [Home Page](#home-page)
  - [Game Listing Page](#game-listing-page)
- [Features](#features)
  - [MVP](#mvp)
  - [Manual Processes for MVP](#manual-processes-for-mvp)
  - [Phase 2](#phase-2)
- [Tech Stack](#tech-stack)
- [Business Rules](#business-rules)
- [Validation](#validation)
- [MVP Constraints](#mvp-constraints)
- [Data Model](#data-model)
  - [Game](#game)
  - [Booking](#booking)


## Plan

- [x] Initial mockup of the website using Bootstrap only so that I have a starting idea on what to plan
- [x] Plan
- [x] Content
- [x] Setup Claude Code. Initialize Bootstrap and Sass project. Put all context in `local/`. Ask Claude to generate `README.md`. Init Claude using `/init`. Review `CLAUDE.md`. Setup Claude context and skills. From here, I can build out the static site using feature files. Then, I can ask Claude later to convert it into a Next.js project.


## Rental Model

Pricing:

| Game              | Price Per Day | Deposit | Late Fees Per Day |
| ----------------- | ------------- | --------| ----------------- |
| Monopoly          | P150          | P500    | P150              |
| Exploding Kittens | P150          | P500    | P150              |
| Monopoly Deal     | P100          | P100    | P100              |
| Piles             | P150          | P500    | P150              |
| Herd Mentality    | P150          | P500    | P150              |
| Game of Life      | P150          | P500    | P150              |
| RC Plane          | P150          | P200    | P150              |
| Jackstones        | P50           | P50     | P50               |

## Policies

**Payment**

- Full payment, including the security deposit, must be made via GCash before the booking is confirmed.
- Bookings are confirmed only after payment is manually verified.

**Cancellation**

- Customers may cancel before the booking is confirmed.
- Once confirmed, rental payments are non-refundable.
- The security deposit will still be refunded if the games have not yet been delivered.

**Security Deposit**

- A refundable security deposit is required for every rental.
- The deposit is returned after the games are returned and inspected.
- Any late fees, damage fees, or missing-item charges will be deducted from the deposit.

**Late Returns**

- Games returned after the agreed return date will be charged the listed late fee per day.
- Late fees may be deducted from the security deposit.

**Damage or Missing Items**

- Customers are responsible for keeping the games and all components in good condition.
- Charges may apply for damaged or missing cards, pieces, boxes, or other components.
- If a game is lost or severely damaged, part or all of the security deposit may be withheld.

**Delivery and Return**

- Delivery and return are handled through Lalamove.
- The customer is responsible for both delivery and return fees.
- Lalamove fees are separate from the rental price.

**Customer Responsibility**

- Customers should check the games upon receipt and report any existing damage or missing pieces as soon as possible.
- Games should be kept clean, dry, and away from food, drinks, pets, and other sources of damage.

**Availability**

- Bookings are subject to game availability.
- A booking is not guaranteed until it has been confirmed.

## Booking Flow

1. **Homepage**

   - User lands on the homepage.
   - Sees featured games and “How it Works.”
   - Clicks **Browse Games**.

2. **Game Listing page**

   - User sees the availability date selector at the top.
   - Clicks **Start Date** → selects `September 20`.
   - Clicks **End Date** → selects `September 22`.
   - Clicks **Check Availability**.

3. **Website checks availability**

   - Available games show **Available**.
   - Booked games show **Unavailable for selected dates**.
   - User clicks **Add to Booking** on:

     - Exploding Kittens
     - Herd Mentality

4. **Booking summary updates automatically**

   - Sticky booking panel shows:

     - 2 games
     - Rental dates
     - Number of rental days
     - Rental subtotal
     - 10% discount
     - Deposit total
     - Grand total
   - It also shows:

     - “Delivery and return via Lalamove.”
     - “Lalamove fees are paid by the renter.”

5. **User enters booking details**

   - Types name.
   - Types mobile number.
   - Types complete delivery address.

6. **User pays via GCash**

   - Website displays your GCash payment instructions.
   - User opens GCash separately.
   - Sends the displayed amount.
   - Returns to the website.
   - Types the **GCash reference number**.

7. **User submits**

   - Clicks **Submit Booking**.
   - Website validates the form and checks availability again.
   - Website creates the booking with status: `pending`
   - Website also sends an email to `liandrejohn88@gmail.com` to notify me.

8. **Booking Submitted Message**

   - User sees something like:

    > Booking received
    > **Booking #BG-1024**
    >
    > Your payment is being verified.
    > We’ll text you once your booking is confirmed.

   - Also display the selected games, dates, amount paid, delivery address, and Lalamove reminder.

9. **You verify the booking — manual**

   - You check whether the GCash payment was actually received.
   - You verify the dates and booking details.
   - You change the booking to `confirmed`.

10. **You contact the customer — manual**

    - Customer receives a text such as:

    > Hi Alex! Your booking BG-1024 for September 20–22 is confirmed. We’ll contact you regarding Lalamove delivery details.

11. **Delivery day**

    - You prepare and inspect the games.
    - You arrange or coordinate the Lalamove booking with the customer.
    - Customer pays the Lalamove delivery fee.
    - Booking status becomes `out-for-delivery`.

12. **Customer receives the games**

    - Lalamove delivers them.
    - Once delivered, you mark the booking: `rented`

At that point, the **website portion of the pre-rental customer journey is finished**. 

On the day of the return, the customer will receive a text to return the board games to the specified return address. The customer will book and pay Lalamove for the return. I will manually inspect it and deduct fees from the deposit if there's damage or missing items but if it's good I will return back the full deposit and sent text to the customer.

I’d treat the flow visually as:

**Homepage → Select Dates → Choose Games → Booking Summary → Customer Details → GCash Payment → Submit → Booking Pending → Manual Confirmation → Lalamove → Games Received**

## GCash Payment Process

There will be a GCash QR code in the checkout form. The customer just need to transfer money using QR code and input the GCash reference number before submitting the booking.

## Lalamove Rules

The customer will pay for both delivery and return fees.
I will coordinate the delivery. Customer will coordinate the return.

## Game Information

1. Monopoly
2. Exploding Kittens
3. Monopoly Deal
4. Herd Mentality
5. Piles
6. Game of Life
7. RC Plane
8. Jackstones

I will let AI do the detailed information for this.

## Website Pages

1. Home Page
2. Game Listing Page

### Home Page

Purpose: explain what Unboxed is, show the games, establish trust, and push visitors toward booking.

- **Navbar**
  - Unboxed logo/name
  - Home
  - Games
  - Browse Games CTA

- **Hero**
  - Short headline such as “Game night without buying the game.”
  - Explain:
    - Board game rentals
    - Metro Manila only
    - Delivery via Lalamove
  - Primary CTA: **Browse Games**

- **Featured Games**
  - Show several game cards or a carousel
  - Game image
  - Name
  - Starting price per day
  - Player count
  - Approximate play time
  - **View Games** CTA

- **How It Works**
  - Choose rental dates
  - Pick available games
  - Pay through GCash
  - Receive via Lalamove
  - Return via Lalamove

- **Why Rent From Unboxed**
  - Affordable compared with buying
  - Simple GCash payment
  - Convenient Metro Manila delivery
  - Refundable security deposit
  - Personally inspected games

- **Pricing / Rental Highlights**
  - Rentals from ₱50 per day
  - Refundable deposits
  - Customer pays Lalamove delivery and return fees
  - 10% multi-game discount

- **Rental Policies Preview**
  - Payment before confirmation
  - Refundable deposit
  - Late-return fees
  - Damage and missing-piece responsibility
  - Lalamove responsibility
  - Full policies can be shown in an accordion or modal instead of a separate page

- **Final CTA**
  - “Ready for your next game night?”
  - **Check Game Availability**

- **Footer**
  - Metro Manila only
  - Contact information
  - Rental policy link or modal
  - Copyright

### Game Listing Page

Purpose: combine the game listing, availability checker, booking summary, customer details, and GCash checkout into one page.

- **Page Header**
  - “Choose Your Games”
  - Short explanation of the rental process

- **Rental Date Selector**
  - Start date
  - End date
  - **Check Availability**
  - Display calculated rental days

- **Game Filters**
  - All Games
  - Available
  - Additional filters such as price range or player count can be added later

- **Game Grid**
  - Monopoly
  - Exploding Kittens
  - Monopoly Deal
  - Game of Life
  - Herd Mentality
  - Piles
  - RC Plane
  - Jackstones

  Each game card should show:
  - Photo
  - Game name
  - Short description
  - Number of players
  - Play time
  - Recommended age
  - Price per day
  - Security deposit
  - Availability status
  - **Add to Booking** button

- **Game Details**
  - Open game details in a Bootstrap modal instead of using a separate page
  - Larger images
  - Description
  - How to play summary
  - Number of players
  - Play time
  - Included components
  - Rental price
  - Security deposit
  - Late fee

- **Sticky Booking Summary**
  - Selected games
  - Rental dates
  - Number of rental days
  - Price per game
  - Rental subtotal
  - Multi-game discount
  - Security deposit total
  - Grand total
  - Remove-game buttons
  - Show reminder:
    - Delivery and return are handled via Lalamove
    - Lalamove fees are paid separately by the renter

- **Customer Details**
  - Full name
  - Mobile number
  - Complete Metro Manila delivery address

- **GCash Payment**
  - Amount to send
  - GCash QR code
  - Payment instructions
  - GCash reference number field

- **Rental Agreement**
  - Checkbox confirming agreement to:
    - Cancellation rules
    - Security deposit rules
    - Late fees
    - Damage and missing-item charges
    - Lalamove responsibility
  - Full policies can open in a modal or accordion

- **Submit Booking**
  - Recheck availability
  - Validate customer details
  - Create booking with status `pending`
  - Send email notification to me
  - Prevent duplicate submissions

- **Booking Confirmation State**
  - Show this on the same page instead of creating a third page
  - Display:
    - Booking received
    - Booking number such as `BG-1024`
    - `Pending payment verification`
    - Selected games
    - Rental dates
    - Amount paid
    - Delivery address
    - Lalamove reminder
    - Message explaining that confirmation will arrive by text

## Features

### MVP

- **Game Catalog**
  - Display all 8 rentable games

- **Date Range Selector**
  - Customer chooses start and end dates

- **Availability Checking**
  - Check whether each game is available for the selected dates
  - Prevent overlapping confirmed bookings

- **Multi-Game Booking**
  - Allow customers to rent more than one game in a single booking

- **Automatic Pricing**
  - Calculate rental days multiplied by each game's daily rental price

- **Security Deposit Calculation**
  - Add the required deposit for each selected game automatically

- **10% Multi-Game Discount**
  - Apply the planned discount when applicable

- **Sticky Booking Summary**
  - Keep selected games, dates, pricing, deposits, discounts, and totals visible

- **Customer Details Form**
  - Collect full name
  - Collect mobile number
  - Collect delivery address

- **Metro Manila Service Area**
  - Clearly state that rentals are available only within Metro Manila
  - Validate or flag addresses outside the supported area where practical

- **GCash QR Payment**
  - Display the GCash QR code during checkout

- **GCash Reference Number**
  - Require the customer to enter the transaction reference number

- **Booking Validation**
  - Validate required fields before submission
  - Recheck game availability immediately before creating the booking

- **Booking ID Generation**
  - Generate a unique booking number such as `BG-1024`

- **Booking Database**
  - Save booking details
  - Save selected games
  - Save rental dates
  - Save customer information
  - Save payment reference number
  - Save booking status

- **Booking Statuses**
  - `pending`
  - `confirmed`
  - `out-for-delivery`
  - `rented`
  - `return-pending`
  - `returned`
  - `completed`
  - `cancelled`

- **Email Notification**
  - Send an email to me when a new booking is submitted

- **Booking Confirmation**
  - Show the booking number and submitted booking information after submission

- **Responsive Design**
  - Optimize the website for mobile devices because customers may use GCash and Lalamove from their phones

- Email sending to notify me when someone rented.
- Database Tracking. Saving booking and auto updates status. I will just manually update the database for the status made by admin like `rented`.

### Manual Processes for MVP

Keep these manual for the first version:

- GCash payment verification
- Booking confirmation
- SMS confirmation
- Lalamove delivery coordination
- Lalamove return coordination
- Booking status changes made by admin
- Damage inspection
- Missing-item inspection
- Security deposit deductions
- Security deposit refunds

### Phase 2

- **Admin Dashboard**
  - View all bookings
  - View booking details
  - Update booking statuses
  - View rental availability calendar
  - Track deposits
  - Track refunds
  - Track damage or missing-item charges
  - Search and filter bookings
  - View customer information
  - Potentially automate customer email or SMS notifications
  
## Tech Stack

- Next.js
- Bootstrap & Sass
- MongoDB & Mongoose
- Web3Forms
- AWS Amplify

## Business Rules

- Rental days are counted inclusively: Sep 20–22 = 3 rental days.
- Start date cannot be in the past.
- End date must be on or after the start date.
- A game cannot be booked if it overlaps a `confirmed`, `out-for-delivery`, `rented`, or `return-pending` booking.
- `pending` bookings do not block availability until manually confirmed.
- 10% multi-game discount applies when booking 2 or more games.
- Discount applies only to rental fees, not security deposits.
- Each physical game has only 1 rentable copy.
- Customer pays the full rental fee + security deposit before submission.
- Lalamove delivery and return fees are excluded from the website total.
- Booking becomes valid only after manual GCash verification.
- Security deposit is refunded manually after return inspection.
- Late/damage/missing-item charges are deducted manually from the deposit.
- Customer may cancel while booking is `pending`.
- Confirmed rental fees are non-refundable.
- Only Metro Manila delivery addresses are accepted.

## Validation

- Require at least 1 selected game.
- Require start date and end date.
- Reject invalid or past date ranges.
- Recheck availability when booking is submitted.
- Require full name.
- Require Philippine mobile number.
- Require complete delivery address.
- Require GCash reference number.
- Prevent duplicate form submission.
- Reject booking if any selected game becomes unavailable before submission.
- Calculate all prices server-side instead of trusting browser values.
- Generate booking numbers server-side and ensure uniqueness.

## MVP Constraints

- Only the existing 8 games are supported.
- Only 1 copy of each game exists.
- Metro Manila only.
- GCash only.
- Lalamove only.
- No customer accounts or login.
- No admin dashboard.
- No online booking management for customers.
- No automated GCash verification.
- No Lalamove API integration.
- No automated SMS.
- No automated refunds.
- No promo-code system.
- No dynamic inventory management.
- No ratings or reviews.
- No waitlist.
- Game information can be stored directly in the database or seeded manually.
- Booking status updates are performed directly in the database for MVP.

## Data Model

### Game

```js
{
  slug: String,

  name: String,
  description: String,
  imageUrl: String,

  players: String,
  playTime: String,

  pricePerDay: Number,
  deposit: Number,
  lateFeePerDay: Number,

  active: Boolean
}
```

### Booking

```js
{
  bookingNumber: String,

  customer: {
    name: String,
    mobile: String,
    address: String
  },

  startDate: Date,
  endDate: Date,

  games: [ObjectId],

  rentalSubtotal: Number,
  discountAmount: Number,
  depositTotal: Number,
  grandTotal: Number,

  gcashReferenceNumber: String,

  status: String,

  damageFee: Number,
  depositReturned: Number,

  createdAt: Date,
  updatedAt: Date
}
```

Booking Status values:

```js
[
  "pending",
  "confirmed",
  "out-for-delivery",
  "rented",
  "return-pending",
  "returned",
  "completed",
  "cancelled"
]
```