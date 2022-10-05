#!/bin/bash
# build cmd for windows
declare -a projects=("element1" "element2" "element3")
projects=$(cat ./.tsc-all)
cur=$PWD

for proj in $projects
do
  cd "${proj%%[[:cntrl:]]}"
  echo $PWD
  echo "Compiling $proj"
  yarn tsc
  cd "$cur" 
done