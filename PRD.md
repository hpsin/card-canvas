# Drawing Canvas App

A mobile-first digital canvas that enables users to create simple drawings with their finger and save them to a gallery.

**Experience Qualities**: 
1. Intuitive - Drawing should feel natural and responsive like using a real pen
2. Playful - Bright colors and smooth interactions encourage creative expression  
3. Accessible - Simple interface works seamlessly on mobile devices

**Complexity Level**: Light Application (multiple features with basic state)
- Combines drawing functionality with persistent storage and basic admin features

## Essential Features

**Drawing Canvas**
- Functionality: Touch/mouse drawing with smooth line rendering
- Purpose: Primary creative tool for user expression
- Trigger: User touches canvas area
- Progression: Touch canvas → drag finger → see continuous line → lift finger to complete stroke
- Success criteria: Lines appear instantly with no lag, colors apply correctly

**Color Palette**  
- Functionality: Six color options (red, yellow, green, blue, purple, black) plus eraser
- Purpose: Provide essential drawing tools without overwhelming choices
- Trigger: User taps color button
- Progression: Tap color → visual feedback shows selection → draw with new color
- Success criteria: Color changes immediately, selected state is visually clear

**Save Drawing**
- Functionality: Capture canvas as JPEG with user attribution
- Purpose: Preserve and collect user artwork
- Trigger: User taps save button
- Progression: Tap save → name dialog appears → enter name → confirm → drawing saved to gallery
- Success criteria: Dialog appears, name is required, JPEG saves successfully

**Admin Gallery**
- Functionality: View all saved drawings with download/delete options
- Purpose: Moderate content and provide admin oversight
- Trigger: Navigate to /admin route
- Progression: Visit /admin → authenticate as owner → view grid of drawings → download or delete individual items
- Success criteria: Only app owner can access, all drawings display, actions work reliably

## Edge Case Handling

- **Touch/Mouse Compatibility**: Detect input method and handle both touch and mouse events seamlessly
- **Empty Canvas Save**: Prevent saving blank canvases or show appropriate feedback
- **Invalid Names**: Handle empty names or extremely long names in save dialog
- **Network Issues**: Graceful handling if save operations fail
- **Mobile Orientation**: Maintain functionality across portrait/landscape orientations

## Design Direction

The design should feel playful and inviting like a digital sketchpad, with clean modern aesthetics that don't distract from the creative process.

Minimal interface that prioritizes the canvas space, with controls that feel substantial enough for finger interaction while maintaining an uncluttered appearance.

## Color Selection

Triadic color scheme with bright, saturated colors that feel energetic and creative.

- **Primary Color**: Vibrant Blue (oklch(0.6 0.25 260)) - Main UI elements and primary actions, communicates reliability and focus
- **Secondary Colors**: Canvas white (oklch(1 0 0)) and neutral gray (oklch(0.7 0 0)) for backgrounds and secondary elements
- **Accent Color**: Warm Orange (oklch(0.75 0.2 60)) - Save button and important calls-to-action, creates urgency and warmth
- **Foreground/Background Pairings**: 
  - Background (Pure White oklch(1 0 0)): Dark Gray text (oklch(0.2 0 0)) - Ratio 16.9:1 ✓
  - Primary (Vibrant Blue oklch(0.6 0.25 260)): White text (oklch(1 0 0)) - Ratio 7.2:1 ✓  
  - Accent (Warm Orange oklch(0.75 0.2 60)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Card (Light Gray oklch(0.98 0 0)): Dark Gray text (oklch(0.2 0 0)) - Ratio 15.8:1 ✓

## Font Selection

Typography should feel friendly and approachable while maintaining excellent readability on mobile devices.

- **Typographic Hierarchy**: 
  - H1 (App Title): Inter Bold/24px/tight letter spacing
  - Button Labels: Inter Medium/16px/normal spacing  
  - Body Text: Inter Regular/14px/relaxed line height
  - Small Labels: Inter Regular/12px/wide letter spacing

## Animations

Subtle and functional animations that provide immediate feedback without being distracting, maintaining the focus on drawing.

- **Purposeful Meaning**: Smooth color transitions and gentle button press effects communicate responsiveness and quality
- **Hierarchy of Movement**: Drawing strokes are immediate (no animation), UI feedback is quick (100-200ms), save confirmation has gentle celebration

## Component Selection

- **Components**: 
  - Dialog for name input when saving
  - Button variants for color selection and primary actions
  - Card layout for admin gallery view
  - Alert for feedback messages
- **Customizations**: 
  - Custom canvas component with touch/mouse event handling
  - Color picker as a horizontal row of circular buttons
  - Admin grid layout for artwork thumbnails
- **States**: 
  - Color buttons show selected state with border/shadow
  - Save button disabled when canvas is empty
  - Loading states during save operations
- **Icon Selection**: 
  - Save icon from Phosphor for save button
  - Download/Trash icons for admin actions
  - Eraser icon for eraser tool
- **Spacing**: 
  - Generous touch targets (44px minimum)
  - Consistent 16px base spacing unit
  - Tight spacing (8px) for color palette compactness
- **Mobile**: 
  - Canvas fills viewport minus control bar
  - Color palette as fixed bottom bar
  - Admin gallery uses responsive grid (2-3 columns)
  - Touch-optimized button sizes throughout