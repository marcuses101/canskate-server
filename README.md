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
/api/club | POST | Authorization: token | name | returns created club object
/api/club/:id | GET | Authorization: token | | return all data associated with the club for use in front end app.
/api/club/:id | PATCH | Authorization: token | name | Returns updated club object.

### /api/skater

Route | Request | Body | Result
----- | ------ | ------ | ------ | 
/api/skater | POST | fullname, gender, birthdate | returns the created skater object
/api/skater | PATCH | minimum one of the following: 'fullname', 'gender', 'birthdate' | returns the updated skater object
/api/skater/:id | GET | | returns the skater object associated with id

### /api/session

Route | Request | Body | Result
----- | ------ | ------ | ------ | 

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
