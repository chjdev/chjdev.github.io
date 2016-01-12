---
title: Universal Python Server
layout: post
redirect_from: /universal-python-server/
---

I recently read a cool post by [Joe Armstrong](https://joearms.github.io/) in
which he showcases his favorite [Erlang](http://www.erlang.org/) program: [the
universal server.](https://joearms.github.io/2013/11/21/My-favorite-erlang-program.html)
The program creates an easily distributable generic server, that can perform
any concrete task you tell it to by sending it a function. E.g. it could act as
an HTTP server, RPC server, etc.

This little program "suitable for a 10min talk" highlights how awesomely simple
Erlang can be for the tasks it was designed to do best. I was intrigued and
wanted to see if a comparably simple universal Python server could be created
by using only the standard library.

To make the program distributable the [multiprocessing](https://docs.python.org/3/library/multiprocessing.html)
module of the standard library will be used. It contains the tools necessary
for creating multiple processes and inter process communication.

## Architecture
This version deviates a little bit from Armstrong's program. Instead of a
``become`` message, here the function to be performed is included for
every task to be performed. It is implemented using 3 components: a
``manager`` as central connection point, a ``worker`` which
will receive generic tasks to be performed and a ``boss`` which will
schedule said tasks.

Disclaimer: Obviously this is only a simple little experiment, none of this
code is intended to be used in anything respectable.

#### Manager
First here is the ``manager`` service. It's responsible to provide the
communication channels. Both the ``worker`` - as well as the
``boss`` processes connect to it for discovery.


{% highlight python %}
from multiprocessing.managers import SyncManager
import marshal
import os

class Manager(SyncManager):
    pass

Manager.register('get_job_q')
Manager.register('get_res_q')

def connect(ip, port, auth):
    manager = Manager(address=(ip, port), authkey=auth)
    manager.connect()
    return manager

def remote(func, manager):
    def inner(*args, **kwargs):
        manager.get_job_q().put((marshal.dumps(func.__code__), args, kwargs))
    return inner

if __name__ == '__main__':
    from multiprocessing import Queue
    job_q = Queue()
    res_q = Queue()
    Manager.register('get_job_q', callable=lambda: job_q)
    Manager.register('get_res_q', callable=lambda: res_q)
    manager = Manager(address=('', 1234), authkey=b'abc')
    print('Manager startet with PID=', os.getpid())
    manager.get_server().serve_forever()
{% endhighlight %}


The first thing that's necessary is to create our own subclass of the
[SyncManager](https://docs.python.org/3/library/multiprocessing.html#multiprocessing.managers.SyncManager)
provided by the multiprocessing module. This is necessary to ``register`` the
custom methods used. Here 2 methods are registered: a method to access the job
queue (which will contain the tasks to be performed) and a method to access the
result queue which will communicate the results.

Note: this is a very primitive setup and for example doesn't play nice with
multiple bosses. ``Manager.register`` is only called with the name of these
functions to tell it that they exist, so if the manager is subsequently
imported it will be ready to use.

Next up is the ``connect`` function. This function is used by the workers and
the boss to connect to the same session. This is akin to joining multiple
running Erlang beam VMs and allows us to communicate with remote processes.

``remote`` is a decorator for functions that allows to seamlessly send them to
remote processes in order to be executed.
It works by taking the decorated function and putting a tuple of its
[marshalled](https://docs.python.org/3/library/marshal.html) pseudo-compiled
code (``func.__code__``) and arguments in the job queue. The tuple thereby
contains everything a remote process needs to know to reconstruct the task.

Note: the marshal module has to be used because it appears that
[pickle](https://docs.python.org/3/library/pickle.html) module is not powerful
enough to handle this specific use cases. Trying to directly pickle the
function and loading it in the remote process will lead to an
``AttributeError`` because the function is not part of this process, and
pickling of the ``__code__`` builtin unfortunately doesn't work.

Finally running the manager script will initiate the
[queues](https://docs.python.org/3/library/multiprocessing.html#multiprocessing.Queue)
used for communicating and reregister them. Then a manager object is created
and instructed to serve forever.

#### Worker
The worker process will perform the tasks scheduled by the boss. It works by
getting tasks from the job queue, reconstructing the function of the task,
invoking this new function and putting its result into the result queue.


{% highlight python %}
from manager import connect
import marshal
import types
import os

def universal(job_q, res_q):
    while True:
        funcs, args, kwargs = job_q.get()
        func_code = marshal.loads(funcs)
        func = types.FunctionType(func_code, globals(), 'loaded_func')
        print('processing ', func, args, kwargs)
        res_q.put((os.getpid(), func(*args, **kwargs)))

if __name__ == '__main__':
    manager = connect('127.0.0.1', 1234, b'abc')
    print('Worker started with PID=', os.getpid())
    universal(manager.get_job_q(), manager.get_res_q())
{% endhighlight %}


The ``universal`` function is the main driver. It takes the job - and result
queue as arguments. As stated above the job queue contains triplets with the
marshalled function code and the arguments. First the marshalled code is
unmarshalled giving us the pseudo-compiled code back. Next a new function is
created from this code, it is now part of the process and can be called.
Finally a tuple containing this processes id and the result of the invocation
is put into the result queue.

When the script is run, it joins the specified manager using ``connect`` and
then enters the ``universal`` function. 

#### Boss
Now this setup can be put to use for arbitrary tasks, for example here is a
boss that schedules the calculation of factorials.


{% highlight python %}
from manager import remote, connect
import os

def factorial(n):
    res = 1
    while n > 1:
        res, n = res * n, n - 1
    return res

if __name__ == '__main__':
    manager = connect('127.0.0.1', 1234, b'abc')
    print('Factorial started with PID=', os.getpid())

    inputs = range(1, 10)
    for num in inputs:
        remote(factorial, manager)(num)
    for _ in inputs:
        print(manager.get_res_q().get())
{% endhighlight %}


As can be seen the factorial function is a completely normal function. If the
boss is run, it again connects to a running manager and then uses the
``remote`` decorator to schedule the factorial calculations to remote
processes.

This is arguably a pretty simple example, so here is something a bit cooler.
With this boss the workers will be turned into socket servers that can handle
requests on their own!


{% highlight python %}
from manager import connect, remote
import os

def server(port):
    import socket
    host = ''
    backlog = 5
    size = 1024
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind((host,port))
    s.listen(backlog)
    done = False
    print('start serving')
    while not done:
        client, address = s.accept()
        data = client.recv(size)
        if data:
            client.send(data)
        client.close()
        done = data.decode().strip() == 'QUIT'
    print('done serving')
    return port

if __name__ == '__main__':
    manager = connect('127.0.0.1', 1234, b'abc')
    print('Echo started with PID=', os.getpid())

    remote(server, manager)(5001)
    remote(server, manager)(5002)
    print(manager.get_res_q().get())
    print(manager.get_res_q().get())
{% endhighlight %}


Note: the import in the function is necessary, for it to be reconstructable in the remote process

All in all, this architecture is pretty usable. Using a fleet of these
universal servers you basically can build a simple cluster environment that can
compute anything. Not only that, it can be dynamically patched with arbitrary
new behavior without the need for a restart.

## Conclusion
As you can see, implementing the universal server in Python is quite a bit more
involved than it is in Erlang, but that is understandable because it wasn't
specifically designed with this problem in mind. That being said, it is still
remarkable how simple this concept can be implemented using only standard
library modules. (Production code of course would be quite a bit more complex.)
