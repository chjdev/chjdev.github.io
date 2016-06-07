---
title: TLS secured Docker on Ubuntu 16.04 Quickstart
layout: post
description: Quickly set up TLS secured Docker on Ubuntu 16.04 with systemd
image: /assets/2016/06/docker_ubuntu.png
card_type: summary_large_image
---

[<img src="/assets/2016/06/docker_ubuntu.png"/>](/assets/2016/06/docker_ubuntu.png)

The Problem
===========

Installing a Vanilla-Docker environment on [Ubuntu
16.04](http://releases.ubuntu.com/16.04/) was surprisingly non-straightforward
for me. Turns out it would have been actually quite simple, but the docs and
tutorials seem to be still assuming 14.04/non-systemd and led me in circles a
bit.

The problem is that 16.04 is now based on
[systemd](https://wiki.ubuntu.com/SystemdForUpstartUsers) and not upstart
anymore, so config files moved around.  Previously you would pass docker daemon
options via <code>/etc/default/docker</code>, this however doesn't work
anymore.

Setting up Docker with TLS on systemd
=====================================

So here is a quick write up on how to set up [Docker with
TLS](https://docs.docker.com/engine/security/https/) on 16.04 with systemd.
First a quick edit of the docker systemd service file is necessary. It is
located at <code>/lib/systemd/system/docker.service</code>.  As a default it
will launch the docker daemon with a unix socket bound to <code>-H fd://</code>
however in my opinion it's nicer to have all config options at a central place,
namely the <code>daemon.json</code> that is read by the docker daemon on start.

So first we'll remove the <code>-H fd://</code> flag from the
<code>ExecStart</code> line of the <code>docker.service</code> file and leave
it plain without flags:

```
$ cat /lib/systemd/system/docker.service
[...]
ExecStart=/usr/bin/docker daemon
[...]
```

Next we create the <code>/etc/docker/daemon.json</code> and add our settings
there:

{% highlight json %}
{
  "tlsverify": true,
  "tlscacert": "/etc/docker/YOUR_DOMAIN/ca.pem",
  "tlscert"  : "/etc/docker/YOUR_DOMAIN/cert.pem",
  "tlskey"   : "/etc/docker/YOUR_DOMAIN/key.pem",
  "hosts"    : ["fd://", "TCP://BIND:2376"]
}
{% endhighlight %}

As you can see i stored my TLS files in a subfolder <code>YOUR_DOMAIN</code> in
the <code>/etc/docker/</code> directory. The certificates are usually specific
to a domain name so it makes it more obvious.  I bound the daemon to two hosts,
first the default unix socket for nicer docker management on the server itself
and the TLS secured TCP address. I use my domain name for <code>BIND</code> for
the same reason stated previously.

And that should be it, reload and restart your docker service and use enable to
boot it on startup and you should be able to connect:

```
sudo systemctl daemon-reload
sudo systemctl restart docker
sudo systemctl enable docker
```

You could opt to add your server user to the <code>docker</code> group on your
system, however since I manage docker via TCP I opt not to use it and run
docker via sudo if necessary.

Note: don't forget to distribute certificates to your clients, and  set the
<code>DOCKER_HOST</code> and <code>DOCKER_TLS_VERIFY</code> environment
variables.

Happy dockering!

Creating the certificates
=========================

This is somewhat beyond the scope of this quick post and I'd like to redirect
you to the [official docs](https://docs.docker.com/engine/security/https/) for
that.

A really neat tool i encountered though is this
[GIST](https://gist.github.com/sheerun/ccdeff92ea1668f3c75f) by [Adam
Stankiewicz](https://github.com/sheerun):

```
$ gem install certificate_authority
$ ruby certgen.rb YOUR_DOMAIN
```

This will generate self signed client and server certificates and store them in
your <code>~/.docker</code> folder. Copy the server certificates from
<code>~/.docker/YOUR_DOMAIN</code> to your server and set the proper
permission:

```
$ sudo ls -la /etc/docker/fanlens.chjdev.com/
total 20
dr-------- 2 root root 4096 Jun  6 14:29 .
drwx------ 3 root root 4096 Jun  6 15:42 ..
-r-------- 1 root root 1151 Jun  6 14:29 ca.pem
-r-------- 1 root root 1155 Jun  6 14:29 cert.pem
-r-------- 1 root root 1679 Jun  6 14:29 key.pem
```

