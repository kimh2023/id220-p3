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

class Book {
  constructor(title, author, hue, y, x) {
    this.title = title;
    this.author = author;
    this.hue = hue;
    this.y = y;
    this.x = x;
  }

  display() {
    noStroke();
    fill(hue, 90, 80, 0.7);
    rect(this.x, this.y, this.width, this.height);
  }
}
