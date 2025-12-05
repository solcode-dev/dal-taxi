# Design Guidelines: Performance Dashboard (Android)

## Architecture Decisions

### Authentication
**No Auth Required** - This is a performance tracking utility app focused on personal revenue data stored locally. Include a profile/settings screen accessible from the dashboard with:
- User-customizable avatar (1 preset business-themed avatar)
- Display name field
- App preferences (theme, notification settings, currency format)
- Goal setting controls

### Navigation
**Tab Navigation** - Assuming this dashboard is part of a larger financial tracking app:
- **Dashboard** (this screen)
- **Transactions** (revenue entries)
- **Settings** (profile & preferences)

## Dashboard Screen Specification

### Screen Layout
- **Header:** Default navigation header with transparent background
  - Left: Menu icon (opens drawer if multi-feature app, or nothing if simple app)
  - Center: "대시보드" (Dashboard) title
  - Right: Settings icon
- **Content:** Scrollable view (ScrollView)
- **Safe Area Insets:**
  - Top: headerHeight + Spacing.xl
  - Bottom: tabBarHeight + Spacing.xl
  - Horizontal: Spacing.lg

### Component Hierarchy (Top to Bottom)

#### 1. Period Filter Toggle
- **Type:** Segmented button group (Material 3 style)
- **Options:** "일간" | "주간" | "월간"
- **Position:** Top of content, full width minus horizontal padding
- **Behavior:**
  - Default selection: "일간" (Daily)
  - Single selection (mutually exclusive)
  - Selected state: Filled background with primary color
  - Unselected state: Outlined style with neutral background
  - Haptic feedback on selection change
  - Smooth transition animation (200ms) when switching periods
- **Spacing:** Margin bottom: Spacing.xxl

#### 2. Revenue Display Card
- **Container:** Elevated card with rounded corners (radius: 16dp)
- **Layout:**
  - Main revenue amount: Center-aligned, very large typography
  - Label above: "총 수입" in subtle text (TextVariant.caption)
  - Net change indicator below: Row with icon + text
- **Net Change Styling:**
  - **Increase:** Green (#4CAF50) upward arrow icon + "+₩XX,XXX"
  - **Decrease:** Red (#F44336) downward arrow icon + "-₩XX,XXX"
  - **No change:** Gray (#9E9E9E) horizontal icon + "₩0"
  - Use Feather icons: arrow-up, arrow-down, minus
  - Font weight: medium, size: 16sp
- **Shadow:** elevation: 2 (subtle Material shadow)
- **Spacing:** 
  - Padding: Spacing.xl
  - Margin bottom: Spacing.xxl

#### 3. Monthly Goal Progress Section
- **Container:** Elevated card matching revenue card style
- **Layout:**
  - Section title: "월간 목표 달성률" (top-left)
  - Circular progress gauge: Centered
  - Progress percentage: Inside circle, large bold text
  - Target info: Below circle "₩X,XXX,XXX / ₩X,XXX,XXX"
- **Circular Progress Specifications:**
  - Diameter: 180dp
  - Stroke width: 16dp
  - Background track color: Light gray (#E0E0E0)
  - Progress color gradient:
    - 0-50%: Amber (#FFC107)
    - 51-80%: Blue (#2196F3)
    - 81-100%: Green (#4CAF50)
  - Animated progress fill on screen load (500ms ease-out)
  - Percentage text size: 32sp, bold
- **Spacing:**
  - Card padding: Spacing.xl
  - Margin bottom: Spacing.xl

## Design System

### Color Palette
- **Primary:** #2196F3 (Material Blue 500)
- **Background:** #FAFAFA (Light gray)
- **Surface:** #FFFFFF (Cards)
- **Success:** #4CAF50 (Green)
- **Error:** #F44336 (Red)
- **Warning:** #FFC107 (Amber)
- **Text Primary:** #212121
- **Text Secondary:** #757575

### Typography (Material Design Type Scale)
- **Display Large:** 57sp, bold (main revenue amount)
- **Headline Medium:** 28sp, regular (section headers)
- **Title Large:** 22sp, medium (card titles)
- **Body Large:** 16sp, regular (general text)
- **Label Medium:** 12sp, medium (labels)

### Spacing Scale
- xs: 4dp
- sm: 8dp
- md: 12dp
- lg: 16dp
- xl: 24dp
- xxl: 32dp

### Interaction Design
- **Filter Toggle:**
  - Minimum touch target: 48dp height
  - Ripple effect on press (Material ripple)
  - State transition: 200ms cubic-bezier
- **Cards:**
  - Subtle elevation change on press (optional, if cards are tappable for details)
  - No interaction if display-only
- **Progress Circle:**
  - Entrance animation: Animate from 0% to target % over 500ms
  - Re-animate on period change

### Accessibility
- **Color Contrast:** Ensure all text meets WCAG AA (4.5:1 for normal text)
- **Touch Targets:** Minimum 48dp × 48dp for all interactive elements
- **Content Descriptions:**
  - Filter buttons: "일간 필터", "주간 필터", "월간 필터"
  - Net change: "전 기간 대비 X원 증가/감소"
  - Progress gauge: "월간 목표 달성률 X퍼센트"
- **Screen Reader:** Announce data updates when period filter changes

### Visual Assets
**No custom illustrations needed** - Use Material icons from @expo/vector-icons:
- `arrow-up` (net increase)
- `arrow-down` (net decrease)
- `minus` (no change)
- `settings` (header right button)
- `menu` (header left button, if applicable)

### Data Update Behavior
- When user selects a different period:
  1. Highlight selected filter (instant)
  2. Fade out old revenue data (100ms)
  3. Update revenue amount and net change
  4. Fade in new data (100ms)
  5. Re-animate progress circle if monthly view (500ms)
- Total transition time: ~700ms for smooth, professional feel