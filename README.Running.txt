
# This has been tested with
#   - NodeJS 10.13.0
#   - Google Chrome Version 71.0.3578.98 (Official Build) (64-bit)

# Clone the repo:
git clone https://github.com/garana/MineSweeper.git

# API in NodeJS 10.13.
# Make sure node runs at least version 10, check README.Setup.txt.
cd MineSweeper/api
PORT=3088 node --require ts-node/register index.js

# UI: ReactJS web site.
cd MineSweeper
. .setup.sh
cd web
npm run start
