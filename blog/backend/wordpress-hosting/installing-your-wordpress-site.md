---
pageTitle: Installing your WordPress site
tags:
    - wordpress
    - wordpress_hosting
category: wordpress_hosting
date: 2020-10-06
headerImage: /images/backend/wordpress-hosting/wp-logo.png
blurb: Getting your WordPress site uploaded and configured
---

Now, everything is coming together. By the end of this lesson, your WordPress site will be live on your server.

## New installations
   
If your WordPress site is new, you will need to add some more code to the `wp-config.php` file. (If your site already exists, feel free to skip to the next section.) Look for the following section in your `wp-config.php` file on your local computer (this will be inside the `wordpress` directory that got unzipped in the MySQL lesson – and don’t forget to use a plain text editor for this, such as Notepad or Visual Studio Code):

```php
define( 'AUTH_KEY',         'put your unique phrase here' );
define( 'SECURE_AUTH_KEY',  'put your unique phrase here' );
define( 'LOGGED_IN_KEY',    'put your unique phrase here' );
define( 'NONCE_KEY',        'put your unique phrase here' );
define( 'AUTH_SALT',        'put your unique phrase here' );
define( 'SECURE_AUTH_SALT', 'put your unique phrase here' );
define( 'LOGGED_IN_SALT',   'put your unique phrase here' );
define( 'NONCE_SALT',       'put your unique phrase here' );
```

These 8 settings are critical to the security of your website, and we will need to select strong unique values for each of them. Fortunately, [WordPress has a utility that will generate this entire snippet for us](https://api.wordpress.org/secret-key/1.1/salt/). Open that link and copy the output on the page that is generated. In your `wp-config.php` file, highlight the entire section shown above and delete it, then paste in the generated version from the WordPress utility and save the file.

## Uploading WordPress to your VPS
### Preparing WordPress for upload
    
We’re going to upload WordPress over SCP the same way we moved our database backup file in the MySQL lesson (if your WordPress installation is going to be new, you would have skipped that step). But the most efficient way to do that is going to be if your site is in a ZIP archive.
    
If you downloaded an existing site from your host, chances are this was already in a ZIP archive. If so, just use that. Make a note of the name of the archive so we can use it in a moment.
    
If you downloaded WordPress in this course and this is going to be a new site, you will need to create a ZIP archive from the `wordpress` folder that got extracted from the WordPress download. You can’t just use the WordPress download because you’ve made changes to the `wp-config.php` file. [Here is a tutorial](https://www.ubergizmo.com/how-to/make-a-zip-file/) for how to create ZIP archives on each operating system. You can name the archive anything you want, but in this lesson we will use the name `website.zip`.

### Uploading the files

To actually perform the upload, you will need to open a command line on your computer (for Windows, use PowerShell; for Mac and Linux, use Terminal). Navigate to the folder where your website ZIP is stored (this is probably in `~/Downloads`, but we will double check) using the `cd` command:

```bash
cd ~/Downloads
ls
```

The `ls` command will list the contents of your current directory. Make sure you see your website ZIP archive in the output. If you don’t, you will need to find the correct directory on your computer and use the `cd` command to move there.

Once your command line is in the same directory as your website ZIP, enter this command, replacing `website.zip` with the name you chose for your website ZIP archive, `your_username` with the username for your VPS, and `your_ip_address` with the IP address of your VPS:

```bash
scp website.zip your_username@your_ip_address:
```

Now, SCP will copy `website.zip` (or whatever you chose to call this archive) to your server. You will have to enter your VPS password in order to continue. In your VPS, this ZIP archive will have the same name as it had on your local computer.

## Setting up the WordPress files on your VPS
   
Now that our WordPress files are on our VPS, we need to get them set up so Nginx can serve them. We will need to move them to the website folder that we created in the last lesson, and we will also need to set up the file ownership and permissions so that Nginx can process file uploads and so that WordPress can update itself and install plugins/themes from the administrator interface.

### Extracting the WordPress files
    
To start, you need to be logged in to your VPS, so go ahead and do that now if you aren’t still logged in.
    
Once logged in, we need to be able to extract your website from the ZIP archive you uploaded. To do that, we need to install another program that handles zip files by running this command:

```bash
sudo apt install -y zip
```

Confirm your password if needed, and then wait for the zip utilities to be installed. Once that’s done, run this command to extract your WordPress website from the ZIP archive, replacing `website.zip` with the name you used for the ZIP archive:

```bash
unzip website.zip
```

This will extract the folder containing your website and deposit everything into the current directory for the command line (this is almost certainly your home directory, `~`). Run a quick `ls` to make sure that the ZIP extracted properly. You should see the `.sql` file from the MySQL lesson (if your site is a new WordPress installation, you won’t see this file because you skipped that part), you should see the `website.zip` archive containing your website, and you should see a folder containing the actual WordPress site that you backed up. If your site is new, this will probably be called `wordpress`, but if your site is migrating from a different host, this will most likely be the same as your domain name.

### Moving the WordPress files
    
The WordPress files have to be copied to the directory you created for your site in the last lesson. That was `/var/www/your_site/public`, where `your_site` is replaced with whatever name you chose for the directory. However, the `/var/www directory` is owned by `root`, not by your user, so in order to move files there, we will need to prepend the `cp` (copy) command with `sudo`. Run this command to copy the files, replacing `website` with the name of the directory that was extracted from the ZIP you just uploaded and `your_site` with the name you chose for your website directory:

```bash
sudo cp -r website/* /var/www/your_site/public
```

The `cp` command copies the specified files, the `-r` flag tells `cp` to copy all directories and files nested within the specified location, the `website/*` argument tells `cp` to copy all directories and files within the `website` directory without copying the `website` directory itself, and the `/var/www/your_site/public` argument tells `cp` where it should copy the files to.

We copied the files instead of moving them so that we still have the original files in case we make a mistake. We could always re-extract the files, but that’s an extra step that we don’t need to take since we copied the files instead of moving them.

### Hiatus: File ownership and permissions
    
In all operating systems, file ownership and permissions are very important, and when hosting a website, it’s especially important to make sure that the permissions are set appropriately.

#### File and directory ownership

In Unix systems, files and directories have both an owner and a group. The owner of the file is…well, the owner. The file is considered theirs. They are able to move, copy, and delete files and directories that they own without superuser privileges (as long as the new location is also under their ownership). They can also change the permissions (see the next subheading) on files and directories they own without superuser privileges. The group of a file is similar to an owner, but the group is used to extend permissions to an entire group of users who should also be able to make modifications to a file or directory. Group members who aren’t the file owner can’t change the file permissions on files or directories without superuser privileges – if a user isn’t the direct owner of the file, they still need to use `sudo`.

If you want the file or directory to be owned by only you, every user also has a group named after their user, and that user is the only member of that group by default – so on my computer, for example, if I want to keep a file or directory private, I can set its user and group both to `christian`, and then other users will have no special permission to use it.

#### File and directory permissions
     
There are three customizable permissions in Unix systems: read, write, and execute permissions. Any file or directory has those three permissions set independently. A text file likely has read and write permissions allowed and execute permissions blocked (you should only enable the execute permission for files that need it, like scripts or programs).
     
The special thing about permissions is that you can set permissions independently for the owner, the group, and everyone else. Extending the text file example above, the owner will likely have read and write permissions allowed (because the owner should be able to read the file and make changes), the group will likely have read permissions and may have write permissions if you want other members of the group to be able to modify it as well, and everyone else will most likely have either no permissions (if you want to keep the file private) or read permissions only (this allows non-owner, non-group users to read the file, but not change it or execute it).

#### Execute permissions – files vs. directories
     
The execute permission has different meanings for files and directories. With the execute permission set on a file, that file can be directly called like a computer program. This is required for binaries (computer programs that have been compiled to machine code) before they can be run directly, and this is also required if you want to directly execute scripts, like PHP scripts, Python scripts, or Bash scripts. As long as the read permission is set on a script, that script can still be called with the correct interpreter even if the execute permission is off.
     
With directories, however, the execute permission determines whether a directory can be accessed at all. No matter what the read and write permissions on a directory are, if the execute permission isn’t turned on, that directory’s files can’t be read or written to and its executable files can’t be called. You will also be unable to `cd` into that directory in a command line. If a user is supposed to have access to a directory’s contents, the execute permission must be enabled for that directory.

#### Viewing permissions
     
You can view the permissions set on all the files and directories within a directory with the command `ls -l`. The `ls` command lists the files and directories within a directory, and the `-l` flag tells `ls` to list the “long” form, with a bunch of extra information like the file or directory’s permissions, the owner and group, the size, and the date it was last modified. If you run the `ls -l` command in your VPS terminal, the output will probably look something like this:

```text
-rw-rw-r-- 1 your_username your_username xxxx Mmm DD HH:MM backup.sql
drwxrwxr-x 2 your_username your_username xxxx Mmm DD HH:MM your_site
-rw-rw-r-- 1 your_username your_username xxxx Mmm DD HH:MM website.zip
```

The permissions can be found in the first group of data on each line, while the owner is represented by the first `your_username` and the group is represented by the second `your_username`. After the user and group is a number representing the filesize in bytes, followed by the last modified date, and finally the file name.

In the permission block, an `r` indicates the read permission is active, a `w` indicates the write permission is active, an `x` indicates the execute permission is active, and a `-` indicates that the permission in that position is inactive. The data is in the form `1222333444`, where:

- `1` indicates whether the listing is for a directory (`d`) or a file (`-`)
- `2` is the permission block for the file or directory owner
- `3` is the permission block for the file or directory group
- `4` is the permission block for everyone else (non-owner, non-group)

In my example above, the entry `backup.sql` is:

- A file (because the directory marker is `-`)
- Readable and writable, but not executable, by the owner (because the next three characters are `rw-`)
- Readable and writable, but not executable, by the group (because the next three characters are `rw-`)
- Readable, but not writable or executable, by everyone else (because the next three characters are `r--`)

#### Calculating the numerical representation of permissions
     
File permissions are viewed as a user-friendly, text-based representation of file permissions. However, setting file permissions is actually done using numbers. There are eight possible combinations of permissions, each represented by a number between 0-7. The owner, group, and non-owner non-group each have their own permission set, so they each have their own permission number. To calculate each permission number, start with zero and add:

- 1 if the execute permission should be active, or 0 otherwise
- 2 if the write permission should be active, or 0 otherwise
- 4 if the read permission should be active, or 0 otherwise

You may notice that each successive number is twice as large as the number before. This allows us to store multiple numeric values in a single field because no matter what combination of values is set, each sum of all values is unique. This is a technique called bitmasking and it’s used frequently in computing and programming because a large amount of data can be stored in a single field.

The possible values for file permissions are thus:

- `0` if no permissions are set (`base 0 + read 0 + write 0 + execute 0`)
- `1` if only execute permission is set (`base 0 + read 0 + write 0 + execute 1`)
- `2` if only write permission is set (`base 0 + read 0 + write 2 + execute 0`)
- `3` if write and execution permissions are set (`base 0 + read 0 + write 2 + execute 1`)
- `4` if only read permission is set (`base 0 + read 4 + write 0 + execute 0`)
- `5` if read and execute permissions are set (`base 0 + read 4 + write 0 + execute 1`)
- `6` if read and write permissions are set (`base 0 + read 4 + write 2 + execute 0`)
- `7` if all permissions are set (`base 0 + read 4 + write 2 + execute 1`)

You will probably never see permissions of `1`, `2`, or `3` in the real world. Any situation where you would want to execute a file without being able to read it, or write a file without being able to read it, is most likely arbitrary or contrived and unlikely to occur in a real setting. But, strange as it would be, those are technically valid permission combinations.

Using the same `backup.sql` file as an example, the numerical representation of its permissions would be `664`. To calculate this, look back to the textual representation of its permissions, `rw-rw-r--`.

- The owner permissions are calculated with the first three characters. Read and write permissions are enabled, so the calculation would be `base 0 + read 4 + write 2 + execute 0 = 6`
- The group permissions are calculated with the next three characters. Read and write permissions are enabled, so the calculation would be `base 0 + read 4 + write 2 + execute 0 = 6`
- The non-owner, non-group permissions are calculated with the last three characters. Read permission is enabled, so the calculation would be `base 0 + read 4 + write 0 + execute 0 = 4`
- Simply combine these three numbers in order to arrive at a permission setting of `664`

### Setting the correct ownership and permissions on the WordPress files
    
Now that we know all about file ownership and permissions, we can set these for the WordPress files that we moved a few minutes ago. You can use the `cd` command to change the active directory to one outside your home directory (as long as the target directory and all its parents have the execute permission set, that is!), and now we will change our active directory to the directory containing our website with this command, replacing `your_site` with the directory name you chose to contain your website:

```bash
cd /var/www/your_site/public
```

Now, we can run `ls -l` to see our WordPress files in their natural habitat. If you look at the output, you will see a couple things that are interesting.

Firstly, all files most likely have `644` as their permissions (`rw-r--r--`) and all directories most likely have `755` as their permissions (`rwxr-xr-x`). This allows anyone to view the files in your website, no matter what directory they are in. These permissions are sufficient for many websites, and these are appropriate for WordPress too (but we will set the permissions in a moment anyway, just in case any files or directories are incorrect for some reason).

Secondly, all files and folders are owned by user `root` and group `root`. The reason for this is that we copied your website files using `sudo` (we had no choice), and when a command is run as `sudo`, you don’t actually get elevated permission – your command is actually run as `root`, not your regular user. So when you copied your website using `sudo`, the copied files ended up being owned by `root`. We don’t want our website files to be owned by `root`, so we will transfer ownership to a different user. But who?

#### Setting ownership
     
WordPress is a self-updating application, so the PHP process needs to be able to write to our website’s files and directories. This means we can either give write access to anyone (which is a really bad idea) or we can change the ownership of the website files to the same user that runs PHP. This is also a generally bad idea, but with WordPress, there isn’t much choice. Both Nginx and the PHP process are run by the system user `www-data`, so to keep permissions as restrictive as possible, we will transfer the entire website to that user. To do this, run this command:

```bash
cd ..
sudo chown -R www-data:www-data public
```

First, we `cd` into the directory above our current directory (in Unix, the current directory is represented by a single period, `.`, and the parent of the current directory is represented by two periods, `..`), because we’re currently in `/var/www/your_site/public` and we want to transfer ownership of everything, including the `public` directory itself, to `www-data`. Then, the `chown` command is used to `ch`ange `own`ership of files and directories. The `-R` flag tells `chown` to also change files and directories within the directory designated (it stands for "recursive"). The `www-data:www-data` input tells chown that the user and group ownership should be changed to `www-data` and `www-data` respectively. Finally, `public` tells `chown` what file or directory to operate on. The command needs to be run with `sudo` privileges because a) you don’t own the files (`root` does), and b) you’re transferring the files to a different user, `www-data`, and that also requires `sudo` privileges even if you did own the files.

#### Setting permissions
     
The ideal file permissions for PHP applications are `644`. The rationale is that the scripts can be read by anyone, and the owner (`www-data`, as we just set) should be able to write changes to those files. PHP scripts don’t need the execute permission because they don’t get directly executed – instead, the PHP process reads the PHP script and then executes it in its own execution context. The file is never directly executed, so the PHP process just needs to be able to read the file contents.
     
The ideal directory permissions for PHP applications are `755`. This permission is the same as for PHP files, but everyone also has the execute permission (remember, this is required in order to enter a directory, so anyone with permission to read a directory must also have permission to execute it).
     
We need to make sure that all the files in our website are set to `644`, and we need to make sure all the directories are set to `755`. To do this, we’re going to run two complicated commands that have to be entered exactly right in order to work, so don’t execute it yet – just look carefully:
 
```bash
find public -type d -print0 | sudo xargs -0 chmod 755
find public -type f -print0 | sudo xargs -0 chmod 644
```

The `find` command is a ridiculously useful tool. You could make an entire course just on this command alone. `find` is used to locate files and directories based on test conditions like size, owner and group, time last modified, and many other factors. In this case, we’re searching separately for `-type d` and `-type f`, which searches for directories only and files only, respectively. The `-print0` flag tells `find` to generate results in a way that is friendly to processing by other utilities.

The first command ends at the pipe character (`|`). The pipe character is a command line operator that tells the Linux command line to take the output of one command and send it to another command as that command’s input. We already saw this operator once, although I neglected to explain it at the time: When we were generating a password for our MySQL database, we executed the command `head -c 24 /dev/urandom | base64`, which reads 24 bytes from `/dev/urandom` – but instead of printing those bytes to the screen, it redirected (or "piped", in command line terminology) those bytes directly into the `base64` command, which takes any kind of input (including raw binary) and converts it to text characters only. You can run `head -c 24 /dev/urandom` by itself to see what it does, if you like; the output will likely be gibberish with a lot of question marks. By sending the output of `head` to `base64`, you ensure that no matter what data `head` generates, it will be suitable for use as passwords or other secret data because `base64` only outputs text. It’s common in Linux operation to use the `|` operator to send the output of one command as the input of another.

On the other side of the pipe character, we have a call to the `xargs` command, which is another useful utility. `xargs` is used to run a specific command against a list of inputs. Sometimes you will want to run a single command over and over, where the command is identical each time but the input changes. This can be mildly annoying to run a few times, but it quickly becomes impossible when the batch size grows. In our case, we want to run the command `chmod 755` against every directory inside the `public` directory, and we want to run the command `chmod 644` against every file inside the `public` directory. (A file’s permissions are sometimes called the `file mode`, and the `chmod` command is used to `ch`ange the `mod`e for a file or directory.) This isn’t feasible to do manually (WordPress has thousands of individual files) and we can’t just use `chmod -R` to execute against everything inside the `public` directory because we want directories to have `755` permissions and we want files to have `644` permissions. So we will run the command using a list of generated inputs. The entire command does this:

- `find public -type d -print0` searches the `public` directory for all items that are of type `directory` and formats the output in a way that utilities like `xargs` can understand
- `|` takes the list generated by `find` and sends it to the next command, `xargs`
- `sudo xargs -0 chmod 755` accepts input formatted specially by programs like `find`, and for each input generated by `find`, it executes the `chmod 755` command against it. All of this is done with `sudo` because your user doesn’t own the files – `www-data` owns the files, so you don’t have permission to change the file or directory properties without `sudo`
- The second command does the same thing, except it searches for files instead of directories and it sets the file permissions to `644` instead of `755`

This is a rather advanced usage of the command line, so it’s perfectly okay if you don’t understand exactly what’s going on. As long as the command is entered exactly as shown, it will work.

## Installing WordPress on your VPS (new sites only)
   
If you are migrating an existing WordPress installation, go ahead and go to the next lesson.
   
If you have done everything so far, you’re ready to install WordPress on your new VPS. To recap, you should have:

1. [Set up a VPS](/blog/backend/wordpress-hosting/creating-a-vps-instance)
2. [Installed Nginx and set up Nginx to serve a default site](/blog/backend/wordpress-hosting/setting-up-a-web-server)
3. [Installed MySQL and set up your database for WordPress to use](/blog/backend/wordpress-hosting/installing-and-configuring-mysql)
4. [Installed PHP and configured Nginx to serve PHP websites](/blog/backend/wordpress-hosting/installing-and-configuring-php)
5. Copied your WordPress site up to your web server and configured file ownership and permissions

If you’ve done all of this, simply visit your VPS’s IP address in a web browser, and the WordPress installer will run automatically. It will ask you for some preliminary information, including things like your preferred language and your default login credentials. Follow the on-screen prompts, and then you will have a fully-functional WordPress website in just a few moments!

## In Conclusion

If you’ve reached this point of the course, you have a working WordPress site uploaded and ready to go. If you have a new installation of WordPress, you can even use the site in a browser by navigating to the server IP address (existing WordPress installations probably won’t be able to do this because of the way WordPress works).

You’re now ready to move on to the next lesson, where we will connect your website to a domain name so users can visit your website without needing to know its IP address.