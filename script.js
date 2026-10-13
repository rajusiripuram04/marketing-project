"use strict";

/* Site data is kept separately so content can be changed without editing layout. */
const config = window.SITE_CONFIG;
const projects = window.PORTFOLIO_PROJECTS;
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function createElement(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function getSafeWebUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function getDigits(value) {
  return String(value || "").replace(/[\s()+-]/g, "");
}

function normalizeIndianNumber(value) {
  const digits = getDigits(value);
  return digits.length === 10 ? `91${digits}` : digits;
}

function makeWhatsAppUrl(message) {
  const phone = normalizeIndianNumber(config.whatsapp);
  if (!/^[1-9]\d{7,14}$/.test(phone)) return "#contact";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function openExternalLink(link, url) {
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}

function initializeCompanyContent() {
  $$("[data-company]").forEach((element) => {
    element.textContent = config.companyName;
  });

  $("#companyDescription").textContent = config.description;
  $("#year").textContent = new Date().getFullYear();
  $("#aboutStory").textContent = config.about.story;
  $("#aboutMission").textContent = config.about.mission;
  $("#aboutVision").textContent = config.about.vision;
}

function initializeNavigation() {
  const menu = $(".nav-links");
  const toggle = $(".menu-toggle");

  function closeMenu() {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav-link", menu).forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener(
    "scroll",
    () => $(".site-header").classList.toggle("scrolled", window.scrollY > 20),
    { passive: true },
  );

  if (!("IntersectionObserver" in window)) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  $$(".reveal").forEach((element) => revealObserver.observe(element));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.hash === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-15% 0px -60% 0px" });

  $$("main section[id]").forEach((section) => sectionObserver.observe(section));
}

function initializeWhatsAppLinks() {
  const defaultMessage =
    `Hello ${config.companyName}, I have a question about your creative services.`;
  const url = makeWhatsAppUrl(defaultMessage);

  if (url === "#contact") {
    $(".whatsapp-float").hidden = true;
    $("#contactWhatsApp").hidden = true;
    return;
  }

  openExternalLink($(".whatsapp-float"), url);
  openExternalLink($("#contactWhatsApp"), url);

  $$("[data-enquiry]").forEach((link) => {
    openExternalLink(link, makeWhatsAppUrl(link.dataset.enquiry));
  });
}

function renderServices() {
  const serviceGrid = $(".services-grid");

  config.services.forEach((service, index) => {
    const card = createElement("article", "service-card");
    const top = createElement("div", "service-top");
    const quoteLink = createElement("a", "", "Get a Quote ↗");

    top.append(
      createElement("span", "", "✳"),
      createElement("span", "", String(index + 1).padStart(2, "0")),
    );

    quoteLink.setAttribute("aria-label", `Get a quote for ${service.title}`);
    openExternalLink(
      quoteLink,
      makeWhatsAppUrl(
        `Hello ${config.companyName}, I am interested in your ${service.title} service. Please share the details and pricing.`,
      ),
    );

    card.append(
      top,
      createElement("h3", "", service.title),
      createElement("p", "", service.description),
      quoteLink,
    );
    serviceGrid.append(card);
  });
}

function initializePortfolio() {
  const filterNames = [
    "All Projects",
    "Logo Design",
    "Branding",
    "Graphic Design",
    "Social Media",
    "Video Editing",
  ];
  const filterGroup = $(".portfolio-filters");
  const projectGrid = $(".portfolio-grid");
  const dialog = $("#portfolioModal");
  let visibleProjects = projects;
  let activeIndex = 0;
  let returnFocusTarget = null;

  function showProject(index) {
    activeIndex = (index + visibleProjects.length) % visibleProjects.length;
    const project = visibleProjects[activeIndex];
    const image = $("#modalImage");
    const client = $("#modalClient");
    const externalLink = $("#projectExternal");

    image.src = project.image;
    image.alt = `${project.name} — ${project.category}`;
    $("#modalTitle").textContent = project.name;
    $("#modalCategory").textContent = project.category;
    $("#modalCaption").textContent = project.description;

    client.hidden = !project.client;
    client.textContent = project.client ? `Client: ${project.client}` : "";

    const projectUrl = getSafeWebUrl(project.url);
    externalLink.hidden = !projectUrl;
    if (projectUrl) openExternalLink(externalLink, projectUrl);

    $("#projectEnquiry").href = makeWhatsAppUrl(
      `Hello ${config.companyName}, I liked your ${project.name} design. Can we discuss something similar for my business?`,
    );
  }

  function renderProjects(category) {
    visibleProjects = projects.filter((project) =>
      category === "All Projects" || project.category === category
    );
    projectGrid.replaceChildren();

    visibleProjects.forEach((project, index) => {
      const card = createElement("article", "portfolio-item");
      const button = createElement("button", "portfolio-view");
      const image = createElement("img");
      const metadata = createElement("div", "project-meta");

      button.type = "button";
      button.setAttribute("aria-label", `Preview ${project.name}`);
      image.src = project.image;
      image.alt = `${project.name} — ${project.category}`;
      image.width = 800;
      image.height = 800;
      image.loading = "lazy";

      button.append(image, createElement("span", "view-arrow", "↗"));
      button.addEventListener("click", () => {
        returnFocusTarget = document.activeElement;
        showProject(index);
        dialog.showModal();
        document.body.style.overflow = "hidden";
      });

      metadata.append(
        createElement("h3", "", project.name),
        createElement("span", "", project.category),
      );
      card.append(button, metadata);
      projectGrid.append(card);
    });

    const count = visibleProjects.length;
    $("#portfolioStatus").textContent = count
      ? `${count} ${count === 1 ? "project" : "projects"} · ${category}`
      : "New work in this category is coming soon.";
  }

  filterGroup.replaceChildren();
  filterNames.forEach((category, index) => {
    const button = createElement(
      "button",
      `filter-btn${index === 0 ? " active" : ""}`,
      category,
    );

    button.type = "button";
    button.setAttribute("aria-pressed", String(index === 0));
    button.addEventListener("click", () => {
      $$(".filter-btn", filterGroup).forEach((filter) => {
        const selected = filter === button;
        filter.classList.toggle("active", selected);
        filter.setAttribute("aria-pressed", String(selected));
      });
      renderProjects(category);
    });
    filterGroup.append(button);
  });

  $("#previousProject").addEventListener("click", () => {
    showProject(activeIndex - 1);
  });
  $("#nextProject").addEventListener("click", () => {
    showProject(activeIndex + 1);
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showProject(activeIndex - 1);
    if (event.key === "ArrowRight") showProject(activeIndex + 1);
  });

  $("#projectEnquiry").addEventListener("click", () => {
    if (makeWhatsAppUrl("") === "#contact") dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
    returnFocusTarget?.focus();
  });

  renderProjects("All Projects");
}

function getVideoUrl(video) {
  const videoUrl = getSafeWebUrl(video.url);
  if (!videoUrl) return "";

  const url = new URL(videoUrl);
  if (video.type !== "youtube") return ["mp4", "embed"].includes(video.type) ? videoUrl : "";

  const id = url.hostname === "youtu.be"
    ? url.pathname.slice(1)
    : url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).at(-1);

  return /^[w-]{11}$/.test(id || "")
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`
    : "";
}

function initializeVideos() {
  const dialog = $("#videoModal");
  let returnFocusTarget = null;

  config.videos.forEach((video) => {
    const card = createElement("article", "video-card");
    const thumbnail = createElement("div", "video-thumb");
    const videoUrl = getVideoUrl(video);

    if (getSafeWebUrl(video.thumbnail)) {
      const image = createElement("img");
      image.src = video.thumbnail;
      image.alt = "";
      image.loading = "lazy";
      thumbnail.append(image);
    }

    if (videoUrl) {
      const playButton = createElement("button", "play-video", "▶");
      playButton.type = "button";
      playButton.setAttribute("aria-label", `Play ${video.title}`);
      playButton.addEventListener("click", () => {
        returnFocusTarget = document.activeElement;
        $("#videoModalTitle").textContent = video.title;

        const player = createElement(video.type === "mp4" ? "video" : "iframe");
        player.src = videoUrl;

        if (video.type === "mp4") {
          player.controls = true;
          player.autoplay = true;
          player.preload = "metadata";
        } else {
          player.title = video.title;
          player.allow = "autoplay; fullscreen";
          player.allowFullscreen = true;
        }

        $("#videoPlayer").replaceChildren(player);
        dialog.showModal();
        document.body.style.overflow = "hidden";
      });
      thumbnail.append(playButton);
    } else {
      thumbnail.append(
        createElement("span", "", "Coming Soon"),
        createElement("small", "", "STORIES IN THE MAKING"),
      );
    }

    card.append(
      thumbnail,
      createElement("h3", "", video.title),
      createElement("p", "", video.description),
    );
    $(".video-grid").append(card);
  });

  dialog.addEventListener("close", () => {
    const player = $("video", dialog);
    player?.pause();
    $("#videoPlayer").replaceChildren();
    document.body.style.overflow = "";
    returnFocusTarget?.focus();
  });
}

function initializeDialogs() {
  $$("dialog").forEach((dialog) => {
    $(".modal-close", dialog).addEventListener("click", () => dialog.close());

    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      const clickedOutside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;
      if (clickedOutside) dialog.close();
    });
  });
}

function renderReasonsAndFaqs() {
  const reasons = [
    ["Creative and Original Designs", "Individual ideas shaped around your business."],
    ["Professional Brand Presentation", "A consistent visual identity across every touchpoint."],
    ["Custom Solutions", "Your goals and personality guide the creative direction."],
    ["Attention to Detail", "Every small decision adds up."],
    ["Collaborative Design Process", "Your vision stays at the center."],
    ["Modern Visual Storytelling", "Design and motion make your message clear."],
  ];
  const symbols = ["✦", "◈", "◎", "✳", "↗", "◉"];

  reasons.forEach(([title, description], index) => {
    const card = createElement("article", "feature-card");
    card.append(
      createElement("span", "", symbols[index]),
      createElement("h3", "", title),
      createElement("p", "", description),
    );
    $("#features").append(card);
  });

  const questions = [
    ["What design services do you provide?", "Logo design, brand identity, graphics, social media creatives, marketing materials and video editing."],
    ["How can I request a logo design?", "Choose Get a Quote on Logo Design or tell us about your business using the WhatsApp contact link."],
    ["Do you offer video editing services?", "Yes. We edit promotional videos, reels, YouTube videos and other custom projects."],
    ["Can I request custom branding?", "Yes. Share your business goals, audience and brand assets to discuss a creative direction."],
    ["How can I share my project requirements?", "Open WhatsApp using any contact or service link and tell us about your project."],
    ["How long does a project usually take?", "Timing depends on scope, complexity and feedback. We will discuss a schedule when reviewing your brief."],
    ["How can I contact your team?", "Use the WhatsApp button or Instagram link on this page to contact us directly."],
  ];

  questions.forEach(([question, answer]) => {
    const item = createElement("details");
    item.append(createElement("summary", "", question), createElement("p", "", answer));
    $("#faqs").append(item);
  });
}

function renderTestimonials() {
  if (!config.testimonials.length) return;

  const section = $("#testimonials");
  section.hidden = false;

  config.testimonials.forEach((testimonial) => {
    const card = createElement("article", "testimonial-card");
    card.append(
      createElement("p", "", testimonial.feedback),
      createElement("h3", "", testimonial.name),
      createElement("p", "", testimonial.business || ""),
    );
    $(".testimonial-grid", section).append(card);
  });
}

function renderContactLinks() {
  const phoneDigits = normalizeIndianNumber(config.phone);
  const contactOptions = [];

  if (/^[1-9]\d{7,14}$/.test(phoneDigits)) {
    const displayPhone = getDigits(config.phone).length === 10
      ? `+91 ${getDigits(config.phone)}`
      : `+${phoneDigits}`;
    contactOptions.push(["Phone", displayPhone, `tel:+${phoneDigits}`]);
  }

  if (normalizeIndianNumber(config.whatsapp)) {
    contactOptions.push([
      "WhatsApp",
      "Chat with us on WhatsApp",
      makeWhatsAppUrl(`Hello ${config.companyName}, I have a question about your creative services.`),
    ]);
  }

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email)) {
    contactOptions.push(["Email", config.email, `mailto:${config.email}`]);
  }

  const instagramUrl = getSafeWebUrl(config.instagram);
  if (instagramUrl) {
    let handle = "Instagram";
    try {
      handle = `@${new URL(instagramUrl).pathname.split("/").filter(Boolean)[0]}`;
    } catch {
      // Keep the generic label if a configured profile has an unusual URL.
    }

    contactOptions.push(["Instagram", `${handle} ↗`, instagramUrl]);
    const profileLink = $("#instagramProfile");
    profileLink.hidden = false;
    profileLink.querySelector("strong").textContent = handle;
    openExternalLink(profileLink, instagramUrl);
  }

  contactOptions.forEach(([label, text, url]) => {
    const row = createElement("div", "info-card");
    const link = createElement("a", "", text);
    row.append(createElement("small", "", label), link);

    if (url.startsWith("http")) openExternalLink(link, url);
    else link.href = url;

    $("#contactDetails").append(row);
    $("#footerContacts").append(link.cloneNode(true));
  });

  if (config.address) $("#contactDetails").append(createElement("p", "", config.address));

  Object.entries(config.socials).forEach(([name, value]) => {
    const url = getSafeWebUrl(value);
    if (!url) return;

    const link = createElement("a", "", `${name} ↗`);
    openExternalLink(link, url);
    $("#socialLinks").append(link);
  });
}

function updateSearchMetadata() {
  document.title = config.seo.title;
  $('meta[name="description"]').content = config.seo.description;
  $('meta[property="og:title"]').content = config.seo.title;
  $('meta[property="og:description"]').content = config.seo.description;
  $('meta[property="og:image"]').content = new URL(config.seo.image, location.href).href;

  if (getSafeWebUrl(config.seo.url)) {
    const canonical = createElement("link");
    canonical.rel = "canonical";
    canonical.href = config.seo.url;
    document.head.append(canonical);
  }

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config.companyName,
    description: config.description,
    sameAs: [config.instagram, ...Object.values(config.socials)]
      .map(getSafeWebUrl)
      .filter(Boolean),
  };

  if (config.email) organization.email = config.email;
  if (config.address) organization.address = config.address;
  if (config.seo.url) organization.url = config.seo.url;

  const structuredData = createElement("script");
  structuredData.type = "application/ld+json";
  structuredData.textContent = JSON.stringify(organization);
  document.head.append(structuredData);
}

/* Start each page feature from one place. */
initializeCompanyContent();
initializeNavigation();
initializeWhatsAppLinks();
renderServices();
initializePortfolio();
initializeVideos();
initializeDialogs();
renderReasonsAndFaqs();
renderTestimonials();
renderContactLinks();
updateSearchMetadata();
