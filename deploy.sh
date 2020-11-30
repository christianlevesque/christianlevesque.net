#!/usr/bin/env bash

printf "Building website...\n"
npm run build
printf "...website built.\n"

printf "Creating archive for deployment...\n"
find ./build -name *.map -prune -o -type f -print0 | xargs -0 tar -rf blog.tar
printf "...archive created.\n"

printf "Deploying archive to server...\n"
scp blog.tar $CL_BLOG_CREDENTIAL:
printf "...archive deployed.\n"

printf "Clearing previous build from server...\n"
ssh $CL_BLOG_CREDENTIAL "rm -r $CL_BLOG_DIRNAME"
printf "...previous build cleared.\n"

printf "Extracting archive on server...\n"
ssh $CL_BLOG_CREDENTIAL "mkdir $CL_BLOG_DIRNAME"
ssh $CL_BLOG_CREDENTIAL "tar -xf blog.tar"
ssh $CL_BLOG_CREDENTIAL "mv build $CL_BLOG_DIRNAME/public"
printf "...archive extracted.\n"

printf "Cleaning up deployment...\n"
ssh $CL_BLOG_CREDENTIAL "rm blog.tar"
rm blog.tar
printf "...deployment cleaned.\n"