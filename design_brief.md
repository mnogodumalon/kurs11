# Design Brief: Kursverwaltung

## 1. App Analysis
- **What this app does**: A comprehensive course management system for educational institutions to manage courses, instructors, participants, rooms, and enrollments with full CRUD capabilities.
- **Who uses this**: Course administrators, educational coordinators who need to organize training programs
- **The ONE thing users care about most**: Quick overview of current courses and easy enrollment management
- **Primary actions**: Create/manage courses, assign instructors to courses, register participants, manage room bookings, track payments

## 2. What Makes This Design Distinctive
- **Visual identity**: Professional academic aesthetic with deep navy blue accents and warm paper-like backgrounds
- **Layout strategy**: Tab-based navigation for 5 data entities with a hero dashboard showing key stats
- **Unique element**: Gradient stat cards with subtle shadows creating a "floating paper" effect

## 3. Theme & Colors
- **Font**: Plus Jakarta Sans - professional, modern, excellent readability
- **Google Fonts URL**: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap
- **Why this font**: Clean professional feel, good for data-heavy interfaces, excellent number rendering

### Color Palette (HSL)
- **Primary**: hsl(222, 47%, 31%) - Deep navy blue
- **Primary Foreground**: hsl(0, 0%, 100%)
- **Accent**: hsl(142, 71%, 45%) - Success green for payments
- **Warning**: hsl(38, 92%, 50%) - Orange for pending
- **Background**: hsl(40, 23%, 97%) - Warm off-white
- **Card**: hsl(0, 0%, 100%)
- **Muted**: hsl(220, 14%, 96%)
- **Border**: hsl(220, 13%, 91%)

## 4. Mobile Layout
- **Layout approach**: Single column, tab navigation at top
- **What users see**: Stats row → Active tab content → FAB for adding
- **Touch targets**: Minimum 44px, bottom sheet for forms

## 5. Desktop Layout
- **Overall structure**: Sidebar navigation + main content area
- **Section layout**: Stats bar at top, data table below with inline actions
- **Hover states**: Row highlighting, button color shifts

## 6. Components

### Hero KPIs (4 stat cards)
1. Aktive Kurse (count)
2. Dozenten (count)
3. Teilnehmer (count)
4. Offene Zahlungen (sum)

### Data Tables (5 tabs)
1. **Kurse**: Title, Dozent, Raum, Start-End dates, Max participants, Price, Actions
2. **Dozenten**: Name, Email, Phone, Fachgebiet, Actions
3. **Teilnehmer**: Name, Email, Phone, Geburtsdatum, Actions
4. **Räume**: Raumname, Gebäude, Kapazität, Actions
5. **Anmeldungen**: Teilnehmer, Kurs, Anmeldedatum, Bezahlt status, Actions

### Primary Action Button
- Floating "+" button on mobile
- "Neu hinzufügen" button in header on desktop

### Forms (Dialog-based)
- Add/Edit forms for each entity type
- Validation for required fields
- Date pickers for dates
- Dropdowns for relationships

## 7. Visual Details
- **Border radius**: 12px for cards, 8px for buttons/inputs
- **Shadows**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- **Spacing**: 16px base, 24px section gaps
- **Animations**: 150ms ease-out transitions

## 8. CSS Variables
```css
:root {
  --radius: 0.75rem;
  --background: hsl(40, 23%, 97%);
  --foreground: hsl(222, 47%, 11%);
  --card: hsl(0, 0%, 100%);
  --card-foreground: hsl(222, 47%, 11%);
  --popover: hsl(0, 0%, 100%);
  --popover-foreground: hsl(222, 47%, 11%);
  --primary: hsl(222, 47%, 31%);
  --primary-foreground: hsl(0, 0%, 100%);
  --secondary: hsl(220, 14%, 96%);
  --secondary-foreground: hsl(222, 47%, 31%);
  --muted: hsl(220, 14%, 96%);
  --muted-foreground: hsl(220, 9%, 46%);
  --accent: hsl(142, 71%, 45%);
  --accent-foreground: hsl(0, 0%, 100%);
  --destructive: hsl(0, 84%, 60%);
  --border: hsl(220, 13%, 91%);
  --input: hsl(220, 13%, 91%);
  --ring: hsl(222, 47%, 31%);
}
```
