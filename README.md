# Pomodoro PWA - Setup & Usage

## Installation
1. **Host the files**: You need to serve these files over HTTPS (GitHub Pages is a great free option).
2. **Add to Home Screen (iOS)**:
   - Open the site in Safari.
   - Tap the "Share" button (square with arrow up).
   - Scroll down and tap "Add to Home Screen".
3. **Offline Use**: Once loaded once, the app will work without internet.

## Required Assets
- **icon.png**: You need a square icon (at least 192x192px) in the root directory for the home screen icon.

## Customization
### Timer Durations
Edit `index.html` buttons:
```html
<button class="preset-btn" data-time="30">30m</button>
```
Change `data-time` to your desired minutes.

### Colors
Edit `style.css`:
```css
:root {
    --color-text: #ffffff;
    /* ... */
}
```

### Animation Speed
Edit `backgroundSnow.js` or `backgroundLeaves.js`:
```javascript
speedY: Math.random() * 1 + 0.5, // Adjust numbers for speed
```
