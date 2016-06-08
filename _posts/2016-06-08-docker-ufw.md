---
title: Attention! Docker overrules UFW
layout: post
description: Docker, by default, directly manipulates iptables in order to work its network magic. It thus completely circumvents UFW rules! In this post I show strategies to deal with this.
card_type: summary
---

TL;DR: Docker, by default, directly manipulates iptables in order to work its network magic. It thus completely circumvents UFW rules! In this post I show strategies to deal with this.

Problem
=======

While setting up my [Docker](https://www.docker.com) server I noticed something
weird.  I started up all my containers to see if everything is building and
running correctly, enabled ports 80 and 443 on my firewall, and everything
worked fine. However, after disabling the ports again my server was still
reachable.  I'm using [UFW](https://wiki.ubuntu.com/UncomplicatedFirewall) as
firewall to keep the base system as simple as possible and even explicitly
`REJECT`-ing the ports still kept them open.

Huh? What's the hell is going on? Well, as we can see in the
[docs](https://docs.docker.com/engine/userguide/networking/default_network/binding/),
Docker directly manipulates the systems `iptable` to forward trafffic to
containers!

```
$ sudo iptables --list
[...]
Chain DOCKER (2 references)
target     prot opt source               destination         
ACCEPT     tcp  --  anywhere             172.18.0.6           tcp dpt:https
ACCEPT     tcp  --  anywhere             172.18.0.6           tcp dpt:http
[...]
```

Well, I wasn't aware that this completely circumvents rules set in UFW.  UFW in
turn (obviously) doesn't show you the whole `iptables` state but only its
subset of rules.  

Strategies
==========

If you want to disable this behaviour you can disable it in your daemon.json
(or via flags) and rely on the userland proxy:

```
{
"iptables": false,
"userland-proxy": true,
...
}
```

Now you face a different problem though. Since Docker uses bridged networking
by
[default](https://docs.docker.com/v1.8/articles/networking/#container-networking)
You now lose the original source IP, which, depending on your use-case, can be
quite important, e.g. to log it as part of the access log of your web servers.

To solve this issue you have two options: switch the networking stack to `host`
for the daemon or all containers involved (mixed linking of containers doesn't
work), or bite the bullet and deal with the iptables behaviour and disable the
userland proxy. I opted for the latter because of the [security
implications](https://github.com/docker/docker/issues/6401) of host networking.
According to the docs:

> Note that this does not let the container reconfigure the host network stack
> — that would require --privileged=true — but it does let container processes
> open low-numbered ports like any other root process. It also allows the
> container to access local network services like D-bus. This can lead to
> processes in the container being able to do unexpected things like restart your
> computer.

Also it is apparently the more
[canonical](https://github.com/docker/docker/issues/15086#issuecomment-125678120)
approach, with discussion of
[disabling](https://github.com/docker/docker/issues/14856) the userland-proxy
by default.


