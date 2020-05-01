---
title: Rust + Wasm + Webgl Global Population
description: In this experiment I'm combining Rust with wasm-bindgen to create a WebGL visualization of global population density
render: <iframe src='/experiments/populationdensity/' style='width:100%;height:40vh;border:none;'></iframe>
image: /assets/2019/03/populationdensity.png
include_excerpt: true
card_type: summary_large_image
cram: false
published: false
layout: post
---

**--IN PROGRESS--**

# Setup

# The Data

# Lat/Lon to XYZ

Since the data is in latitude/longitude format it's pretty easy to convert them to XYZ coordinates using some trigonometry.
But first of how does the coordinate system work in WebGL?

## WebGL Coordinates

Device coordinates, i.e. WebGL will normalize all axis to $$[-1.0; 1.0]$$ in the shader and use that to draw pixels to the viewport.
The coordinate system then looks like this:

![device coordinates](https://github.com/chjdev/chjdev.github.io/raw/master/assets/2019/03/devicecoord.png)

With that out of the way lets find out our $$XYZ$$ coordinates. Latitude and Longitude basically describe a three dimensional [polar coordinate system](https://en.wikipedia.org/wiki/Polar_coordinate_system) with the distance set to $$1$$. Put a different way they're describing vectors of length $$1$$ that point from the origin $$[0, 0, 0]$$ to a point on the surface of a sphere:

![point on sphere](https://github.com/chjdev/chjdev.github.io/raw/master/assets/2019/03/pointonsphere.png)

In order to convert this representations to coordinates we can use for WebGL we'll use some trigonometry and start out to find the $$Y$$ coordinate and the radius $$R$$. "Radius?" I hear you asking, well we'll treat the coordinates as points on circles drawn on a sphere that move from top to bottom. A graphic makes probably more sense:

![sphere slices](https://github.com/chjdev/chjdev.github.io/raw/master/assets/2019/03/sphere.png)

Ok time to calculate. Since everything is normalized to $$1$$ it's actually pretty easy. Since we know $$\lambda$$, $$Y$$ is simply $$\sin(\lambda)$$ and $$R$$ is $$\cos(\lambda)$$, easy.

![trigonometry](https://github.com/chjdev/chjdev.github.io/raw/master/assets/2019/03/trigonometry.png)

Now lets find out $$X$$ and $$Y$$. To that let's switch our perspective from the $$XY$$ plane to the $$XZ$$ plane, i.e. instead of looking at the sphere from the front, we'll look at from the top, so $$X$$ again is $$R * \cos(\phi)$$ and $$Z$$ is $$R * \sin(\phi)$$.

And that's it, we moved from latitude/longitude to $$XYZ$$ for our vertex! Now you can do with it whatever you want, rotate it, move it, you do you.

## Drawing circles

# Recursive callbacks
