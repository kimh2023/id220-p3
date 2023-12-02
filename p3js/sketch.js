let data; // Assuming you load your CSV data into this variable

let nodes = [];
let links = [];
let nodeXOffsets = {};
let nodeYOffsets = {};
let nodeHeight = 5;
let linkOffset = 6;
let spaceBetween = 10;
let sankey_y = 200;
let sankey_x = 400;

function preload() {
  // Load your CSV data
  data = loadTable("all_months.csv", "csv", "header");
}

function setup() {
  colorMode(HSL);
  createCanvas(1600, 1600, SVG);
  let startDate = new Date("2011-02");
  let endDate = new Date("2023-12");

  getNode("2011", "year");
  getNode("Suspense/Thriller", "genre");
  getNode("Romance", "genre");
  getNode("Mystery/Crime", "genre");
  getNode("Historical Fiction", "genre");
  getNode("Fantasy", "genre");

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
    let hue = map(currentDate, startDate, endDate, -25, 60);
    if (hue < 0) {
      hue = 360 + hue;
    }
    let yearNode = getNode(year, "year", row.get("title"), year);
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
    currentNode.y = base_offset + sankey_y;
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
      currentNode.y = nodeYOffsets[type][i][1] + sankey_y;
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
