import { Client, AssociationTypes } from "@hubspot/api-client";

const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;
const hubspotPipelineId = process.env.HUBSPOT_PIPELINE_ID;
const hubspotDealstageId = process.env.HUBSPOT_DEALSTAGE_ID;

const hubspotClient = hubspotAccessToken
  ? new Client({ accessToken: hubspotAccessToken })
  : null;

// One-directional, frozen-at-creation practice sync into HubSpot: a Contact
// (deduped by phone) plus a Deal for the booking, associated together.
// Called from createBooking, wrapped in its own try/catch by the caller so a
// HubSpot failure never affects the booking response or the email send.
export async function syncBookingToHubSpot({
  bookingNumber,
  customerName,
  customerMobile,
  customerAddress,
  gamesText,
  datesText,
  grandTotal,
  gcashReferenceNumber,
}) {
  if (!hubspotClient || !hubspotPipelineId || !hubspotDealstageId) return;

  const searchResult = await hubspotClient.crm.contacts.searchApi.doSearch({
    filterGroups: [
      {
        filters: [
          { propertyName: "phone", operator: "EQ", value: customerMobile },
        ],
      },
    ],
  });

  let contactId;
  if (searchResult.results.length > 0) {
    contactId = searchResult.results[0].id;
  } else {
    const contact = await hubspotClient.crm.contacts.basicApi.create({
      properties: {
        firstname: customerName,
        phone: customerMobile,
        address: customerAddress,
      },
    });
    contactId = contact.id;
  }

  await hubspotClient.crm.deals.basicApi.create({
    properties: {
      dealname: `Booking ${bookingNumber} — ${customerName}`,
      amount: String(grandTotal),
      pipeline: hubspotPipelineId,
      dealstage: hubspotDealstageId,
      booking_details: `${gamesText} | ${datesText} | GCash ref: ${gcashReferenceNumber}`,
    },
    associations: [
      {
        to: { id: contactId },
        types: [
          {
            associationCategory: "HUBSPOT_DEFINED",
            associationTypeId: AssociationTypes.dealToContact,
          },
        ],
      },
    ],
  });
}
