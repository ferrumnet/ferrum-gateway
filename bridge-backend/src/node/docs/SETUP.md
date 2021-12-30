
# How to securely set up a machine that holds private key

There are cases where you need a VM that runs certain tasks with valuable assets. For example, a liquidity bot, or a bridge validator both have to hold a private key used for signing. The ferrum bridge node infrastructure provides certain security tools that significantly improves the storage of private keys on VMs. However, the access to the VM is still the weak link. If a hacker hacks your passwords, or finds a root access to the machine, there are still methods, to extract the private key or fool your service to sign a malicious message.

To begin with, you hold the private keys for the bridge nodes, double encrypted. Once through AWS KMs, and once through Ferrum 2fa services. In both cases encryption is done locally and only key encryption keys are encrypted and stored remotely. 

But first things first, to ensure access to your machine is secured, we first need to ensure the following rules:

a. Get a VM with docker support, in a VPC (not a shared VM)
b. Add a user for your app (e.g. node)
c. Limit the new user access to **only** `ssh` **with UbiKey dongle** - Most of this document is dedicated to this item
d. Completely remove the root access (both from ssh and su)
e. Create a paper backup of the private key (no digital record)

**What if I lost access to the host**

If you  lost access to the machine, you can destroy the machine and set up a new one. As long as you have access to the paper private key everything will be fine.

## a. Get a VM with docker support

1. Create a digital ocean account.
2. Enable 2fa on your account.
3. Create a new ubuntu droplet, from marketplace choose "Docker", and select a 2GB machine with 2 CPUs ~ $15/mo

## b. Add a user for your app

```
$ adduser node --disabled-password
$ usermod -aG docker node
$ su node
$ cd /home/node
```

## c. Limit the new user access to **only** `ssh` **with UbiKey dongle**

If you don't have a ubikey, buy one. Its $50 and worth it.

First, set up ubikey on ubuntu:

```
$ su root
$ add-apt-repository ppa:yubico/stable
$ apt-get update
$ apt-get install libpam-yubico

$ # Then generate ubikey API keys
$ vim /etc/pam.d/sshd
```

As the first line in the file, include the following (while obviously replacing the values between square brackets with the values you got from the Yubico API above):

```
auth required pam_yubico.so id=[Your Client ID] key=[Your Secret Key] debug authfile=/etc/yubikey_mappings mode=client
```

And also, comment out the following line:

```
@include common-auth
```

Next, you’re going to actually create the file at /etc/yubikey_mappings and populate it with the first 12 characters of your YubiKey’s OTP. Doing this is pretty easy: just open the file, type the name of the user for whom you want to enable authentication via YubiKey, and then tap your YubiKey to output the password. Take the first 12 characters and voila!

```
node:jdlrkfosndhf
```

Follow this article for the rest:

https://monicalent.com/blog/2017/12/16/ssh-via-yubikeys-ubuntu/


**Troubleshooting**

Check the logs:

`/var/log/auth.log`

if you get auth error (keyboard.interactive) make sure the pamubico is installed

## d. Completely Remove the root access

Sign in to the server as root. See (https://serverfault.com/questions/698562/how-to-disable-root-login-completely)

```
$ passwd -l root
$ vim /etc/ssh/sshd_config

PermitRootLogin no
```
