import Image from "next/image";

const STATUS_BADGE = {
  unknown: { text: "Select dates to check", className: "bg-secondary" },
  available: { text: "Available", className: "bg-success" },
  unavailable: {
    text: "Unavailable for selected dates",
    className: "bg-danger",
  },
};

export default function GameCard({ game, status, isSelected, onToggle, onViewDetails }) {
  const badge = STATUS_BADGE[status];
  const isDisabled = status === "unavailable" && !isSelected;

  return (
    <div className="col game-card">
      <div className="card h-100 border-0 shadow-sm">
        <div className="position-relative rounded-top-4 overflow-hidden">
          <div
            className="ratio ratio-4x3 view-details-trigger"
            role="button"
            tabIndex={0}
            onClick={onViewDetails}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onViewDetails();
              }
            }}
          >
            {game.imageSrc ? (
              <Image
                src={game.imageSrc}
                alt={game.imageAlt}
                fill
                sizes="(min-width: 1200px) 33vw, (min-width: 576px) 50vw, 100vw"
                className="object-fit-cover"
              />
            ) : (
              <div
                className={`${game.placeholderBg} d-flex align-items-center justify-content-center w-100 h-100`}
              >
                <i className={`bi ${game.icon} text-primary display-3`}></i>
              </div>
            )}
          </div>
          <span
            className={`badge availability-badge ${badge.className} rounded-pill position-absolute top-0 end-0 m-3`}
          >
            {badge.text}
          </span>
        </div>
        <div className="card-body d-flex flex-column p-3 p-sm-4">
          <h3
            className="h5 card-title mb-2 view-details-trigger"
            role="button"
            tabIndex={0}
            onClick={onViewDetails}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onViewDetails();
              }
            }}
          >
            {game.name}
          </h3>
          <p className="text-body-secondary card-desc-clamp mb-2 mb-sm-3">
            {game.description}
          </p>
          <ul className="list-unstyled small text-body-secondary mb-2 mb-sm-3">
            <li className="mb-1">
              <i className="bi bi-people me-2"></i>
              {game.players}
            </li>
            <li>
              <i className="bi bi-clock me-2"></i>
              {game.playTime}
            </li>
          </ul>
          <p className="mb-1">
            <span className="fs-4 fw-bold">&#8369;{game.pricePerDay}</span>
            <span className="text-body-secondary">/day</span>
          </p>
          <p className="small text-body-secondary mb-2 mb-sm-3">
            &#8369;{game.deposit} refundable deposit
          </p>
          <div className="d-grid gap-2 mt-auto">
            <button
              type="button"
              className={`btn rounded-pill ${
                isSelected ? "btn-outline-success" : "btn-primary"
              }`}
              onClick={onToggle}
              disabled={isDisabled}
            >
              <i
                className={`bi ${
                  isSelected
                    ? "bi-check-circle"
                    : isDisabled
                    ? "bi-slash-circle"
                    : "bi-cart-plus"
                } me-2`}
              ></i>
              {isSelected
                ? "Added"
                : isDisabled
                ? "Already Booked"
                : "Add to Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
