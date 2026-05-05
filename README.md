# Airbnb Clone (Full Stack Project)

This is a full stack web application inspired by Airbnb where users can explore listings, book stays, and manage their bookings. I built this project to understand how real-world platforms handle user interaction, bookings, and data consistency.

## Features

* User authentication (signup/login/logout)
* Create, edit and delete listings
* Upload listing images
* Add reviews and ratings
* Booking system with date selection
* Calendar that blocks already booked and past dates
* Prevents overlapping bookings (even across different users)
* User dashboard to view and manage bookings
* Hosts can see bookings on their listings
* Cancel booking (only for upcoming bookings)
* Flash messages for feedback

## Tech Stack

* Node.js
* Express.js
* MongoDB & Mongoose
* EJS (templating)
* Bootstrap (UI)
* Passport.js (authentication)
* Cloudinary (image storage)
* Mapbox (maps)

## What I Focused On

While building this, I tried to focus more on **real-world logic instead of just UI**.
Some things I paid attention to:

* Handling booking conflicts properly using date overlap logic
* Making sure users cannot book past dates
* Preventing users from booking their own listings
* Keeping backend validation strong even if frontend fails
* Structuring the project using MVC pattern

## Dashboard

I added a dashboard where:

* Users can see their bookings
* Hosts can see bookings on their listings
* Users can cancel upcoming bookings

## Challenges I Faced

* Implementing correct date overlap logic for bookings
* Syncing frontend calendar with backend availability
* Managing relationships between users, listings, and bookings.

## How to Run Locally

1. Clone the repository

2. Install dependencies
   npm install

3. Add your environment variables (.env):

   * ATLASDB_URL
   * SECRET
   * CLOUDINARY credentials
   * MAPBOX token

4. Run the server
   node app.js

5. Open in browser
   http://localhost:8080

## Live Demo
https://airbnb-project-7cl8.onrender.com
Deployed on Render with MongoDB Atlas as database.

This project helped me understand how a real booking system works and how to handle edge cases properly.
