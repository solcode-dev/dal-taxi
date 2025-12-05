# Performance Dashboard

## Overview
A mobile performance dashboard app built with Expo React Native that displays user revenue data with period filters and goal tracking. Designed with a clean, modern Material Design interface optimized for Android.

## Recent Changes
- **2025-12-05**: Initial implementation
  - Created dashboard with Daily/Weekly/Monthly period filter
  - Implemented revenue display with net change indicators
  - Added circular progress gauge for monthly goal tracking
  - Set up navigation with Dashboard and Settings tabs

## Project Architecture

### Frontend (Expo React Native)
- **Navigation**: React Navigation 7 with bottom tab navigator
  - Dashboard tab (main screen)
  - Settings tab (preferences)
- **Screens**:
  - `DashboardScreen.tsx` - Main performance dashboard
  - `SettingsScreen.tsx` - App preferences and settings
- **Components**:
  - `PeriodFilter.tsx` - Segmented toggle for period selection
  - `RevenueCard.tsx` - Revenue display with net change indicator
  - `CircularProgress.tsx` - SVG-based progress gauge

### Backend (Express)
- Basic Express server on port 5000
- Currently using mock data for revenue metrics

### Data Structure (Mock)
```javascript
{
  daily: { revenue: 50000, netChange: 10000 },
  weekly: { revenue: 350000, netChange: -50000 },
  monthly: { revenue: 1500000, netChange: 150000 },
  monthlyGoal: 2000000
}
```

## User Preferences
- Language: Korean (한국어)
- UI Style: Material Design for Android
- Currency: KRW (Korean Won)

## Key Features
1. **Period Filter Toggle**: Switch between daily, weekly, and monthly views
2. **Revenue Display**: Large, prominent total revenue with currency formatting
3. **Net Change Indicator**: Color-coded increase/decrease with icons
4. **Monthly Goal Progress**: Animated circular progress with percentage

## File Structure
```
client/
├── components/
│   ├── PeriodFilter.tsx
│   ├── RevenueCard.tsx
│   ├── CircularProgress.tsx
│   └── ... (common components)
├── screens/
│   ├── DashboardScreen.tsx
│   └── SettingsScreen.tsx
├── navigation/
│   ├── MainTabNavigator.tsx
│   └── HomeStackNavigator.tsx
└── constants/
    └── theme.ts (design system tokens)
```
