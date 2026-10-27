/**
 * Calendar utilities for downloading .ics file or adding to Google Calendar
 */
export function generateIcsCalendar(weddingData) {
  const { couple, date, venue, message } = weddingData;
  const title = `Wedding of ${couple.groom.fullName} & ${couple.bride.fullName}`;
  const description = `${message.romantic}\n\nVenue: ${venue.name}, ${venue.address}, ${venue.city}`;
  const location = `${venue.name}, ${venue.address}, ${venue.city}, ${venue.country}`;

  // 2027-01-03 11:30 AM IST (UTC+5:30) -> 20270103T060000Z
  // Concludes after lunch ~ 3:30 PM IST -> 20270103T100000Z
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ahamed Ansar & Nowfiyath Basriya Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:wedding-Ahamed Ansar-Nowfiyath Basriya-2027@wedding.com',
    'DTSTAMP:20261017T000000Z',
    'DTSTART:20270103T060000Z',
    'DTEND:20270103T100000Z',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Wedding-${couple.groom.fullName}-${couple.bride.fullName}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function openGoogleCalendar(weddingData) {
  const { couple, venue, message } = weddingData;
  const title = encodeURIComponent(`Wedding of ${couple.groom.fullName} & ${couple.bride.fullName}`);
  const details = encodeURIComponent(
    `${message.romantic}\n\nWedding (Nikah): 11:30 AM at Mohideen Masjid, Eruvadi\nCelebratory Lunch: After Zuhar at Baithussalam, Eruvadi, Tirunelveli`
  );
  const location = encodeURIComponent(`${venue.name}, ${venue.address}, ${venue.city}`);
  const dates = '20270103T060000Z/20270103T100000Z';

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
