
RESTful API for MineSweeper game:
================================

General notes:
-------------

 * The API is built with compatibility in mind, both for mobile apps and for web
   browsers.

 * RESTful APIs require to use PUT HTTP method for updates, but that may rise
   some issues with browsers, so we bend the rules to use POST in those cases.

 * A single browser will not be able to participate in multiple windows or tabs,
   as the board-id is stored in a cookie.  The mobile app client should honor
   http sessions.

 * All HTTP requests will use the "boardId" cookie to fetch the current status
   of the board.

 * Since persistence locking is not used ATM, each request will return the full
   state of the board.

Resources:
---------

POST /game
  This creates a new board, returning a token, which acts as a session.
  The board-id is returned as a cookie.
  Parameters:

   - width: integer: 5..50
   - height: integer: 5..50

   (Limits are in api/Config.ts)

GET /game
  Returns the full board as JSON structure.
  Each cell is represented by an array of 2 entries:
    - flags: a string indicating the flags "visible" (represented with a 'v')
    and "flagged" (represented with an 'f').
    - the number of neighboring bombs.

  Board (5x5) in a response:
  {
     "width":5,
     "height":5,
     "board":[
        [             // first row
           ["f",0],   // top-left cell, flagged
           ["v",2],   // next cell to the right, visible, 2 neighboring bombs.
           ["v",2],
           ["",0],
           ["",2]
        ],
        ....
     ]
  }


POST /click
  Sends a "click" of a cell, it should be in "hidden" state, otherwise a "409
  Conflict" will be returned.
  Required parameters:
  - x: integer: 0..board_width
  - y: integer: 0..board_height

POST /flag
  Sets on/off the "flagged" state of a hidden cell.
  Required parameters:
  - x: integer: 0..board_width
  - y: integer: 0..board_height
  - flagged: number:
     * 0 or any "NaN" value => will turn off the flag,
     * any other values will turn on the flag.


Testing
=======

Launch the API (remember to run .setup.sh first):
PORT=3088 node --require ts-node/register index.js

Create a 5x5 board:
curl -v -d 'width=5&height=5' http://localhost:3088/game; echo

Get the board status:
curl -v \
    -H 'Cookie: mineSweeper=4201e832-b2df-4a96-b3b4-65eb0363bd32' \
    http://localhost:3088/game; echo

Simulate a click in the board:

curl -d 'x=0&y=0' \
    -H 'Cookie: mineSweeper=cca95a25-ccf6-438e-8252-bf9b3dd3b00d' \
    http://localhost:3088/click; echo

Simulate a flagging in the board:
curl -d 'x=2&y=0&flagged=1' \
    -H 'Cookie: mineSweeper=cca95a25-ccf6-438e-8252-bf9b3dd3b00d' \
    http://localhost:3088/click; echo
