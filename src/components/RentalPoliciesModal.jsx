export default function RentalPoliciesModal() {
  return (
    <div
      className="modal fade"
      id="rentalPoliciesModal"
      tabIndex="-1"
      aria-labelledby="rentalPoliciesModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5" id="rentalPoliciesModalLabel">
              Full Rental Policies
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h3 className="h6 fw-semibold">Payment</h3>
            <ul className="small text-body-secondary">
              <li>
                Full payment, including the security deposit, must be made
                via GCash before the booking is confirmed.
              </li>
              <li>Bookings are confirmed only after payment is manually verified.</li>
            </ul>
            <h3 className="h6 fw-semibold">Cancellation</h3>
            <ul className="small text-body-secondary">
              <li>Customers may cancel before the booking is confirmed.</li>
              <li>Once confirmed, rental payments are non-refundable.</li>
              <li>
                The security deposit will still be refunded if the games have
                not yet been delivered.
              </li>
            </ul>
            <h3 className="h6 fw-semibold">Security Deposit</h3>
            <ul className="small text-body-secondary">
              <li>A refundable security deposit is required for every rental.</li>
              <li>The deposit is returned after the games are returned and inspected.</li>
              <li>
                Any late fees, damage fees, or missing-item charges will be
                deducted from the deposit.
              </li>
            </ul>
            <h3 className="h6 fw-semibold">Late Returns</h3>
            <ul className="small text-body-secondary">
              <li>
                Games returned after the agreed return date will be charged
                the listed late fee per day.
              </li>
              <li>Late fees may be deducted from the security deposit.</li>
            </ul>
            <h3 className="h6 fw-semibold">Damage or Missing Items</h3>
            <ul className="small text-body-secondary">
              <li>
                Customers are responsible for keeping the games and all
                components in good condition.
              </li>
              <li>
                Charges may apply for damaged or missing cards, pieces,
                boxes, or other components.
              </li>
              <li>
                If a game is lost or severely damaged, part or all of the
                security deposit may be withheld.
              </li>
            </ul>
            <h3 className="h6 fw-semibold">Delivery and Return</h3>
            <ul className="small text-body-secondary">
              <li>Delivery and return are handled through Lalamove.</li>
              <li>The customer is responsible for both delivery and return fees.</li>
              <li>Lalamove fees are separate from the rental price.</li>
            </ul>
            <h3 className="h6 fw-semibold mb-0">Customer Responsibility</h3>
            <ul className="small text-body-secondary mb-0">
              <li>
                Customers should check the games upon receipt and report any
                existing damage or missing pieces as soon as possible.
              </li>
              <li>
                Games should be kept clean, dry, and away from food, drinks,
                pets, and other sources of damage.
              </li>
            </ul>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary rounded-pill px-4"
              data-bs-dismiss="modal"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
