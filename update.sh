#!/bin/bash -uex

mkdir -p logs
rsync 'opam.ocaml.org:/home/opam/var/log/xz/*.xz' logs/
rsync 'opam.ocaml.org:/home/opam/var/log/access.log' logs/access.log

LOGS=(logs/*.xz logs/access.log)

GOACCESS="goaccess -p goaccessrc -q --ignore-crawlers --max-items 10000"

{ xzcat logs/*.xz; cat logs/access.log; } | \
  awk '/GET \/urls\.txt/ { if (!stop) print } /GET \/1.1\/urls\.txt/ { stop = 1; print }' | \
  $GOACCESS -o opam0.json
{ xzcat logs/*.xz; cat logs/access.log; } | \
  awk '/GET \/1.1\/urls\.txt/ { start = 1 } /GET \/urls\.txt/ { if (start) print }' | \
  $GOACCESS -o opam1.json
xzgrep -h 'GET /2.0[^ ]*/index.tar.gz' "${LOGS[@]}" | \
  $GOACCESS -o opam2.json

sed '1i var data0 =' opam0.json > html/js/opam0.js
sed '1i var data1 =' opam1.json > html/js/opam1.js
sed '1i var data2 =' opam2.json > html/js/opam2.js

xdg-open html/index.html
