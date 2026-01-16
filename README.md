A role-driven movie review platform built with the MERN stack that models real-world editorial workflows instead of simple CRUD posting.
Critics write movie reviews and essays, but Editors control publication.
Viewers can only read approved content.

I. Roles

A. Viewer
Read published reviews & essays
Filter by genre, movie, critic
No write access

B. Critic
Write movie reviews & essays
Save drafts
Edit own drafts
Submit for editorial review
View rejection feedback

C. Editor
Review submissions
Approve / reject with comments
Publish / unpublish content
Archive outdated reviews
Manage users & roles

II. Content Lifecycle
DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED

III. Security & Backend Practices

JWT-based authentication
Password hashing
Role-based route protection
Input validation
Centralized error handling
Proper HTTP status codes
Environment-based configuration

IV. Tech Stack
1) Backend
Node.js
Express.js
MongoDB (Atlas)
JWT Authentication

2) Frontend
React
Context API
Role-based UI rendering

V. Audit Logs
1) Auth/User:
User signup
Role change (later)

2) Reviews:
Review submitted for review
Review approved
Review rejected (with reason)
Review archived
