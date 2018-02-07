import { Lexer } from "./lexer";
import { CardDefinition } from "./models/card-definition";

export class Database
{
  /**
   * Retrieve the file from github, we just need to make a pull request in order to update the database.
   */
  private fileUrl : string = "https://raw.githubusercontent.com/EsakK/sts-reddit-enhancement/master/database/database.json";

  private storageVersion : number = 1;
  private storageKey = "stsre-database";
  private storageTimeout = 86400000;

  private xhr : XMLHttpRequest;
  private cards : {[key : string]: CardDefinition} = {};

  load() {
    return new Promise((resolve, reject) => {
      /**
       * Save the database in user storage in order to not download it again and again
       */
      if (this.loadFromStorage()) {
        console.log("Slay The Spire Reddit Enhancement: database loaded from storage");
        resolve(this);
        return ;
      }

      let xhr = new XMLHttpRequest();
      xhr.open("GET", this.fileUrl, true);
      xhr.onload = () => {
        this.initCards(JSON.parse(xhr.responseText));
        this.saveInStorage();

        console.log("Slay The Spire Reddit Enhancement: database loaded from server");

        resolve(this);
      };
      xhr.onerror = reject;
      xhr.send(null);
    });
  }

  initCards(data : Array<any>) {
    let lexer = new Lexer();
    
    for (let i = 0; i < data.length; i++) {
      let keywords = data[i]["keywords"];

      for (let j = 0; j < keywords.length; j++) {
        let keyword = lexer.parse(keywords[j]);

        this.cards[keyword[0]] = new CardDefinition();
        this.cards[keyword[0]].keywords = keyword;
        this.cards[keyword[0]].image = data[i]["image"];
      }
    }
  }

  private loadFromStorage() {
    let stored = localStorage.getItem(this.storageKey);

    if (! stored) return false;

    let storedObject = JSON.parse(stored);
    if (storedObject.version != this.storageVersion
      || storedObject.expire < new Date().getTime()) {
      this.removeFromStorage();
      return false;
    }

    this.cards = storedObject.cards;
    return true;
  }

  private saveInStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify({
      cards: this.cards,
      expire: new Date().getTime() + this.storageTimeout,
      version: this.storageVersion,
    }));
  }

  private removeFromStorage() {
    localStorage.removeItem(this.storageKey);
  }

  getCards() {
    return this.cards;
  }

  hasCard(key : string) {
    return this.cards[key] != undefined;
  }

  getCard(key : string) {
    return this.hasCard(key) ? this.cards[key] : null;
  }

}
