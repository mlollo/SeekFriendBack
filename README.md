# Documentation API REST SeekFriendBack

## Host

- mlollo.rmoprheus.enseirb.fr

## Protocol

- http

## Port

- 80

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
  - Description : Package qui permet de connecter le serveur à la base de données mongodb (connect dans app.js ligne 58) et permet de créer des models, enregistrer des entrées (save), rechercher des entrées (find), les modifier (findOneAndUpdate) et les supprimer (remove).
  
- bcrypt :
  - Description : permet d'encrypter un mot de passe (hashSync) et de comparer un mot de passe avec celui encrypté et stocké dans mongodb (compareSync)
  
- jsonwebtoken :
  - Description : permet de créer un token à partir d'une phrase servant de mot de passe et d'un username (dans notre cas un email) et permet de verifier si le token donné en paramètre correspond à celui stocké dans la base. Cela permet l'authentification des requêtes des users.
  
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
  - Description : Login a user who is in the database (update of islog field) and retrieve the token
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
  - Description : Get all users and coords to show in the sidebar view, used in reloadFriendsList
                : If you are logged you have every user except you but you can only show the positions of your friends
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
                : If you are logged you have every user who match except you
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
  - Description : Add an entry to the coords entity when a user is saving a position
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
  - Description : Get all coords or all coords which match with search to show in the sidebar profil view when you are logged in
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
  - Description : check if two users are friends
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
  - Description : logout and update the parameter islog
  - Body Param :
    - String: email
  - Response :
    - 200:
       - JsonObject:
          - String: email
          - String: pseudo
          - String: password
          - Boolean: isLog
          - String: token
    - 400:
      - String: error (friends1 and friends2 are required)
    - 500:
      - JsonObject: error
      
- POST /users/getbyemail
  - Description : get a user who matchs with an email
  - Body Param :
    - String: email
  - Response :
    - 200:
       - JsonObject:
          - String: email
          - String: pseudo
          - String: password
          - Boolean: isLog
          - String: token
    - 500:
      - JsonObject: error
      
- POST /users/getbyid
  - Description : get a user who matchs with an id
  - Body Param :
    - String: user_id
  - Response :
    - 200:
       - JsonObject:
          - String: email
          - String: pseudo
          - String: password
          - Boolean: isLog
          - String: token
    - 400:
      - String: error (user_id are required)
    - 500:
      - JsonObject: error
      
- PUT /users/pw
  - Description : update the user's password
  - Module :
    - bcrypt :  compare the old password with database password
  - Body Param :
    - String: password
    - String: newpassword
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
    - 400:
      - String: error (password and newpassword are required)
    - 401:
      - JsonObject:
        - Boolean: valid
    - 500:
      - JsonObject: error
      
- POST /users/reset
  - Description : delete all users not use in the app
  - Response :
    - 200:
       - String: Success
    - 500:
      - JsonObject: error
      
- POST /users/rm
  - Description : delete one user not used in the app
  - Body Param :
    - String: email
  - Response :
    - 200:
       - String: Success
    - 400:
      - String: error (email is required)
    - 500:
      - JsonObject: error
      
- POST /users/removeFriend
  - Description : delete a friendship by users id, used in the sidebar view in the menu template
  - Body Param :
    - String: friends1
    - String: friends2
  - Response :
    - 200:
       - String: Success
    - 400:
      - String: error (friends1 and friends2 are required)
    - 500:
      - JsonObject: error
      
- POST /coords/reset
  - Description : delete all coords not used
  - Response :
    - 200:
       - String: Success
    - 500:
      - JsonObject: error
      
- POST /coords/rm
  - Description : delete one coord by id, used in profil view when deleting a position record
  - Body Param :
    - String: id
  - Response :
    - 200:
       - String: Success
    - 400:
      - String: error (id is required)
    - 500:
      - JsonObject: error
      
- POST /friends/reset
  - Description : delete all friendships not used
  - Response :
    - 200:
       - String: Success
    - 500:
      - JsonObject: error
      
- POST /friends/rm
  - Description : delete one friendship by id not used
  - Body Param :
    - String: id
  - Response :
    - 200:
       - String: Success
    - 400:
      - String: error (id is required)
    - 500:
      - JsonObject: error
