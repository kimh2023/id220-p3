let data;

let nodes = {};
let links = {};
let books = {};
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
let largePublisherHues = {
  "Hachette Book Group": [201, 60, 80],
  // "Penguin Random House": [15, 96, 80],
  "Penguin Random House": [11, 96, 80],
  // "Harper Collins": ["Harper", "Morrow", "Avon"],
  "Simon & Schuster": [206, 63, 54],
  Macmillan: [0, 99, 70],
  "Other Publishers": [327, 50, 85],
};
let largeGenres = {
  "Suspense/Thriller": [220, 70, 80],
  "Historical Fiction": [225, 74, 30],
  Romance: [341, 80, 80],
  "Mystery/Crime": [12, 90, 35],
  "Other Genres": [20, 30, 86],
};

let nodeXOffsets = {};
let nodeHeight = 5;
let linkOffset = 6;
let spaceBetween = 20;
let sankey_y = 100;
let sankey_x = 550;
let bookshelf_x = 250;

function preload() {
  data = loadTable("all_months.csv", "csv", "header");
  titleFont = loadFont("./assets/Ogg-Regular.ttf");
}

const hueDeterminant = "genre";

function setup() {
  colorMode(HSL);
  strokeCap(SQUARE);
  createCanvas(1700, 2200, SVG);
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
    let pages = parseInt(row.get("pages"));
    let weeksOnList = parseInt(row.get("weeks_on_list"));
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

    switch (hueDeterminant) {
      case "genre":
        hue = largeGenres[genre];
        break;
      case "publisher":
        hue = largePublisherHues[publisher];
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

    getBook(title, author, pages, weeksOnList, hue, yearNode);
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
  background("#FFFCF6");
  strokeCap(SQUARE);
  // textAlign(LEFT, TOP);
  // textFont(titleFont, 50);
  // text("Sold Out: What Makes a Bestseller", 120, 120);

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

  // Draw books
  for (let year of Object.keys(books)) {
    for (let book of books[year]) {
      book.display();
    }
  }
}
