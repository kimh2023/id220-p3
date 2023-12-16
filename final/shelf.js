// BookTok authors (that were on the lists)
let bookTokAuthors = [
  "Colleen Hoover", // super famous...
  "Rebecca Yarros", // https://time.com/6332608/iron-flame-rebecca-yarros/
  "Emily Henry", //https://www.penguin.co.uk/articles/2022/08/emily-henry-and-erin-morgenstern-how-tiktok-changed-our-careers
  //"Liane Moriarty", // BIG LITTLE LIES
  //"Sarah J. Maas", //https://theeverygirl.com/sarah-j-maas-books-reading-order/
  "Elin Hilderbrand", //https://www.theknot.com/content/booktok-books
  //"Delia Owens" //WHERE THE CRAWDADS SING
];

function getShelf(author, authorInfo, authorNode, hue) {
  let newShelf = new Shelf(author, authorInfo, authorNode, hue);
  shelves[author] = newShelf;
}

class Shelf {
  constructor(author, authorInfo, authorNode, hue) {
    this.author = author;
    this.authorInfo = authorInfo;
    this.authorNode = authorNode;
    this.hue = hue;
  }
  display() {
    let normalizedColor = [this.hue[0], 60, this.hue[2]];

    strokeWeight(2);
    stroke(...normalizedColor);

    // stem
    const startYear = new Date(this.authorInfo["birth_year"] + 40, 0, 1);
    const endDate = new Date(2023, 12, 7);
    let checkDate = new Date(this.authorInfo["books"][0]["dates"][0]);
    let timeLength = map(checkDate, startYear, endDate, 0, 130);
    line(
      this.authorNode.x - 5,
      this.authorNode.y + this.authorNode.height / 2,
      this.authorNode.x - 5 - timeLength,
      this.authorNode.y + this.authorNode.height / 2
    );

    // base
    noStroke();
    fill(...normalizedColor, 0.07);
    rect(
      this.authorNode.x - shelf_width,
      this.authorNode.y,
      shelf_width,
      this.authorNode.height
    );
    fill(0, 0, 0);
    rect(this.authorNode.x - 5, this.authorNode.y, 5, this.authorNode.height);
    fill(...normalizedColor);
    rect(
      this.authorNode.x - 5,
      this.authorNode.y,
      map(2023 - this.authorInfo["birth_year"], 0, 100, 0, 10),
      this.authorNode.height
    );

    // books
    fill(this.hue[0], 50, this.hue[2], 0.5);
    for (let book of this.authorInfo["books"]) {
      checkDate = new Date(book["dates"][0]);
      timeLength = map(checkDate, startYear, endDate, 0, 130);
      noStroke();
      circle(
        this.authorNode.x - 5 - timeLength,
        this.authorNode.y + this.authorNode.height / 2,
        Number(book["pages"]) / 100
      );
      strokeWeight(0.5);
      stroke(this.hue[0], 80, 70);
      drawArrow(
        this.authorNode.x - 5 - timeLength,
        this.authorNode.y + this.authorNode.height / 2,
        Math.log1p(book["dates"].length) * 9
      );
    }
  }
  displayQuill() {
    let normalizedColor = [this.hue[0], 60, this.hue[2]];
    let rectangleSize = 10;
    let startX = 380;
    let startY = 1420;
    let height = 40;
    let centerY = startY + height / 2;

    strokeWeight(2);
    stroke(...normalizedColor);

    // stem
    const startYear = new Date(this.authorInfo["birth_year"] + 40, 0, 1);
    const endDate = new Date(2023, 12, 7);
    let checkDate = new Date(this.authorInfo["books"][0]["dates"][0]);
    let timeLength = map(checkDate, startYear, endDate, 0, 260);
    line(
      startX - rectangleSize,
      centerY,
      startX - rectangleSize - timeLength,
      centerY
    );

    // base
    noStroke();

    fill(0, 0, 0);
    rect(startX - rectangleSize, startY, rectangleSize * 2, height);
    fill(...normalizedColor);
    rect(
      startX - rectangleSize,
      startY,
      map(2023 - this.authorInfo["birth_year"], 0, 100, 0, rectangleSize * 2),
      height
    );

    // books
    fill(this.hue[0], 50, this.hue[2], 0.5);
    for (let book of this.authorInfo["books"]) {
      checkDate = new Date(book["dates"][0]);
      timeLength = map(checkDate, startYear, endDate, 0, 260);
      noStroke();
      circle(
        startX - rectangleSize - timeLength,
        centerY,
        Number(book["pages"]) / 50
      );
      strokeWeight(1);
      stroke(this.hue[0], 80, 70);
      drawArrow(
        startX - rectangleSize - timeLength,
        centerY,
        Math.log1p(book["dates"].length) * 18
      );
    }

    // extra arrow explanation
    noStroke();
    circle(
      startX + HTRSpace,
      centerY,
      Number(
        this.authorInfo["books"][this.authorInfo["books"].length - 1]["pages"]
      ) / 50
    );
    strokeWeight(1);
    stroke(this.hue[0], 80, 70);
    const size =
      Math.log1p(
        this.authorInfo["books"][this.authorInfo["books"].length - 1]["dates"]
          .length
      ) * 18;
    let angle = PI / 4;

    // Calculate arrow points
    let x1 = startX + HTRSpace - size * sin(angle);
    let y1 = centerY - size * cos(angle);
    let x2 = startX + HTRSpace + size * sin(angle);
    let y2 = centerY - size * cos(angle);

    // Draw arrow lines
    line(startX + HTRSpace, centerY, x1, y1);
    line(startX + HTRSpace, centerY, x2, y2);

    stroke(0, 0, 70);
    strokeWeight(1.5);
    line(startX + HTRSpace + 2 - 2, centerY - 5 - 2, x1 + 2 + 2, y1 - 5 + 2);

    fill(0, 0, 60);
    noStroke();
    translate(startX + HTRSpace - 10, centerY + 5);
    rotate(PI / 4);
    text("1", 0, 0);
    rotate(-PI / 4);
    translate(-(startX + HTRSpace - 10), -(centerY + 5));
    translate(x1 + 2 + 2 - 8, y1 - 5 + 2 + 12);
    rotate(PI / 4);
    text("5", 0, 0);
    rotate(-PI / 4);
    translate(-(x1 + 2 + 2 - 8), -(y1 - 5 + 2 + 12));
  }
}

function drawArrow(x, y, size) {
  let angle = PI / 4;

  // Calculate arrow points
  let x1 = x - size * cos(angle);
  let y1 = y - size * sin(angle);
  let x2 = x - size * cos(angle);
  let y2 = y + size * sin(angle);

  // Draw arrow lines
  line(x, y, x1, y1);
  line(x, y, x2, y2);
}
