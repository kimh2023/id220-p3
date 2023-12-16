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
    strokeWeight(2);
    stroke(this.hue[0], 80, this.hue[2]);

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
    fill(this.hue[0], 60, this.hue[2], 0.07);
    rect(
      this.authorNode.x - 270,
      this.authorNode.y,
      270,
      this.authorNode.height
    );
    // fill(0, 0, 0);
    // rect(this.authorNode.x - 10, this.authorNode.y, 10, this.authorNode.height);
    fill(this.hue[0], 80, this.hue[2]);
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
}

function drawArrow(x, y, size) {
  let angle = PI / 4;
  let arrowLength = 20;

  // Calculate arrow points
  let x1 = x - size * cos(angle);
  let y1 = y - size * sin(angle);
  let x2 = x - size * cos(angle);
  let y2 = y + size * sin(angle);

  // Draw arrow lines
  line(x, y, x1, y1);
  line(x, y, x2, y2);
}
