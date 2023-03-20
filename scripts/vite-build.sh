#!/bin/sh

VITE_COMMIT=$(git log -1 --pretty=format:%H) vite build
