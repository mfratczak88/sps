<p align="center">
  <img src="frontend/src/assets/logo.svg" />
</p>
<p align="center">
  <a href="https://api.netlify.com/api/v1/badges/78681f56-68fe-40cc-839e-a831bcb2bf25/deploy-status">
    <img src="https://api.netlify.com/api/v1/badges/78681f56-68fe-40cc-839e-a831bcb2bf25/deploy-status">
    </img>
  </a>
    <a href="https://codecov.io/gh/mfratczak88/sps/branch/main/graph/badge.svg?token=M3QPKXQ1UK">
    <img src="https://codecov.io/gh/mfratczak88/sps/branch/main/graph/badge.svg?token=M3QPKXQ1UK">
    </img>
  </a>
    <a href="https://img.shields.io/github/actions/workflow/status/mfratczak88/sps/ci.yml?label=checks">
    <img src="https://img.shields.io/github/actions/workflow/status/mfratczak88/sps/ci.yml?label=checks">
    </img>
  </a>
    <a href="https://img.shields.io/github/actions/workflow/status/mfratczak88/sps/cd.yml?label=build">
    <img src="https://img.shields.io/github/actions/workflow/status/mfratczak88/sps/cd.yml?label=build">
    </img>
  </a>
</p>

# Overview

This app was basis for my CS degree thesis which revolved around a problem when a driver chooses in a specific day some kind of vehicle to commute and at the parking lot finds that all parking spaces are already taken. As a result it needs to drive out and for unknown period of time trying to find a new spot.

Inherent problem here is that driver cannot know beforehand that he would not find a parking spot in a given time. Should he knew that he would not have to make a decision to use a vehicle to commute in a given day.

**Most obvious solution was to create parking space reservation system**.

SPS stands for Simple Parking System (I just needed a name).

# Requirements

### Essentially there are 3 types of users in the app

* Admin
* Driver
* Parking clerk

### Admin
* Add/Display parking lots
* Change lot hours of operation
* Change lot capacity
* Display drivers
* Assign (or remove assignment) a driver to a parking lot
* Change user role

### Clerk
* Find a reservation based on a license plate
* Issue parking ticket
* Take in returned ticket

### Driver
* Add vehicle (as a base for a reservation)
* Display assigned parking lots
* Request access to a lot (TODO)
* Make reservation
* Display reservation(s)
* Confirm reservation
* Cancel reservation
* Edit time of a reservation (as long as it's not confirmed/cancelled/past)

# Architecture

## Two parts:
* backend (aka API)
* frontend

## Backend:

<img src="https://i.imgur.com/5bHSXOC.png"></img>

Domain holds the actual logic for handling use cases, and defines abstractions which are then implented in the outer layers (of the onion).

Application defines services, finders and DTOs (Commands, Queries).
Services handles Commands by usually fetching domain object from respository, calls a method on it and gives it back for save to repository.
Finders are just abstractions which operates on Queries.

Infrastructure handles REST requestes, email sending, authorization, authentication, CSRF Tokens, users etc. All flow comes through controllers which either uses finder to handle Query or service to handle Commands.

Persistence implements repositories, user store (from Infrastructure) and finders.



## Frontend 

On frontend there are modules for dashboards for each type of user together with error module and auth module.

Core module has logic related to handling state and returning state slices, api facades, guards and interceptors and some pipes and model.

Share module mainly stores shared components.

Smart components fetches data from store by using selectors and dispatches actions. Dumb components just display the data.

<img src="https://i.imgur.com/Bh6cb3T.png"></img>

# Tech used

## Frontend
* Angular
* NgXS
* Material
* Netlify

## Backend
* NestJS
* PostgreSQL
* Prisma
* Docker
* Fly.io
* Doppler
* Mailgun

# Setup
1. Setup Google authentication, and get client ID & client secret
2. Setup Mailgun account
3. Setup Bcrypt
  ```js
  console.log(require('bcrypt').genSaltSync(10));
  ```
4. Generate secrets for JWT token, refresh token & CSRF Token
```js
  const crypto = require('crypto');

  [...Array(3)].map(() => crypto.randomBytes(64).toString('base64'))
  ```
5. Put those into .env.example file in /api
6. Create Doppler account on https://doppler.com, and install Doppler CLI: https://docs.doppler.com/docs/install-cli.
7. Put those env vars into Doppler
8. Generate Doppler token for local env access
9. Set Doppler env var
   ```bash
   EXPORT DOPPLER_TOKEN=someTokenValue
   ```
10. Install deps in api & frontend by:
    ``` sh
    yarn --frozen-lockfile
    ```
11. Install doppler cli

# Running
## DB in Docker
```sh
 cd aio
 chmod +x infra-up.sh
 ./infra-up.sh
 cd api
 doppler run -- yarn prisma migrate dev
```
## Api
``` sh
 cd api && yarn start:debug
```
## Frontend
``` sh
 cd frontend && yarn start
```

Users to log in to be found in api/prisma/seed.ts

# TODO

* [ ] Request for parking access handling (driver->admin)
* [ ] Reservations details - admin
* [ ] Add flag to reservations dto if time has been exceeded -> blocking user
* [ ] Clear store on logout
* [ ] Bug - ongoing reservations not visible
* [ ] Bug - allows adding multiple reservations for the same license plate