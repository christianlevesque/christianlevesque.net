#!/usr/bin/env bash

copy_new_file () {
	newsum=($(md5sum $1))
	oldname=$(echo $1 | sed 's/\/build\//\/christianlevesque.io\/public\//')

	# If $oldname isn't an existing file, it's new
	# so copy it and break
	if [ ! -f "$oldname" ]; then
		directoryname=$(echo $1 | sed 's/^.*\/build//' | sed -E 's/[[:alnum:]_-]+\.[[:alnum:]]+$//')
		mkdir -p "christianlevesque.io/public$directoryname"
		cp $1 $oldname
		return
	fi

	oldsum=($(md5sum $oldname))

	# If checksums don't match, the file has been modified
	# so copy it over
	if [ "$newsum" != "$oldsum" ]; then
		cp $1 $oldname
	fi
}

purge_if_old_file () {
	newname=$(echo $1 | sed 's/\/christianlevesque.io\/public\//\/build\//')

	# If #newname isn't an existing file, it was deleted
	# so delete it from the site
	if [ ! -f "$newname" ]; then
		rm $1
	fi
}

oldfiles=($(find ~/build -type f -print0 | xargs -0 ls | tr '\n' ' '))

for el in ${oldfiles[@]};
do
	copy_new_file $el
done

currentfiles=($(find ~/christianlevesque.io/public -type f -print0 | xargs -0 ls | tr '\n' ' '))

for el in ${currentfiles[@]};
do
	purge_if_old_file $el
done