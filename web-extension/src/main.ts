import { Database } from "./database";
import { Lexer } from "./lexer";
import { Utils } from "./utils";

let database = new Database();

database.load()
.then((base : Database) => {
  let start = new Date().getTime();
  let lexer = new Lexer();

  let posts = document.getElementsByClassName("usertext-body");
  for (var i = 0; i < posts.length; i++) {
    let message = lexer.parse(posts[i].innerHTML);

    for (var j = 0; j < message.length; j++) {
      var word = message[j];
      let card = base.getCard(word);

      if (card != undefined  && Utils.arrayIncluded(card.keywords, message, j)) {
        message[j] = '<span class="stser-container">' 
        + '<span class="stser-tooltip">'
        + '<img src="' + card.image + '">'
        + '</span>'
        + card.keywords.join(" ") 
        + '</span>';

        if (card.keywords.length > 1) {
          message.splice(j + 1, card.keywords.length - 1);
        }

        j = j -1 + card.keywords.length;
      }
    }

    posts[i].innerHTML = message.join("")
  }

  console.log("Executed in " + (new Date().getTime() - start));
});