let data;

let nodes = {};
let links = {};
let books = {};
let shelves = {};
let largePublishers = {
  "Hachette Book Group": [
    "Little, Brown",
    "Little Brown",
    "Windblown Media",
    "Grand Central",
    "Grand Central Publishing",
    "Algonquin",
    "Little, Brown & Company",
    "Mulholland Books/Little, Brown",
    "Mulholland/Little, Brown",
    "Little, Brown and Knopf",
    "Mulholland",
  ],
  "Penguin Random House": [
    "Penguin Press",
    "Penguin Group",
    "Penguin",
    "Putnam",
    "Doubleday",
    "Knopf Doubleday Publishing",
    "Riverhead",
    "Delacorte",
    "Crown",
    "Crown Publishing",
    "Dutton",
    "Penguin Group (USA) Incorporated",
    "Dell",
    "Berkley",
    "Bantam",
    "Vintage",
    "Anchor", //from Doubleday
    "Viking",
    "Ballantine",
    "Random House",
    "Random House Publishing",
    "Putnam",
  ],
  "Harper Collins": ["Harper", "HarperCollins", "Morrow", "Avon"],
  "Simon & Schuster": ["Simon & Schuster", "Scribner", "Atria"],
  "Macmillan Publishers": [
    "St. Martin's'",
    "St. Martin's",
    "St. Martin's Press",
    "Flatiron",
    "Minotaur",
  ],
};
let largePublisherHues = {
  "Penguin Random House": [12, 96, 80],
  "Hachette Book Group": [201, 60, 80],
  "Macmillan Publishers": [0, 99, 70],
  "Simon & Schuster": [206, 63, 54],
  "Harper Collins": [0, 96, 80],
  "Other Publishers": [327, 50, 85],
};
let largeGenres = {
  "Suspense/Thriller": [220, 70, 80],
  "Historical Fiction": [225, 74, 30],
  Romance: [341, 80, 80],
  "Mystery/Crime": [12, 90, 35],
  "Other Genres": [20, 30, 86],
  // Fantasy: [341, 80, 80],
  // Horror: [341, 80, 80],
};
let majors = {
  English: [220, 70, 85],
  "Business & Commerce": [12, 70, 40],
  "Other Majors": [20, 30, 87],
  "Humanities and Social Sciences": [350, 80, 40],
  "Political Science": [225, 74, 30],
  Journalism: [235, 70, 80],
  Art: [341, 75, 84],
  // Zoology: [220, 70, 85],
  // Law: [225, 74, 30],
};
let bookTokHues = {
  "not #BookTok": [201, 60, 80],
  "#BookTok": [0, 99, 70],
};
// let careerGroups = {
//   Advertising: ["Advertising"],
//   "Job unrelated to writing": [
//     "Temp Jobs",
//     "Lineman",
//     "Politician",
//     "Travel Guide",
//     "Teacher",
//     "Counselor",
//     "Lawyer",
//     "Zoologist",
//   ],
//   Media: [
//     "Magazine publishing and marketing",
//     "Presentation Director",
//     "Studio Assistant",
//   ],
//   Journalist: ["Journalist"],
// };
const careerGroups = {
  Advertising: ["Advertising"],
  // "Fiction Writing": ["Author", "Novelist", "Poet"],
  "NonFiction Writing": ["Journalist", "Technical Writer", "Biographer"],
  "Law and Politics": ["Lawyer", "Politician"],
  Media: [
    "Magazine publishing and marketing",
    "Presentation Director",
    "Studio Assistant",
  ],
  Education: ["Teacher", "Counselor"],
  // Science: ["Zoologist"],
  Miscellaneous: [
    "Temp Jobs",
    "Lineman",
    "Travel Guide",
    "Zoologist",
    "None",
    // "Magazine publishing and marketing",
    // "Presentation Director",
    // "Studio Assistant",
  ],
};

let nodeXOffsets = {};
let nodeHeight = 13;
let linkOffset = 4;
let spaceBetween = 12;
let sankey_y = 100;
let sankey_x = 550;
let bookshelf_x = 250;

function preload() {
  data = loadTable("all_months.csv", "csv", "header");
  authors = loadJSON("all_authors.json");
  titleFont = loadFont("./assets/Ogg-Regular.ttf");
}

const hueDeterminant = "publisher";

function setup() {
  colorMode(HSL);
  strokeCap(SQUARE);
  createCanvas(2200, 2200, SVG);

  getNode("James Patterson", "author");
  getNode("English", "major");
  for (let career in careerGroups) {
    getNode(career, "career");
  }
  for (let genre in largeGenres) {
    getNode(genre, "genre");
  }
  for (let publisher in largePublisherHues) {
    getNode(publisher, "publisher");
  }

  for (let author in authors) {
    if (!(authors[author]["major"] in majors)) {
      authors[author]["major"] = "Other Majors";
    }
    let hue = majors[authors[author]["major"]];

    let authorNode = getNode(author, "author");
    let majorNode = getNode(authors[author]["major"], "major");
    getLink(authorNode, majorNode, hue);
    authorNode.links++;
    majorNode.links++;

    let career = authors[author]["career"];
    for (bigCategories in careerGroups) {
      if (careerGroups[bigCategories].includes(career)) {
        career = bigCategories;
      }
    }

    let carrerNode = getNode(career, "career");
    getLink(majorNode, carrerNode, hue);
    carrerNode.links++;

    let genre = authors[author]["books"][0]["genre"];
    if (!(genre in largeGenres)) {
      genre = "Other Genres";
    }

    let publisher = authors[author]["books"][0]["publisher"];
    for (bigFive in largePublishers) {
      if (largePublishers[bigFive].includes(publisher)) {
        publisher = bigFive;
      }
    }
    if (!(publisher in largePublisherHues)) {
      publisher = "Other Publishers";
    }
    // let genreHue = largeGenres[genre];
    // if (!(genre in largeGenres)) {
    //   genreHue = largeGenres["Other Genres"];
    // }
    let publisherHue = largePublisherHues[publisher];
    if (!(publisher in largePublisherHues)) {
      publisherHue = largePublisherHues["Other Publishers"];
    }

    let genreNode = getNode(genre, "genre");
    getLink(carrerNode, genreNode, publisherHue);
    genreNode.links++;

    let publisherNode = getNode(publisher, "publisher");
    getLink(genreNode, publisherNode, publisherHue);
    publisherNode.links++;

    getShelf(author, authors[author], authorNode, hue);
    // console.log(shelves);
  }

  // Update link ordering
  for (let type in links) {
    let [sourceType, targetType] = type.split("-");
    // if (sourceType == "major") {
    //   continue;
    // }
    let names;
    let careerNames;
    let genreNames;
    switch (sourceType) {
      case "major":
        names = Object.keys(majors);
        careerNames = Object.keys(careerGroups);
        links[type].sort((a, b) => {
          let chk = names.indexOf(a.source.name) - names.indexOf(b.source.name);
          if (chk == 0) {
            chk =
              careerNames.indexOf(a.target.name) -
              careerNames.indexOf(b.target.name);
          }
          return chk;
        });
        break;
      case "career":
        names = Object.keys(largePublisherHues);
        careerNames = Object.keys(careerGroups);
        genreNames = Object.keys(largeGenres);
        links[type].sort((a, b) => {
          let aPublisher;
          let bPublisher;
          for (let publisher in largePublisherHues) {
            if (
              a.hue[0] === largePublisherHues[publisher][0] &&
              a.hue[1] === largePublisherHues[publisher][1]
            ) {
              aPublisher = publisher;
            }
            if (
              b.hue[0] === largePublisherHues[publisher][0] &&
              b.hue[1] === largePublisherHues[publisher][1]
            ) {
              bPublisher = publisher;
            }
          }

          let chk = names.indexOf(aPublisher) - names.indexOf(bPublisher);
          if (chk == 0) {
            chk =
              careerNames.indexOf(a.source.name) -
              careerNames.indexOf(b.source.name);

            if (chk == 0) {
              chk =
                genreNames.indexOf(a.target.name) -
                genreNames.indexOf(b.target.name);
            }
          }
          return chk;
        });
        break;
      case "genre":
        names = Object.keys(largePublisherHues);
        careerNames = Object.keys(careerGroups);
        genreNames = Object.keys(largeGenres);
        links[type].sort((a, b) => {
          let aCareer;
          let bCareer;
          for (let career in careerGroups) {
            if (
              a.hue[0] === careerGroups[career][0] &&
              a.hue[1] === careerGroups[career][1]
            ) {
              aCareer = career;
            }
            if (
              b.hue[0] === careerGroups[career][0] &&
              b.hue[1] === careerGroups[career][1]
            ) {
              bCareer = career;
            }
          }
          let chk = names.indexOf(a.target.name) - names.indexOf(b.target.name);
          if (chk == 0) {
            chk =
              genreNames.indexOf(a.source.name) -
              genreNames.indexOf(b.source.name);
            if (chk == 0) {
              chk = careerNames.indexOf(aCareer) - careerNames.indexOf(bCareer);
            }
          }
          return chk;
        });
        break;
      default:
        names = Object.keys(majors);
    }
  }
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
  textAlign(LEFT, CENTER);
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
  for (let author of Object.keys(shelves)) {
    shelves[author].display();
  }
}

function mousePressed() {
  save("mySVG.svg");
}
