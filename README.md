# Peter's Home Command Center 🏠

A premium, always-on smart home dashboard built with React, Vite, and Tailwind CSS.  
Designed to run full-screen on a wall-mounted TV — inside a beautiful wooden frame.

---

## What it looks like

```
┌─── Peter's Home Command Center ────────────────── Auto-refresh every 5 min ─┐
│                                                                               │
│  ┌──────────────┐  ┌──────────────────────────┐  ┌────────────────────────┐  │
│  │              │  │   TODAY'S SCHEDULE        │  │   UPCOMING             │  │
│  │   3:45 PM    │  │                           │  │                        │  │
│  │   Tuesday    │  │  ● 9:00 AM Morning Standup│  │  TUE 25  Dentist       │  │
│  │  June 24     │  │  ● NOW · Lunch with Joe   │  │  WED 26  Dinner        │  │
│  │   2026       │  │  ● 2:30 PM Insurance Call │  │  THU 27  Plumber       │  │
│  │              │  │  ● 5:30 PM Gym            │  │  SAT 29  Farmers Mkt   │  │
│  │  ⛅ 72°F     │  │                           │  │                        │  │
│  │  Partly      │  ├──────────────────────────┤  ├────────────────────────┤  │
│  │  Cloudy      │  │   TASKS                   │  │   REMINDERS            │  │
│  │              │  │   ─────────────────────── │  │  🏠 Mortgage — 1st     │  │
│  │  Feels 74°   │  │   □ Check morning emails  │  │  🔧 HVAC filter        │  │
│  │  Humidity 58%│  │   ✓ Daily workout         │  │  🗑️  Garbage — Tuesday  │  │
│  │  Wind 12 mph │  │   □ Review grocery list   │  │  🔥 Smoke detectors    │  │
│  │  H 76 / L 64 │  │   □ Evening walk          │  ├────────────────────────┤  │
│  └──────────────┘  └──────────────────────────┘  │  "The secret of getting│  │
│                                                   │   ahead is getting     │  │
│                                                   │   started." — Twain    │  │
│                                                   └────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# → http://localhost:5173
```

Press **F11** in your browser to go full-screen.

---

## Installation

### Prerequisites
- **Node.js 18+** — download at https://nodejs.org
- **npm** (included with Node.js)
- A modern browser (Chrome, Firefox, Edge)

### Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/peters-home-command-center.git
cd peters-home-command-center
npm install
```

---

## Running Locally

```bash
npm run dev
```

The dashboard opens at `http://localhost:5173`.  
It auto-reloads any time you save a file.

---

## Customisation

**Everything you need to personalise the dashboard lives in one file:**

```
src/config/settings.js
```

Open it and edit:

| Setting | Description |
|---|---|
| `ownerName` | Your first name (shows in greeting & empty states) |
| `houseMessage` | Text shown at the top of the clock card |
| `use12Hour` | `true` = 12-hour clock, `false` = 24-hour |
| `showSeconds` | Show seconds on the clock |
| `refreshIntervalMinutes` | How often to re-fetch calendar data |
| `weatherCity` | Display name for your city |
| `weatherLatitude/Longitude` | Your GPS coordinates for weather |
| `weatherUnit` | `'fahrenheit'` or `'celsius'` |
| `defaultTasks` | Your daily to-do list |
| `reminders` | Persistent house reminders |
| `quotes` | Rotating daily quotes |

---

## Weather Setup

Weather is powered by **Open-Meteo** — it is completely **free** and requires **no API key**.

1. Find your coordinates at https://www.latlong.net/
2. Open `src/config/settings.js`
3. Set `weatherLatitude`, `weatherLongitude`, and `weatherCity`
4. Set `weatherUnit` to `'fahrenheit'` or `'celsius'`
5. Save the file — weather appears automatically

```js
weatherEnabled:   true,
weatherLatitude:  47.6062,    // ← your latitude
weatherLongitude: -122.3321,  // ← your longitude
weatherCity:      'Seattle',  // ← display name
weatherUnit:      'fahrenheit',
```

---

## Google Calendar Setup

> The dashboard works beautifully with mock data out of the box.  
> Follow these steps when you're ready to connect your real calendar.

### Step 1 — Enable the Google Calendar API

1. Go to https://console.cloud.google.com
2. Create a new project (or select an existing one)
3. In the left menu, go to **APIs & Services → Library**
4. Search for **"Google Calendar API"** and click **Enable**

### Step 2 — Create an API Key

1. Go to **APIs & Services → Credentials**
2. Click **+ Create Credentials → API key**
3. Copy the key that appears
4. *(Recommended)* Click **Edit** on the key → under "API restrictions", restrict it to "Google Calendar API" → under "Application restrictions", restrict to your domain or IP

### Step 3 — Get your Calendar ID

1. Open **Google Calendar** at https://calendar.google.com
2. Click the three-dot menu next to your calendar → **Settings and sharing**
3. Scroll down to **"Integrate calendar"**
4. Copy the **Calendar ID** (looks like `your.email@gmail.com` for your primary calendar)

### Step 4 — Share your calendar (required for API key access)

For an API key to read your calendar, it must be accessible without OAuth:

1. In the calendar's settings, scroll to **"Access permissions for events"**
2. Check **"Make available to public"** → **"See all event details"**

> ⚠️ This makes your calendar events publicly readable. If you prefer privacy, use OAuth2 instead — see the "Advanced: OAuth2" section below.

### Step 5 — Update settings.js

```js
googleCalendarEnabled: true,
googleApiKey:          'AIzaSy...your-key-here...',
googleCalendarId:      'your.email@gmail.com',
```

Save the file. Live events will replace mock data immediately.

### Advanced: OAuth2 (private calendar)

If you don't want to make your calendar public, you can use OAuth2.  
This requires a backend or Google's GAPI client library with a sign-in flow.  
Search for "Google Calendar API OAuth2 JavaScript quickstart" for a guide.  
The hook in `src/hooks/useCalendar.js` has a clearly-marked section where the fetch URL can be replaced with an authenticated request.

---

## Deployment

### Vercel (recommended — free, one click)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at https://vercel.com — it auto-deploys on every push.

### Netlify

```bash
npm run build
# Drag the `dist/` folder to https://app.netlify.com/drop
```

Or connect your GitHub repo at https://netlify.com for auto-deploys.

### GitHub Pages

1. Open `vite.config.js` and set `base` to your repo name:
   ```js
   base: '/peters-home-command-center/',
   ```
2. Install the deploy tool:
   ```bash
   npm install --save-dev gh-pages
   ```
3. Add to `package.json` scripts:
   ```json
   "deploy": "gh-pages -d dist"
   ```
4. Build and deploy:
   ```bash
   npm run build
   npm run deploy
   ```
5. In your GitHub repo → Settings → Pages → Source: `gh-pages` branch

---

## Raspberry Pi / Mini PC TV Setup

This is how to set up a dedicated always-on display using a Raspberry Pi 4 (or any mini PC running Linux).

### Step 1 — Install the OS

- Download **Raspberry Pi OS Lite (64-bit)** or the full desktop version
- Flash it with **Raspberry Pi Imager**: https://www.raspberrypi.com/software/
- Enable SSH in imager settings for remote access

### Step 2 — Install Node.js on the Pi

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # should show v20.x
```

### Step 3 — Clone and build the app

```bash
git clone https://github.com/YOUR_USERNAME/peters-home-command-center.git
cd peters-home-command-center
npm install
npm run build
```

### Step 4 — Serve the built app

Install a simple static file server:

```bash
npm install -g serve
serve -s dist -l 3000
```

Or use **Nginx** for a more robust setup:

```bash
sudo apt install nginx
sudo cp -r dist/* /var/www/html/
sudo systemctl enable nginx
sudo systemctl start nginx
# Dashboard now at http://localhost
```

### Step 5 — Auto-start Chromium in kiosk mode on boot

Create a startup script:

```bash
mkdir -p ~/.config/autostart
nano ~/.config/autostart/dashboard.desktop
```

Paste this content (adjust the URL if using Nginx on port 80):

```ini
[Desktop Entry]
Type=Application
Name=Home Dashboard
Exec=/bin/bash -c 'sleep 5 && chromium-browser --kiosk --noerrdialogs --disable-infobars --no-first-run --disable-session-crashed-bubble --disable-restore-session-state http://localhost:3000'
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
```

**Chromium kiosk flags explained:**
- `--kiosk` — full-screen, no address bar, no tabs, no close button
- `--noerrdialogs` — suppress crash/error popups  
- `--disable-infobars` — hide "running in automation" banners
- `--no-first-run` — skip the first-run welcome screen

### Step 6 — Prevent screen from sleeping

```bash
sudo nano /etc/lightdm/lightdm.conf
```

Add under `[Seat:*]`:
```
xserver-command=X -s 0 -dpms
```

Or add to `/etc/xdg/lxsession/LXDE-pi/autostart`:
```
@xset s noblank
@xset s off
@xset -dpms
```

### Step 7 — Keep it updated

On your main computer:

```bash
git add .
git commit -m "Update settings"
git push
```

On the Raspberry Pi:

```bash
cd ~/peters-home-command-center
git pull
npm run build
# If using Nginx:
sudo cp -r dist/* /var/www/html/
```

Or set up a **cron job** to auto-pull and rebuild every night:

```bash
crontab -e
```

Add:
```
0 3 * * * cd /home/pi/peters-home-command-center && git pull && npm run build && sudo cp -r dist/* /var/www/html/
```

---

## Full-Screen in Browser (without Raspberry Pi)

On any computer with Chrome/Edge connected to your TV via HDMI:

1. Open Chrome and navigate to `http://localhost:5173` (dev) or your deployed URL
2. Press **F11** for full-screen  
   *(or Menu → More tools → Cast to cast to a Chromecast)*

### Kiosk mode via command line

**Windows:**
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --app=http://localhost:5173
```

**macOS:**
```bash
open -a "Google Chrome" --args --kiosk http://localhost:5173
```

**Linux:**
```bash
chromium-browser --kiosk http://localhost:5173
```

---

## Project Structure

```
.
├── index.html                  # App shell (Google Fonts loaded here)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
│
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Layout + data hooks
    ├── index.css               # Global styles + kiosk CSS
    │
    ├── config/
    │   └── settings.js         # ← EDIT THIS to customise everything
    │
    ├── data/
    │   └── mockData.js         # Sample calendar & weather data
    │
    ├── hooks/
    │   ├── useCalendar.js      # Google Calendar API + mock fallback
    │   ├── useWeather.js       # Open-Meteo weather API
    │   └── useTasks.js         # Task list with localStorage
    │
    └── components/
        ├── Card.jsx            # Reusable glass card + header
        ├── ClockWidget.jsx     # Large clock + date + greeting
        ├── WeatherWidget.jsx   # Current weather conditions
        ├── CalendarWidget.jsx  # Today's events
        ├── UpcomingWidget.jsx  # Upcoming events (next 7 days)
        ├── TasksWidget.jsx     # Interactive to-do list
        ├── RemindersWidget.jsx # Persistent house reminders
        └── QuoteWidget.jsx     # Daily rotating quote
```

---

## Tips & Tricks

**Burn-in prevention:** Modern LCD and QLED TVs don't suffer from burn-in. If you have an OLED TV, use your TV's built-in screen saver / pixel-shift feature.

**Offline use:** Once built and deployed (or served locally), the app works without internet for the dashboard layout. Weather and calendar require connectivity to fetch fresh data.

**Multiple calendars:** In `useCalendar.js`, you can make multiple API calls and merge the results to show events from multiple Google calendars.

**Custom fonts:** Change the Google Fonts link in `index.html` to any font you prefer.

**Remote updates:** Push changes to GitHub from any computer. Pull on the Pi to update. No need to be physically at the TV.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI framework |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS v3](https://tailwindcss.com) | Utility-first styling |
| [Day.js](https://day.js.org) | Lightweight date/time |
| [Open-Meteo](https://open-meteo.com) | Free weather API (no key) |
| [Google Calendar API](https://developers.google.com/calendar) | Live calendar events |

---

*Built with ❤️ for Peter's first house.*
