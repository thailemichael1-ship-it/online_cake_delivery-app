# Cake Delivery Mobile App

Expo React Native client for the Cake Delivery platform. The app is organized as a single codebase with role-based experiences for customers, admins, and delivery users, plus authentication recovery, notifications, realtime order updates, and multilingual UI support.

## 1. What the App Covers

- Customer flow: browse cakes, search and filter products, build a cart, place multi-item orders, schedule delivery, track status, and submit feedback after delivery.
- Admin flow: manage the catalog, toggle availability, review orders, assign delivery users, review payment proofs (approve/reject), manage users, and inspect period-based reports.
- Delivery flow: view assigned jobs, update delivery status, submit payment proof images and references, open locations in maps, and receive live notifications.
- Auth flow: register, verify email, log in, recover a password, and resume session on app restart.

## 2. Stack

- Expo SDK 54 + React Native + TypeScript
- React Navigation with drawer and native stack navigation
- Zustand for state management
- Axios for backend calls
- Socket.IO client for realtime updates
- AsyncStorage for session persistence
- Expo modules for image picking, clipboard, and location
- React Native Maps for location display and delivery helpers
- React Native Chart Kit for dashboard charts

## 3. Prerequisites

- Node.js 18+
- Expo workflow via `npx expo`
- Android emulator, iOS simulator, or physical device with Expo Go
- Running backend API; see `../backend/README.md`

## 4. Install and Run

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm run start
```

Platform shortcuts:

```bash
npm run android
npm run ios
npm run web
```

Type-check the app:

```bash
npx tsc --noEmit
```

## 5. API Configuration

The app resolves the backend base URL in this order:

1. `EXPO_PUBLIC_API_BASE_URL`
2. the development fallback in `src/utils/constants.ts` (currently the deployed backend URL)
3. inferred Expo LAN host when available
4. Android emulator fallback at `10.0.2.2:4000`

Recommended `.env` file in `mobile-app/`:

```env
EXPO_PUBLIC_API_BASE_URL=http://<your-local-ip>:4000
EXPO_PUBLIC_AUTH_PRIMARY_PHOTO_URL=
```

If you are not using `.env`, update the fallback in `src/utils/constants.ts` to the backend host you want the app to use.

## 6. App Structure

```text
src/
  api/          # Axios client and endpoint wrappers
  components/    # Shared UI building blocks
  i18n/         # Translation tables and language hooks
  navigation/    # Auth and role-based navigation roots
  realtime/     # Socket client and event subscriptions
  screens/      # Feature screens grouped by role
  store/        # Zustand stores for auth, cart, orders, notifications, theme, language
  types/        # Shared TypeScript contracts
  utils/        # constants, currency, errors, theme, toast, typography, phone helpers
```

## 7. Auth and Session Flow

### Registration and verification

1. User opens `WelcomeScreen` and chooses to register.
2. `RegisterScreen` calls `POST /auth/register`.
3. The backend returns a verification-required state.
4. `VerifyEmailScreen` submits the code to `POST /auth/verify-email`.
5. The token and user payload are stored and the app enters the authenticated navigation tree.

### Login

- `LoginScreen` calls `POST /auth/login`.
- Verified accounts proceed directly into the app.
- Token and user data are persisted through `auth.store.ts`.

### Password recovery

1. `ForgotPasswordScreen` calls `POST /auth/forgot-password`.
2. The backend sends a reset code by email.
3. `ResetPasswordScreen` calls `POST /auth/reset-password`.

## 8. Role-Based Navigation

Navigation is rooted in `src/navigation/index.tsx` and `src/navigation/AppNavigator.tsx`.

- Unauthenticated users: auth stack
- Customer drawer: shop, cart, my orders, profile, notifications
- Admin drawer: dashboard, manage cakes, manage orders, manage users, profile, notifications
- Delivery drawer: delivery orders, profile, notifications

## 9. Current Feature Set

### Customer experience

- Browse cakes and open item details.
- Search and filter the catalog.
- Add multiple cakes to a cart.
- Place direct orders or multi-item cart orders.
- Choose quantity, size, flavour, design notes, delivery address, scheduled delivery time, and payment method.
- Track order progress from the timeline view.
- Submit rating and feedback after delivery.
- Receive live notifications for order and payment updates.

### Admin experience

- View dashboard summaries and chart data.
- Change cake availability.
- Add or edit cake images with the image picker flow.
- Manage all orders and delivery assignments.
- Review submitted payment proofs in a payment queue.
- Approve payment or reject with a required reason.
- Open uploaded proof images for verification.
- Manage users, including customers and delivery personnel.
- Review report summaries by period.
- Monitor notifications and unread counts.

### Delivery experience

- View assigned deliveries only.
- Update delivery status as the order progresses.
- Submit payment proof with transaction reference and receipt/proof image.
- Re-submit proof after admin rejection.
- Open delivery coordinates in maps when provided.
- Receive realtime order and notification updates.

### Payment workflow in the app

- Customer selects payment method during order placement.
- Delivery submits proof via the delivery orders screen (`transactionRef`, optional bank for cash, required bank for non-cash, and `proofImage`).
- Admin reviews proofs from manage orders:
  - approve -> payment becomes paid
  - reject -> payment becomes rejected with reason visible in order details
- Rejected proofs remain actionable for delivery re-submission.

## 10. Realtime Behavior

`src/realtime/socket.ts` subscribes to backend Socket.IO events after login.

Order events:

- `order:created`
- `order:status_updated`
- `order:assigned`
- `order:delivered`
- `order:payment_updated`

Notification events:

- `notification:new`

These updates flow into the Zustand stores so badges, lists, and dashboards stay current without a full refresh.

## 11. State Management

- `auth.store.ts`: token and user persistence, hydration, login/logout helpers
- `cart.store.ts`: multi-item cart with quantity and item updates
- `order.store.ts`: paginated order data, role-aware fetching, realtime upserts
- `notification.store.ts`: notification list, unread count, mark-read actions
- `theme.store.ts`: persisted theme state
- `i18n.store.ts`: persisted language state and hydration

## 12. Shared UI and Screen Notes

Key reusable pieces:

- `components/Input.tsx`: secure inputs with visibility toggles
- `components/Button.tsx`: primary, secondary, and danger actions
- `components/Card.tsx`: consistent surfaces for lists and dashboard panels
- `components/OrderStatusTimeline.tsx`: visual order progress indicator
- `components/CakeImageGallery.tsx`: product image viewer
- `components/location/LocationPickerModal.tsx`: map-based location picker

Important screens currently present:

- Auth: `LoginScreen`, `RegisterScreen`, `VerifyEmailScreen`, `ForgotPasswordScreen`, `ResetPasswordScreen`
- Customer: `CakeListScreen`, `PlaceOrderScreen`, `CartScreen`, `MyOrdersScreen`
- Admin: `DashboardScreen`, `ManageCakesScreen`, `ManageOrdersScreen`, `ManageUsersScreen`
- Shared: `ProfileScreen`, `NotificationsScreen`
- Delivery: `DeliveryOrdersScreen`

## 13. Troubleshooting

- API connection issues:
  - confirm the backend is running on port `4000`
  - confirm `EXPO_PUBLIC_API_BASE_URL` or the LAN fallback in `src/utils/constants.ts`
  - ensure the device or emulator can reach the backend host
- Map or location issues:
  - grant location permissions
  - confirm device location services are enabled
- Realtime updates not appearing:
  - make sure the backend Socket.IO server is running
  - log out and back in to rejoin the appropriate socket rooms

## 14. Important Files to Study

- `App.tsx`: app bootstrap and providers
- `src/navigation/AppNavigator.tsx`: role routing, notification badges, socket subscriptions
- `src/api/*.ts`: API contracts and response mapping
- `src/store/*.ts`: app state and persistence
- `src/screens/**`: full feature implementations by role
- `src/utils/constants.ts`: environment and API base URL fallbacks

---

For backend API and server internals, read `../backend/README.md`.
