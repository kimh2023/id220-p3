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
  "Penguin Random House": [350, 23, 100],
  "Hachette Book Group": [215, 26, 96],
  "Macmillan Publishers": [346, 60, 100],
  "Simon & Schuster": [220, 70, 80],
  "Harper Collins": [243, 35, 100],
  "Other Publishers": [312, 20, 98],
};
let largeGenres = {
  "Suspense/Thriller": [220, 70, 80],
  "Historical Fiction": [225, 74, 30],
  Romance: [341, 80, 80],
  "Mystery/Crime": [12, 90, 35],
  "Other Genres": [20, 30, 86],
};
let majors = {
  English: [220, 22, 100],
  "Business & Commerce": [12, 90, 65],
  "Other Majors": [20, 8, 90],
  "Humanities and Social Sciences": [350, 70, 80],
  "Political Science": [225, 85, 50],
  Journalism: [235, 30, 95],
  Art: [341, 25, 96],
};
let bookTokHues = {
  "not #BookTok": [201, 60, 80],
  "#BookTok": [0, 99, 70],
};
const careerGroups = {
  Advertising: ["Advertising"],
  "NonFiction Writing": ["Journalist", "Technical Writer", "Biographer"],
  "Law and Politics": ["Lawyer", "Politician"],
  Media: [
    "Magazine publishing and marketing",
    "Presentation Director",
    "Studio Assistant",
  ],
  Education: ["Teacher", "Counselor"],
  Miscellaneous: ["Temp Jobs", "Lineman", "Travel Guide", "Zoologist", "None"],
};
const nodeTypeExplanations = {
  major: [
    "University Major",
    `What do authors major in while at university? 
  Though English seems like a good guess, 
  other majors like journalism and 
  political science also appears frequently. `,
  ],
  career: [
    "Prior Occupation",
    `Before their big break, a lot of authors
    were writing for money, whether in
    Advertising, Journalism, or Technical Writing.`,
  ],
  genre: [
    "#1 Debut Genre",
    `Getting first place on the bestseller lists
  is easier for a suspense/thriller writer.`,
  ],
  publisher: [
    "#1 Debut Publisher",
    `Best to go safe when choosing your publisher.
  Out of the 30 authors, only two didn’t make their first
  place debut with one of the Big 5 publishers.`,
  ],
};

let nodeXOffsets = {};
let nodeHeight = 15;
let linkOffset = 4;
let spaceBetween = 14;
const sankey_x = 420;
const sankey_y = 265;
const canvas_x = 2100;
const canvas_y = 1560;
const shelf_width = 310;
const linkOpacity = 0.75;
const HTRSpace = 190;

function preload() {
  authors = loadJSON("all_authors.json");
  titleFont = loadFont("./assets/OPTIEngraversOldEnglish.otf");
  subtitleFont = loadFont("./assets/Futura-Medium-Italic.ttf");
  bodyFontLight = loadFont("./assets/Helvetica-Light.ttf");
  bodyFontBold = loadFont("./assets/Helvetica-Bold.ttf");
}

const hueDeterminant = "publisher";

function setup() {
  colorMode(HSB);
  strokeCap(SQUARE);
  createCanvas(canvas_x, canvas_y, SVG);

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
  }

  for (let type in links) {
    let [sourceType, targetType] = type.split("-");
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

  //title
  fill(0, 0, 0);
  noStroke();
  textAlign(RIGHT, TOP);
  textFont(titleFont, 120);
  text("The New York Times", canvas_x - 145, 80);
  textFont(subtitleFont, 28);
  text("#1 BESTSELLING AUTHORS, RANKED", canvas_x - 110, 250);
  textAlign(LEFT, TOP);
  textFont(bodyFontLight, 20);
  text(
    "Crafting a bestseller is difficult, but there’s more — becoming a #1 New York Times Best-\nselling author is even more of a challenge. I wondered about the life paths that would \nlead to this extraordinary accomplishment. Here, I looked at 30 authors who have been \nranked #1 the most often on the Combined Print & E-Book Fiction list",
    110,
    109
  );

  // Draw links
  strokeCap(SQUARE);
  for (let linkType of Object.keys(links)) {
    for (let link of links[linkType]) {
      link.display();
    }
  }

  // Draw nodes
  for (let nodeType of Object.keys(nodes)) {
    if (nodeType !== "author") {
      const center_x = nodes[nodeType][0].x + nodes[nodeType][0].width / 2;
      // dashed line
      drawingContext.setLineDash([5, 5]);
      stroke(0, 0, 70);
      strokeWeight(1.5);
      line(center_x, 940, center_x, 1020);

      // divider
      stroke(0, 0, 0);
      drawingContext.setLineDash();
      line(center_x - 106, 1073, center_x + 106, 1073);

      // text
      noStroke();
      textAlign(CENTER, TOP);
      textFont(bodyFontBold, 18);
      text(nodeTypeExplanations[nodeType][0], center_x, 1044);
      textFont(bodyFontLight, 13);
      text(nodeTypeExplanations[nodeType][1], center_x, 1084);
    }
    for (let node of nodes[nodeType]) {
      node.display();
    }
  }

  // Draw books
  for (let author of Object.keys(shelves)) {
    shelves[author].display();
  }

  // How to Read Section
  howToRead();
}

function mousePressed() {
  save("mySVG.svg");
}

function howToRead() {
  drawingContext.setLineDash([5, 5]);
  stroke(0, 0, 70);
  strokeWeight(1.5);
  line(0, 1200, canvas_x, 1200);

  drawingContext.setLineDash();

  fill(0, 0, 0);
  noStroke();
  textAlign(LEFT, TOP);
  textFont(bodyFontBold, 29);
  text("HOW TO READ", 110, 1248);

  const common_y = 1295;
  textFont(bodyFontBold, 18);
  text("Author’s Fountain Pen", 110, common_y);
  text("University Major", 790, common_y);
  text("Publisher", 1460, common_y);

  textFont(bodyFontBold, 14);
  let i = 0;
  let x = 790;
  for (let major of Object.keys(majors)) {
    if (i > 3) {
      x += 330;
      i = 0;
    }
    fill(...majors[major], linkOpacity);
    rect(x, 1337 + i * 30, 66, 17);
    fill(0, 0, 0);
    text(major, x + 76, 1337 + i * 30 + 2);
    i++;
  }

  i = 0;
  x = 1460;
  for (let publisher of Object.keys(largePublisherHues)) {
    if (i > 2) {
      x += 330;
      i = 0;
    }
    fill(...largePublisherHues[publisher], linkOpacity);
    rect(x, 1337 + i * 30, 66, 17);
    fill(0, 0, 0);
    text(publisher, x + 76, 1337 + i * 30 + 2);
    i++;
  }

  // Example Quill
  const currentShelf = shelves["Kristin Hannah"];
  const shelfX = 1410;
  // const currentShelf = shelves["Janet Evanovich"];
  const bestSellerX = 188;
  const authorAgeX = 320;
  const ageY = shelfX + 60;
  fill(0, 0, 60);
  noStroke();
  textAlign(CENTER, CENTER);
  textFont(bodyFontBold, 14);
  text("#1 bestsellers", bestSellerX, 1345);
  text("author’s age when reaching #1", authorAgeX, 1370);
  text("80", 140 - 20, ageY);
  text("40", 390 - 10 + 20, ageY);
  text("author’s age", (140 + 390 - 10) / 2, ageY + 17);

  text(
    `log of the number of weeks
  the book was in #1`,
    390 + HTRSpace - 10,
    shelfX - 55
  );
  text(
    `radius of the circle is
    number of pages in the book`,
    390 + HTRSpace,
    shelfX + 40 / 2 + 53
  );

  drawingContext.setLineDash([5, 5]);
  stroke(0, 0, 70);
  strokeWeight(1.5);
  line(bestSellerX, 1345 + 15, bestSellerX, shelfX - 17);
  line(bestSellerX - 65, shelfX - 17, bestSellerX + 65, shelfX - 17);
  line(bestSellerX - 65, shelfX - 17, bestSellerX - 65, shelfX - 10);
  line(bestSellerX + 65, shelfX - 17, bestSellerX + 65, shelfX - 10);

  line(authorAgeX, 1370 + 15, authorAgeX, shelfX + 10);
  line(390 + HTRSpace, shelfX + 40 / 2, 390 + HTRSpace, shelfX + 40 / 2 + 32);
  line(390 + HTRSpace - 10, shelfX - 2, 390 + HTRSpace - 10, shelfX - 26);

  drawingContext.setLineDash();
  line(authorAgeX - 55, shelfX + 10, authorAgeX + 55, shelfX + 10);
  line(140, ageY, 390 - 10, ageY);

  currentShelf.displayQuill(); // place here so text formatting is applied
}
