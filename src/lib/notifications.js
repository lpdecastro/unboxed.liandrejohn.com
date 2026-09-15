import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const NOTIFICATION_RECIPIENT = "liandrejohn88@gmail.com";

// Admin notification sent server-side from inside createBooking, awaited but
// wrapped in try/catch by the caller so a Resend failure never fails the
// booking response.
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
  if (!resend) return;

  // The Resend SDK resolves with { data, error } instead of throwing on API
  // errors (bad key, etc.) — surface that as a thrown error so the caller's
  // try/catch logs it consistently.
  const { error } = await resend.emails.send({
    from: "Unboxed <onboarding@resend.dev>",
    to: NOTIFICATION_RECIPIENT,
    subject: `New Booking ${bookingNumber} - Pending Verification`,
    text: [
      `Booking Number: ${bookingNumber}`,
      `Customer Name: ${customerName}`,
      `Customer Mobile: ${customerMobile}`,
      `Delivery Address: ${customerAddress}`,
      `Games: ${gamesText}`,
      `Rental Dates: ${datesText}`,
      `Grand Total: ${amountText}`,
      `GCash Reference Number: ${gcashReferenceNumber}`,
    ].join("\n"),
  });

  if (error) throw error;
}
