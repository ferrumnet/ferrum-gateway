#!/bin/bash
declare -a projects=("element1" "element2" "element3")
projects=$(cat ./.tsc-all)
cur=$PWD

for proj in $projects
do
  cd $proj
  echo "Compiling $proj"
  npx tsc
  cd "$cur" 
done
