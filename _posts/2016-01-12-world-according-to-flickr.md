---
title: The World according to Flickr
layout: post
description: Constructing and rendering a global network based on public Flickr data.
card_type: photo
image: /experiments/vienna_acyclic/vienna_acyclic-contrast-wide-1024.png
---

[<img src='/experiments/vienna_acyclic/world_flickr.png'/>](/experiments/vienna_acyclic/world_flickr.png)

Part of project proposal I'm working on currently is the network
(re)construction of geographical locations. For a first experiment I used a
publicly available data set provided by Flickr that contains 100 million
photos of which 49 million are geotagged. It can be found [here](http://yahoolabs.tumblr.com/post/89783581601/one-hundred-million-creative-commons-flickr-images). The dataset consists of 10 TSV files holding the information (like id,
geotag, user, etc.) of 100.000 photos each.

I used Apache Spark for the preprocessing of these files and converted it into
a GraphX graph.  An Edge between locations exists if at least 2 persons visited
both and locations are less then 10 degree apart.

{% highlight scala %}
val geoTriplets = flickrRowsWithGeo
  .map(frow => (frow.user, List(makeVIdx(frow.latitude.get, frow.longitude.get))))
  // build a that contains all localities for the user, e.g. (christian, [Innsbruck, Vancouver, Montanita, ...])
  .reduceByKey((a, b) => a ++ b)
  // transform this list into links between the localities [((Innsbruck, Vancouver), christian), ...] and flatten it
  .flatMap(nodeList => nodeList._2.combinations(2)
                         .filter(lst => lst(0) != lst(1))
                         .map(lst => ((lst(0), lst(1)),  List(nodeList._1))))
  // we sanitize for regionality, i.e. localities that are too far away from each other are excluded
  .filter(tup => {
    val (lat1, lon1) = parseVIdx(tup._1._1)
    val (lat2, lon2) = parseVIdx(tup._1._2)
    shortestAngleDist(lat1, lat2) < 10 && shortestAngleDist(lon1, lon2) < 10
  })
  // we now basically inverted the list and gather up the users per location pair ((Innsbruck, Vancouver), [christian, marti])
  .reduceByKey((a, b) => a ++ b)
  // now we transform the user list into an edge weight and build a triplet (actually quadruplet) of the form (Innsbruck, 2, Vancouver, [christian, marti])
  .map(withUserList => (withUserList._1._1, withUserList._2.size, withUserList._1._2, withUserList._2))
  // we only keep edges with a weight > 1 meaning more than 2 person visited both
  .filter(_._2 > 2)

def vertices(): RDD[(VertexId, Unit)] = {
  geoTriplets.map(_._1).union(geoTriplets.map(_._3)).distinct().map((_, ()))
}

def edges(): RDD[Edge[Int]] = {
  geoTriplets.map(triplet => Edge(triplet._1, triplet._3, triplet._2))
}

def main(args: Array[String]): Unit = {
  val graph = Graph(vertices(), edges())
    graph.vertices.map(_._1.toString).saveAsTextFile("/path/to/out_vertices")
    graph.triplets.map(triplet => List(triplet.srcId, triplet.dstId, triplet.attr).map(_.toString)).saveAsTextFile("/path/to/out_edges")
}
{% endhighlight %}

Using Spark the resulting vertices and edges where written to disk and
transformed to a JSON object holding these values. Using d3.js (world
rendering, top) and processing.js (BFS rendering with starting point Vienna,
bottom) this JSON object was loaded and the network projected onto a Miller and
azimuthal projection respectively.  Vertices where drawn as translucent circles
whose overlap creates different color intensities on the map according to the
popularity of the location. Edges where drawn as translucent arcs with weighted
line width that highlight highly connected vertices via overlapping. The final
renderings are based on ~170.000 vertices and over 4 million edges.

[<img src='/experiments/vienna_acyclic/vienna_acyclic-contrast-wide-768.png' class="bg-image" />](/experiments/vienna_acyclic/vienna_acyclic-contrast-wide-1920.png)


