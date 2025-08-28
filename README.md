# Sevara Badriddinova — Personal Website

Live: https://sevara-badriddinova.vercel.app/

A fast, responsive portfolio built with HTML, CSS, and vanilla JavaScript.

## Features
- Smooth scrolling, active nav state
- Animated timeline and project cards
- Mobile menu, scroll-to-top
- Contact form (AJAX via FormSubmit)

## Run locally
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy
- Drag-and-drop to Vercel/Netlify, or host as static files.
- For Vercel, create a new project and import this repo.

## Edit content
- `index.html`: text, experience, projects, links
- `styles.css`: colors, spacing, components
- `script.js`: interactions (menu, typing effect, contact form)

## Contact form
Uses FormSubmit’s AJAX endpoint. First submission triggers a confirmation email. After confirming, messages are delivered to your inbox.

## License
MIT
