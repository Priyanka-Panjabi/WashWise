# 🚗 WashWise - Weather-Smart Car Wash Assistant

A production-ready MVP that helps drivers in cold-weather cities determine the best time to wash their car based on weather forecasts, snowfall risk, freeze conditions, and salt corrosion analysis.

Perfect for cities like Calgary, Canada where road salt and winter conditions make car wash timing critical.

---

## 📋 Features

- **Weather Integration**: Real-time weather data and 5-day forecasts from OpenWeather API
- **Smart Recommendations**: AI-powered decision engine calculates optimal wash timing
- **Salt Risk Analysis**: Visual risk meter showing corrosion danger levels
- **Cost Optimizer**: Compare pay-per-wash vs. monthly membership with break-even analysis
- **Geolocation Support**: Automatic location detection or manual city input
- **Offline Persistence**: Location and preferences saved to localStorage
- **Responsive Design**: Clean, professional UI built with TailwindCSS

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (ES6+)
- **State Management**: Redux Toolkit
- **Data Fetching**: Axios
- **Styling**: TailwindCSS
- **Testing**: Jest + React Testing Library
- **API**: OpenWeather API

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenWeather API key ([Get one free here](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   cd WashWise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your API key:
   ```
   OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
washwise/
├── app/
│   ├── layout.js              # Root layout with Redux Provider
│   ├── page.js                # Main dashboard
│   ├── globals.css            # Global styles + Tailwind
│   └── api/
│       └── weather/route.js   # Server-side OpenWeather proxy
│
├── components/
│   ├── LocationSelector.js   # Geolocation + manual input
│   ├── WeatherCard.js         # Current weather display
│   ├── RecommendationBadge.js # Wash recommendation
│   ├── SaltRiskMeter.js       # Visual risk indicator
│   ├── CostAnalyzer.js        # Cost comparison
│   ├── ExplanationCard.js     # AI explanation
│   └── ErrorFallback.js       # Error boundary UI
│
├── lib/
│   ├── washDecisionEngine.js  # ⭐ Core business logic
│   ├── weatherClient.js       # Weather data parsing
│   ├── costCalculator.js      # Cost analysis
│   └── utils.js               # Helper functions
│
├── store/
│   ├── index.js               # Redux store config
│   ├── locationSlice.js       # Location state
│   ├── weatherSlice.js        # Weather state + async thunks
│   └── washSlice.js           # Wash history + preferences
│
├── hooks/
│   ├── useLocation.js         # Geolocation hook
│   └── useWashRecommendation.js
│
├── constants/
│   └── index.js               # App constants
│
└── __tests__/
    ├── washDecisionEngine.test.js
    └── costCalculator.test.js
```

---

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The test suite includes:
- Salt risk calculation tests
- Wash recommendation logic tests
- Cost analysis tests
- Edge case handling

---

## 🧮 Decision Engine

The core business logic is in `/lib/washDecisionEngine.js` - a pure JavaScript module with no React dependencies.

### Salt Risk Formula

```
riskScore = (daysSinceSnow × 2) + (freezeDays × 1.5) - (daysSinceWash × 1)
```

### Recommendation Logic

- **Snow within 48h** → "Wait"
- **Risk Score > 15** → "Wash Now"
- **Risk Score > 8** → "Undercarriage Recommended"
- **Otherwise** → "Wait"

### Risk Levels

- **Low**: Score ≤ 5
- **Moderate**: Score 6-12
- **High**: Score > 12

---

## 🌐 API Routes

### GET `/api/weather`

Server-side proxy for OpenWeather API (keeps API key secure).

**Query Parameters:**
- `lat` + `lon` (coordinates) OR
- `city` (city name)

**Response:**
```json
{
  "current": { ... },
  "forecast": { ... },
  "timestamp": "2024-02-24T..."
}
```

---

## 💾 State Management

Uses Redux Toolkit with three slices:

1. **Location Slice**: User location (lat/lon or city)
2. **Weather Slice**: Current weather + forecast data
3. **Wash Slice**: Last wash date, history, preferences

All state persists to localStorage for offline support.

---

## 🎨 Customization

### Change Default Preferences

Edit `/constants/index.js`:

```javascript
export const DEFAULT_PREFERENCES = {
  pricePerWash: 15,        // Change default price
  monthlyMembership: 30,   // Change default membership
  washesPerMonth: 4,       // Change default frequency
};
```

### Modify Risk Thresholds

Edit `/lib/washDecisionEngine.js`:

```javascript
if (riskScore > 15) {
  recommendation = 'Wash Now';  // Adjust threshold
}
```

### Update Colors

Edit `/tailwind.config.js`:

```javascript
colors: {
  risk: {
    low: '#10b981',      // Green
    moderate: '#f59e0b', // Yellow
    high: '#ef4444',     // Red
  },
}
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Import project in Vercel dashboard

3. Add environment variable:
   - `OPENWEATHER_API_KEY` = your API key

4. Deploy!

### Manual Deployment

```bash
# Build the production bundle
npm run build

# Start production server
npm start
```

The app will be available on port 3000.

---

## 🔒 Security

- ✅ API key stored in environment variables (never committed)
- ✅ Server-side API proxy (no client-side exposure)
- ✅ Input validation on city names
- ✅ Secure localStorage handling
- ✅ CORS protection on API routes

---

## 📊 Performance

- **React Redux**: Optimized state management
- **Server-Side API Calls**: Weather data fetched on server
- **Memoization**: Expensive calculations cached with useMemo
- **TailwindCSS**: Optimized CSS bundle
- **Code Splitting**: Next.js automatic optimization

---

## 🤝 Contributing

This is an MVP project. Potential enhancements:

- [ ] Historical wash tracking with charts
- [ ] Push notifications for optimal wash times
- [ ] Multi-city support
- [ ] Weather alerts integration
- [ ] Car maintenance reminders
- [ ] Dark mode toggle

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🙏 Credits

- Weather data: [OpenWeather API](https://openweathermap.org/)
- Icons: Unicode emoji
- Built with ❤️ for cold-weather drivers

---

## 🐛 Troubleshooting

### "OpenWeather API key not configured"
- Make sure `.env.local` exists with `OPENWEATHER_API_KEY`
- Restart the dev server after adding env variables

### "Failed to fetch weather data"
- Check your API key is valid
- Verify you haven't exceeded free tier limits (60 calls/min)
- Check internet connection

### "Location permission denied"
- Use manual city input instead
- Check browser location permissions

### Tests failing
- Run `npm install` to ensure all deps installed
- Clear Jest cache: `npm test -- --clearCache`

---

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the code comments in critical files
3. Test with the included unit tests

---

**Made for drivers in Calgary and other cold-weather cities. Stay safe, keep your car clean!** 🚗💧❄️
