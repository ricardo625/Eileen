{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\froman\fcharset0 Times-Roman;}
{\colortbl;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c0\c0\c0;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\deftab720
\pard\pardeftab720\sa240\partightenfactor0

\f0\fs24 \cf0 \expnd0\expndtw0\kerning0
\outl0\strokewidth0 \strokec2 ```markdown\
# Design System Document: The Sovereign Editorial\
\
## 1. Overview & Creative North Star\
**Creative North Star: "The Architectural Whisper"**\
\
This design system rejects the "template-first" mentality of modern SaaS. Instead of rigid boxes and heavy borders, we embrace an editorial layout inspired by premium architectural journals. We achieve "Trustworthy" not through bulky security icons, but through **intentional asymmetry, vast whitespace, and tonal depth.**\
\
The experience should feel like walking into a high-end gallery: quiet, spacious, and authoritative. By utilizing a "No-Line" philosophy and a sophisticated interplay of deep blues and soft grays, we create a mobile login experience that feels more like an invitation than a form.\
\
---\
\
## 2. Colors & Surface Philosophy\
\
### The Color Palette\
Our palette centers on the deep, intellectual authority of `primary` (#002446) and the calming neutrality of `surface` (#f7fafc).\
\
### The "No-Line" Rule\
**Explicit Instruction:** Do not use 1px solid borders to define sections or input fields. Boundaries are created through:\
* **Tonal Shifts:** A `surface-container-low` (#f1f4f6) element sitting on a `surface` (#f7fafc) background.\
* **Negative Space:** Using the Spacing Scale (specifically `8` or `10`) to separate functional groups.\
\
### Surface Hierarchy & Nesting\
Treat the UI as a series of stacked, physical layers.\
* **Base:** `surface` (#f7fafc)\
* **Sectioning:** `surface-container-low` (#f1f4f6) for large background areas.\
* **Interaction Points:** `surface-container-lowest` (#ffffff) for inputs or cards to create a "lifted" feel.\
\
### The "Glass & Gradient" Rule\
To add soul to the "Modern" aesthetic, the main CTA (Login) should utilize a subtle linear gradient from `primary` (#002446) to `primary_container` (#1a3a5f). For floating overlays, use a Glassmorphic effect: `surface_container_low` at 80% opacity with a `20px` backdrop blur.\
\
---\
\
## 3. Typography: The Editorial Voice\
\
We use a dual-typeface system to balance character with readability.\
\
* **Display & Headlines (Manrope):** This is our "Editorial" voice. Manrope\'92s geometric yet warm curves provide the "Modern" feel. Use `headline-lg` for welcome messages with tight letter-spacing (-0.02em) to create an authoritative look.\
* **Body & Labels (Inter):** Our "Functional" voice. Inter is used for high-legibility tasks.\
* **Hierarchy Tip:** Pair a `headline-sm` title with a `body-md` description. The high contrast in scale between the `headline` and the `label-md` for inputs creates a sophisticated, bespoke rhythm.\
\
---\
\
## 4. Elevation & Depth\
\
### The Layering Principle\
Avoid traditional drop shadows. Instead, use "Tonal Layering."\
* **Example:** To make a login card stand out, place a `surface_container_lowest` (#ffffff) card on top of a `surface_dim` (#d7dadc) background. The 4% difference in luminance is enough to signify depth to the human eye without the "muddy" look of shadows.\
\
### Ambient Shadows\
If a "floating" action button is required:\
* **Color:** Use a tinted shadow based on `on_surface` (#181c1e) at 6% opacity.\
* **Blur:** Use a high diffusion (e.g., `32px` blur, `8px` Y-offset) to mimic soft, overhead gallery lighting.\
\
### The "Ghost Border" Fallback\
If an input requires a container for accessibility, use the `outline_variant` (#c3c6cf) at **15% opacity**. It should be felt, not seen.\
\
---\
\
## 5. Components\
\
### Input Fields (The "Soft Inset")\
* **Style:** No borders. Use `surface_container_highest` (#e0e3e5) as a background.\
* **Shape:** `rounded-lg` (0.5rem) to maintain a modern but professional softness.\
* **States:** On focus, transition the background color to `primary_fixed_dim` (#abc8f5) at 20% opacity.\
\
### Buttons (The "High-Contrast Anchor")\
* **Primary:** A gradient of `primary` to `primary_container`. Text in `on_primary` (#ffffff). Use `rounded-full` for a distinct, modern silhouette.\
* **Secondary:** No background. Use `title-sm` typography in `primary` (#002446) with a `surface_container` (#ebeef0) hover state.\
\
### Cards & Containers\
* **Rule:** Forbid divider lines.\
* **Separation:** Use a `16` (4rem) vertical spacing block or a background shift to `surface_container_low`.\
\
### Additional Component: The "Biometric Pulse"\
* **Context:** For mobile login, a dedicated FaceID/TouchID trigger using a `surface_container_highest` circular base with a `primary` icon, signaling high-tier security through "Glass & Gradient" styling.\
\
---\
\
## 6. Do's and Don'ts\
\
### Do:\
* **Do** use asymmetrical margins. For example, a headline with a left margin of `8` and a right margin of `12` creates a dynamic, custom feel.\
* **Do** use `on_surface_variant` (#43474e) for secondary text to maintain a soft, low-contrast professional aesthetic.\
* **Do** lean into `surface_bright` for full-screen backgrounds to keep the "Clean" aesthetic.\
\
### Don't:\
* **Don't** use pure black (#000000). Always use `on_background` (#181c1e) to keep the palette sophisticated.\
* **Don't** use "Standard" blue (#0000FF). Stick strictly to the `primary` deep navy (#002446) for a "Trustworthy" tone.\
* **Don't** stack more than three levels of surface containers. It breaks the "Soft Minimalism" and becomes cluttered.\
* **Don't** use 1px dividers. Use a `px` height `surface_variant` (#e0e3e5) block only if absolutely necessary for data density.\
}