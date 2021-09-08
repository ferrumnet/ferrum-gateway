# How to secure a node

A node process hold a private key to sign messages. This can cause an point of attack and security vulnerability. In order to minimize the risk of access to the secret keys we want to achieve the following as the minimum baseline. Obviously this is work in progress and far from perfect:

1. No unencrypted private key at any time is stored any where.
2. To decrypt the private key, in addition to the state of the art of encryption (e.g. AWS KMS), we also need to have an independent two factor authentication mechanism (such as google auth).
3. A hacker with access to the node, should not be able to read the memory that holds the key or force the process to sign arbitrary messages.

From above, 1 and 2 are achievable, however currently there is no perfect solution for 3. Ideally, we can may hardware security modules or some sort of off-network signer. This could ensure hackers cannot access the private key, but they can still force the server to sign arbitrary messages.

## 1 and 2

To ensure 1 and 2, the following architecture is proposed:

- Nodes that verify signature and do the signature, are run as a daemon in a docker container.
- An `init` api, will load the private key in the deamon.
- To initialize the private key the 2fa token is provided. Private key is wrapped in two other keys. One received from the 2fa server and another received from AWS KMS.

- If a hacker gets access to all the passwords and secrets of the may get access to the node, and AWS keys, hence; it would be able to decrypt the private key but will not have access to the 2fa code (assuming 2fa is used on a secure device)

## The challenge for 3

Thirst requirement - to keep the in-memory private key secure from a hacker with access to the machine, is much harder to achieve. However there are a few obvious security considerations that are way better than nothing:

The host running the node should be configured as follows:

1. Disable core dumps on the system
2. Disable core dumps on the docker
3. Make sure ssh happens as a non-root user, and ensure root access only possible through cloud console, with 2fa
4. Enable 2fa for your non-root user for ssh
5. Build container with specific users. Never ave the node container use `root` user.
6. remove the setuid and setgid permissions in the images.
7. Specify the amount of memory and CPU needed for a container to operate.
8. Disable debugging of process [I am not sure how to do this yet]

#### Disable core dump on user

```
/etc/security/limits.conf

* soft core 0
* hard core 0

```


To disable core dumps set a ulimit value in /etc/security/limits.conf file and defines some shell specific restrictions.

You have to start your container with the option --ulimit core=0 to disable coredumps. refer this stackoverflow.com/questions/58704192/… – Shashank Pai Jan 27 '20 at 8:04


#### Enable 2fa for ssh

```

INSTALL 2FA:

sudo apt-get update
sudo apt-get install libpam-google-authenticator
google-authenticator
[ Set up the totp ]

https://www.digitalocean.com/community/tutorials/how-to-set-up-multi-factor-authentication-for-ssh-on-ubuntu-18-04

sudo nano /etc/ssh/sshd_config
AuthenticationMethods publickey,password publickey,keyboard-interactive
sudo nano /etc/pam.d/sshd

. . .
# Standard Un*x authentication.
#@include common-auth
. . .

sudo systemctl restart sshd.service

```

# How to secure a quorum

Multi-sig quorums as used for token bridge can be very powerful tool if used properly.

Example:

For example a governance quorum can be set up for a set of tokens.

Example: An AMM dex called (X-SWAP) can set their partner projects up. They can hold one or two seats in the X-SWAP quorum.

X-SWAP may chose to run node to ensure security of the liquidities of their partners. They can request all their projects (at the time of adding) to only accept to their nodes, by creating a custom group Id. In that case, even if another quorum gets compromised, projects handled by X-SWAP group will not be affected.

## Sanity check

A sanity check script should be created and made available to the public. This script will get list of all quorums. Check all the subscriptions (look back history to find subscribers), and make sure: 

1. No known malicous addresses is left in the quorum
2. Quorums all rquire a mimium number of signatures
3. Verify all quorum members are active in the sigining process and remove them if they are not. (More complicated to implement but not too hard)

