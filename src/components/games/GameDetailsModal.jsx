import { forwardRef } from "react";
import Image from "next/image";
import { peso } from "@/lib/format";

const GameDetailsModal = forwardRef(function GameDetailsModal(
  { game, isSelected, onToggle },
  ref
) {
  return (
    <div
      className="modal fade"
      id="gameDetailsModal"
      tabIndex="-1"
      aria-labelledby="gameDetailsModalLabel"
      aria-hidden="true"
      ref={ref}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5" id="gameDetailsModalLabel">
              {game ? game.name : "Game Name"}
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {game?.imageSrc && (
              <div className="ratio ratio-16x9 rounded-3 overflow-hidden mb-4 position-relative bg-dark-subtle">
                <Image
                  src={game.imageSrc}
                  alt={game.imageAlt}
                  fill
                  sizes="(min-width: 992px) 800px, 90vw"
                  className="object-fit-cover"
                />
              </div>
            )}
            <p className="text-body-secondary">{game?.description}</p>
            <div className="row row-cols-3 text-center g-2 my-3">
              <div className="col">
                <p className="small text-body-secondary mb-1">Players</p>
                <p className="fw-semibold mb-0">{game?.players ?? "—"}</p>
              </div>
              <div className="col">
                <p className="small text-body-secondary mb-1">Play Time</p>
                <p className="fw-semibold mb-0">{game?.playTime ?? "—"}</p>
              </div>
              <div className="col">
                <p className="small text-body-secondary mb-1">
                  Recommended Age
                </p>
                <p className="fw-semibold mb-0">{game?.age ?? "—"}</p>
              </div>
            </div>
            {game && (
              <div>
                <h3 className="h6 fw-semibold mt-4 mb-2">How to Play</h3>
                <p className="text-body-secondary">{game.howToPlay}</p>
              </div>
            )}
            <h3 className="h6 fw-semibold mt-4 mb-2">What&rsquo;s Included</h3>
            <p className="text-body-secondary">
              All game pieces and components included with my copy will be
              checked before delivery.
            </p>
            <div className="row row-cols-3 text-center g-2 mt-3 pt-3 border-top">
              <div className="col">
                <p className="small text-body-secondary mb-1">Rental</p>
                <p className="fw-semibold mb-0">
                  {game ? `${peso(game.pricePerDay)}/day` : "—"}
                </p>
              </div>
              <div className="col">
                <p className="small text-body-secondary mb-1">
                  Refundable Deposit
                </p>
                <p className="fw-semibold mb-0">
                  {game ? peso(game.deposit) : "—"}
                </p>
              </div>
              <div className="col">
                <p className="small text-body-secondary mb-1">Late Fee</p>
                <p className="fw-semibold mb-0">
                  {game ? `${peso(game.lateFeePerDay)}/day` : "—"}
                </p>
              </div>
            </div>
            <p className="small text-body-secondary mt-4 mb-0">
              Please check the game when it arrives and let me know as soon
              as possible if anything looks damaged or missing.
            </p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary rounded-pill px-4"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className={`btn rounded-pill px-4 ${
                isSelected ? "btn-outline-success" : "btn-primary"
              }`}
              onClick={onToggle}
              disabled={!game}
            >
              {isSelected ? "Added" : "Add to Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default GameDetailsModal;
