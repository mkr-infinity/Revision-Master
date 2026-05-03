import sharp from "sharp";
import fs from "fs";

const SIZE = 1024;
const PURPLE_BG = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#a855f7"/>
      <stop offset="60%" stop-color="#7f13ec"/>
      <stop offset="100%" stop-color="#5b0fb0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="url(#g)"/>
</svg>`;

async function build() {
  const bgBuf = Buffer.from(PURPLE_BG);

  // 1. icon-background.png — solid purple radial gradient
  await sharp(bgBuf).png().toFile("resources/icon-background.png");
  console.log("✓ icon-background.png");

  // 2. icon-foreground.png — transparent bg, logo at 720/1024 (safe zone for adaptive)
  const fgLogo = await sharp("assets/logo.png")
    .resize(720, 720, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: fgLogo, top: 152, left: 152 }])
    .png()
    .toFile("resources/icon-foreground.png");
  console.log("✓ icon-foreground.png");

  // 3. icon.png (legacy) — purple bg + LARGE logo (920px) so the launcher's circle mask still shows mostly logo
  const bigLogo = await sharp("assets/logo.png")
    .resize(920, 920, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp(bgBuf)
    .composite([{ input: bigLogo, top: 52, left: 52 }])
    .png()
    .toFile("resources/icon.png");
  console.log("✓ icon.png");

  // 4. Splash screens — solid bg (#0e0820) with centered logo, NOT stretched
  const splashLogo = await sharp("assets/logo.png")
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  const splashBg = `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732"><rect width="2732" height="2732" fill="#0e0820"/></svg>`;
  await sharp(Buffer.from(splashBg))
    .composite([{ input: splashLogo, gravity: "center" }])
    .png()
    .toFile("resources/splash.png");
  await sharp(Buffer.from(splashBg))
    .composite([{ input: splashLogo, gravity: "center" }])
    .png()
    .toFile("resources/splash-dark.png");
  console.log("✓ splash.png / splash-dark.png");

  // 5. Also copy icon.png into public/ for the web favicon
  fs.copyFileSync("resources/icon.png", "public/favicon.png");
  console.log("✓ public/favicon.png");
}

build().catch((e) => { console.error(e); process.exit(1); });
