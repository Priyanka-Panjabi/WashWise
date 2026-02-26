/**
 * Root Layout
 * Wraps the app with Redux Provider and global styles
 */

'use client';

import { Provider } from 'react-redux';
import store from '@/store';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>WashWise - Weather-Smart Car Wash Assistant</title>
        <meta name="description" content="Get personalized car wash recommendations based on weather forecast, snowfall risk, and salt corrosion analysis for cold-weather cities." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <Provider store={store}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
