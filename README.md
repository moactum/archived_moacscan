# moacscan - moac blockchain explorer

## blockchain explorer using websocket koa nunjunks and vuejs

## Progress
  - The tool is good for test now

## Requirements
  - chain3.js for moac access
  - nodejs of recent versions
  
## Tested on
  - ubuntu 16.04
  - ubuntu 18.04 (best)
  
## Steps
  0. have moac running with --rpc option
  1. install node.js
  2. fork, clone the repository
  3. test
    * npm install
    * open two terminals
      * start web service with websocket
        * npm start
      * pull and feed data to websocket
        * npm run feed
    * browse to http://localhost:3002
  4. deploy
    * customeize config.js 
    * deploy nginx referring nginx-sample.conf
  5. production
    * you can have separate /api and /ws to offload a single unit
    * you can cluster multiple units behind haproxy balancer
