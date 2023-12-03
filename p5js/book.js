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

function getBook(title, author, pages, weeksOnList, hue, yearNode, bookTok) {
  if (!(yearNode.name in books)) {
    books[yearNode.name] = [];
  }

  let totalPageCount = books[yearNode.name].reduce((sum, book) => {
    // Add the page count of each book to the sum
    return sum + book.pages / 30 + 2;
  }, 0);

  let newBook = new Book(
    title,
    author,
    pages,
    weeksOnList,
    hue,
    yearNode,
    totalPageCount,
    bookTok
  );
  books[yearNode.name].push(newBook);
}

class Book {
  constructor(
    title,
    author,
    pages,
    weeksOnList,
    hue,
    yearNode,
    xOffset,
    bookTok
  ) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.weeksOnList = weeksOnList;
    this.hue = hue;
    this.yearNode = yearNode;
    this.x = bookshelf_x + xOffset;
    this.bookTok = bookTok;
  }

  display() {
    if (!this.pages) {
      console.log(this.title);
    }
    noStroke();
    // console.log(this.weeksOnList);
    fill(...this.hue, 0.7);
    rect(this.x, this.yearNode.y, this.pages / 30, this.yearNode.height);

    let startX = this.x + this.pages / 45;
    let width = this.pages / 120;
    let startY = this.yearNode.y + 0.001;
    let height = Math.log1p(this.weeksOnList) * 12;

    fill(this.hue[0], this.hue[1], this.hue[2] / 2);
    rect(startX, startY, width, height);
    triangle(
      startX,
      startY + height,
      startX,
      startY + height + 4,
      startX + width,
      startY + height
    );
    triangle(
      startX,
      startY + height,
      startX + width,
      startY + height + 4,
      startX + width,
      startY + height
    );

    if (this.bookTok == "#BookTok") {
      fill(this.hue[0], this.hue[1], this.hue[2] * 0.8);
      circle(
        this.x + this.pages / 60,
        startY + this.yearNode.height - 10,
        width * 2
      );
    }
  }
}
