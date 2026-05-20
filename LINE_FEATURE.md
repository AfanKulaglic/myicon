# Line Feature Implementation

## Overview
Lines have been added to the customizer as a new layer type. Lines can be locked/unlocked, rotated, and moved diagonally when unlocked.

## Key Features

### 1. **Line Layer Type**
- New `LineLayer` interface added to type definitions
- Lines are defined by:
  - `x`, `y`: Starting position
  - `width`: Length of the line (height is always 0)
  - `rotation`: Angle in degrees
  - `stroke`: Line color
  - `strokeWidth`: Thickness in pixels
  - `locked`: Boolean flag (default: true)

### 2. **Default Behavior**
- **Lines are locked by default** when created
- When locked:
  - Lines can only be moved horizontally/vertically
  - Rotation is disabled via transformer
  - Prevents accidental diagonal movement
- When unlocked:
  - Full rotation enabled (360°)
  - Free diagonal movement
  - All transformer handles active

### 3. **User Interface**

#### Adding Lines
- **Location**: Left Sidebar → Shapes tab
- **Icon**: Minus icon (horizontal line)
- **Default properties**:
  - Length: 200px (or 50% of print area)
  - Thickness: 4px
  - Color: Black (#111111)
  - Position: Centered in print area
  - **Locked: true**

#### Editing Lines (Right Sidebar)
When a line is selected, the following controls appear:

1. **Länge (Length)**: Number input to adjust line length
2. **Strichstärke (Stroke Width)**: Slider (1-20px) to adjust thickness
3. **Farbe (Color)**: Color picker with preset colors
4. **Deckkraft (Opacity)**: Slider (0-100%)
5. **Drehung (Rotation)**: Slider (-180° to +180°)
6. **Lock Warning**: Yellow info box appears when line is locked, explaining how to unlock

#### Lock/Unlock Toggle
- **Location**: 
  - Floating toolbar above selected line (Lock/Unlock icon)
  - Layers panel (Lock icon next to each line)
- **Visual feedback**:
  - Locked: Lock icon, blue background
  - Unlocked: Unlock icon, gray background

### 4. **Visual Representation**

#### On Canvas
- Lines render as Konva `Line` elements with rounded caps
- Outline box (10px height) shown around unselected lines for visibility
- Transformer shows when selected (if unlocked)

#### In Layers Panel
- Icon: Minus (horizontal line)
- Label: "Linie"
- Lock status visible and toggleable

### 5. **Keyboard Shortcuts**
All standard shortcuts work with lines:
- **Arrow keys**: Move line (1px, or 10px with Shift)
- **Ctrl+D**: Duplicate line
- **Delete/Backspace**: Remove line
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo

## Technical Implementation

### Files Modified

1. **`src/types/index.ts`** (not modified - types only in CustomizerContext)
2. **`src/features/customizer/state/CustomizerContext.tsx`**
   - Added `LineLayer` interface
   - Updated `LayerType` to include "line"
   - Updated `Layer` union type

3. **`src/features/customizer/panels/LeftSidebar.tsx`**
   - Added `Minus` icon import
   - Added line button to ShapesPanel (3rd button in grid)
   - Added tip text explaining locked behavior
   - Updated LayersPanel to show Minus icon and "Linie" label

4. **`src/features/customizer/canvas/DesignerCanvas.tsx`**
   - Added line rendering in clipped design area
   - Added line outline rendering (10px height box)
   - Lines use Konva `Line` component with `lineCap="round"`

5. **`src/features/customizer/panels/RightSidebar.tsx`**
   - Added `LineControls` component with:
     - Length input
     - Stroke width slider
     - Color picker
     - Lock warning message
   - Updated `LayerControls` to show "Linie" label
   - Updated `LayerControls` to render `LineControls` for line layers

## Usage Flow

### Creating a Line
1. Open customizer
2. Click "Formen" (Shapes) tab in left sidebar
3. Click the horizontal line button (Minus icon)
4. Line appears centered in print area, **locked by default**

### Unlocking and Rotating
1. Select the line (click on it)
2. Click the Lock icon in the floating toolbar or layers panel
3. Line is now unlocked - rotation handles appear
4. Drag rotation handle or use rotation slider to rotate
5. Move line freely in any direction (including diagonally)

### Locking Again
1. Select the unlocked line
2. Click the Unlock icon to lock it
3. Line movement restricted to horizontal/vertical
4. Rotation disabled

## Design Decisions

### Why Locked by Default?
- Lines are typically used for horizontal/vertical dividers
- Prevents accidental rotation during placement
- User must explicitly unlock for diagonal use
- Matches user's mental model: "straight line" = locked

### Why Allow Unlocking?
- Flexibility for creative designs
- Diagonal lines useful for:
  - Decorative elements
  - Underlines at angles
  - Geometric patterns
  - Custom layouts

### Visual Feedback
- Lock icon always visible in layers panel
- Yellow warning box in properties panel when locked
- Tip text in shapes panel explains behavior
- Clear unlock button in floating toolbar

## Future Enhancements (Not Implemented)
- Dashed/dotted line styles
- Arrow heads (start/end)
- Curved lines (bezier)
- Line presets (thin, medium, thick)
- Snap to 45° angles when rotating

## Testing Checklist
- ✅ Line appears when clicking line button
- ✅ Line is locked by default
- ✅ Locked line cannot be rotated via transformer
- ✅ Locked line can be moved horizontally/vertically
- ✅ Unlock button works (toolbar and layers panel)
- ✅ Unlocked line can be rotated freely
- ✅ Unlocked line can be moved diagonally
- ✅ Lock button works to re-lock line
- ✅ Length control adjusts line length
- ✅ Stroke width slider adjusts thickness
- ✅ Color picker changes line color
- ✅ Opacity slider works
- ✅ Rotation slider works
- ✅ Duplicate creates new line
- ✅ Delete removes line
- ✅ Undo/redo works with lines
- ✅ Lines save/load correctly in drafts
- ✅ Lines export correctly in cart designs

## Summary
Lines are now fully functional in the customizer with smart default locking behavior. Users can create straight horizontal/vertical lines quickly, or unlock them for full rotational freedom and diagonal placement. The implementation follows the existing layer architecture and integrates seamlessly with all existing customizer features.
