#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: $0 <source_file.c>"
    exit 1
fi

PROGRAM="$1"
EXECUTABLE="${PROGRAM%.c}"

gcc -std=c99 -O2 -o $EXECUTABLE $PROGRAM
if [ $? -ne 0 ]; then
    echo "Compilation failed"
    exit 1
fi

for infile in *.in; do
    outfile="${infile%.in}.out"
    my_output="my_${infile%.in}.out"
    
    ./$EXECUTABLE < $infile > $my_output

    diff -Z $outfile $my_output
    if [ $? -eq 0 ]; then
        echo "Test $infile: PASS"
    else
        echo "Test $infile: FAIL"
    fi
done
