function getNode(name, type, title, date = 0) {
  // Check if the node already exists
  let existingNodeSource = links.filter((link) => link.source.name === name);
  if (existingNodeSource.length == 0) {
    existingNodeSource = links.filter((link) => link.target.name === name);
  }
  let existingNode = nodes.find((node) => node.name === name);
  if (existingNode) {
    existingNode.height =
      nodeHeight * (existingNodeSource.length + 1) + linkOffset;
    existingNode.title = title;
    existingNode.date = date;
    return existingNode;
  }

  let x;
  if (!(type in nodeXOffsets)) {
    nodeXOffsets[type] = Object.keys(nodeXOffsets).length * 250 + sankey_x; // Adjust the spacing as needed
  }
  x = nodeXOffsets[type];

  let y;
  if (!(type in nodeYOffsets)) {
    nodeYOffsets[type] = [];
  }
  if (!nodeYOffsets[type].find((value) => value[0] == name)) {
    nodeYOffsets[type].push([name, 0]);
  }
  y = 0;

  let newNode = new Node(name, type, x, y, title, date);
  nodes.push(newNode);
  return newNode;
}

class Node {
  constructor(name, type, x, y, title, date) {
    this.name = name;
    this.type = type;
    this.x = x;
    this.y = y;
    this.title = title;
    this.date = date;
    this.width = 5;
    this.height = nodeHeight + linkOffset;
  }

  display() {
    noStroke();
    fill(0, 0, 0);
    rect(this.x, this.y, this.width, this.height);

    fill(0);
    textAlign(LEFT, CENTER);
    text(this.name, this.x + this.width + 10, this.y + this.height / 2);
  }
}

function getLink(source, target, hue) {
  let sameLink = links.find(
    (link) => link.source === source && link.target === target
  );
  if (sameLink) {
    sameLink.count++;
    return;
  }

  let existingSourceLink = links.filter((link) => link.source === source);
  let yOffsetSource = existingSourceLink.length * nodeHeight;

  let existingTargetLink = links.filter((link) => link.target === target);
  let yOffsetTarget = existingTargetLink.length * nodeHeight;

  // Create a new node and add it to the nodes array
  let newLink = new Link(source, target, hue, yOffsetSource, yOffsetTarget);
  links.push(newLink);
}

class Link {
  constructor(source, target, hue, yOffsetSource, yOffsetTarget, count = 1) {
    this.source = source;
    this.target = target;
    this.hue = hue;
    this.yOffsetSource = yOffsetSource;
    this.yOffsetTarget = yOffsetTarget;
    this.count = count;
  }

  display() {
    // Draw a Bezier curve to represent the flow
    stroke(this.hue, 90, 80, 0.4);
    strokeWeight(nodeHeight * this.count);
    noFill();
    bezier(
      this.source.x + this.source.width,
      this.source.y + nodeHeight / 2 + this.yOffsetSource + linkOffset / 2,
      this.source.x + this.source.width + 150,
      this.source.y + nodeHeight / 2 + this.yOffsetSource + linkOffset / 2,
      this.target.x - 150,
      this.target.y + nodeHeight / 2 + this.yOffsetTarget + linkOffset / 2,
      this.target.x,
      this.target.y + nodeHeight / 2 + this.yOffsetTarget + linkOffset / 2
    );
  }
}
