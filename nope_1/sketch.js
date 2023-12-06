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
let bookTokHues = {
  "not #BookTok": [201, 60, 80],
  "#BookTok": [0, 99, 70],
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
  createCanvas(3000, 2000, SVG);
  let startDate = new Date("2011-02");
  let endDate = new Date("2023-12");

  // getNode("2011", "year");
  // for (let genre in largeGenres) {
  //   getNode(genre, "genre");
  // }
  // for (let publisher in largePublishers) {
  //   getNode(publisher, "publisher");
  // }

  // getNode("Romance", "genre");
  // getNode("Mystery/Crime", "genre");
  // getNode("Historical Fiction", "genre");
  // getNode("Fantasy", "genre");

  let all_books = [];
  let year_genre = {};

  for (let row of data.rows) {
    if (all_books.includes(row.get("date"))) {
      continue;
    }
    all_books.push(row.get("date"));
    let year = row.get("date").split("-")[0];
    let genre = row.get("genre");
    if (!(genre in largeGenres)) {
      genre = "Other Genres";
    }
    if (!(year in year_genre)) {
      year_genre[year] = {};
    }
    if (!(genre in year_genre[year])) {
      year_genre[year][genre] = [0, 0];
    }
    year_genre[year][genre][0]++;
    year_genre[year][genre][1]++;
  }
  console.log(year_genre);

  // for (let year in year_genre) {
  //   for (let genre in year_genre[year]) {
  //     let yearNode = getNode(genre, year);
  //     for (let i = 0; i < year_genre[year][genre]; i++) {
  //       yearNode.links++;
  //     }

  //     if (year - 1 in nodes) {
  //       let sameGenre = nodes[year - 1].find((node) => node.name == genre);
  //       if (sameGenre) {
  //         for (let i = 0; i < year_genre[year][genre]; i++) {
  //           getLink(yearNode, sameGenre, largeGenres[genre]);
  //         }
  //       }
  //     }
  //   }
  // }
  for (let year in year_genre) {
    let count;
    for (let genre in year_genre[year]) {
      let yearNode = getNode(genre, year);
      for (let i = 0; i < year_genre[year][genre][0]; i++) {
        yearNode.links++;
      }

      // Loop through the previous year's genres and create links based on counts
      if (year - 1 in nodes) {
        count = 0; // this genre exhausted by last year same genre
        if (genre in year_genre[year - 1]) {
          count = Math.min(
            year_genre[year - 1][genre][1],
            year_genre[year][genre][0]
          );
          for (let i = 0; i < count; i++) {
            let prevYearNode = getNode(genre, year - 1);
            getLink(prevYearNode, yearNode, largeGenres[genre]);
          }
          year_genre[year - 1][genre][1] =
            year_genre[year - 1][genre][1] - count;
          year_genre[year][genre][0] = year_genre[year][genre][0] - count;
        }
      }
    }
    for (let genre in year_genre[year]) {
      if (year - 1 in nodes) {
        while (year_genre[year][genre][0] > 0) {
          let maxGenre = Object.keys(year_genre[year - 1]).reduce((a, b) => {
            return year_genre[year - 1][a][1] > year_genre[year - 1][b][1]
              ? a
              : b;
          });
          count = Math.min(
            year_genre[year - 1][maxGenre][1],
            year_genre[year][genre][0]
          );

          if (count == 0) {
            break;
          }

          for (let i = 0; i < count; i++) {
            let prevYearNode = getNode(maxGenre, year - 1);
            let yearNode = getNode(genre, year);
            getLink(prevYearNode, yearNode, largeGenres[maxGenre]);
          }
          year_genre[year - 1][maxGenre][1] =
            year_genre[year - 1][maxGenre][1] - count;
          year_genre[year][genre][0] = year_genre[year][genre][0] - count;
          console.log(year_genre[year][genre][0]);
        }
        // for (let prevGenre in year_genre[year - 1]) {
        //   let prevYearNode = getNode(prevGenre, year - 1);
        //   // Check if there are books flowing from the previous genre to the current genre
        //   if (year_genre[year - 1][prevGenre] > 0) {
        //     let count = Math.min(
        //       year_genre[year - 1][prevGenre],
        //       year_genre[year][genre]
        //     );
        //     // for (let i = 0; i < count; i++) {
        //     //   yearNode.links++;
        //     // }
        //     // Link to the same genre in the previous year
        //     getLink(prevYearNode, yearNode, largeGenres[genre]); // Make sure this link represents the relationship between genres
        //   }
        // }
      }
    }
  }

  // Parse the CSV data and create nodes and links
  for (let row of data.rows) {
    if (all_books.includes(row.get("title"))) {
      continue;
    }
    let year = row.get("date").split("-")[0];
    let title = row.get("title");
    let pages = parseInt(row.get("pages"));
    let weeksOnList = parseInt(row.get("weeks_on_list"));
    let genre = row.get("genre");
    let publisher = row.get("publisher");
    let author = row.get("author");
    let bookTok = bookTokAuthors.includes(author) ? "#BookTok" : "not #BookTok";

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
    // let genreNode = getNode(genre, "genre");
    // let publisherNode = getNode(publisher, "publisher");
    // let authorNode = getNode(author, "author");
    // // let bookTokNode = getNode(bookTok, "bookTok");

    // getLink(yearNode, genreNode, hue);
    // getLink(genreNode, publisherNode, hue);
    // getLink(publisherNode, authorNode, hue);
    // // getLink(authorNode, bookTokNode, bookTokHues[bookTok]);
    // // getLink(publisherNode, bookTokNode, bookTokHues[bookTok]);

    yearNode.links++;
    // genreNode.links++;
    // publisherNode.links++;
    // authorNode.links++;
    // // bookTokNode.links++;

    getBook(
      title,
      author,
      pages,
      weeksOnList,
      hue,
      yearNode,
      row.get("gender")
    );
  }

  // Update link ordering
  for (let type in links) {
    let [sourceType, targetType] = type.split("-");
    if (sourceType == "year") {
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
