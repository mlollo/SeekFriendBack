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
  - Description : Pour notre API REST, nous avons utilisé le module expressjs (qui permet d'avoir un serveur léger et rapide). 

- mongoose :
  - Use in every routes
- bcrypt :

- jsonwebtoken :

- express-jwt:

## Routes route.js

### Basic Operations without token

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
  - Description : Login a user to the database (update of islog field) and retrieve the token
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
  - Description : Get all users and coords to show in the sidebar view use in reloadFriendsList
                : If you are logged you have every user except you
  - Body Param :
    - Boolean: islog
    - String: user_id
  - Response :
    - 200:
      - JsonArray:
        - JsonObject: user
          - String: email
          - String: pseudo
          - String: password
          - Boolean: isLog
          - String: token
        - JsonArray: info
          - String: user_id
          - String: lat
          - String: lng
          - String: date
        - Boolean: isfriend
    - 400:
      - String: error (islog is required)
    - 500:
      - JsonObject: error
- POST /users/onsearch
  - Description : Get all users and coords that match with search to show in the sidebar view
                : If you are logged you have every user that match except you
  - Body Param :
    - Boolean: islog
    - String: search
    - String: user_id
  - Response :
    - 200:
      - JsonArray:
        - JsonObject: user
          - String: email
          - String: pseudo
          - String: password
          - Boolean: isLog
          - String: token
        - JsonArray: info
          - String: user_id
          - String: lat
          - String: lng
          - String: date
        - Boolean: isfriend
    - 400:
      - String: error (islog and search are required)
    - 500:
      - JsonObject: error
### Use 
- Use 
  - Description : use of jwt.verify() methods to require an authentification token for all others routes
  - Module :
    - jwt : use of verify methods
  - Body Param :
    - String: token
    - String: email
  - Response :
    - 400:
      - String: error (email is required or wrong token)
    - 401:
      - String: error (token is required)
    - 500:
      - JsonObject: error 
### Operation that require a token (email and token are required for all routes)

- POST /users/logine
  - Description : Login with a token when you choose remember me option (not working yet)
  - Body Param :
    - String: email
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
    - 500:
      - JsonObject: error
- POST /users/addcoords
  - Description : Add a entry to the coords entity when a user is saving a position
  - Body Param :
    - String: user_id
    - String: lat
    - String: lng
    - String: date 
  - Response :
    - 200:
      - JsonObject:
        - String: user_id
        - String: lat
        - String: lng
        - String: date
    - 500:
      - JsonObject: error
- POST /users/onsearchprofil
  - Description : Get all coords or all coords that match with search to show in the sidebar profil view when you are logged in
  - Body Param :
    - String: email
    - String: search
    - String: user_id
  - Response :
    - 200:
      - JsonArray:
        - JsonObject: user
          - String: email
          - String: pseudo
          - Boolean: isLog
        - JsonArray: info
          - String: user_id
          - String: lat
          - String: lng
          - String: date
    - 400:
      - String: error (user_id and search are required)
    - 500:
      - JsonObject: error
- POST /users/addfriend
  - Description : add a friendship between two users
  - Body Param :
    - String: friends1
    - String: friends2
  - Response :
    - 200:
      - JsonObject:
        - String: \_id
        - String: friends1
        - String: friends2
    - 400:
      - String: error (friends1 and friends2 are required)
    - 500:
      - JsonObject: error
- POST /users/isfriend
  - Description : check if two users are friend
  - Body Param :
    - String: friends1
    - String: friends2
  - Response :
    - 200:
      - JsonObject:
        - String: isfriend
    - 400:
      - String: error (friends1 and friends2 are required)
    - 500:
      - JsonObject: error
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
