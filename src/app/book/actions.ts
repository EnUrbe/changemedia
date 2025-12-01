"use server";

import { createBooking, getBookingsForDateRange } from "@/lib/bookingStore";
import { getCalendarFeeds } from "@/lib/calendarStore";
import { sendEmail } from "@/lib/email";
import { generateBookingEmail } from "@/lib/emailTemplate";
import { addHours, startOfDay, endOfDay, parseISO, format, isWithinInterval } from "date-fns";
import { createEvents, EventAttributes } from "ics";
import ical from "node-ical";

async function getExternalEvents(start: Date, end: Date) {
  const feeds = await getCalendarFeeds();
  const events: { start: Date; end: Date }[] = [];

  const promises = feeds.map(async (feed) => {
    try {
      const response = await fetch(feed.url);
      if (!response.ok) throw new Error(`Failed to fetch ${feed.url}`);
      const text = await response.text();
      const data = ical.sync.parseICS(text);

      for (const k in data) {
        const event = data[k];
        if (event.type === "VEVENT" && event.start && event.end) {
          // Simple check if event overlaps with the day we are looking at
          // We'll refine the overlap check in the main loop, but here we just collect relevant events
          // Actually, let's just collect everything that might overlap
          const evStart = new Date(event.start);
          const evEnd = new Date(event.end);
          
          // If the event overlaps with our target day
          if (evStart < end && evEnd > start) {
             events.push({ start: evStart, end: evEnd });
          }
        }
      }
    } catch (error) {
      console.error(`Error fetching calendar ${feed.name}:`, error);
    }
  });

  await Promise.all(promises);
  return events;
}

export async function getAvailableSlots(dateStr: string) {
  const date = parseISO(dateStr);
  const start = startOfDay(date);
  const end = endOfDay(date);

  // Fetch existing bookings for this day
  const bookings = await getBookingsForDateRange(start, end);
  
  // Fetch external calendar events
  const externalEvents = await getExternalEvents(start, end);

  // Define working hours (e.g., 9 AM to 5 PM)
  const slots = [];
  let current = new Date(date);
  current.setHours(9, 0, 0, 0);
  
  const endWorkDay = new Date(date);
  endWorkDay.setHours(17, 0, 0, 0);

  while (current < endWorkDay) {
    const slotEnd = addHours(current, 1);
    
    // Check collision with internal bookings
    const isTakenInternal = bookings.some(b => {
      const bStart = new Date(b.startTime);
      const bEnd = new Date(b.endTime);
      return (current >= bStart && current < bEnd) || (slotEnd > bStart && slotEnd <= bEnd);
    });

    // Check collision with external events
    const isTakenExternal = externalEvents.some(ev => {
      return (current >= ev.start && current < ev.end) || (slotEnd > ev.start && slotEnd <= ev.end) || (ev.start >= current && ev.end <= slotEnd);
    });

    if (!isTakenInternal && !isTakenExternal) {
      slots.push(current.toISOString());
    }
    
    current = slotEnd;
  }

  return slots;
}

export async function submitBooking(formData: FormData) {
  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const serviceType = formData.get("serviceType") as string;
  const startTimeStr = formData.get("startTime") as string;
  
  // Extended details
  const organization = formData.get("organization") as string;
  const role = formData.get("role") as string;
  const website = formData.get("website") as string;
  const social = formData.get("social") as string;
  const goals = formData.get("goals") as string;
  const userNotes = formData.get("notes") as string;

  // Compile all notes into a structured format for AI ingestion
  const compiledNotes = `
--- CLIENT DETAILS ---
Organization: ${organization || "N/A"}
Role: ${role || "N/A"}
Website: ${website || "N/A"}
Social: ${social || "N/A"}

--- GOALS ---
${goals || "N/A"}

--- USER NOTES ---
${userNotes || "N/A"}

--- AI RESEARCH TRIGGER ---
[TODO: System to auto-enrich this profile based on domain/socials]
`.trim();

  if (!clientName || !clientEmail || !startTimeStr) {
    return { error: "Missing required fields" };
  }

  const startTime = new Date(startTimeStr);
  const endTime = addHours(startTime, 1); // Default 1 hour duration

  try {
    const booking = await createBooking({
      clientName,
      clientEmail,
      serviceType,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      notes: compiledNotes, // Store the rich data in the notes field
    });

    // Generate ICS file content
    const event: EventAttributes = {
      start: [startTime.getFullYear(), startTime.getMonth() + 1, startTime.getDate(), startTime.getHours(), startTime.getMinutes()],
      duration: { hours: 1 },
      title: `CHANGE Media: ${serviceType}`,
      description: `Meeting with ${clientName}\n\n${compiledNotes}`,
      location: 'Google Meet / Zoom (TBD)',
      url: 'https://changemedia.studio',
      organizer: { name: 'CHANGE Media', email: 'hello@changemedia.studio' },
      attendees: [
        { name: clientName, email: clientEmail, rsvp: true }
      ]
    };

    return new Promise<{ success: boolean; ics?: string }>((resolve) => {
      createEvents([event], async (error, value) => {
        if (error) {
          console.error(error);
          resolve({ success: true }); // Still success, just no ICS
        } else {
          // Send email with invite
          await sendEmail({
            to: clientEmail,
            subject: `Booking Confirmed: ${serviceType} with CHANGE Media`,
            text: `Hi ${clientName},\n\nYour ${serviceType} has been confirmed for ${format(startTime, "MMMM d, yyyy 'at' h:mm a")}.\n\nPlease find the calendar invitation attached.\n\nBest,\nCHANGE Media Team`,
            html: await generateBookingEmail(clientName, serviceType, format(startTime, "MMMM d, yyyy 'at' h:mm a")),
            attachments: [
              {
                filename: 'invite.ics',
                content: value,
                contentType: 'text/calendar'
              }
            ]
          });

          resolve({ success: true, ics: value });
        }
      });
    });
  } catch (error) {
    console.error("Booking error:", error);
    return { error: "Failed to create booking" };
  }
}
