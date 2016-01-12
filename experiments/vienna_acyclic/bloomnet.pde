// abandon all hope, ye who travel here
// this code is super experimental and hacky

// Global variables
float radius;
// The scale of our world
float zoom;
// A vector to store the offset from the center
PVector offset;
// The previous offset
PVector poffset;
// A vector for the mouse position
PVector mouse;

// Setup the Processing Canvas
void setup(){
  size(config.width, config.height);
  radius = 2;
  zoom = 1.0;
  offset = new PVector(0, 0);
  poffset = new PVector(0, 0);
  smooth();
  noLoop();
}

void clear() {
  //background(255, 255, 255);
  background(0, 0, 0);
}

void drawVertex(int x, int y) {
  float r = radius * pow(zoom,2);
  if (x < 0 || x > config.width || y < 0 || y > config.height) {
    return;
  }
  ellipse(x, y, r, r);
}

void drawEdge(int source_x, int source_y,
              int target_x, int target_y,
              int weight) {
  if (source_x < 0 || source_x > config.width || source_y < 0 || source_y > config.height ||
      target_x < 0 || target_x > config.width || target_y < 0 || target_y > config.height) {
    return;
  }

  strokeWeight((1 - (1/weight))/10);
  int vec_x = target_x - source_x;
  int vec_y = target_y - source_y;
  int dist_x = abs(vec_x);
  int dist_y = abs(vec_y);
  float dist = sqrt(dist_x * dist_x + dist_y * dist_y);
//  if(dist_x <= 0 || dist_y <= 0 || dist > 10) {
//    return;
//  }

  int per_x = -vec_y;
  int per_y = vec_x;
  float per_len = sqrt(per_x * per_x + per_y * per_y);
  float norm_per_x = per_x / per_len;
  float norm_per_y = per_y / per_len;

  float center_x = min(source_x, target_x) + dist_x / 2 + norm_per_x * dist/4;
  float center_y = min(source_y, target_y) + dist_y / 2 + norm_per_y * dist/4;
  bezier(source_x, source_y,
         center_x, center_y,
         center_x, center_y,
         target_x, target_y);

//  line(source_x, source_y,
//       target_x, target_y);
}

void initVertexDrawing() {
  fill(70, 130, 180, 0.4*255);
  noStroke();
}

void initEdgeDrawing() {
  noFill();
  //stroke(255,170,0, 0.4*255);
  stroke(255,255,255, 0.4*255);
}

void draw() {
  clear();
  console.log("edges");
  initEdgeDrawing();
  vertex_list = [];
  graph.edges.slice(0,40000).forEach(function (edge) {
          var sourceXY = projection(edge[0]),
              targetXY = projection(edge[1]);
          drawEdge(sourceXY[0], sourceXY[1],
                   targetXY[0], targetXY[1],
                   edge[2]);
          vertex_list.push(sourceXY);
          vertex_list.push(targetXY);
  });
  initVertexDrawing();
  console.log("vertices");
  vertex_list.forEach(function (xy) {
          drawVertex(xy[0], xy[1]);
  });
//  graph.vertices.forEach(function (vertex) {
//          var xy = projection(parse_id(vertex));
//          drawVertex(xy[0], xy[1]);
//  });
}


// Zoom in and out when the key is pressed
void keyPressed() {
  if (key == 'a') {
    projection.scale(projection.scale()*1.2);
  } else if (key == 'z') {
    projection.scale(projection.scale()/1.2);
  } else if (key == 'd') {
    var canvas = document.getElementById('bloomnet');
    var dt = canvas.toDataURL('image/png');
    /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
    dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
    dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=Canvas.png');
    window.open(dt, "_blank");
  }
  redraw();
}
