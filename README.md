# 🫧 Fizzi — A Playful, Animated Brand Experience

**Fizzi** is a vibrant, motion-driven website built with **Next.js**, **TypeScript**, **GSAP**, **ScrollTrigger**, **Framer Motion**, **Three.js**, **React Three Fiber**, and **Tailwind CSS**, blending smooth 3D animation with playful, soda-inspired visuals.  
From bubbling waves to interactive globes and games, Fizzi delivers an immersive, fizzy brand experience that truly pops 🍹.

---

## 🌐 Live Preview

👉 [**View Live Site**](https://fizzi-arj.vercel.app)

---

## ✨ Core Features

### 🧭 Interactive Navigation  
- Fullscreen **wave-animated menu** powered by GSAP and SVG path morphing.  
- Each menu item floats smoothly **inside a wave**, syncing its motion in real-time.  
- Transitions between pages are fluid and dynamic — like soda bubbles rising.

---

### 🏠 Home Page  
Built entirely using **Prismic Slices**, the homepage includes:  
- **Hero Slice** — Bold animated heading introducing the brand.  
- **Skydive Slice** — Scroll-triggered 3D movement powered by GSAP + ScrollTrigger.  
- **AlternateText Slice** — Alternating bold and light text for dynamic storytelling.  
- **BigText Slice** — Huge brand typography animations.  
- **Header & Footer** — Elegant, responsive navigation and social links with smooth scroll effects.

---

### 🕹️ Fizzi Zone (Interactive Game)
- A fun **mini-game** built with React, Zustand, and GSAP.
- Cans of Fizzi **fall from the sky**, and the player must collect them using a **crosshair**.  
- Every can gives **Fizzi Points** — redeemable for **real dollar value** (100 points = $1).  
- Includes:
  - Game timer  
  - Music toggle 🎵  
  - Dynamic score counter  
  - Animated bubbles and particle effects  
  - "Game Over" screen with redeemable dollar calculation 💰

---

### 🌍 Find Stores Page
- 3D **interactive globe** built using **React Three Fiber** and **Three.js**.  
- Connected arcs between cities show Fizzi’s global presence.  
- Each store is dynamically fetched from **Prismic CMS** (city, country, coordinates, image).  
- Users can browse featured store cards with smooth fade and zoom animations.

---

### 💬 Contact Us Page
- Stunning **3D text** that **reacts to your mouse movement** in real-time.  
- **Bubble cursor** follows your pointer — giving a playful, effervescent feel.  
- GSAP + Three.js magic for realistic lighting, depth, and motion.

---

### 🧠 Prismic CMS Integration
- All pages are **fully dynamic**, powered by **Prismic Slices**.  
- Custom slices include:
  - `hero_section`
  - `skydive_section`
  - `alternate_text`
  - `big_text`
  - `find_stores`
  - `contact_section`
  - `fizzi_zone`

This structure allows marketers and content creators to edit and deploy new content easily without touching code.

---

### 🎨 Motion & Design
- Real-time **wave animation engine** using sine functions + GSAP timelines.  
- **ScrollTrigger** for parallax motion and staggered reveals.  
- **Framer Motion** for page transitions and interactive elements.  
- **Three.js + React Three Fiber** for immersive 3D experiences.  
- **Tailwind CSS + Shadcn UI** for modern, clean styling.

---

## 🧰 Tech Stack

| Category | Technologies |
|-----------|---------------|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS, Shadcn UI |
| **Animations** | GSAP, ScrollTrigger, Framer Motion |
| **3D Engine** | Three.js, React Three Fiber, Drei |
| **State Management** | Zustand |
| **CMS** | Prismic (with Slices) |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Local Development

### 1️⃣ Clone & Install
```bash
git clone https://github.com/ShadowSlayer03/Fizzi-Drink-Website.git
cd fizzi-arj
npm install
````

### 2️⃣ Set Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_PRISMIC_REPOSITORY_NAME=your-repo-name
NEXT_PUBLIC_PRISMIC_ACCESS_TOKEN=your-token
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

Open 👉 [http://localhost:3000](http://localhost:3000)

---

## 🧩 Key Components

| Component             | Description                                                     |
| --------------------- | --------------------------------------------------------------- |
| `FizziWaveMenu.tsx`   | Fullscreen animated wave menu with synced text motion.          |
| `NavMenu.tsx`         | Floating trigger button that opens the FizziWaveMenu.           |
| `FindStoresSlice.tsx` | 3D interactive globe with Prismic-powered location data.        |
| `FizziZone.tsx`       | Interactive Fizzi collection game with score and reward system. |
| `HeroSlice.tsx`       | Bold animated entry slice with brand motion.                    |
| `ContactSection.tsx`  | 3D text with bubble cursor animation and interactive lighting.  |

---

## 🧠 Prismic Slice Model Overview

| Slice Name          | Fields                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| **hero_section**    | heading (Text), subtext (Rich Text), background_image (Image)                                             |
| **skydive_section** | heading, subheading, image/video, motion speed                                                            |
| **alternate_text**  | text (Repeatable), alignment, animation type                                                              |
| **big_text**        | text (Rich Text), scroll trigger start/end                                                                |
| **find_stores**     | title, subtitle, show_globe, globe_theme, cta_text, cta_link, storeslist (city, country, lat, lng, image) |
| **fizzi_zone**      | rules, gameplay text, timer, UI text fields                                                               |
| **contact_section** | title, subtitle, CTA text/link                                                                            |

---

## 🎨 Brand Aesthetic

🍒 Colors: deep magentas, bright purples, and vibrant lime greens
🌈 Gradients: soft transitions inspired by soda fizz and fruit candy
💡 Lighting: glows, shadows, and neon strokes powered by GSAP + WebGL
💬 Typography: big, bold, and bubbly — just like the Fizzi vibe

Everything feels alive — **motion, color, and interaction fuse together** to give a playful, premium identity.

---

## 🧑‍💻 Author

**Arjun Nambiar**
Frontend Engineer & Creative Technologist

> Building interactive experiences that blend code, design, and motion ✨

---

## 🥤 Summary

> Fizzi isn’t just a website — it’s a living, bubbling brand universe.
> Built to move, react, and flow — just like your favorite soda fizzing to life.
> A fusion of code, art, and motion that makes the digital world *pop* 🧃✨