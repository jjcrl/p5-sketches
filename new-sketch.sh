#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: ./new-sketch.sh <sketch-name> [weather|vanilla]"
  exit 1
fi

NAME=$1
TYPE=${2:-vanilla}

if [ "$TYPE" = "weather" ]; then
  TEMPLATE="weather"
  TARGET="sketches/$NAME-weather"
else
  TEMPLATE="vanilla"
  TARGET="sketches/$NAME-vanilla"
fi

if [ -d "$TARGET" ]; then
  echo "Sketch '$NAME' already exists"
  exit 1
fi

mkdir -p "$TARGET"
echo "TEMPLATE: $TEMPLATE"
echo "TARGET: $TARGET"
ls "$TEMPLATE"
cp -r "$TEMPLATE"/. "$TARGET"/
echo "✓ $TYPE sketch '$NAME' created at $TARGET"
code "$TARGET"