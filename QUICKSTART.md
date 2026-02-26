# 🚀 WashWise - Quick Start Guide

## Setup (3 minutes)

1. **Get OpenWeather API Key**
   - Go to https://openweathermap.org/api
   - Sign up for free account
   - Get your API key from dashboard

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```
   OPENWEATHER_API_KEY=paste_your_key_here
   ```

3. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

4. **Open Browser**
   - Navigate to http://localhost:3000
   - Allow location access OR enter city manually
   - Get your wash recommendation!

---

## How It Works

### 1. Location Detection
- Click "Use My Location" for automatic detection
- Or manually enter city name (e.g., "Calgary")

### 2. Weather Analysis
- Fetches current weather + 5-day forecast
- Analyzes snow risk, freeze days, dry periods

### 3. Smart Recommendation
The decision engine calculates:
- **Salt Risk Score**: Based on days since snow, freeze days
- **Recommendation**: Wash Now / Undercarriage / Wait
- **Explanation**: Plain English reasoning

### 4. Cost Optimization
- Input your wash pricing
- Compare pay-per-wash vs membership
- See break-even analysis

---

## Architecture Highlights

### Pure Business Logic
`/lib/washDecisionEngine.js` - Framework-agnostic decision engine

```javascript
// Example usage:
const result = calculateWashRecommendation({
  snowNext48h: false,
  dryDaysAhead: 3,
  daysSinceSnow: 5,
  daysSinceWash: 2,
  freezeDays: 3
});
// => { recommendation: "Wash Now", riskScore: 12.5, ... }
```

### State Management (Redux)
- **locationSlice**: User location
- **weatherSlice**: Weather data + async thunks
- **washSlice**: History + preferences

### Security
- API key never exposed to client
- Server-side proxy at `/app/api/weather/route.js`
- All sensitive data in environment variables

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

**Test Coverage:**
- ✅ Salt risk calculations
- ✅ Recommendation logic
- ✅ Cost analysis
- ✅ Edge cases

---

## Deployment to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variable: `OPENWEATHER_API_KEY`
4. Deploy!

Your app will be live at `https://your-app.vercel.app`

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/page.js` | Main dashboard UI |
| `app/layout.js` | Redux Provider wrapper |
| `lib/washDecisionEngine.js` | Core business logic |
| `store/weatherSlice.js` | Async weather fetching |
| `components/RecommendationBadge.js` | Main recommendation display |
| `app/api/weather/route.js` | OpenWeather proxy |

---

## Customization Examples

### Change Risk Thresholds
Edit `lib/washDecisionEngine.js`:
```javascript
if (riskScore > 20) {  // was 15
  recommendation = 'Wash Now';
}
```

### Add New Preference
1. Add to `constants/index.js`:
   ```javascript
   DEFAULT_PREFERENCES = {
     ...existing,
     carColor: 'white'  // new field
   }
   ```

2. Update Redux slice `store/washSlice.js`

3. Add UI input in `components/CostAnalyzer.js`

---

## Troubleshooting

**"Can't find module '@/lib/...'"**
→ Check `jsconfig.json` path aliases are correct

**Weather not loading**
→ Check browser console for errors
→ Verify API key in `.env.local`
→ Restart dev server after adding env vars

**Tests failing**
→ Run `npm install` again
→ Clear cache: `npm test -- --clearCache`

---

## Next Steps

- ✅ Basic functionality working
- ✅ Tests passing
- ✅ Production build successful

**Optional Enhancements:**
- [ ] Add wash history chart
- [ ] Email/SMS notifications
- [ ] Dark mode
- [ ] Multiple vehicles support
- [ ] Weather alerts

---

**You're ready to go! Happy washing! 🚗💧**
