==authRouter==
POST /signup
POST /login
POST /logout

==profileRouter==
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

==connectionRequestRouter==
[ POST /request/send/interested/:userId, POST /request/send/ignored/:userId ] => POST /request/send/:status/:userId

POST /request/review/accepted/:requested
POST /request/review/rejected/:requested

==userRouter==
GET /user/connections/:status
GET /user/requests
GET /user/feed

STATUS: ignore, interested, accepted, rejected
