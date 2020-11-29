---
pageTitle: Installing and configuring MySQL
tags:
    - wordpress
    - wordpress_hosting
category: wordpress_hosting
date: 2020-10-04
---

MySQL is a free and open-source database server. It’s the most popular database system in use with PHP and it’s the only database that works with WordPress (MariaDB is a fork of MySQL; they are generally interchangeable and contain most of the same source code), so we will be installing MySQL since that’s most likely what you need.

It’s important to note that MySQL isn’t a database itself – it is a database server, which means that MySQL is a kind of container for databases. You create databases within MySQL, and those databases can be accessed by other services on your server.

## Brace yourself
   
The next two lessons of the class are easily the most grueling, but follow along closely and I won’t let you down. If you have any problems, MySQL is a huge ecosystem with millions of developers worldwide, so finding help is usually fairly painless. If you get stuck and you need help, feel free to [@ me on Twitter](https://www.twitter.com/clevesque92).

## Download your site now
   
Before we go any further, we need to pull database information out of your WordPress installation, so if you have WordPress already, go ahead and create a backup your site and download it onto your computer. You may need to look up instructions on how to do this because it varies by host.

If you don’t have WordPress already, you’ll need to download the latest version. You can do that by going to the [WordPress download page](https://www.wordpress.org/latest.zip). The latest version of WordPress will download automatically (you may have to authorize the download, depending on your operating system and browser).

Once you have WordPress downloaded (either your existing WordPress site or a brand new copy), you might have to unzip it ([here is a tutorial on how to unzip files on Windows and Mac](https://www.sweetwater.com/sweetcare/articles/how-to-zip-and-unzip-files/)). If you just downloaded a new WordPress installation, then after unzipping the files you will need to open the `wordpress` folder (this is where the site files are stored) and rename the file `wp-config-sample.php` to `wp-config.php`.

Once your WordPress website is unzipped and `wp-config-sample.php` has been renamed (if applicable), you’re ready to proceed to the next section.

## Installation
   
Before we get started installing packages, I want to remind you that it’s best practice to keep your software up to date. If you are coming back to this tutorial from a different day, it might be a good idea to update your software again. (I finished writing the previous article at 2AM, and by 11AM when I started this article, there were already package updates available.) In case you forgot, you update your server’s software like this:

```bash
sudo apt update
sudo apt upgrade -y
```

To install MySQL, run this command:

```bash
sudo apt install -y mysql-server
```

On Ubuntu 20, this installs MySQL 8 by default. MySQL is now installed, but we want it to run as an enabled service like Nginx (we always want our database to be accessible!) so to do that, run these commands:

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

Now, we need to configure MySQL. Run this command to launch a configuration wizard:

```bash
sudo mysql_secure_installation
```

The wizard that launches will run you through a series of questions. For most of these, you should answer “yes”. I usually don’t bother setting up the validate password component, but this is up to you. MySQL also has a root user, similar to Ubuntu itself, and the second question asks you to create a password for the root user. Answer “yes” for the rest of the questions after this, and then we’re ready to go.

## Selecting WordPress credentials
   
   Now, your backend needs to access the database with a username and password. WordPress stores your credentials in a file called `wp-config.php`. When editing website files, it’s very important to make sure that the file is formatted as plain text and not rich text. Windows Notepad edits as plain text by default, so you can safely use this program to edit your `wp-config.php` file. Mac’s TextEdit program edits in rich text by default (although it should recognize that `wp-config.php` is in plain text and adjust its settings accordingly), but you still need to force TextEdit to preserve standard quotes after opening `wp-config.php` in TextEdit by going into TextEdit’s settings and disabling the Smart Quotes option. Smart Quotes have a different UTF character code than standard quotes, so they will break your `wp-config.php` file if TextEdit uses them. If you’re not sure you want to risk running into trouble, you can download a dedicated code editor called [Visual Studio Code](https://code.visualstudio.com/download). After this course, you can either delete Visual Studio Code or, if you will be hosting multiple websites and will need to make these changes more than once, hang onto it – Visual Studio Code is free and very useful for web development.
   
Open wp-config.php in a text editor and look for the following lines:

```php
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'database_name_here' );

/** MySQL database username */
define( 'DB_USER', 'username_here' );

/** MySQL database password */
define( 'DB_PASSWORD', 'password_here' );
```

This is a PHP file that defines values that can be used anywhere in your WordPress installation. `define` is a `function` in PHP, and it works like this:

1. Create a name for your constant, e.g. DB_NAME
2. Set that constant to a value, e.g. my_wp_database
3. The quotes are used to tell PHP where the data starts and ends; the quotes are NOT part of the constant

It’s important to note that the `wp-config.php` file doesn’t actually create a database, username, or password – `wp-config.php` is a place for you to tell WordPress what those values are. WordPress will only work if your database server contains a database named `DB_NAME` with a user `DB_USER` and password `DB_PASSWORD`.

If your `wp-config.php` has a database name, username, and password already, feel free to skip ahead to the database setup. If it doesn’t, you can use anything you like within a certain set of rules. In general, keep the names short (database names can be up to 64 characters, while usernames have to be under 16 characters) and don’t use special characters other than underscores, and you will be fine. Go ahead and type your chosen database name and username into the appropriate fields, but don’t use just anything for the password – we will actually let Ubuntu give us a random password. This is safer and more secure than selecting a password ourselves, and it doesn’t matter that we won’t be able to remember it because this password is only being used by WordPress. To generate secure random passwords, I like to use this nifty command:

```bash
head -c 24 /dev/urandom | base64
```

This command reads 24 bytes of data from `/dev/urandom`, which is a source of random data on Ubuntu. Then it sends that data to get Base64-encoded, which converts those bytes into text.

Move the output from the console into the database password field in `wp-config.php`, and now we’re ready to set up the WordPress database itself.

## Setting up the database

To set up the database, we need to actually be logged in to the database server. To do so, enter this command:

```bash
sudo mysql
```

If you’re prompted for your password, you should use the password for your user account, not the password you selected for the MySQL root account.

Once you’re logged in to MySQL, you will notice that your command line has changed. Now, it looks like this:

```bash
mysql> _
```

This indicates that you’re now in the MySQL prompt instead of the regular command line.

The first thing we need to do is set up the database for WordPress. To create a database for WordPress, enter the following command, replacing `your_database_name` with the name of your database from `wp-config.php` (note the backticks surrounding the database name and the semicolon at the end of the line):

create database `your_database_name`;

If the command was successful, MySQL will print a message something like this:

`Query OK, 1 row affected (0.01 sec)`

Now, you need to create a user with a password. Enter this command, replacing `your_database_username` and `your_database_password` with the appropriate values (note the backticks surrounding the username and localhost, and note that the password is surrounded by single quotes, not backticks):

```sql
create user `your_database_username`@`localhost` identified by 'your_database_password';
```

If the command was successful, MySQL will print a message similar to the one above – except this time, it will report that 0 rows were affected.

Now, MySQL databases are private by default – only the root user can access a database. So in order for our new user to be able to use our database, we need to grant the new user access rights. To do that, enter this command, noting the backticks and replacing `your_database_name` and `your_database_user` as necessary:

```sql
grant all privileges on `your_database_name`.* to `your_database_user`@`localhost`;
```

Once again, MySQL will print a message similar to the above on success. 0 rows should be affected by this query.

## Copying the old database to your new server
   
Assuming everything went according to plan, we now have a database, a user, and a password set up and ready to go in MySQL. If your WordPress installation is going to be new, you can skip this next step. However, if you’re importing an existing WordPress database, now is the time to grab the `.sql` file from your current web host. Your web host should be able to help you with generating this database backup. (If you have a shared web host using CPanel, you can [follow these phpMyAdmin instructions](https://my.bluehost.com/hosting/help/4) to create a backup of your database. The instructions are from BlueHost, but since CPanel is a third party platform, these instructions should work with any host that uses CPanel.)
   
The next part gets a little hairy. We will need to copy the `.sql` file from your computer to your VPS instance. If you’re on Linux or Mac, this won’t be a problem because these systems come with OpenSSH installed by default. On Windows, however, you will be required to go into your optional software settings and enable the OpenSSH client (don’t bother enabling OpenSSH server unless you understand the consequences). [Here is a tutorial from Microsoft](https://docs.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse) on how to do this on Windows 10.

Once you’ve downloaded the `.sql` file and you have OpenSSH ready to go, open up a command line on your local computer. On Windows, run a program called Powershell (if you don’t know where to find Powershell, simply type `powershell` into Cortana and she will find it for you); on Mac or Linux systems, run Terminal.

In your command line, you will need to change your current directory to the location where the `.sql` file is located. All three major operating systems place downloads in the `~/Downloads` directory by default, so enter these commands on your local command line:

```bash
cd ~/Downloads
ls
```

The `cd` command changes your directory to the one specified. The `~/Downloads` directory tells `cd` to go to the home directory (`~`) and then within the home directory, go to the `Downloads` directory. The `ls` command tells the prompt to list the files and directories in your current directory (which, thanks to `cd`, is your `Downloads` directory). You should see the `.sql` file you downloaded somewhere in this directory. If you don’t, you will have to find this file, then use the `cd` command to move into that directory instead.

Once you’re in the directory containing your `.sql` file, you will use a command line utility called `scp` (Secure CoPy) to move the file from your local computer to your VPS. In order to do this, you will need some information:

1. Your VPS’s IP address
2. Your VPS username (the one you made, not root)
3. The name of the .sql file on your local computer

To copy the file, run this command, replacing `your_username`, `your_ip_address`, and `filename` with the appropriate information:

```bash
scp filename.sql your_username@your_ip_address:~/backup.sql
```

Just so there’s no confusion on this command, I will give you the command I’m using while writing this tutorial (this is for me only – use this to base your command on, but your command will be different than this!):

```bash
scp my_database.sql christian@12.34.56.78:~/backup.sql
```

When you connect to a server over SSH for the first time, you are asked to confirm whether you want to continue connecting. You have to type `yes` into this prompt and hit enter to proceed (typing `y` is not enough for SSH/SCP – you have to type out the word `yes`). Then, you will be prompted to enter the password for your VPS user. Once you have done this, a small dialog will print on the screen indicating the upload progress.

Now, change back over to the terminal you have open for your VPS and run a quick `ls`. You should now see `backup.sql` in the file list (in fact, it should be the only file there). Now, all you have to do is copy your database backup into the new database we created in the previous step. To do that, enter this command, replacing `your_database_name` with the name you chose for your database earlier:

```bash
sudo mysql your_database_name < backup.sql
```

As always with `sudo`, you may be asked for your password. Once this command has run, your website database is copied into MySQL and ready to go.

## Configuring MySQL
### Disabling remote access
   
Until recently, MySQL was able to be accessed remotely by default. That meant that anyone who knew your website URL could try to log in to your database and steal your information. There are steps that you can take to prevent this remote access, however, and we will take one of those steps right now, together. (We will take an additional step to lock down your server at the end of this tutorial.)
   
To disable remote access to a MySQL database, we will need to edit one of the MySQL configuration files. In your VPS terminal, enter the following command:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Your prompt will change to a simple terminal text editor called Nano. You will see a flashing cursor on the screen. Press the down arrow on your keyboard until you find a line in the configuration file that starts with the word `bind-address`. We want this line to read like this (spaces before the equal sign will probably be present; these are irrelevant, and you may omit these if you choose):

```text
bind-address = 127.0.0.1
```

The line may be different than this, or it may be absent altogether. If you don’t see the line above exactly, do one of these three things:

1. If the line reads `bind-address = 0.0.0.0`, change the line to read `bind-address = 127.0.0.1`.
2. If the line is present, but actually starts with a `#` symbol, remove the `#` symbol and make sure the line reads `bind-address = 127.0.0.1`
3. If the line isn’t present at all, add it to the end of the file

The `bind-address` line tells MySQL which IP addresses to accept connections from. If the line is missing, MySQL assumes it should listen on `0.0.0.0`, and `0.0.0.0` will accept connections from any computer in the world! Obviously, this isn’t what we want, so we set it to `127.0.0.1` – which means that MySQL will only listen for connections on the local machine. Someone would have to hack their way into your server in order to log in to your database.

Leave the file open for the next section, because we need to make one more change before saving our configuration.

### Setting the MySQL authentication plugin
   
Ubuntu 20.04 installs MySQL 8 by default; this is a big change from recent years, when the default version had been MySQL 5.x. MySQL 8 changed the way passwords are handled by default, and this will prevent your application from being able to connect to MySQL (this isn’t just a WordPress problem – PHP itself can’t connect to MySQL 8 by default!).
   
In order to enable PHP to connect to your database, we need to tell MySQL to use its old authentication plugin. To do this, add this line at the very bottom of the `mysqld.cnf` file (this should still be open from when we checked the `bind-address` value):

```text
default_authentication_plugin = mysql_native_password
```

Now, MySQL will use the old authentication plugin and PHP will be able to connect to your database as expected.

### Saving and applying the configuration
    
To exit Nano, hit Ctrl+X (yes, even you, Mac users!) If you made modifications to the file, it will ask you if want to “save the modified buffer”. Type y and then hit Enter, and Nano will save the changes. If you made changes to the configuration file, you will have to restart MySQL for changes to take effect. Do this by running this command:

```bash
sudo systemctl restart mysql
```

(Usually, you can reload service configurations by running sudo systemctl reload service_name, but MySQL doesn’t support reloading in this manner.)

## Grab a cigar and pour yourself a stiff drink. You did it!
   
This lesson wasn’t for the faint of heart, but if you made it this far, you deserve serious kudos. Good job. Take a mental break and get ready for the next lesson, where we install PHP and configure Nginx to serve PHP websites properly.