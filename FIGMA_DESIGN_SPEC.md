# NeuralData - Figma Design Specification

## Overview
NeuralData is an AI-powered data intelligence platform that monitors data quality, trust scores, and provides insights through an intelligent assistant. The design uses a modern, tech-forward aesthetic with glassmorphism, neon accents, and smooth animations.

---

## Color System

### Primary Palette
- **Cyber Blue**: `#3b82f6` - Primary action, primary trust metrics
- **Purple Accent**: `#a855f7` - Secondary accents, gradients
- **Emerald Green**: `#10b981` - Success states, positive trends
- **Neon Pink**: `#ec4899` - Highlights, interactive elements

### Neutral Palette
- **Dark BG**: `#0a0a0f` - Main background
- **Card BG**: `#1a1a2e` - Secondary background
- **Border**: `rgba(255, 255, 255, 0.1)` - Subtle dividers
- **Text Primary**: `#ffffff` - Main text
- **Text Secondary**: `#94a3b8` - Secondary text

### Status Colors
- **Success**: `#10b981` - Emerald Green
- **Warning**: `#f59e0b` - Amber
- **Danger**: `#ef4444` - Red
- **Info**: `#3b82f6` - Cyber Blue

---

## Typography

### Font Family
- **Headings**: Inter (Bold, SemiBold)
- **Body**: Inter (Regular, Medium)
- **Monospace**: JetBrains Mono (for code/terminal)

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 32px | Bold | 40px |
| H2 | 24px | SemiBold | 32px |
| H3 | 20px | SemiBold | 28px |
| Body Large | 16px | Regular | 24px |
| Body Regular | 14px | Regular | 22px |
| Small Text | 12px | Regular | 18px |
| Caption | 11px | Regular | 16px |

---

## Component Library

### 1. Buttons

#### Primary Button
- **Background**: `#3b82f6`
- **Text**: White, 14px Bold
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **State Hover**: Scale 1.05, shadow increase
- **State Active**: Scale 0.95
- **State Disabled**: Opacity 0.5

#### Secondary Button
- **Background**: Transparent
- **Border**: 1px solid `rgba(255, 255, 255, 0.2)`
- **Text**: White, 14px
- **Padding**: 12px 24px
- **Border Radius**: 8px
- **Hover**: Background `rgba(255, 255, 255, 0.05)`

#### Icon Button
- **Size**: 40x40px
- **Icon Size**: 20px
- **Background**: `rgba(255, 255, 255, 0.05)`
- **Border Radius**: 8px
- **Hover**: Background `rgba(255, 255, 255, 0.1)`

### 2. Cards

#### Glass Panel Card
- **Background**: `rgba(26, 26, 46, 0.7)` with backdrop blur (12px)
- **Border**: 1px solid `rgba(255, 255, 255, 0.1)`
- **Border Radius**: 16px
- **Padding**: 24px
- **Shadow**: `0 8px 32px rgba(0, 0, 0, 0.3)`
- **Hover**: Scale 1.02, enhanced shadow

#### Stat Card
- **Variant of Glass Panel**
- **Contains**: 
  - Title (12px, secondary text)
  - Value (28px, bold, gradient or accent color)
  - Trend indicator (icon + small text)
  - Decorative glow border (colored)

#### Source Card
- **Glass Panel with colored gradient overlay**
- **Header**: Icon + Name + Type
- **Body**: Connect button or extraction terminal
- **Hover**: Scale 1.02, enhanced colored shadow

### 3. Input Fields

#### Text Input
- **Background**: `rgba(255, 255, 255, 0.05)`
- **Border**: 1px solid `rgba(255, 255, 255, 0.1)`
- **Border Radius**: 8px
- **Padding**: 12px 16px
- **Icon Padding**: 12px 16px 12px 40px (if icon)
- **Focus**: Border color `#3b82f6`
- **Placeholder**: Secondary text color

#### Chat Input
- **Similar to Text Input but larger (48px height)**
- **Flex layout with icon button on right**
- **Send button scales in on text entry**

### 4. Navigation

#### Sidebar
- **Width**: 280px
- **Background**: `#0a0a0f`
- **Border Right**: 1px solid border color
- **Items**: 
  - Icon (20px) + Label (14px)
  - Padding: 16px 20px
  - Hover: Background `rgba(255, 255, 255, 0.05)`
  - Active: Border left (3px) + `#3b82f6` + background highlight

### 5. Progress & Metrics

#### Progress Bar
- **Height**: 8px
- **Background Track**: `rgba(255, 255, 255, 0.1)`
- **Fill**: Color-coded (blue, purple, pink, emerald)
- **Border Radius**: 4px
- **Glow effect on fill**

#### Metric Badge
- **Background**: Transparent with colored border
- **Border**: 1px solid accent color
- **Text**: 12px, secondary
- **Padding**: 6px 12px
- **Border Radius**: 12px

---

## Page Layouts

### 1. Login Page
```
┌─────────────────────────────────────┐
│                                     │
│   [BG Gradient Shapes]              │
│                                     │
│         ┌──────────────────┐        │
│         │   [Logo + Icon]  │        │
│         │                  │        │
│         │  Welcome Back    │        │
│         │  Subtitle        │        │
│         │                  │        │
│         │  [Email Input]   │        │
│         │  [Password Input]│        │
│         │                  │        │
│         │  [Remember] [FP] │        │
│         │  [Sign In Btn]   │        │
│         │                  │        │
│         │ Request Access   │        │
│         └──────────────────┘        │
│                                     │
└─────────────────────────────────────┘
```

### 2. Dashboard Page
```
┌─────────────────────────────────────────────────┐
│ [Sidebar] │ [Header: Trust Command Center]      │
│           │ [Run Full Audit Button]             │
│           │                                     │
│           │ ┌─────┬─────┬─────┬─────┐          │
│           │ │Stat │Stat │Stat │Stat │ (Cards) │
│           │ └─────┴─────┴─────┴─────┘          │
│           │                                     │
│           │ ┌──────────────────┬──────────────┐ │
│           │ │ Trust Chart      │Quality Metrics
│           │ │ [Area Chart]     │[Progress Bars]
│           │ │                  │              │
│           │ └──────────────────┴──────────────┘ │
│           │                                     │
│           │ ┌─────────────────────────────────┐ │
│           │ │ Live Intelligence Feed          │ │
│           │ │ [Alert Items with timestamps]  │ │
│           │ │ [Alert Items...]               │ │
│           │ └─────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 3. Connections Page
```
┌─────────────────────────────────────────────────┐
│ [Sidebar] │ [Header: Data Sources]              │
│           │ [Add New Source Button]             │
│           │                                     │
│           │ ┌─────┬─────┬─────┬─────┐          │
│           │ │ DB  │ SF  │ Mongo│ S3  │ Cards   │
│           │ │     │     │      │     │         │
│           │ │ Con │ Con │ Con  │ Con │         │
│           │ │ Btn │ Btn │ Btn  │ Btn │         │
│           │ └─────┴─────┴─────┴─────┘          │
│           │                                     │
│           │ ┌────────────────────────────────┐ │
│           │ │[Terminal Extraction (animated)]│ │
│           │ │[Progress Bar + Percentage]     │ │
│           │ │[Success Indicator]             │ │
│           │ └────────────────────────────────┘ │
│           │                                     │
│           │ ┌─────┬──────┬─────┬──────┐        │
│           │ │ 142 │ 1.8K │ PII │ 89%  │ Cards │
│           │ │Tbl  │ Cols │Ents │Trust │       │
│           │ └─────┴──────┴─────┴──────┘        │
└─────────────────────────────────────────────────┘
```

### 4. Assistant Page
```
┌──────────────────────────────────────────────────────┐
│ [Sidebar] │ [Header: Intelligence Agent]            │
│           │ [Badge: NeuralEngine-v3.0]              │
│           │                                         │
│           │ ┌───────────────────┬──────────────┐    │
│           │ │                   │ Active       │    │
│           │ │ [Chat Messages]   │ Context      │    │
│           │ │ [Bot Messages]    │ ┌──────────┐│    │
│           │ │ [User Messages]   │ │Sources   ││    │
│           │ │ [Typing Indicator]│ │Tags      ││    │
│           │ │                   │ │          ││    │
│           │ │ ┌─────────────────┐│ Suggested ││    │
│           │ │ │[Chat Input]   ●││ Inquiries ││    │
│           │ │ └─────────────────┘│ ├─────────┤│    │
│           │ │ [Input Glow]       │ │ Inquiry │    │
│           │ │                   │ │ Inquiry │    │
│           │ │                   │ │ Inquiry │    │
│           │ │                   │ │         ││    │
│           │ │                   │ └─────────┘│    │
│           │ │                   │             │    │
│           │ └───────────────────┴──────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 5. Settings Page
```
┌─────────────────────────────────────────────────┐
│ [Sidebar] │ [Header: Settings]                  │
│           │                                     │
│           │ ┌──────────────────────────────────┐
│           │ │ Account Settings                 │
│           │ │ [Profile Image] [Name] [Email]   │
│           │ │ [Change Password Button]         │
│           │ │ [Two-Factor Auth Toggle]         │
│           │ └──────────────────────────────────┘
│           │                                     │
│           │ ┌──────────────────────────────────┐
│           │ │ Notification Settings            │
│           │ │ [Email Notifications] [Toggle]   │
│           │ │ [Audit Alerts] [Toggle]          │
│           │ │ [Trust Score Warnings] [Toggle]  │
│           │ └──────────────────────────────────┘
│           │                                     │
│           │ ┌──────────────────────────────────┐
│           │ │ Integrations                     │
│           │ │ [Slack] [Connected] [Btn]        │
│           │ │ [Teams] [Not Connected] [Btn]    │
│           │ └──────────────────────────────────┘
└─────────────────────────────────────────────────┘
```

---

## Animation & Motion

### Entrance Animations
- **Container**: Fade in + stagger children (0.1s delay)
- **Items**: Slide up (y: 20px → 0) + fade in
- **Easing**: Spring (stiffness: 300, damping: 24)

### Interaction Animations
- **Hover**: Scale 1.02-1.05, enhanced shadow
- **Tap**: Scale 0.95
- **Charts**: Smooth line draw over 2s
- **Progress**: Animate width with ease-out

### Micro-interactions
- **Pulse Icon**: Scale 1.1 ↔ 1 (repeating)
- **Typing Indicator**: Dot animation (3 dots, wave effect)
- **Live Indicator**: Dot pulse with glow
- **Scanning Line**: Horizontal sweep animation
- **Glow Border**: Subtle opacity pulse

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile | < 640px | Single column, collapsible sidebar |
| Tablet | 640px - 1024px | Two column, adaptive sidebar |
| Desktop | > 1024px | Full multi-column layout |

---

## Accessibility Guidelines

1. **Color Contrast**: All text meets WCAG AA standards (min 4.5:1)
2. **Focus States**: Visible focus ring (2px, accent color)
3. **Icons + Text**: All icons paired with text labels
4. **Motion**: Respect `prefers-reduced-motion` setting
5. **ARIA**: Use semantic HTML with proper ARIA roles

---

## Export & Implementation Notes

### Component Variants
- **Button**: Default, Hover, Active, Disabled, Loading
- **Card**: Default, Hover, Active, Extracting, Success
- **Input**: Default, Focus, Disabled, Error, Filled

### Assets to Generate
- Logo and favicon
- Background gradient shapes (SVG)
- Icon set (Lucide React compatible)
- Placeholder images for data viz

### Dev Integration
- Use Tailwind CSS with custom theme
- Implement with Framer Motion for animations
- Recharts for data visualization
- Responsive design with mobile-first approach

---

## Design System Files Structure

```
Figma Project: NeuralData Design System
├── 🎨 Colors & Typography
├── 🔘 Components
│   ├── Buttons
│   ├── Cards
│   ├── Inputs
│   ├── Navigation
│   └── Metrics
├── 📄 Pages
│   ├── Login
│   ├── Dashboard
│   ├── Connections
│   ├── Assistant
│   └── Settings
├── 📱 Responsive Variants
│   ├── Mobile
│   ├── Tablet
│   └── Desktop
└── ✨ Animation Specs
```

---

## Implementation Checklist

- [ ] Create color styles (with semantic naming)
- [ ] Design typography styles
- [ ] Create all component variants
- [ ] Design page layouts for desktop, tablet, mobile
- [ ] Create interaction/animation specifications
- [ ] Document responsive breakpoints
- [ ] Create developer handoff guide
- [ ] Export design tokens for Tailwind

