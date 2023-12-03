let data;

let nodes = {};
let links = {};
let largePublishers = {
  "Hachette Book Group": [
    "Little, Brown",
    "Windblown Media",
    "Grand Central",
    "Grand Central Publishing",
    "Algonquin",
  ],
  "Penguin Random House": [
    "Penguin",
    "Putnam",
    "Doubleday",
    "Riverhead",
    "Delacorte",
    "Crown",
    "Dutton",
    "Dell",
    "Berkley",
    "Bantam",
    "Vintage",
    "Anchor", //from Doubleday
    "Viking",
    "Ballantine",
  ],
  // "Harper Collins": ["Harper", "Morrow", "Avon"],
  "Simon & Schuster": ["Simon & Schuster", "Scribner"],
  Macmillan: ["St. Martin's", "Flatiron"],
};
let largeGenres = {
  "Suspense/Thriller": 220,
  "Historical Fiction": 200,
  Romance: 310,
  "Mystery/Crime": 240,
  "Other Genres": 150,
};

let nodeXOffsets = {};
let nodeHeight = 5;
let linkOffset = 6;
let spaceBetween = 20;
let sankey_y = 200;
let sankey_x = 400;

function preload() {
  data = loadTable("all_months.csv", "csv", "header");
}

const hueDeterminant = "genre";

function setup() {
  colorMode(HSL);
  strokeCap(SQUARE);
  createCanvas(2000, 2000, SVG);
  let startDate = new Date("2011-02");
  let endDate = new Date("2023-12");

  getNode("2011", "year");
  for (let genre in largeGenres) {
    getNode(genre, "genre");
  }
  for (let publisher in largePublishers) {
    getNode(publisher, "publisher");
  }

  // getNode("Romance", "genre");
  // getNode("Mystery/Crime", "genre");
  // getNode("Historical Fiction", "genre");
  // getNode("Fantasy", "genre");

  // Parse the CSV data and create nodes and links
  for (let row of data.rows) {
    let year = row.get("month").split("-")[0];
    let title = row.get("title");
    let genre = row.get("genre");
    let publisher = row.get("publisher");
    let author = row.get("author");
    let currentDate = new Date(row.get("month"));
    let hue = map(currentDate, startDate, endDate, 0, 250);

    for (bigFive in largePublishers) {
      if (largePublishers[bigFive].includes(publisher)) {
        publisher = bigFive;
      }
    }
    if (!(publisher in largePublishers)) {
      publisher = "Other Publishers";
    }
    if (!(genre in largeGenres)) {
      genre = "Other Genres";
    }

    if (hueDeterminant == "genre") {
      hue = largeGenres[genre];
    }

    let yearNode = getNode(year, "year", title);
    let genreNode = getNode(genre, "genre");
    let publisherNode = getNode(publisher, "publisher");
    let authorNode = getNode(author, "author");

    getLink(yearNode, genreNode, hue);
    getLink(genreNode, publisherNode, hue);
    getLink(publisherNode, authorNode, hue);

    yearNode.links++;
    genreNode.links++;
    publisherNode.links++;
    authorNode.links++;
  }

  // Update link ordering
  // for (let type in links) {
  //   let [sourceType, targetType] = type.split("-");
  //   if (sourceType == "year") {
  //     continue;
  //   }
  //   links[type].sort((a, b) => b.count - a.count);
  // }
  for (let type in links) {
    let [sourceType, targetType] = type.split("-");
    for (let source of nodes[sourceType]) {
      let sameSource = links[type].filter((link) => link.source === source);
      let sourceCumulativeCount = 0;
      for (let link of sameSource) {
        link.sourcePrevLinks = sourceCumulativeCount;
        sourceCumulativeCount += link.count;
      }
    }
    for (let target of nodes[targetType]) {
      let sameTarget = links[type].filter((link) => link.target === target);
      let targetCumulativeCount = 0;
      for (let link of sameTarget) {
        link.targetPrevLinks = targetCumulativeCount;
        targetCumulativeCount += link.count;
      }
    }
  }

  // Update y offsets
  let max_length =
    nodes[
      Object.keys(nodes).reduce((a, b) =>
        nodes[a].length > nodes[b].length ? a : b
      )
    ].length;

  for (let type in nodes) {
    let base_offset = ((max_length - nodes[type].length) * spaceBetween) / 2;
    let previousNode;
    let currentNode = nodes[type][0];
    currentNode.y = base_offset + sankey_y;
    currentNode.height = currentNode.links * nodeHeight + linkOffset;

    for (let i = 1; i < nodes[type].length; i++) {
      currentNode = nodes[type][i];
      previousNode = nodes[type][i - 1];

      currentNode.y =
        previousNode.y + previousNode.links * nodeHeight + spaceBetween;
      currentNode.height = currentNode.links * nodeHeight + linkOffset;
    }
  }
}

function draw() {
  background(255);
  strokeCap(SQUARE);

  // Draw links
  for (let linkType of Object.keys(links)) {
    for (let link of links[linkType]) {
      link.display();
    }
  }

  // Draw nodes
  for (let nodeType of Object.keys(nodes)) {
    for (let node of nodes[nodeType]) {
      node.display();
    }
  }
}
