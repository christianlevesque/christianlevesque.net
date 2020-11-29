#!/usr/bin/env bash

printf "Building website...\n"
npm run build
printf "...website built.\n"

printf "Creating archive for deployment...\n"
find ./build -name *.map -prune -o -type f -print0 | xargs -0 tar -rf blog.tar
printf "...archive created.\n"

printf "Deploying archive to server...\n"
scp blog.tar $SERVER_CREDENTIAL:
printf "...archive deployed.\n"

printf "Clearing previous build from server...\n"
ssh $SERVER_CREDENTIAL "rm -r christianlevesque.io"
printf "...previous build cleared.\n"

printf "Extracting archive on server...\n"
ssh $SERVER_CREDENTIAL "mkdir christianlevesque.io"
ssh $SERVER_CREDENTIAL "tar -xf blog.tar"
ssh $SERVER_CREDENTIAL "mv build christianlevesque.io/public"
printf "...archive extracted.\n"

printf "Cleaning up deployment...\n"
ssh $SERVER_CREDENTIAL "rm blog.tar"
rm blog.tar
printf "...deployment cleaned.\n"