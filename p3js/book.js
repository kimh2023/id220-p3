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
    bezier(
      this.source.x + this.source.width,
      this.source.y + nodeHeight / 2 + this.yOffsetSource + linkOffset / 2,
      this.source.x + this.source.width + 150,
      this.source.y + nodeHeight / 2 + this.yOffsetSource + linkOffset / 2,
      this.target.x - 150,
      this.target.y + nodeHeight / 2 + this.yOffsetTarget + linkOffset / 2,
      this.target.x,
      this.target.y + nodeHeight / 2 + this.yOffsetTarget + linkOffset / 2
    );
  }
}
