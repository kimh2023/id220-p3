function getNode(name, type, title) {
  if (!(type in nodes)) {
    nodes[type] = [];
  }

  let existingNode = nodes[type].find((node) => node.name === name);
  if (existingNode) {
    return existingNode;
  }

  if (!(type in nodeXOffsets)) {
    nodeXOffsets[type] = Object.keys(nodeXOffsets).length * 300 + sankey_x; // Adjust the spacing as needed
  }

  let newNode = new Node(name, type, title);

  nodes[type].push(newNode);
  return newNode;
}

class Node {
  constructor(name, type, title) {
    this.name = name;
    this.type = type;
    this.x = nodeXOffsets[type] + sankey_x;
    this.y = 0;
    this.title = title;
    this.width = 5;
    this.height = 0;
    this.links = 0;
  }

  display() {
    noStroke();
    fill(0, 0, 0);
    rect(this.x, this.y, this.width, this.height);

    fill(0);
    textAlign(LEFT, CENTER);
    textSize(12);
    text(this.name, this.x + this.width + 10, this.y + this.height / 2);
  }
}

function getLink(source, target, hue) {
  if (!(`${source.type}-${target.type}` in links)) {
    links[`${source.type}-${target.type}`] = [];
  }

  let sameLink = links[`${source.type}-${target.type}`].find(
    (link) =>
      link.source === source && link.target === target && link.hue == hue
  );
  if (sameLink) {
    sameLink.count++;
    return;
  }

  // Create a new node and add it to the nodes array
  let newLink = new Link(source, target, hue);
  links[`${source.type}-${target.type}`].push(newLink);
}

class Link {
  constructor(source, target, hue) {
    this.source = source;
    this.target = target;
    this.hue = hue;
    this.sourcePrevLinks = 0;
    this.targetPrevLinks = 0;
    this.count = 1;
  }

  display() {
    let strokeW = nodeHeight * this.count;
    let sourceY =
      this.source.y +
      strokeW / 2 +
      this.sourcePrevLinks * nodeHeight +
      linkOffset / 2;
    let targetY =
      this.target.y +
      strokeW / 2 +
      this.targetPrevLinks * nodeHeight +
      linkOffset / 2;
    // Draw a Bezier curve to represent the flow

    stroke(...this.hue, 0.5);
    strokeWeight(strokeW);
    noFill();
    bezier(
      this.source.x + this.source.width,
      sourceY,
      this.source.x + this.source.width + 150,
      sourceY,
      this.target.x - 150,
      targetY,
      this.target.x,
      targetY
    );
  }
}
