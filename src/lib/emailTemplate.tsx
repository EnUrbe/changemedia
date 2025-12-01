import { render } from "@react-email/render";
import BookingConfirmationEmail from "../emails/BookingConfirmation";

export async function generateBookingEmail(
  clientName: string,
  serviceType: string,
  dateStr: string
) {
  const html = await render(
    <BookingConfirmationEmail
      clientName={clientName}
      serviceType={serviceType}
      dateStr={dateStr}
    />
  );
  return html;
}

