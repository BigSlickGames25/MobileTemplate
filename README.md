# Mobile Game Template

A reusable Expo/React Native starter for shipping mobile-first games with a working gameplay shell instead of a blank app.

## Included

- File-based native navigation with an iOS-friendly modal settings flow.
- Safe-area aware layout for notches, status bars, and the home indicator.
- Runtime orientation control with portrait, landscape, and adaptive modes.
- Native haptics hooks for menus, pickups, hits, and gameplay actions.
- Touch-first HUD with a virtual joystick, boost hold button, and pulse action.
- A sample game loop you can replace while keeping the app shell intact.
- Persisted settings for handedness, haptics, keep-awake, and motion preferences.
- EAS build configuration for internal preview and production builds.

## Stack

- Expo SDK 54
- React Native 0.81
- Expo Router
- TypeScript
- Async Storage
- Expo Haptics
- Expo Screen Orientation
- Expo Keep Awake

## Project layout

- `app/`: navigation routes and screen entry points.
- `src/components/`: reusable shell, UI, and touch controls.
- `src/game/`: sample world state, update loop, and game rendering.
- `src/services/`: device services such as haptics and orientation.
- `src/store/`: persisted runtime settings.

## Run it

```bash
npm install
npx expo install --fix
npx expo-doctor
npx expo start
```

For iOS simulator work:

```bash
npx expo prebuild
npx expo run:ios
```

## Deploy to Netlify

1. Push this folder to a GitHub repository.
2. In Netlify, choose `Add new site` -> `Import an existing project`.
3. Select the GitHub repo that contains this project.
4. Keep the Netlify defaults from `netlify.toml`:
   Build command: `npm run netlify-build`
   Publish directory: `web-build`
5. Deploy the site.

If you want to test the Netlify build locally first:

```bash
npm run export:web
```

That generates the static site in `web-build/`.

## GitHub quick start

```bash
git init
git add .
git commit -m "Initial mobile game template"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## What to replace for your game

1. Replace the sample entity logic in `src/game/world.ts`.
2. Replace the temporary UI copy in `app/index.tsx`, `app/settings.tsx`, and `app/how-to-play.tsx`.
3. Add your real app icon, splash art, fonts, sounds, and branding.
4. Update `app.config.ts` bundle identifiers, app name, slug, and scheme.
5. Add analytics, saves, backend, and monetization only after the core loop is stable.

## Shipping checklist

1. Test safe areas, rotation, and touch controls on a physical iPhone and iPad.
2. Replace placeholder identifiers in `app.config.ts`.
3. Add App Store metadata, screenshots, privacy policy, and support URL.
4. Create an Expo project and connect EAS.
5. Run `eas build --platform ios --profile production`.
6. Validate the release build on-device before App Store submission.

## Notes

- `ios.requireFullScreen` is enabled so orientation locking remains reliable on iPad.
- The sample loop is intentionally simple. The template value is the mobile shell around it.
- If dependency versions drift, run `npx expo install --fix` to align with the current SDK.
- Netlify is for the web build only. Native features like haptics and device rotation behavior still need testing on a real iPhone or iPad.
