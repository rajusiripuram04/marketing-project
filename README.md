# Durga Digital Media Works Limited

A responsive static marketing site built with HTML, CSS, and vanilla JavaScript. It needs no framework, build step, or backend.

## Preview

Open `index.html` in a browser, or run `python -m http.server 8000` in this folder and visit `http://localhost:8000`.

## Project structure

- `index.html` contains the accessible page sections and reusable containers.
- `style.css` is organized by foundation, shared components, page sections, and responsive breakpoints.
- `script.js` initializes the page and keeps navigation, services, portfolio, videos, contact links, and metadata in separate functions.
- `config.js` contains business details, copy, services, videos, testimonials, and SEO settings.
- `portfolio-data.js` contains the project entries rendered in the portfolio.
- `festival.css` and `festival.js` style and animate the Vijayadashami / Dussehra grand-opening flag at the top of the page.
- `intro.js` dismisses the four-second animated Vijayadashami greeting shown when the page opens.
- `assets/durga-mata-welcome.png` is the new generated Durga Mata artwork; `assets/durga-welcome-artwork.md` records its prompt and dimensions.

## Opening greeting and grand-opening banner

When `index.html` opens, a four-second greeting appears with a dimensional Durga Mata artwork, a Vijayadashami / Dussehra message, and a sign-off from Shashi DP. It then fades into the site. Keep `intro.js`, `festival.css`, `companyLog.jpeg`, and the `assets` folder together when deploying.

The opening section in `index.html` welcomes visitors to the grand opening on Vijayadashami / Dussehra. Update that section to add a confirmed date, time, or venue. Its enquiry button uses the configured WhatsApp contact. The flag animation has a pause button, respects reduced-motion preferences, and pauses when the banner is offscreen or the browser tab is hidden. Include `festival.css`, `festival.js`, and the `assets` folder when deploying the site.

## WhatsApp and Instagram

The WhatsApp number is set in `config.js` as `7732006606`. The site adds India's `91` country code to this ten-digit number. The floating WhatsApp icon, contact button, service links, project links, and enquiry calls to action open WhatsApp with a relevant message.

The Instagram profile is configured as `https://www.instagram.com/shashi_dp/` and appears in the contact section and footer. Change `instagram` in `config.js` to update it. The optional phone, email, address, and other social links appear when configured.

There is no enquiry form. Visitors open WhatsApp and send their message directly.

## Add portfolio projects

Add an entry to `portfolio-data.js` with a unique `id`, `name`, `category`, `image`, and `description`. Optional fields are `client` and `url`. Put image files in this folder or use an HTTPS image URL. Filters are created automatically from the categories present in the portfolio.

The supplied `logo1.jpeg` through `logo5.jpeg` are the current portfolio samples. Keep `companyLog.jpeg` as the company logo.

## Configure videos and testimonials

Edit the `videos` array in `config.js`. Entries accept `title`, `description`, `type`, `url`, and optional `thumbnail`. Supported types are `youtube` (YouTube watch or short URL), `mp4` (direct HTTPS video or local MP4 path), and `embed` (HTTPS embeddable URL). Empty URLs show a video-service enquiry link. Add genuine testimonials to `testimonials`; the section stays hidden while that list is empty.

## Deploy

Upload the project files and all six supplied JPEGs to GitHub Pages, Netlify, Vercel, or another static host. Use this folder as the publish directory; no build command is needed. Set `seo.url` in `config.js` after the production domain is known.
"# marketing-project" 
