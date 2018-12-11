
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

GET /game
  Returns the full board as JSON array of strings.
  Each cell is represented by these possible states:
    - 'h' => hidden
    - 'e' => empty (it's visible and empty).
    - 'm' => "m" (it's visible and has a mine).

  Board (5x5) in a response:
  [
      "hhhhh",
      "hbbbb",
      "beebh",
      "hbbhh",
      "hhhhh"
  ]

POST /click
  Sends a "click" of a cell, it should be in "hidden" state, otherwise a "409
  Conflict" will be returned.
  Required parameters:
  - x: integer: 0..board_width
  - y: integer: 0..board_height
