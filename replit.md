# Performance Dashboard (성과 대시보드)

## Overview
A mobile performance dashboard app built with Expo React Native that displays user revenue data with filtering capabilities and goal tracking. The app features a clean, modern Korean UI optimized for Android.

## Current State
MVP Complete - All core dashboard features implemented with mock data.

## Project Architecture

### Frontend (Expo React Native)
- **Framework**: Expo SDK 54 with React Native
- **Navigation**: React Navigation 7 (bottom tabs + stack navigators)
- **State Management**: Local React state + React Query for API calls
- **Animations**: React Native Reanimated 3
- **Styling**: StyleSheet with theme tokens

### Backend (Express)
- **Server**: Express.js on port 5000
- **Current**: Serving static landing page (placeholder for future API)

## Screen Structure

### Dashboard Screen (대시보드)
Main screen displaying:
1. **Period Filter Toggle** - 일간/주간/월간 (Daily/Weekly/Monthly)
2. **Revenue Card** - Shows total revenue with net change indicator
3. **Circular Progress** - Monthly goal achievement gauge (75% with mock data)

### Settings Screen (설정)
Configuration options:
- 월간 목표 (Monthly Goal)
- 통화 (Currency) - KRW
- 테마 (Theme)
- 데이터 내보내기 (Export Data)
- 동기화 (Sync)
- 앱 버전 (App Version)

## File Structure
```
client/
├── App.tsx                 # Root component with providers
├── components/
│   ├── PeriodFilter.tsx    # 3-segment toggle control
│   ├── RevenueCard.tsx     # Revenue display with net change
│   ├── CircularProgress.tsx # Goal progress gauge
│   ├── Card.tsx            # Reusable card component
│   ├── ThemedText.tsx      # Themed text component
│   ├── ThemedView.tsx      # Themed view component
│   ├── ErrorBoundary.tsx   # Error boundary wrapper
│   └── ErrorFallback.tsx   # Crash recovery UI
├── screens/
│   ├── DashboardScreen.tsx # Main dashboard
│   └── SettingsScreen.tsx  # Settings screen
├── navigation/
│   ├── RootStackNavigator.tsx
│   ├── MainTabNavigator.tsx
│   ├── HomeStackNavigator.tsx
│   └── ProfileStackNavigator.tsx
├── constants/
│   └── theme.ts            # Design tokens (colors, spacing, typography)
└── hooks/
    ├── useTheme.ts
    ├── useColorScheme.ts
    └── useScreenOptions.ts
```

## Mock Data
```javascript
daily_revenue = 50,000 KRW
weekly_revenue = 350,000 KRW
monthly_revenue = 1,500,000 KRW
monthly_goal = 2,000,000 KRW
daily_net_change = +10,000
weekly_net_change = -50,000
monthly_net_change = +150,000
```

## Design System
- **Primary Color**: #2196F3 (Material Blue)
- **Success**: #4CAF50 (Green - for positive changes)
- **Error**: #F44336 (Red - for negative changes)
- **Warning**: #FFC107 (Amber - for low progress)
- **Dark mode**: Automatic based on system preference

## Development Commands
```bash
npm run all:dev    # Start both Expo and Express servers
npm run expo:dev   # Start Expo only
npm run server:dev # Start Express only
```

## Recent Changes
- 2024-12: Initial MVP with Korean UI
- Dashboard with period filtering
- Revenue display with animated transitions
- Circular progress for goal tracking
- Settings screen with configuration options

## Next Phase Features (Planned)
1. Animated transitions when switching periods
2. Line/bar charts for historical trends
3. Goal setting interface
4. Period comparison view
5. Backend persistence with database
