#!/usr/bin/env bash

printf "Building website...\n"
npm run build
printf "...website built.\n"

printf "Creating archive for deployment...\n"
find ./build -name *.map -prune -o -type f -print0 | xargs -0 tar -rf blog.tar
tar -rf blog.tar copyblog.sh
printf "...archive created.\n"

printf "Deploying archive to server...\n"
scp blog.tar $CL_BLOG_CREDENTIAL:
printf "...archive deployed.\n"

printf "Extracting archive on server...\n"
ssh $CL_BLOG_CREDENTIAL "tar -xf blog.tar"
ssh $CL_BLOG_CREDENTIAL "/usr/bin/env bash copyblog.sh"
printf "...archive extracted.\n"

printf "Cleaning up deployment...\n"
ssh $CL_BLOG_CREDENTIAL "rm blog.tar"
ssh $CL_BLOG_CREDENTIAL "rm -r build"
ssh $CL_BLOG_CREDENTIAL "rm copyblog.sh"
rm blog.tar
printf "...deployment cleaned.\n"