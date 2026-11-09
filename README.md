# SYMBIOLOGY — Project Scaffold

A full folder/file **architecture starter**, not a finished application.

## Start
1. `npm install`
2. Copy `.env.example` to `.env.local` and configure Supabase.
3. `npm run dev`
4. Visit `http://localhost:3000`

## Status
- Basic landing, login/register forms and bottom navigation implemented.
- Most screens are layout placeholders; AI generation, image editing, 3D, IoT, marketplace and admin logic are **not implemented**.
- Midtrans **Snap** planned. `/api/payments/create` returns 501 intentionally until order validation, DB persistence and real server-side transaction creation are built.
- `/api/payments/webhook` validates Midtrans SHA-512 signature but returns 501 until secure idempotent reconciliation with DB is implemented. Never mark an order paid from browser callbacks.
- Supabase migration files are placeholders, not a deployable schema.
- ESP32 firmware is a basic scaffold, not working sensor/control firmware.

## Architecture
- User: Beranda, Marketplace, AI Studio (center), Akuaponikku, Profil.
- AI Studio: photo upload -> vision -> validated engineering rules -> 3D + image render -> recommendations -> cost.
- Payment: Midtrans Snap, backend creates transaction from server-trusted prices, webhook signature validation and idempotent updates.
- IoT: ESP32 with secure device identity, telemetry, safe local controls and server commands.

## Production blockers
Implement authentication guards/RLS, database schema, real AI endpoints, media upload limits, engineering validations, payment checkout & verified webhook reconciliation, order state machine, secure device pairing, device command authorization, safety failover, tests, and deployment monitoring.
