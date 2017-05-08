# Documentation API REST SeekFriendBack

## Host

- mlollo.rmoprheus.enseirb.fr

## Protocol

- http

## Run

### Launch on windows (node prompt) the app with:

- `set DEBUG=seeekfriendback:* & npm start`

### Launch on ubuntu the app with:

- `sudo DEBUG=seeekfriendback:* & npm start`

## Specifications

### Modules

- expressjs :

Pour notre API REST, nous avons utilisé le module expressjs (qui permet d'avoir un serveur léger et rapide). 

- mongoose :

- bcrypt :

- jsonwebtoken :

- express-jwt:

## Routes

### Basic Opérations without token

- GET /users/getall
  - Description : Get a json list of all users
  - Body Param : None
  - Response :
    - 200:
      - JsonObject:
        - String: email
        - String: pseudo
        - Boolean: isLog
        - String: token
    - 500:
      - JsonObject: error
- POST /users/add
  - Description : Add a new user to the data base when a app do Register
  - Module Use : 
    - bcrypt : to encrypt the password
    - jwt : to create a token for this email
  - Body Param :
    - String: email
    - String: pseudo
    - String: password
  - Response :
    - 200:
      - JsonObject:
        - Boolean: invalid
    - 400:
      - String: error (all body params are required)
    - 500:
      - JsonObject: error
- POST /users/login
  - Description : Login a user to the database and retrieve the token
  - Module Use : 
    - bcrypt : to check if the password is correct
  - Body Param :
    - String: email
    - String: password
  - Response :
    - 200:
      - JsonObject:
        - Boolean: valid
        - JsonObject: user
          - String: email
          - String: pseudo
          - String: password
          - Boolean: isLog
          - String: token
    - 400:
      - String: error (all body params are required)
    - 401:
      - JsonObject:
        - Boolean: valid
    - 500:
      - JsonObject: error
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
