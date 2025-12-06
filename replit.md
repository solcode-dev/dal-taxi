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

## Database Schema

### transactions 테이블
거래 기록을 저장하는 원장 테이블입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | varchar (UUID) | 고유 식별자 |
| occurred_at | timestamp | 거래 발생 시각 |
| type | enum ('income', 'expense') | 거래 유형 (수입/지출) |
| amount | integer | 거래 금액 (원) |

### financial_goals 테이블
월간 재무 목표 금액을 저장하는 테이블입니다.

| 필드 | 타입 | 설명 |
|------|------|------|
| id | varchar (UUID) | 고유 식별자 |
| year | integer | 목표 설정 연도 |
| month | integer | 목표 설정 월 (1-12) |
| amount | integer | 목표 금액 (원) |

## API Endpoints

### 거래 기록 (Transactions)
- `GET /api/transactions` - 모든 거래 조회 (쿼리: startDate, endDate)
- `GET /api/transactions/:id` - 특정 거래 조회
- `POST /api/transactions` - 새 거래 생성
- `DELETE /api/transactions/:id` - 거래 삭제

### 재무 목표 (Financial Goals)
- `GET /api/goals` - 모든 목표 조회
- `GET /api/goals/:year/:month` - 특정 월 목표 조회
- `POST /api/goals` - 목표 생성/수정 (동일 년월 존재 시 업데이트)

### 수익 요약 (Revenue Summary)
- `GET /api/revenue/summary/:period` - 기간별 수익 요약 (period: daily, weekly, monthly)

## 데이터베이스 연동
대시보드가 실시간으로 데이터베이스에서 데이터를 조회합니다:
- 기간별 수익 요약: transactions 테이블에서 계산
- 월간 목표: financial_goals 테이블에서 조회
- 목표 달성률: (월간 수익 / 목표 금액) * 100

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
