---
title: From Monoids to Monads in Python
description: A pragmatic description of monads using Python.
image: /assets/2014/12/First_matryoshka_museum_doll_open.jpg
include_excerpt: true
layout: post
---

Monads are a concept you will run into sooner or later when you learn about
functional programming. In the most general sense, Monads are a smart way to
structure a functional program and handle side effects. Although the math
concepts can be intricate, using them in your programs is quite straight
forward. One of the most trivial Monads for example will simply execute
functions in a specified order.

[<img src="/assets/2014/12/First_matryoshka_museum_doll_open.jpg" alt="Monads and Monoids are kind of like a Matryoshka doll. Photo By: RK812, Doll carved by Zvezdochkin, painted by Malyutin (Sergiev Posad Museum of Toys, Russia) [Public domain], via Wikimedia Commons" />](/assets/2014/12/First_matryoshka_museum_doll_open.jpg)

Why is that interesting? Well, in purely functional programming languages the
concept of statements that get executed sequentially doesn't really apply. Why
is that? A functional program basically consists of calling a function which is
composed of smaller functions, which are composed of smaller functions, and so
on. This makes sense because "pure" functions don't have any side effects, e.g.
updating a global state, which means that it is guaranteed to return the same
result each time it is called with the same parameters. So calling different
functions in a sequence basically equates to running different programs, since
they have no way of influencing each other.

However, in real world use cases handling side effects is unavoidable, e.g. you
probably want to handle user input. Handling these side effects and still
complying with the basic structure of a functional program is where Monads come
in.

In this article we will build the concept of a Monad from the ground up using a
very pragmatic high level view, that focuses on the application instead of the
math. To cause less confusion we will use Python to implement the examples
because the syntax is probably the most familiar, the concepts however don't
change in other languages. Monads are a general concept that can be implemented
in one way or another in any language.

## Function Composition
If you start reading about Monads you will probably see the word <a
href="https://en.wikipedia.org/wiki/Monoid">Monoid</a> being thrown around. The
mathematical definition of a Monoid is: *an algebraic structure with a single
associative binary operation and an identity element*.  It sounds complicated
but is pretty simple actually, an example would be the ``+`` operator: ``a + b
+ c = (a + b) + c + 0 = (a + (b + c)) + 0 + 0``, with ``0`` being the identity element in
this specific case. Everything that behaves this way is a Monoid. Note:
although ``+`` is <a
href="https://en.wikipedia.org/wiki/Commutative_property">commutative</a> it is
not a requirement. The Monoid we will use is <a
href="https://en.wikipedia.org/wiki/Function_composition">"Function
Composition."</a>

Let's work our way up. Let's say the only things you can do in functional
programs is defining and calling functions. But how can you structure your
program like that? First lets define some functions to work with:

{% highlight python %}
def f(x: int) -> int: return ~x
def g(x: int) -> int: return x ** 2
def h(x: int) -> int: return 2 * x
{% endhighlight %}

Note: I'm using ``int`` here but any types can be used as long as the
functions can be legally combined, more on that later.

The straight forward way to create a program from these functions is calling
the functions with the respective result of calling the other functions:

{% highlight python %}
x = 1
assert f(g(h(x))) == -5
assert h(g(f(x))) == 8
{% endhighlight %}

In the first example we start by calling h with the variable x, then call g
with the result of h and finally call f with the result of g.

This notation however is not very flexible and quickly becomes
unwieldy. Function composition to the rescue! Let's say we have two functions,
``f`` and ``g``, which we want to combine into one function ``c``. The
mathematical notation for this composition is ``g ∘ f``.

``c(x) = (g ∘ f)(x) = g(f(x))``

In Python this translates to the following:

{% highlight python %}
def combine(x: '(int) -> int', y: '(int) -> int') -> '(int) -> int':
    return lambda _: x(y(_))
{% endhighlight %}

Note: unfortunately Python doesn't have a good way to type hint function
objects, so i use ``(int) -> int`` to say: a function that takes an ``int`` and
returns an ``int``. Again it doesn't have to be ``int`` and can be anything as
long as the types match up.

If you want to compose more than 2 functions, simply use ``combine`` repeatedly
with new functions and the result of a previous ``combine``. Since Monoids
follow associativity rules the order in which they are combined doesn't matter,
as long as the general order of operations is preserved.

{% highlight python %}
assert combine(f, combine(g, h))(x) == \
       combine(combine(f, g), h)(x) == -5
{% endhighlight %}

Still pretty cumbersome to write but at least it is more general. Let's take a
quick detour and use a cool Python hack which allows us to create <a
href="http://code.activestate.com/recipes/384122/">infix operators</a>.

{% highlight python %}
ø = Infix(combine)
assert (f |ø| g |ø| h)(x) != (h |ø| g |ø| f)(x)
assert (f |ø| g |ø| h)(x) == f(g(h(x)))
{% endhighlight %}

The ``ø`` symbol was chosen because it's valid Python and resembles the mathematical notation.
If you squint, this almost looks like statements in an imperative language. You
start with an ``x`` then you do ``h`` followed by ``g`` followed by ``f`` and
arrive at a result.

Monads behave very similar to this concept. You probably already heard the
line: "A monad is just a monoid in the category of endofunctors, what's the
problem?" We already know how Monoids work. Now however we will change the type
of the functions that will be used.

## Down the rabbit hole: Monads
Previously we used function of the form ``(a) -> a`` (for ``a`` meaning any
type). For Monads however we will now use functions of the form ``(a) -> M a``.
The ``M a`` indicates a type constructor. Basically it's just a wrapper that
wraps a type and needs to be evaluated to create (in this case) an ``a``.

Our approach for function composition doesn't work any more since we can't
simply combine two ``(a) -> M a`` functions. E.g. if we change the type of our
functions ``f`` and ``g`` to use a type constructor, ``g(f(x))`` doesn't work
since both functions expect an ``a`` as an argument, the result of ``f``
however is an ``M a``. It's better to look at some real code to understand
this.

### The Trivial Monad
Let's build the simplest Monad: Trivial. This Monad will simply chain functions
analog to our ``combine`` example. First let's create our type constructor:

{% highlight python %}
class Trivial():
    def __init__(self, value):
        self._value = value

    def __call__(self, *args, **kwargs):
        return self._value
{% endhighlight %}

This wrapper is pretty useless, it just wraps a value and spits it back out
when the object is called. However it is useful to have this abstraction for
more intricate Monads that allow e.g. I/O or concurrency. We'll later see a
Monad that's a bit more useful.

Alright, let's create some functions, that are using this type constructor.
We'll just use our previous functions and wrap them in the type constructor:

{% highlight python %}
def tf(x: int) -> Trivial: return Trivial(f(x))
def tg(x: int) -> Trivial: return Trivial(g(x))
def th(x: int) -> Trivial: return Trivial(h(x))
{% endhighlight %}

It's obvious now, that you can't just compose the functions because you can't
just call e.g. ``tf`` with a ``Trivial`` object. In order to compose these
functions we need a bit more plumbing. We need 2 things: a mechanism that
evaluates our type constructor and calls a function with the result, and a way
to chain multiple functions. This sounds a bit contrived, but will become
clearer once you see it in code.

First, the function to evaluate the type constructor and call a second function - we'll call it ``bind``:

{% highlight python %}
def bind(what: Trivial, other: '(a) -> Trivial') -> Trivial:
    return other(what())
{% endhighlight %}

This ``bind`` operator is different for each Monad, it depends on the type
constructor and what you want to do with it, e.g. you could parallelize the
execution. In this trivial example however, we just dig out the value and pass
it on to the function.

Now, how can we use this operator to compose multiple functions?

{% highlight python %}
programA = (lambda a: bind(th(a),
              lambda b: bind(tg(b),
                lambda c: tf(c))))(x)
{% endhighlight %}

This looks a bit complicated but what it does is actually simple, it just
creates some intermediary variables to pass the input through all the functions
that will be bound. This probably will take a little time to grok, but just try
to run through it a couple of times and it should become clearer.

What have we gained with this mechanism? Well we can now create arbitrary
Monads that allow a natural structuring of a functional program and the
introduction of side effects.

For fun, let's add some syntactic sugar:

{% highlight python %}
def _do_block(bind, *stmts):
    assert len(stmts) > 0
    if len(stmts) == 1:
        return lambda y: stmts[0](y)
    else:
        return lambda x: bind(stmts[0](x),
                  do_block(bind, *stmts[1:]))

def trivial(*stmts): return _do_block(bind, *stmts)

programB = trivial(
    th,
    tg,
    tf)(x)

assert programA() == programB()
{% endhighlight %}

There, looks way better, doesn't it?

## A Variation of the Maybe Monad
To finish off, we'll create a Monad that is actually useful. This is a
variation of the <a
href="http://hackage.haskell.org/package/base-4.7.0.1/docs/Data-Maybe.html">Maybe
Monad</a> which is found in pretty much all functional languages in one form or
another.

Our Monad will allow us to work with functions that may fail to calculate a
result, and if they do, stop the remaining computation immediately. Let's look
at the code:

{% highlight python %}
class Maybe(): pass

class Just(Maybe):
    def __init__(self, value):
        self._value = value

    def __call__(self, *args, **kwargs):
        return self._value

class Nothing(Maybe): pass

@singledispatch
def bind(what: Just, other: 'def f(a) -> Trivial: pass') -> Maybe:
    return other(what())

@bind.register(Nothing)
def bind_nothing(what: Nothing, _) -> Nothing:
    return what

def maybe(*stmts): return _do_block(bind, *stmts)
{% endhighlight %}

Alright, everything in place: a type constructor, a ``bind`` operator and some syntactic sugar.
The type constructor ``Maybe`` can either be a ``Just`` object which wraps a
value, or a ``Nothing`` object.
The bind method for this Monad will either pass on the wrapped value or
immediately return ``what`` (i.e. the ``Nothing`` object).

Now let's use this Monad. We will create a program that checks for different
conditions and print the result.

{% highlight python %}
def mfun1(x: int) -> Maybe:
    print('mfun1', x)
    return Just(x) if (x % 2) == 0 else Nothing()

def mfun2(x: int) -> Maybe:
    print('mfun2', x)
    return Just(x) if (x % 3) == 0 else Nothing()

def mfun3(x: int) -> Maybe:
    print('mfun3', x)
    return Just(x) if (x % 4) == 0 else Nothing()

programC = maybe(
    mfun1,
    mfun2,
    mfun3)
print(programC(12)())
try:
    print(programC(11)())
except:
    print('as expected')
{% endhighlight %}

The first example will work since 12 is a valid input for all functions. The
second example will fail immediately on the first function, since 11 is not
even and the attempt of evaluating ``Nothing`` will raise an ``Exception``.

This concludes our little foray into Monads. I hope you now have an overview
about what people are talking about when they mention Monads and see the
usefulness of the concept.
