let data; // Assuming you load your CSV data into this variable

let nodes = [];
let links = [];
let nodeXOffsets = {};
let nodeYOffsets = {};
let nodeHeight = 10;
let linkOffset = 6;
let spaceBetween = 20;

function preload() {
  // Load your CSV data
  data = loadTable("all_months.csv", "csv", "header");
}

function setup() {
  colorMode(HSL);
  createCanvas(800, 1600);
  let startDate = new Date("2011-02");
  let endDate = new Date("2023-12");

  // Parse the CSV data and create nodes and links
  for (let row of data.rows) {
    let year = row.get("month").split("-")[0];
    let existingBook = nodes.find(
      (node) => node.title === row.get("title") && node.date == year
    );
    if (existingBook) {
      continue;
    }
    let currentDate = new Date(row.get("month"));
    let hue = map(currentDate, startDate, endDate, 0, 360);
    let yearNode = getNode(
      year,
      "year",
      row.get("title"),
      row.get("month").split("-")[0]
    );
    let genreNode = getNode(row.get("genre"), "genre");
    let publisherNode = getNode(row.get("publisher"), "publisher");
    let authorNode = getNode(row.get("author"), "author");

    getLink(yearNode, genreNode, hue);
    getLink(genreNode, publisherNode, hue); // Adjust the value as needed
    getLink(publisherNode, authorNode, hue); // Adjust the value as needed
  }

  // Update y offsets
  let max_length =
    nodeYOffsets[
      Object.keys(nodeYOffsets).reduce((a, b) =>
        nodeYOffsets[a].length > nodeYOffsets[b].length ? a : b
      )
    ].length;

  for (let type in nodeYOffsets) {
    let base_offset =
      ((max_length - nodeYOffsets[type].length) * spaceBetween) / 2;
    let currentNode = nodes.find(
      (node) => node.name === nodeYOffsets[type][0][0]
    );
    currentNode.y = base_offset;
    nodeYOffsets[type][0][1] = base_offset;

    for (let i = 1; i < nodeYOffsets[type].length; i++) {
      let previousNodeName = nodeYOffsets[type][i - 1][0];

      let name = nodeYOffsets[type][i][0];
      let previousNodeLinks = links.filter(
        (link) => link.source.name === previousNodeName
      );
      if (previousNodeLinks.length == 0) {
        previousNodeLinks = links.filter(
          (link) => link.target.name === previousNodeName
        );
      }
      nodeYOffsets[type][i] = [
        name,
        nodeYOffsets[type][i - 1][1] +
          previousNodeLinks.length * nodeHeight +
          spaceBetween,
      ];
      let currentNode = nodes.find((node) => node.name === name);
      currentNode.y = nodeYOffsets[type][i][1];
    }
  }
}

function draw() {
  background(255);

  // Draw links
  for (let link of links) {
    link.display();
  }

  // Draw nodes
  for (let node of nodes) {
    node.display();
  }
}

function getNode(name, type, title, date = 0) {
  // Check if the node already exists
  let existingNode = nodes.find((node) => node.name === name);
  if (existingNode) {
    existingNode.height += nodeHeight;
    return existingNode;
  }

  let x;
  if (!(type in nodeXOffsets)) {
    nodeXOffsets[type] = Object.keys(nodeXOffsets).length * 200; // Adjust the spacing as needed
  }
  x = nodeXOffsets[type];

  let y;
  if (!(type in nodeYOffsets)) {
    nodeYOffsets[type] = []; // Adjust the spacing as needed
  }
  if (!nodeYOffsets[type].find((value) => value[0] == name)) {
    nodeYOffsets[type].push([name, 0]);
  }
  y = 0;

  // Create a new node and add it to the nodes array
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
    this.width = 10;
    this.height = nodeHeight + linkOffset;
  }

  display() {
    noStroke();
    fill(0, 0, 0);
    rect(this.x, this.y, this.width, this.height);

    fill(0);
    textAlign(CENTER, CENTER);
    text(this.name, this.x + this.width / 2, this.y + this.height / 2);
  }
}

function getLink(source, target, hue) {
  let existingSourceLink = links.filter((link) => link.source === source);
  let yOffsetSource = existingSourceLink.length * nodeHeight;

  let existingTargetLink = links.filter((link) => link.target === target);
  let yOffsetTarget = existingTargetLink.length * nodeHeight;

  // Create a new node and add it to the nodes array
  let newLink = new Link(source, target, hue, yOffsetSource, yOffsetTarget);
  links.push(newLink);
}

class Link {
  constructor(source, target, hue, yOffsetSource, yOffsetTarget) {
    this.source = source;
    this.target = target;
    this.hue = hue;
    this.yOffsetSource = yOffsetSource;
    this.yOffsetTarget = yOffsetTarget;
  }

  display() {
    // Draw a Bezier curve to represent the flow
    stroke(this.hue, 100, 80);
    strokeWeight(nodeHeight);
    noFill();
    bezier(
      this.source.x + this.source.width,
      this.source.y + nodeHeight / 2 + this.yOffsetSource + linkOffset / 2,
      this.source.x + this.source.width + 80,
      this.source.y + nodeHeight / 2 + this.yOffsetSource + linkOffset / 2,
      this.target.x - 80,
      this.target.y + nodeHeight / 2 + this.yOffsetTarget + linkOffset / 2,
      this.target.x,
      this.target.y + nodeHeight / 2 + this.yOffsetTarget + linkOffset / 2
    );
  }
}
