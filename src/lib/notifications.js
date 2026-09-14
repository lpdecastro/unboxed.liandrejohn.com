const web3formsAccessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

// Best-effort admin notification, fired from the browser after a booking is
// already persisted — Web3Forms' free plan rejects server-to-server calls
// (403, "Use our API in client side or contact support ... Pro plan is
// required"), so this can't run inside the createBooking Server Action.
export async function sendBookingNotificationEmail({
  bookingNumber,
  customerName,
  customerMobile,
  customerAddress,
  gamesText,
  datesText,
  amountText,
  gcashReferenceNumber,
}) {
  if (!web3formsAccessKey) return;

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: web3formsAccessKey,
        subject: `New Booking ${bookingNumber} - Pending Verification`,
        from_name: "Unboxed",
        booking_number: bookingNumber,
        customer_name: customerName,
        customer_mobile: customerMobile,
        delivery_address: customerAddress,
        games: gamesText,
        rental_dates: datesText,
        grand_total: amountText,
        gcash_reference_number: gcashReferenceNumber,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Web3Forms notification failed (${response.status}): ${body}`);
    }
  } catch (error) {
    console.error("Web3Forms notification error:", error);
  }
}
