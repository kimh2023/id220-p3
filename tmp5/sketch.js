let data;

let nodes = {};
let links = {};
let books = {};
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
  "Hachette Book Group": [201, 60, 80],
  "Penguin Random House": [12, 96, 80],
  "Harper Collins": [15, 96, 80],
  "Simon & Schuster": [206, 63, 54],
  "Macmillan Publishers": [0, 99, 70],
  "Other Publishers": [327, 50, 85],
};
let largeGenres = {
  "Suspense/Thriller": [220, 70, 80],
  "Historical Fiction": [225, 74, 30],
  Romance: [341, 80, 80],
  "Mystery/Crime": [12, 90, 35],
  "Other Genres": [20, 30, 86],
  Fantasy: [341, 80, 80],
  Horror: [341, 80, 80],
};
let majors = {
  English: [220, 70, 85],
  "Business & Commerce": [12, 70, 40],
  "Other Majors": [20, 30, 87],
  "Humanities and Social Sciences": [350, 80, 40],
  "Political Science": [225, 74, 30],
  Journalism: [220, 70, 80],
  Art: [341, 75, 84],
  // Zoology: [220, 70, 85],
  // Law: [225, 74, 30],
};
let bookTokHues = {
  "not #BookTok": [201, 60, 80],
  "#BookTok": [0, 99, 70],
};

let nodeXOffsets = {};
let nodeHeight = 2;
let linkOffset = 4;
let spaceBetween = 15;
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
  getNode("James Patterson", "author");
  getNode("English", "major");
  getNode("English", "major");
  // let allGenres = {};
  // Object.values(authors).forEach((author) => {
  //   author.books.forEach((book) => {
  //     const genre = book.genre || "None";
  //     allGenres[genre] = (allGenres[genre] || 0) + 1;
  //   });
  // });
  // for (let major in majors) {
  //   for (let genre in allGenres) {
  //     let haveBook;
  //     for (let author in authors) {
  //       authors[author]["books"].forEach((book) => {
  //         let authorMajor =
  //           authors[author]["major"] in majors
  //             ? authors[author]["major"]
  //             : "Other Majors";

  //         if (authorMajor == major && book["genre"] == genre) {
  //           haveBook = true;
  //         }
  //       });
  //     }
  //     if (haveBook) {
  //       getNode(`${major}${genre}`, "genre");
  //     }
  //   }
  // }
  // getNode("Political Science", "major");
  // getNode("Humanities and Social Sciences", "major");

  console.log(authors);
  for (let author in authors) {
    if (!(authors[author]["major"] in majors)) {
      authors[author]["major"] = "Other Majors";
    }
    let hue = majors[authors[author]["major"]];

    let authorNode = getNode(author, "author");
    let majorNode = getNode(authors[author]["major"], "major");
    for (let i = 0; i < 10; i++) {
      getLink(authorNode, majorNode, hue);
      authorNode.links++;
      majorNode.links++;
    }

    ///////genre
    const genreCounts = {};
    const genrePublisherCounts = {};
    const totalBooks = authors[author]["books"].length;
    authors[author]["books"].forEach((book) => {
      let genre = book.genre || "None";
      // if (!(genre in largeGenres)) {
      //   genre = "Other Genres";
      // }
      let publisher = book.publisher || "Unknown";
      for (bigFive in largePublishers) {
        if (largePublishers[bigFive].includes(publisher)) {
          publisher = bigFive;
        }
      }
      if (!genrePublisherCounts[genre]) {
        genrePublisherCounts[genre] = {};
      }
      genrePublisherCounts[genre][publisher] =
        (genrePublisherCounts[genre][publisher] || 0) +
        10 / authors[author]["books"].length;

      genreCounts[publisher] =
        (genreCounts[publisher] || 0) + 10 / authors[author]["books"].length;
    });
    Object.keys(genreCounts).forEach((genre) => {
      genreCounts[genre] = Math.round(genreCounts[genre]);
    });

    const currentTotal = Object.values(genreCounts).reduce(
      (sum, proportion) => sum + proportion,
      0
    );
    const adjustment = 10 - currentTotal;
    if (adjustment !== 0) {
      const firstGenre = Object.keys(genreCounts)[0];
      genreCounts[firstGenre] += adjustment;
    }

    for (let genre in genreCounts) {
      if (genreCounts[genre] < 1) {
        continue;
      }
      let genreNode = getNode(`${genre}`, "genre");
      // let genreNode = getNode(`${authors[author]["major"]}${genre}`, "genre");
      for (let i = 0; i < genreCounts[genre]; i++) {
        // hue = [0, 0, 0];
        getLink(majorNode, genreNode, hue);
        genreNode.links++;
      }

      // Object.keys(genrePublisherCounts[genre]).forEach((publisher) => {
      //   genrePublisherCounts[genre][publisher] = Math.round(
      //     (genrePublisherCounts[genre][publisher] * genreCounts[genre]) / 10
      //   );
      // });
      // const currentTotal = Object.values(genrePublisherCounts[genre]).reduce(
      //   (sum, proportion) => sum + proportion,
      //   0
      // );
      // const adjustment = genreCounts[genre] - currentTotal;
      // if (adjustment !== 0) {
      //   const firstPublisher = Object.keys(genrePublisherCounts[genre])[0];
      //   genrePublisherCounts[genre][firstPublisher] += adjustment;
      // }
      // for (let publisher in genrePublisherCounts[genre]) {
      //   let publisherNode = getNode(publisher, "publisher");
      //   for (let i = 0; i < genrePublisherCounts[genre][publisher]; i++) {
      //     let publisherHue = largePublisherHues[publisher];
      //     if (!(publisher in largePublisherHues)) {
      //       publisherHue = largePublisherHues["Other Publishers"];
      //     }
      //     getLink(genreNode, publisherNode, publisherHue);
      //     publisherNode.links++;
      //   }
      // }
      // for (let publisher in genrePublisherCounts[genre]) {
      //   let publisherNode = getNode(`${publisher}`, "publisher");
      //   for (let i = 0; i < genrePublisherCounts[genre][publisher]; i++) {
      //     let publisherHue = largePublisherHues[publisher];
      //     if (!(publisher in largePublisherHues)) {
      //       publisherHue = largePublisherHues["Other Publishers"];
      //     }
      //     getLink(genreNode, publisherNode, publisherHue);
      //     publisherNode.links++;
      //   }
      // }
      // let publisher = genreCounts[genre]["publisher"];
      // for (bigFive in largePublishers) {
      //   if (largePublishers[bigFive].includes(publisher)) {
      //     publisher = bigFive;
      //   }
      // }

      // let publisherNode = getNode(publisher, "publisher");
      // getLink(genreNode, publisherNode, hue);
    }

    ////// publisher
    // const publisherCounts = {};
    // authors[author]["books"].forEach((book) => {
    //   let publisher = book.publisher || "None";
    //   for (bigFive in largePublishers) {
    //     if (largePublishers[bigFive].includes(publisher)) {
    //       publisher = bigFive;
    //     }
    //   }

    //   publisherCounts[publisher] = (publisherCounts[publisher] || 0) + 1;
    // });
    // const publisherProportions = {};
    // Object.entries(publisherCounts).forEach(([publisher, count]) => {
    //   publisherProportions[publisher] = Math.round(
    //     (count / authors[author]["books"].length) * 5
    //   );
    // });
    // for (let publisher in publisherProportions) {
    //   if (publisherProportions[publisher] < 1) {
    //     continue;
    //   }
    //   console.log(author, publisherProportions, publisher);
    //   let publisherNode = getNode(publisher, "publisher");
    //   for (let i = 0; i < publisherProportions[publisher]; i++) {
    //     getLink(genreNode, publisherNode, hue);
    //     publisherNode.links++;
    //   }
    // }
  }

  colorMode(HSL);
  strokeCap(SQUARE);
  createCanvas(2200, 2200, SVG);
  let startDate = new Date("2011-02");
  let endDate = new Date("2023-12");

  // getNode("2011", "year");
  // for (let genre in largeGenres) {
  //   getNode(genre, "genre");
  // }
  // for (let publisher in largePublishers) {
  //   getNode(publisher, "publisher");
  // }

  // // getNode("Romance", "genre");
  // // getNode("Mystery/Crime", "genre");
  // // getNode("Historical Fiction", "genre");
  // // getNode("Fantasy", "genre");

  // // Parse the CSV data and create nodes and links
  // for (let row of data.rows) {
  //   let year = row.get("date").split("-")[0];
  //   let title = row.get("title");
  //   let pages = parseInt(row.get("pages"));
  //   let weeksOnList = parseInt(row.get("weeks_on_list"));
  //   let genre = row.get("genre");
  //   let publisher = row.get("publisher");
  //   let author = row.get("author");
  //   let bookTok = bookTokAuthors.includes(author) ? "#BookTok" : "not #BookTok";

  //   // let currentDate = new Date(year);
  //   // let hue = [map(currentDate, startDate, endDate, 0, 250), 40, 80];
  //   let currentDate = parseInt(year);
  //   let hue = [map(currentDate, 2011, 2023, 0, 250), 50, 85];

  //   for (bigFive in largePublishers) {
  //     if (largePublishers[bigFive].includes(publisher)) {
  //       publisher = bigFive;
  //     }
  //   }
  //   if (!(publisher in largePublishers)) {
  //     publisher = "Other Publishers";
  //   }
  //   if (!(genre in largeGenres)) {
  //     genre = "Other Genres";
  //   }

  //   switch (hueDeterminant) {
  //     case "genre":
  //       hue = largeGenres[genre];
  //       break;
  //     case "publisher":
  //       hue = largePublisherHues[publisher];
  //   }

  //   let yearNode = getNode(year, "year", title);
  //   let genreNode = getNode(genre, "genre");
  //   let publisherNode = getNode(publisher, "publisher");
  //   let authorNode = getNode(author, "author");
  //   // let bookTokNode = getNode(bookTok, "bookTok");

  //   getLink(yearNode, genreNode, hue);
  //   getLink(genreNode, publisherNode, hue);
  //   getLink(publisherNode, authorNode, hue);
  //   // getLink(authorNode, bookTokNode, bookTokHues[bookTok]);
  //   // getLink(publisherNode, bookTokNode, bookTokHues[bookTok]);

  //   yearNode.links++;
  //   genreNode.links++;
  //   publisherNode.links++;
  //   authorNode.links++;
  //   // bookTokNode.links++;

  //   getBook(title, author, pages, weeksOnList, hue, yearNode, bookTok);
  // }

  // Update link ordering
  for (let type in links) {
    let [sourceType, targetType] = type.split("-");
    if (sourceType == "major") {
      continue;
    }
    links[type].sort((a, b) => b.count - a.count);
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
