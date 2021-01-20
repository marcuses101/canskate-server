# CanSkate App API

## Summary

**[Live Site](https://canskate.vercel.app)**  
**[Frontend Repo](https://github.com/marcuses101/canskate)**

Used with the frontend CanSkate App, this REST API allows users better organize their [CanSkate](https://skatecanada.ca/learn-to-skate/canskate/) Program \(A program designed to teach beginner skaters the fundamentals of ice skating\). Manage clubs, sessions, groups, skaters. Keep track of skater evaluation and progress.

## Endpoints

### /api/user

| Route           | Request | Body                   | Result                                               |
| --------------- | ------- | ---------------------- | ---------------------------------------------------- |
| /api/user       | POST    | username<br/> password | creates new user                                     |
| /api/user/login | POST    | username<br/> password | returns an access token required to access club data |

---

### /api/club

| Route         | Request | Header               | Body | Result                                                             |
| ------------- | ------- | -------------------- | ---- | ------------------------------------------------------------------ |
| /api/club     | GET     | Authorization: token |      | return clubs associated to user                                    |
| /api/club     | POST    | Authorization: token | name | returns created club JSON                                          |
| /api/club/:id | GET     | Authorization: token |      | return all data associated with the club for use in front end app. |
| /api/club/:id | PATCH   | Authorization: token | name | Returns updated club JSON.                                         |

---

### /api/skater

| Route           | Request | Body                                                                                                                       | Result                                     |
| --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| /api/skater     | POST    | fullname<br/> gender: <ul><li>Male</li><li>Female</li><li>Other</li></ul> birthdate                                        | returns the created skater JSON            |
| /api/skater     | PATCH   | **minimum one of the following:** <br/>fullname<br/> gender: <ul><li>Male</li><li>Female</li><li>Other</li></ul> birthdate | returns the updated skater JSON            |
| /api/skater/:id | GET     |                                                                                                                            | returns the skater JSON associated with id |

---

### /api/session

| Route            | Request | Body                                                                                                                                                                                           | Result                                 |
| ---------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| /api/session     | POST    | day: <ul><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li><li>Sunday</li></ul> start_time<br/> duration<br/> club_id                          | returns created session JSON           |
| /api/session     | GET     |                                                                                                                                                                                                | return session JSON with associated id |
| /api/session/:id | PATCH   | **minimum one of the following:**<br/> day:<ul><li>Monday</li><li>Tuesday</li><li>Wednesday</li><li>Thursday</li><li>Friday</li><li>Saturday</li><li>Sunday</li></ul> start_time<br/> duration | updates session with associated id     |
| /api/session:id  | DELETE  |                                                                                                                                                                                                | deletes session with associated id     |

---

### /api/group

| Route          | Request | Body                                                                                                                                         | Result                                    |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| /api/group     | POST    | group_color: <ul><li>Red</li><li>Orange</li><li>Yellow</li><li>Green</li><li>Blue</li><li>Purple</li><li>Turquoise</li></ul><br/> session_id | returns created group JSON                |
| /api/group/:id | GET     |                                                                                                                                              | returns the group JSON with associated id |
| /api/group/:id | PATCH   | group_color: <ul><li>Red</li><li>Orange</li><li>Yellow</li><li>Green</li><li>Blue</li><li>Purple</li><li>Turquoise</li></ul>                 | updated group with associated id          |
| /api/group/:id | DELETE  |                                                                                                                                              | deletes the group with associated id      |

---

### /api/log

| Route        | Request | Body                                             | Result                                                                                                                                                    |
| ------------ | ------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| /api/log     | POST    | skater_id<br/>element_id</br>date_completed<br/> | returns JSON of the created element log, as well as any checkmark, ribbon, or badge logs if the requirements were met with the completion of this element |
| /api/log/:id | DELETE  |                                                  | returns JSON of the deleted element checkmark ribbon and badge logs if the requirements are no longer met                                                 |

---

### /api/skater-club

Used to associate a skater to a club.

| Route            | Request | Body                  | Result                                                    |
| ---------------- | ------- | --------------------- | --------------------------------------------------------- |
| /api/skater-club | POST    | skater_id<br/>club_id | returns JSON of the created skater-club log               |
| /api/skater-club | DELETE  | skater_id<br/>club_id | removes the log with the associated skater_id and club_id |

---

### /api/skater-session

Used to associate a skater to a session
| Route | Request | Body | Result |
| ----- | ------- | ---- | ------ |
/api/skater-session | POST | skater_id<br/>session_id | returns JSON of the created skater-session log
/api/skater-session | DELETE | skater_id<br/>session_id | removes the log with the associated skater_id and session_id

---

### /api/skater-group

Used to associate a skater to a group
| Route | Request | Body | Result |
| ----- | ------- | ---- | ------ |
/api/skater-group | POST | skater_id<br/>group_id | returns JSON of the created skater-group log
/api/skater-group | PATCH | skater_id<br/>group_id<br/>new_group_id | updates the log

## Tech

- JavaScript
- Node.js
- Express.js
- Postgres

---

## Author Information

### Marcus Connolly

- [Portfolio](https://marcus-connolly.com)
- [LinkedIn](www.linkedin.com/in/marcus-connolly-web)
- [GitHub](www.github.com/marcuses101)
- [Email](mailto:mnjconnolly@gmail.com)
