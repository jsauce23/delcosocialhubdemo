# DELCO Social Hub — demo

Clickable demonstration of DELCO Social Hub, prepared by Around SA Marketing
for DELCO Heating & Cooling.

**This is a demo.** Every post, photo, request and number is a fictional
example. It is not connected to DELCO's Instagram, Facebook or TikTok. Nothing
inside it posts, sends or saves anything. Not licensed for business use.

## Deploy on Render

Dashboard → **New → Static Site** → connect this repo, then:

- **Build Command:** leave empty
- **Publish Directory:** `.`

`render.yaml` sets the same thing, so a Blueprint deploy works too.

`index.html` is the whole app — no build step, no other files needed. It must
be served over http(s), not opened as a local file.
