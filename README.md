# Durga Media Works

A responsive static marketing site built with HTML, CSS, and vanilla JavaScript. It needs no framework, build step, or backend.

## Preview

Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Project structure

- `index.html` contains the accessible page sections and reusable containers.
- `style.css` is organized by foundation, shared components, page sections, and responsive breakpoints.
- `script.js` initializes the page and keeps navigation, services, portfolio, videos, contact links, and metadata in separate functions.
- `config.js` contains business details, copy, services, videos, testimonials, and SEO settings.
- `portfolio-data.js` contains the project entries rendered in the portfolio.

## WhatsApp and Instagram

The WhatsApp number is set in `config.js` as `9182284243`. The site adds India's `91` country code to this ten-digit number, creating `https://wa.me/919182284243`. The floating WhatsApp icon, contact button, service links, project links, and hero calls to action open WhatsApp with a relevant message.

The Instagram profile is configured as `https://www.instagram.com/shashi_dp/` and appears in the navigation, contact section, and footer. Change `instagram` in `config.js` to update it. The optional phone, email, address, and other social links appear when configured.

There is no enquiry form. Visitors open WhatsApp and send their message directly.

## Add portfolio projects

Add an entry to `portfolio-data.js` with a unique `id`, `name`, `category`, `image`, and `description`. Optional fields are `client` and `url`. Put image files in this folder or use an HTTPS image URL. Supported filters are `Logo Design`, `Branding`, `Graphic Design`, `Social Media`, and `Video Editing`; other categories appear under All Projects.

The supplied `logo1.jpeg` through `logo5.jpeg` are the current portfolio samples. Keep `companyLog.jpeg` as the company logo.

## Configure videos and testimonials

Edit the `videos` array in `config.js`. Entries accept `title`, `description`, `type`, `url`, and optional `thumbnail`. Supported types are `youtube` (YouTube watch or short URL), `mp4` (direct HTTPS video or local MP4 path), and `embed` (HTTPS embeddable URL). Empty URLs show Coming Soon with no play control. Add genuine testimonials to `testimonials`; the section stays hidden while that list is empty.

## Deploy

Upload the project files and all six supplied JPEGs to GitHub Pages, Netlify, Vercel, or another static host. Use this folder as the publish directory; no build command is needed. Set `seo.url` in `config.js` after the production domain is known.
"# marketing-project" 
