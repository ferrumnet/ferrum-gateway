## Bridge Node Installer

To install nodes (validator, generator, or liquidityBot) we have an improved process. I have not fully documented this yet, but please help me with that.  The whole system is just a few of bash scripts that should be easy to follow.

**To install generator**

```
curl -s https://ferrum-node-distribution.netlify.app/install-generator.sh | bash
```

**To install validator**

```
curl -s https://ferrum-node-distribution.netlify.app/install-validator.sh | bash
```

**To install liquidityBot**

```
curl -s https://ferrum-node-distribution.netlify.app/install-liquidityBot.sh | bash
```

After running above command, you will have a folder based on the config you installed. In the folder (e.g. generator) there will be a number of hidden files and directories. You need to update the config files, but the config files should be self-explenatory:

```
$ cd validator
$ ./bin/node.sh [start | stop | init ]
```

There would also be a cryptor.sh to generate and encrypt / decrypt private eys:

```
$ ./bin/cryptor.sh help
```

## Scripts

1. One click installer
2. Folder structure:

```

+- .cfg [gnerated configs]
 +- docker-compose.yml
 +- cryptor.env
 +- node.config
+- .templates
 +- docker-compose.yml.template
 +- cryptor.env.template
 +- node.config.template
+- .awsconfig
+- .2faconfig
+- .bridgeconfig
+- bin
 +- cryptor.sh
 +- node.sh

```

# install.sh


```

curl <Addr> | bash

```
