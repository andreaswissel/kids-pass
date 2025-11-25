1. Product Overview

Product name (working): KidsPass (placeholder)
Tagline: “Flexible activities for curious kids — one membership, endless options.”

Goal:
Help parents discover and book kids’ activities (sports, music, arts, etc.) with a single flexible subscription, letting children try many activities instead of committing to one long-term club membership.

Primary audience:
	•	Parents (25–45), typically in urban/suburban areas, with children aged 3–14.
	•	Secondary: Activity providers (clubs, studios, coaches).

MVP platform:
	•	Responsive web app for parents + lightweight admin/partner interface.

⸻

2. User Roles & Permissions

2.1 Roles
	1.	Parent
	•	Manages own account & billing
	•	Manages one or more child profiles
	•	Books & cancels activities
	•	Views upcoming schedule and history
	2.	Partner (Activity Provider) – MVP-light
	•	(MVP) Managed by internal admin; later gets own login
	•	Has multiple activities and sessions assigned
	3.	Admin
	•	Manages partners & activities
	•	Sees basic stats & user list
	•	Can manually adjust bookings and subscriptions

⸻

3. Core User Flows (MVP)

3.1 Parent: Onboarding
	1.	Visit marketing/landing page.
	2.	Click “Get Started” → signup (email + password, or OAuth later).
	3.	Provide basic details:
	•	Parent name
	•	Home area (city / postcode)
	4.	Create first Child:
	•	Name
	•	Age / birth year
	•	Interests (multi-select: “Ball sports”, “Music”, “Climbing”, “Creative”, etc.)
	5.	Choose Plan (for MVP: 1 plan is enough, e.g. “4 activities per month”).
	6.	Enter payment details → create subscription via Stripe.
	7.	Redirect to Dashboard → Recommended activities.

3.2 Parent: Discover & Book Activity
	1.	From dashboard, see:
	•	“Recommended for [Child]”
	•	Filters: Child, Category, Day of week, Time range, Distance (optional).
	2.	Click a card to open Activity detail:
	•	Description
	•	Partner / location
	•	Age group
	•	When & how often
	•	Remaining spots (optional, for later)
	3.	Choose:
	•	Child (if multiple)
	•	Session/date (if repeating class with multiple time slots).
	4.	Click “Book”.
	5.	Booking is validated:
	•	Check remaining monthly quota (e.g., 4 per month)
	•	Check time conflict with existing booking for that child
	6.	On success:
	•	Show confirmation screen
	•	Add to Upcoming list
	•	Send confirmation email (later: add calendar invite).

3.3 Parent: Manage Bookings
	1.	Open “My Schedule”:
	•	Show upcoming activities in chronological order
	•	Filter by child
	2.	Each booking shows:
	•	Activity name, partner, date/time, location
	•	Child name
	•	Status (Booked / Attended / Cancelled)
	3.	Parent can:
	•	Cancel booking up to configurable cutoff (e.g., 24 hours before start).
	•	View past activities in a second tab (“History”).

3.4 Parent: Account & Billing
	1.	Profile
	•	Update name, email, password
	•	Manage children (add/edit/remove)
	2.	Billing
	•	See current subscription plan
	•	See next billing date
	•	See invoice history (from Stripe)
	•	Ability to cancel subscription (hard or soft cancel; MVP can link to Stripe customer portal)

3.5 Admin: Partner & Activity Management (Internal Tool)
	1.	Partners
	•	Create/update Partner (name, address, description, contact info).
	2.	Activities
	•	Create/update Activity:
	•	Title
	•	Description
	•	Partner
	•	Category (Sports, Music, Arts, etc.)
	•	Age range
	•	Skill level (optional)
	3.	Sessions
	•	Recurring or single sessions:
	•	Day of week + time range OR exact date/time
	•	Capacity (number of kids)
	4.	Bookings overview
	•	List bookings with filters (by date, activity, partner, child)
	5.	Users
	•	Search parents, see subscription & bookings
	•	(MVP) No manual billing changes, but read-only view of Stripe customer ID.

⸻

4. Feature Scope (MVP vs Later)

4.1 MVP Features

Parent-facing
	•	Landing page with product explanation and CTA.
	•	Authentication:
	•	Email/password signup & login
	•	Password reset.
	•	Child profiles:
	•	Create, edit, delete.
	•	Activity browsing & filters:
	•	Category, age, day, time
	•	Text search (optional).
	•	Activity details page.
	•	Booking system:
	•	Book activities for a specific child
	•	Quota enforcement (max bookings per billing cycle)
	•	Booking confirmation view.
	•	Schedule:
	•	Upcoming activities list
	•	Past activities list.
	•	Simple cancellation flow with cutoff.
	•	Subscription & billing:
	•	Single plan (e.g., 4 bookings/month)
	•	Stripe checkout
	•	Stripe customer portal link for managing payment method & cancel.

Admin
	•	Secure admin login.
	•	CRUD for partners.
	•	CRUD for activities & sessions.
	•	Booking overview.
	•	Basic user overview.

4.2 Future Versions (Non-MVP, for parking lot)
	•	Partner self-service portal with activity/schedule management.
	•	Recurring class logic vs drop-in sessions.
	•	Waitlists, stand-by.
	•	Ratings & reviews for activities.
	•	Recommendation engine (“What should Leo try next?”).
	•	Social sharing (invite other parents).
	•	Badges/achievements for kids.
	•	Geo-based discovery with map view.
	•	Multi-region support and localization.
	•	Native Expo app with push notifications and offline capabilities.

⸻

5. Non-Functional Requirements
	•	Performance
	•	Initial page load < 2s on average broadband.
	•	Core interactions (booking, cancel) respond within < 500ms backend time.
	•	Availability
	•	Target 99% uptime for MVP (best-effort).
	•	Security
	•	JWT-based authentication or Next Auth (session-based).
	•	Role-based access control (parent vs admin).
	•	HTTPS enforced.
	•	Compliance
	•	Store minimal data about children, clearly describe purpose.
	•	GDPR-ready: allow data deletion on request.
	•	Scalability
	•	Architecture should support:
	•	Multi-city in the future
	•	Additional roles (partner accounts) without major refactor.
	•	Logging & Monitoring
	•	Capture basic error logs on backend.
	•	Track key events (signup, booking, cancel, checkout) for analytics.

⸻

6. Suggested Tech Stack

(Change as you like; this is aimed to be agent-friendly.)

Frontend
	•	Next.js (App Router) + React + TypeScript
	•	Styling: Tailwind CSS
	•	State management: React Query / TanStack Query for data fetching
	•	Forms: React Hook Form + Zod schema validation

Backend
	•	Next.js API routes (or separate Node/NestJS backend later).
	•	Database: Postgres (Supabase / Railway / Neon)
	•	ORM: Prisma
	•	Auth: NextAuth.js (email/password provider, later OAuth)
	•	Payments: Stripe subscriptions
	•	Emails: Resend/SendGrid (for MVP: optional, can start with minimal).

⸻

7. Data Model (Initial Schema)

7.1 Entities

User
	•	id (UUID)
	•	email (unique)
	•	passwordHash (or delegated to auth provider)
	•	name
	•	role (PARENT | ADMIN)
	•	createdAt, updatedAt

Child
	•	id
	•	userId (FK → User)
	•	name
	•	birthDate or ageGroup (e.g., 3-5, 6-8, etc.)
	•	interests (string[] or separate join table)
	•	createdAt, updatedAt

Partner
	•	id
	•	name
	•	description
	•	address
	•	city
	•	contactEmail
	•	contactPhone
	•	websiteUrl (optional)
	•	createdAt, updatedAt

Activity
	•	id
	•	partnerId (FK → Partner)
	•	title
	•	description
	•	category (SPORTS, MUSIC, ARTS, OUTDOOR, etc.)
	•	ageMin
	•	ageMax
	•	skillLevel (optional)
	•	locationAddress
	•	city
	•	createdAt, updatedAt

Session (individual bookable occurrence)
	•	id
	•	activityId (FK → Activity)
	•	startDateTime
	•	endDateTime
	•	capacity (max number of kids)
	•	createdAt, updatedAt

Booking
	•	id
	•	sessionId (FK → Session)
	•	childId (FK → Child)
	•	userId (FK → User) – parent who booked
	•	status (BOOKED, CANCELLED, ATTENDED, NO_SHOW)
	•	createdAt, updatedAt
	•	cancelledAt (nullable)

Subscription
	•	id
	•	userId (FK → User)
	•	stripeCustomerId
	•	stripeSubscriptionId
	•	planCode (e.g., PLAN_4_PER_MONTH)
	•	status (ACTIVE, CANCELLED, PAUSED)
	•	currentPeriodStart
	•	currentPeriodEnd
	•	createdAt, updatedAt

Plan
	•	code (string, PK or unique)
	•	name
	•	description
	•	priceCents
	•	currency
	•	creditsPerPeriod (e.g., 4 activities)
	•	period (MONTHLY)

Usage
	•	id
	•	subscriptionId
	•	periodStart
	•	periodEnd
	•	usedCredits (integer)

⸻

8. API Endpoints (MVP)

(Assuming REST-ish API routes under /api on Next.js)

Auth
	•	POST /api/auth/signup
	•	body: { email, password, name }
	•	effect: create user, return session/JWT
	•	POST /api/auth/login
	•	body: { email, password }
	•	effect: return session/JWT
	•	POST /api/auth/logout
	•	POST /api/auth/password-reset-request
	•	POST /api/auth/password-reset

Child
	•	GET /api/children
	•	POST /api/children
	•	PUT /api/children/:id
	•	DELETE /api/children/:id

Activities & Sessions
	•	GET /api/activities
	•	query params: category, age, dayOfWeek, city, childId
	•	GET /api/activities/:id
	•	GET /api/activities/:id/sessions
	•	optional filters for date range

Bookings
	•	GET /api/bookings
	•	Filters: future=true|false, childId
	•	POST /api/bookings
	•	body: { sessionId, childId }
	•	logic:
	•	validate subscription is active
	•	validate remaining credits in current period
	•	validate no over-capacity on Session
	•	POST /api/bookings/:id/cancel
	•	logic:
	•	check cutoff time
	•	if okay, set status CANCELLED and return credit.

Subscription & Billing
	•	GET /api/subscription
	•	POST /api/subscription/create-checkout-session
	•	returns Stripe checkout URL
	•	POST /api/subscription/webhook
	•	Stripe webhook handler to update subscription & usage
	•	GET /api/subscription/usage
	•	returns current period quota vs used count

Admin

All admin endpoints protected via role: ADMIN.
	•	GET /api/admin/partners
	•	POST /api/admin/partners
	•	PUT /api/admin/partners/:id
	•	GET /api/admin/activities
	•	POST /api/admin/activities
	•	PUT /api/admin/activities/:id
	•	GET /api/admin/sessions
	•	POST /api/admin/sessions
	•	PUT /api/admin/sessions/:id
	•	GET /api/admin/bookings
	•	GET /api/admin/users

⸻

9. Frontend Pages & Components

9.1 Public
	•	/ – Landing page
	•	Hero: short pitch, CTA “Get Started”
	•	Simple explanation of how it works (3 steps)
	•	/signup
	•	/login

9.2 Parent App
	•	/app – Dashboard
	•	Greeting (“Hi, [Name]”)
	•	Child selector (tabs or pills)
	•	Recommended activities list (for MVP: simple filtered list by age)
	•	/app/activities
	•	Filters toolbar (Child, Category, Day, Time)
	•	Activity cards grid/list
	•	/app/activities/[id]
	•	Activity details
	•	Session selector
	•	Book button
	•	/app/schedule
	•	Tabs: Upcoming / History
	•	List of bookings with actions (cancel).
	•	/app/profile
	•	Parent profile details
	•	Children list with “Add Child”
	•	Link to Billing
	•	/app/billing
	•	Current plan
	•	Usage: 2 of 4 activities used this month
	•	Button: “Manage subscription” (Stripe customer portal)

9.3 Admin App
	•	/admin – Overview (guarded route)
	•	/admin/partners
	•	/admin/activities
	•	/admin/sessions
	•	/admin/bookings
	•	/admin/users

⸻

10. Acceptance Criteria (MVP)
	1.	Signup & Login
	•	Parent can sign up, log in, and stay logged in across sessions.
	•	Invalid credentials show a clear error message.
	2.	Child Management
	•	Parent can create at least one child profile.
	•	On deleting a child, booking history is preserved or soft-deleted (define behavior; MVP: prevent deletion if there are future bookings).
	3.	Activity Discovery & Booking
	•	Parent can see a list of activities filtered by their child’s age.
	•	Parent can open an activity and see its sessions.
	•	Parent can book a session for a child if:
	•	He/she has an active subscription.
	•	The monthly credit limit is not exceeded.
	•	The session is not full.
	•	Booking is visible in “Upcoming” schedule.
	4.	Cancellation
	•	Parent can cancel any upcoming booking before cutoff time.
	•	Cancellation restores the credit to the monthly usage.
	5.	Subscription
	•	Parent can start a subscription via Stripe checkout.
	•	System updates subscription status via Stripe webhook.
	•	When subscription is inactive, parent cannot make new bookings but can view schedule/history.
	6.	Admin
	•	Admin can log in and manage partners, activities, and sessions.
	•	Admin can see a list of bookings and users.
