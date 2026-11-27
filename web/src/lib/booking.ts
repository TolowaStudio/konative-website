/**
 * The one public booking link. Every "book a call" surface builds its href
 * here so the URL and the UTM scheme cannot drift (TS-4371).
 *
 * Scheme: utm_source=konative.com, utm_medium=<site|email|llms>,
 * utm_campaign=booking, utm_content=<placement slug>.
 */
export const BOOKING_BASE_URL = "https://cal.com/jeramey-james";

export type BookingMedium = "site" | "email" | "llms";

export function bookingUrl(placement: string, medium: BookingMedium = "site"): string {
  const params = new URLSearchParams({
    utm_source: "konative.com",
    utm_medium: medium,
    utm_campaign: "booking",
    utm_content: placement,
  });
  return `${BOOKING_BASE_URL}?${params.toString()}`;
}
