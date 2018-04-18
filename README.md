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
  1. install node.js
  2. fork, clone the repository
  3. test
    * --infoverify [--recordpath /path/to/records]
      * update internals to pick up database changes without --recordpath parameter
      * you need modify to fit your case
      * the recordpath is the location of the files with changeset uuid <-> git commitid information 
  4. deploy
    * customeize config.js 
    * deploy nginx referring nginx-sample.conf
  5. production
    * you can have separate /api beside /ws offloads a single system
    * you can cluster the instances behind haproxy balancer
