# Performance Dashboard (성과 대시보드)

## Overview
A mobile performance dashboard app built with Expo React Native that displays user revenue data with filtering capabilities and goal tracking. The app features a clean, modern Korean UI optimized for Android.

## Current State
Full-featured dashboard with real-time database integration and interactive UI.

## Project Architecture

### Frontend (Expo React Native)
- **Framework**: Expo SDK 54 with React Native
- **Navigation**: React Navigation 7 (bottom tabs + stack navigators)
- **State Management**: Local React state + React Query for API calls
- **Animations**: React Native Reanimated 3
- **Styling**: StyleSheet with theme tokens

### Backend (Express)
- **Server**: Express.js on port 5000
- **Database**: PostgreSQL with Drizzle ORM
- **Current**: Full REST API for transactions and goals

## Screen Structure

### Dashboard Screen (대시보드)
Main screen displaying:
1. **Current Period Badge** - Shows current date (e.g., "2025년 12월 6일")
2. **Period Filter Toggle** - 일간/주간/월간 (Daily/Weekly/Monthly)
3. **Revenue Card** - Shows total revenue with net change indicator
4. **Circular Progress** - Monthly goal achievement gauge (tap to edit)
5. **Transaction List** - Recent transactions with delete option
6. **Floating Action Button** - Quick add income with confetti celebration

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
├── App.tsx                   # Root component with providers
├── components/
│   ├── PeriodFilter.tsx      # 3-segment toggle control
│   ├── RevenueCard.tsx       # Revenue display with net change
│   ├── CircularProgress.tsx  # Goal progress gauge with edit button
│   ├── CurrentPeriodBadge.tsx # Date display badge
│   ├── FloatingActionButton.tsx # FAB for adding income
│   ├── AddIncomeModal.tsx    # Income entry modal
│   ├── GoalSettingModal.tsx  # Goal configuration modal
│   ├── TransactionList.tsx   # Recent transactions display
│   ├── ConfettiAnimation.tsx # Celebration animation
│   ├── Card.tsx              # Reusable card component
│   ├── ThemedText.tsx        # Themed text component
│   ├── ThemedView.tsx        # Themed view component
│   └── ErrorBoundary.tsx     # Error boundary wrapper
├── screens/
│   ├── DashboardScreen.tsx   # Main dashboard
│   └── SettingsScreen.tsx    # Settings screen
├── navigation/
│   ├── RootStackNavigator.tsx
│   ├── MainTabNavigator.tsx
│   ├── HomeStackNavigator.tsx
│   └── ProfileStackNavigator.tsx
├── constants/
│   └── theme.ts              # Design tokens (colors, spacing, typography)
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
- 2025-12: Full database integration with PostgreSQL
- Real-time data updates using React Query
- Current period badge with calendar icon
- Floating action button for quick income entry
- Add income modal with confetti celebration animation
- Transaction list with delete/undo functionality
- Goal setting modal for monthly targets
- Proper rgba color formatting for React Native compatibility

## Next Phase Features (Planned)
1. Animated transitions when switching periods
2. Line/bar charts for historical trends
3. Expense entry modal
4. Period comparison view
5. Data export functionality
