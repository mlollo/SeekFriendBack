# Documentation API REST SeekFriendBack

## Run

### Launch on windows (node prompt) the app with:

- `set DEBUG=seeekfriendback:* & npm start`

### Launch on ubuntu the app with:

- `sudo DEBUG=seeekfriendback:* & npm start`

## Specifications

### Modules

- expressjs :

Pour notre API REST, nous avons utilisé le module expressjs (qui permet d'avoir un serveur léger et rapide). 

- bcrypt :

- jsonwebtoken :

- express-jwt:

## Routes

### Basic Opérations without token

- GET /users/getall

- POST /users/add

- POST /users/login

- POST /users/getcoords

- POST /users/onsearch

### Use of jwt.verify() methods to require an authentification token for all others routes

- POST /users/logine

- POST /users/addcoords

- POST /users/onsearchprofil

- POST /users/addfriend

- POST /users/isfriend

- POST /users/logout

- POST /users/getbyemail

- POST /users/getbyid

- PUT /users/pw

- POST /users/reset

- POST /users/rm

- POST /users/removeFriend

- POST /coords/reset

- POST /coords/rm

- POST /friends/reset

- POST /friends/rm
