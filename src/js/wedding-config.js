/**
 * WEDDING INVITATION CONFIGURATION
 * -------------------------------------------------------------
 * Edit this file to update any names, dates, venues, contact
 * details, or schedule information. All changes will automatically
 * reflect across the website, countdown, RSVP, and share buttons.
 */

export const WEDDING_CONFIG = {
  // Couple Information
  couple: {
    bride: "Aayushi",
    groom: "Abhishek",
    monogram: "A & A",
    hashtag: "#AayushiWedsAbhishek",
    subtitle: "invite you to share in the joy of their wedding",
    eyebrow: "We are getting married",
    gateSubtitle: "are getting married"
  },

  // Main Wedding Ceremony & Venue
  wedding: {
    // ISO 8601 string used by the countdown timer (Timezone: IST +05:30)
    targetISO: "2026-12-04T22:30:00+05:30",
    
    // Human-readable date and time formats
    displayDate: "04 · 12 · 2026",
    dayOfWeek: "Friday",
    time: "10:30 PM",
    
    // Venue details
    venueName: "Dhaba Sutara, Kursela",
    venueSummary: "Friday · Dhaba Sutara, Kursela",
    venueFullWhen: "Friday, 4 December 2026 · 10:30 PM",
    
    // Google Maps navigation link
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dhaba%20Sutara%2C%20Kursela",
    
    // Google Calendar 'Add to Calendar' link
    calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding%20-%20Aayushi%20%26%20Abhishek&dates=20261204T170000Z/20261204T200000Z&details=Dress%20code%3A%20traditional&location=Dhaba%20Sutara%2C%20Kursela"
  },

  // Family Blessings
  families: {
    bride: {
      title: "Bride's family",
      names: "Mr. Rakesh kr Singh & Mrs. Chandravati Singh"
    },
    groom: {
      title: "Groom's family",
      names: "Mr. Raman Singh & Mrs. Reeta Singh"
    }
  },

  // Celebration Events Schedule
  events: [
    {
      id: "sangeet",
      title: "Sangeet & Mehndi",
      dateFormatted: "Wednesday · 02.12.2026",
      meta: "Time and venue to be announced",
      dressCodeText: "Dress code: anything glittery",
      dressSwatches: ["#7B2E8E", "#E2B857"],
      calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Sangeet%20%26%20Mehndi%20-%20Aayushi%20%26%20Abhishek&dates=20261202/20261203&details=Dress%20code%3A%20anything%20glittery",
      mapUrl: null
    },
    {
      id: "haldi",
      title: "Haldi",
      dateFormatted: "Thursday · 03.12.2026",
      meta: "07:00 PM · At our sweet home",
      dressCodeText: "Dress code: shades of yellow",
      dressSwatches: ["#F2C230", "#F2A31B"],
      calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Haldi%20-%20Aayushi%20%26%20Abhishek&dates=20261203T133000Z/20261203T160000Z&details=Dress%20code%3A%20shades%20of%20yellow&location=At%20our%20sweet%20home",
      mapUrl: null
    },
    {
      id: "wedding",
      title: "Wedding",
      dateFormatted: "Friday · 4th December 2026",
      meta: "10:30 PM · Dhaba Sutara, Kursela",
      dressCodeText: "Dress code: traditional",
      dressSwatches: ["#F1C9D0"],
      calendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Wedding%20-%20Aayushi%20%26%20Abhishek&dates=20261204T170000Z/20261204T200000Z&details=Dress%20code%3A%20traditional&location=Dhaba%20Sutara%2C%20Kursela",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Dhaba%20Sutara%2C%20Kursela"
    }
  ],

  // RSVP & Contact Information
  contact: {
    coordinatorName: "Abhinav",
    phoneDisplay: "+91 6299201514",
    // Pure digits with country code for WhatsApp wa.me link
    whatsappNumber: "916299201514"
  },

  // Audio / Background Music
  music: {
    // If you have a custom MP3 audio file, put it into public/music/
    // and set audioSrc: '/music/my-song.mp3'.
    // If left empty (""), the website will play the built-in ambient acoustic chime melody!
    audioSrc: "",
    defaultVolume: 0.55
  },

  // Sharing & Metadata
  share: {
    title: "Aayushi Weds Abhishek",
    text: "You are invited to Aayushi & Abhishek’s wedding on 4 December 2026."
  }
};
