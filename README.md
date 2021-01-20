# Canskate App API

**[Live Site](https://canskate.vercel.app)**  
**[Frontend Repo](https://github.com/marcuses101/canskate)**

## Endpoints

### /api/user

Route | Request | Body | Result
----- | ------ | ------ | ------ | 
/api/user | POST | username, password | creates new user
/api/user/login | POST | username, password | returns an access token required to access club data

### /api/club
Route | Request | Header | Body | Result
----- | ------ | ------ | ------ | ----- |
/api/club | GET | Authorization: token | | return clubs associated to user
/api/club | POST | Authorization: token | name | returns created club JSON
/api/club/:id | GET | Authorization: token | | return all data associated with the club for use in front end app.
/api/club/:id | PATCH | Authorization: token | name | Returns updated club JSON.

### /api/skater

Route | Request | Body | Result
----- | ------ | ------ | ------ | 
/api/skater | POST | fullname, gender, birthdate | returns the created skater JSON
/api/skater | PATCH | minimum one of the following: 'fullname', 'gender', 'birthdate' | returns the updated skater JSON
/api/skater/:id | GET | | returns the skater JSON associated with id

### /api/session

Route | Request | Body | Result
----- | ------ | ------ | ------ | 
/api/session | POST | day, start_time, duration, club_id | returns created session JSON
/api/session | GET | | return session JSON with associated id
/api/session/:id | PATCH | minimum one of: day, start_time, duration | updates session with associated id
/api/session:id | DELETE | | deletes session with associated id

### /api/group

Route | Request | Body | Result
----- | ------ | ------ | ------ | 


### /api/log

Route | Request | Body | Result
----- | ------ | ------ | ------ | 

### /api/skater-club

Route | Request | Body | Result
----- | ------ | ------ | ------ | 

### /api/skater-session

Route | Request | Body | Result
----- | ------ | ------ | ------ | 

### /api/skater-group
Route | Request | Body | Result
----- | ------ | ------ | ------ | 
