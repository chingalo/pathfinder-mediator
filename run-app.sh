#!/bin/bash
 if [ "$#" -eq  "0" ]
   then
    node index.js
 else
    node index.js $1
 fi
