CURRENT TASK:

Refine UI interactions for navbar and CTA buttons WITHOUT changing any structure or breaking existing layout.

Context:
- This is a Next.js + Tailwind project
- Navbar links currently feel static (no hover interaction)
- "Book a Consultation" button is larger than "Get Your Website" and needs to be visually consistent

Goals:

1. Navbar Hover Effects:
   - Add smooth hover interaction to all navbar links
   - Include:
     - subtle color transition (e.g. gray → darker or blue)
     - optional underline or bottom border animation
     - smooth transition (duration-200 or 300)
   - Must NOT affect layout or spacing

2. CTA Button Size Consistency:
   - Make "Book a Consultation" visually similar in size to "Get Your Website"
   - Adjust:
     - padding (px / py)
     - font size if needed
   - Keep styling hierarchy (primary vs secondary) intact

Constraints:
- DO NOT change component structure
- DO NOT rename classes globally
- DO NOT affect responsiveness
- Only apply Tailwind utility class updates

Outcome:
- Navbar feels interactive and premium
- Buttons feel balanced and intentional
- No layout shifts or broken UI