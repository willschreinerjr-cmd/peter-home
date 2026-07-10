// ============================================================
//  PETER'S HOME COMMAND CENTER — SETTINGS
//
//  This is the single file you edit to customize everything.
//  After making changes, save the file and the dashboard
//  will update automatically (or restart the dev server).
//
//  See README.md for full setup instructions.
// ============================================================

export const settings = {

  // ── SPOTLIGHT ROTATION ────────────────────────────────────────
  // The right panel automatically cycles through 4 views.
  // Set spotlightEnabled to false to lock it on the month calendar.
  spotlightEnabled: true,

  // Seconds to show each panel before rotating to the next.
  spotlightIntervalSeconds: 30,

  // Order of panels to rotate through.
  // Options: 'month' | 'today' | 'tasks' | 'weather' | 'photos'
  // Remove any entry to skip that panel.
  spotlightPanels: ['month', 'today', 'tasks', 'weather', 'photos'],

  // ── BACKGROUND ────────────────────────────────────────────────
  // Set a background image URL to get the atmospheric photo look
  // from the reference image (like the Yaeger Woodworks display).
  //
  // Recommended: a dark landscape/mountain/forest photo.
  // A great free source is Unsplash. Example URLs:
  //   Dark mountains at night: https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop&q=80
  //   Dark forest:             https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1080&fit=crop&q=80
  //   Winter landscape:        https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&h=1080&fit=crop&q=80
  //
  // Set to null to use the built-in dark CSS gradient (works offline).
  backgroundImageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&h=1080&fit=crop&q=80',

  // How dark to make the overlay on top of the background image (0–1).
  // Higher = more readable text but less visible photo.
  backgroundDimness: 0.50,

  // ── GENERAL ──────────────────────────────────────────────────
  // Your name, shown in the greeting and empty-state messages.
  ownerName: 'Peter',

  // Message shown at the top of the dashboard.
  houseMessage: "Welcome Home, Peter",

  // ── DISPLAY ──────────────────────────────────────────────────
  // How often (in minutes) to re-fetch calendar and weather data.
  refreshIntervalMinutes: 5,

  // Show seconds on the clock (true/false).
  showSeconds: false,

  // 12-hour format (true) or 24-hour format (false).
  use12Hour: true,

  // How many upcoming events to show in the right column.
  maxUpcomingEvents: 8,

  // ── WEATHER ──────────────────────────────────────────────────
  // Uses Open-Meteo (https://open-meteo.com) — FREE, no API key needed.
  // Just set your location coordinates and city name below.
  //
  // Find your latitude & longitude at: https://www.latlong.net/
  //
  weatherEnabled: true,
  weatherLatitude:  43.0803,   // Pewaukee, WI
  weatherLongitude: -88.2287,  // W299N857 Maple Ave, Pewaukee WI 53072
  weatherCity: 'Pewaukee',     // display name
  weatherUnit: 'fahrenheit',   // 'fahrenheit' | 'celsius'

  // ── APPLE CALENDAR ───────────────────────────────────────────
  // Connect your iCloud shared calendar so events appear on the dashboard.
  //
  // HOW TO SHARE YOUR APPLE CALENDAR:
  //   Mac:    Open Calendar → right-click your calendar → Share Calendar…
  //           Enable "Public Calendar" → copy the URL shown
  //   iPhone: Settings → [your calendar] → Share Calendar → Public Calendar
  //
  // IMPORTANT: Change  webcal://  to  https://  in the URL before pasting.
  // Example:  https://p01-caldav.icloud.com/published/2/YOUR_CALENDAR_ID
  //
  appleCalendarEnabled: true,
  appleCalendarIcsUrl: 'https://p171-caldav.icloud.com/published/2/MTA3MzYyNTc1OTExMDczNpLrUGlDkWQwX2-J4cj4M8k7upMj929jA4d0MjsrZTCMfvaKjhWJ8mbYSunFn8E2pHDEX_526Clze2yvam5K04A',

  // CORS Proxy (required for iCal — browser can't fetch iCloud directly).
  corsProxy: 'https://corsproxy.io/?url=',

  // ── GOOGLE CALENDAR ──────────────────────────────────────────
  // STEP 1: Read the "Google Calendar Setup" section in README.md.
  // STEP 2: Create an API key at https://console.cloud.google.com
  // STEP 3: Set googleCalendarEnabled to true.
  // STEP 4: Fill in googleApiKey and googleCalendarId below.
  //
  // Until enabled, beautiful mock data is shown automatically.
  //
  googleCalendarEnabled: false,

  // Your Google Calendar API Key (keep this private — don't commit it publicly).
  googleApiKey: 'YOUR_GOOGLE_API_KEY_HERE',

  // Your Calendar ID — usually your Gmail address.
  // Find it: Google Calendar → Gear Icon → Settings → Your Calendar → Integrate Calendar.
  googleCalendarId: 'YOUR_EMAIL@gmail.com',

  // How many days ahead to fetch events for the upcoming section.
  upcomingDays: 7,

  // ── PHOTOS ────────────────────────────────────────────────────
  // Photos shown in the rotating "Photos" spotlight panel.
  // Replace these sample URLs with your own photo links.
  // Tip: upload photos to Google Photos or iCloud and use the shared link,
  //      or drop images in the /public/ folder and reference them as './photo.jpg'.
  //
  photoIntervalSeconds: 12,
  photos: [
    {
      id: 'placeholder-1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80',
      title: 'Add your own photos',
      caption: 'Edit src/config/settings.js → photos to add personal pictures',
    },
    {
      id: 'placeholder-2',
      url: 'https://images.unsplash.com/photo-1439853949212-36089f36a4b8?w=1400&q=80',
      title: 'Replace with family photos',
      caption: 'Drop images in /public/ and reference them as \'./your-photo.jpg\'',
    },
    {
      id: 'placeholder-3',
      url: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1400&q=80',
      title: '',
      caption: '',
    },
  ],

  // ── TASKS ─────────────────────────────────────────────────────
  // Your daily task list. Checked/unchecked state is saved in the
  // browser's localStorage so it persists between page loads.
  //
  // To reset all tasks to unchecked, clear localStorage in DevTools
  // or change the IDs of any tasks you want to reset.
  //
  defaultTasks: [],   // Add tasks from the mobile editor or settings.js

  // ── CHORES ────────────────────────────────────────────────────
  // Recurring house chores. The dashboard automatically calculates
  // whether each chore is due today, tomorrow, or days away.
  //
  // scheduleType options:
  //   'weekly'               — weekday: 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  //   'monthly-nth-weekday'  — nth: 1–5, weekday: 0–6
  //   'bimonthly'            — months: array of 0-based month numbers
  //   'biweekly'             — every other week (fixed reference cycle)
  //
  chores: [
    {
      id: 'trash',
      text: 'Trash & Recycling',
      icon: '🗑️',
      scheduleType: 'weekly',
      weekday: 1,          // Monday
      detail: 'Every Monday',
    },
    {
      id: 'bathrooms',
      text: 'Clean Bathrooms',
      icon: '🚿',
      scheduleType: 'weekly',
      weekday: 0,          // Sunday
      detail: 'Every Sunday',
    },
    {
      id: 'vacuum',
      text: 'Vacuum',
      icon: '🧹',
      scheduleType: 'weekly',
      weekday: 3,          // Wednesday
      detail: 'Every Wednesday',
    },
    {
      id: 'smoker',
      text: 'Clean Smoker',
      icon: '🔥',
      scheduleType: 'monthly-nth-weekday',
      nth: 1,              // 1st Saturday of each month
      weekday: 6,
      detail: '1st Saturday of each month',
    },
    {
      id: 'windows',
      text: 'Clean Windows',
      icon: '🪟',
      scheduleType: 'bimonthly',
      months: [0, 2, 4, 6, 8, 10],  // Jan, Mar, May, Jul, Sep, Nov
      detail: 'Every other month',
    },
    {
      id: 'floors',
      text: 'Wash Floors',
      icon: '🧽',
      scheduleType: 'biweekly',
      referenceDate: '2026-07-07',
      detail: 'Every other week',
    },
  ],

  // ── QUOTES ────────────────────────────────────────────────────
  // Rotates daily. Add your own favorite quotes!
  // Format: { text: '...', author: '...' }
  //
  quotes: [
    { text: "The secret of getting ahead is getting started.",               author: "Mark Twain"         },
    { text: "Home is not a place — it is a feeling.",                        author: "Cecelia Ahern"      },
    { text: "The ache for home lives in all of us, the safe place.",         author: "Maya Angelou"       },
    { text: "Small habits, compounded over time, create remarkable results.", author: "James Clear"       },
    { text: "Simplicity is the ultimate sophistication.",                    author: "Leonardo da Vinci"  },
    { text: "Do what you can, with what you have, where you are.",           author: "Theodore Roosevelt" },
    { text: "Your home should tell the story of who you are.",               author: "Nate Berkus"        },
    { text: "The best investment you can make is in yourself.",              author: "Warren Buffett"     },
    { text: "A house is made of walls; a home is built with love.",          author: "Unknown"            },
    { text: "Own your morning. Elevate your life.",                          author: "Robin Sharma"       },
    { text: "It always seems impossible until it is done.",                  author: "Nelson Mandela"     },
    { text: "The details are not the details. They make the design.",        author: "Charles Eames"      },
  ],
}
