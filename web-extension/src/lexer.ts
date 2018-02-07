export class Lexer {

  constructor() {}

  parse(data : string) : Array<string> {
    let res = [];
    let token = "";
    let isWord = false;

    for (let i = 0; i < data.length; i++) {
      if (isWord != this.isLetter(data.charCodeAt(i))) {
        if (token != "") {
          res.push(token);
        }
        token = "";
      }
      
      token = token + data[i];
      isWord = this.isLetter(data.charCodeAt(i));
    }

    if (token != "") {
      res.push(token);
    }

    return res;
  }

  isLetter(charcode : number) : boolean {
    return  (charcode >= 65 && charcode <= 90)
    || (charcode >= 97 && charcode <= 122);
  }
}