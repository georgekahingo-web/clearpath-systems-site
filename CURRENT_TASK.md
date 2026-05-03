CURRENT TASK: OPEN GRAPH & SOCIAL LINK PREVIEW META TAGS
Version: 1.0
Scope: layout.tsx (or layout.js) ONLY

═══════════════════════════════════════════════════
OBJECTIVE
═══════════════════════════════════════════════════
Add Open Graph and Twitter Card meta tags to the 
root layout file so that when clearpathsystems.dev 
is shared on iMessage, Facebook, Instagram, or any 
other platform, it displays a proper branded link 
preview instead of a generic or incorrect crop.

This is a metadata-only change. Nothing visual, 
structural, or functional is being touched.

═══════════════════════════════════════════════════
FILE TO MODIFY
═══════════════════════════════════════════════════
ONE file only: app/layout.tsx (or app/layout.js)

DO NOT open, read, or modify any other file.

═══════════════════════════════════════════════════
EXACT CHANGE REQUIRED
═══════════════════════════════════════════════════
Locate the existing metadata export in layout.tsx.
It likely looks something like this:

export const metadata: Metadata = {
  title: "...",
  description: "...",
}

Add the following fields to that existing metadata 
object — do NOT replace or remove anything already 
there, only ADD to it:

openGraph: {
  title: "Clearpath Systems",
  description: "Turn Every Customer Interaction Into 
    a Booking — websites, missed call text-back, and 
    ad management for local businesses.",
  url: "https://clearpathsystems.dev",
  siteName: "Clearpath Systems",
  images: [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Clearpath Systems — A Clear Path to Every 
        Customer",
    },
  ],
  type: "website",
},
twitter: {
  card: "summary_large_image",
  title: "Clearpath Systems",
  description: "Turn Every Customer Interaction Into 
    a Booking — websites, missed call text-back, and 
    ad management for local businesses.",
  images: ["/og-image.png"],
},

═══════════════════════════════════════════════════
IMPORTANT — og-image.png
═══════════════════════════════════════════════════
Do NOT create, generate, or reference any image file 
in code beyond the path "/og-image.png" already 
specified above. I will manually add the actual 
og-image.png file to the /public folder myself.

═══════════════════════════════════════════════════
CONSTRAINTS — READ BEFORE MAKING ANY CHANGE
═══════════════════════════════════════════════════
- Touch ONLY app/layout.tsx (or app/layout.js)
- Do NOT modify any component files
- Do NOT modify any page files including page.tsx
- Do NOT change, remove, or rewrite any existing 
  metadata fields already present in the file
- Do NOT alter any imports unless strictly required 
  to support the Metadata type
- Do NOT change any layout structure, className, 
  font, or any JSX in the file
- Do NOT add any new dependencies or packages
- Do NOT modify tailwind.config, next.config, or 
  any other config file
- Make the absolute smallest change possible that 
  achieves only what is described above

═══════════════════════════════════════════════════
MANUAL STEP — TO BE DONE BY ME AFTER DEPLOY
═══════════════════════════════════════════════════
After Cursor makes the code change and I deploy 
to Vercel, I will:

1. Take a screenshot of my hero section
2. Resize it to 1200×630px
3. Save it as og-image.png
4. Place it in the /public folder of the project
5. Push to GitHub so Vercel picks it up
6. Verify the preview at:
   developers.facebook.com/tools/debug

═══════════════════════════════════════════════════
EXPECTED RESULT
═══════════════════════════════════════════════════
After this change and the manual og-image.png step:

✓ Sharing clearpathsystems.dev on iMessage shows 
  the hero section as the link preview image
✓ Sharing on Facebook and Instagram shows the 
  correct branded preview
✓ The preview title reads "Clearpath Systems"
✓ The preview description explains the service
✓ No visual or functional change anywhere on 
  the live site
✓ All existing metadata fields remain intact