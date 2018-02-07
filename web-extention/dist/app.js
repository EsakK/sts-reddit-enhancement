System.register("lexer", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Lexer;
    return {
        setters: [],
        execute: function () {
            Lexer = class Lexer {
                constructor() { }
                parse(data) {
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
                isLetter(charcode) {
                    return (charcode >= 65 && charcode <= 90)
                        || (charcode >= 97 && charcode <= 122);
                }
            };
            exports_1("Lexer", Lexer);
        }
    };
});
System.register("models/definition", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Definition;
    return {
        setters: [],
        execute: function () {
            Definition = class Definition {
            };
            exports_2("Definition", Definition);
        }
    };
});
System.register("models/card-definition", ["models/definition"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var definition_1, CardDefinition;
    return {
        setters: [
            function (definition_1_1) {
                definition_1 = definition_1_1;
            }
        ],
        execute: function () {
            CardDefinition = class CardDefinition extends definition_1.Definition {
            };
            exports_3("CardDefinition", CardDefinition);
        }
    };
});
System.register("database", ["lexer", "models/card-definition"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var lexer_1, card_definition_1, Database;
    return {
        setters: [
            function (lexer_1_1) {
                lexer_1 = lexer_1_1;
            },
            function (card_definition_1_1) {
                card_definition_1 = card_definition_1_1;
            }
        ],
        execute: function () {
            Database = class Database {
                constructor() {
                    this.fileUrl = "https://gist.githubusercontent.com/EsakK/f379e49f2837a72c23b18d8d94de5ab2/raw/20a1e31bd537d1219a7bb7fc584c0e643e11499c/gistfile1.txt";
                    this.storageVersion = 1;
                    this.storageKey = "stsre-database";
                    this.storageTimeout = 86400000;
                    this.cards = {};
                }
                load() {
                    return new Promise((resolve, reject) => {
                        if (this.loadFromStorage()) {
                            console.log("Slay The Spire Reddit Enhancement: database loaded from storage");
                            resolve(this);
                            return;
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
                initCards(data) {
                    let lexer = new lexer_1.Lexer();
                    for (let i = 0; i < data.length; i++) {
                        let keywords = data[i]["keywords"];
                        for (let j = 0; j < keywords.length; j++) {
                            let keyword = lexer.parse(keywords[j]);
                            this.cards[keyword[0]] = new card_definition_1.CardDefinition();
                            this.cards[keyword[0]].keywords = keyword;
                            this.cards[keyword[0]].image = data[i]["image"];
                        }
                    }
                }
                loadFromStorage() {
                    let stored = localStorage.getItem(this.storageKey);
                    if (!stored)
                        return false;
                    let storedObject = JSON.parse(stored);
                    if (storedObject.version != this.storageVersion
                        || storedObject.expire < new Date().getTime()) {
                        this.removeFromStorage();
                        return false;
                    }
                    this.cards = storedObject.cards;
                    return true;
                }
                saveInStorage() {
                    localStorage.setItem(this.storageKey, JSON.stringify({
                        cards: this.cards,
                        expire: new Date().getTime() + this.storageTimeout,
                        version: this.storageVersion,
                    }));
                }
                removeFromStorage() {
                    localStorage.removeItem(this.storageKey);
                }
                getCards() {
                    return this.cards;
                }
                hasCard(key) {
                    return this.cards[key] != undefined;
                }
                getCard(key) {
                    return this.hasCard(key) ? this.cards[key] : null;
                }
            };
            exports_4("Database", Database);
        }
    };
});
System.register("utils", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var Utils;
    return {
        setters: [],
        execute: function () {
            Utils = class Utils {
                static arrayIncluded(arrayA, arrayB, indexStart) {
                    if (arrayA.length > arrayB.length - indexStart)
                        return false;
                    for (var i = 0; i < arrayA.length; i++) {
                        if (arrayA[i].toUpperCase() != arrayB[i + indexStart].toUpperCase())
                            return false;
                    }
                    return true;
                }
            };
            exports_5("Utils", Utils);
        }
    };
});
System.register("main", ["database", "lexer", "utils"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var database_1, lexer_2, utils_1, database;
    return {
        setters: [
            function (database_1_1) {
                database_1 = database_1_1;
            },
            function (lexer_2_1) {
                lexer_2 = lexer_2_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            database = new database_1.Database();
            database.load()
                .then((base) => {
                let start = new Date().getTime();
                let lexer = new lexer_2.Lexer();
                let posts = document.getElementsByClassName("usertext-body");
                for (var i = 0; i < posts.length; i++) {
                    let message = lexer.parse(posts[i].innerHTML);
                    for (var j = 0; j < message.length; j++) {
                        var word = message[j];
                        let card = base.getCard(word);
                        if (card != undefined && utils_1.Utils.arrayIncluded(card.keywords, message, j)) {
                            message[j] = '<span class="stser-container">'
                                + '<span class="stser-tooltip">'
                                + '<img src="' + card.image + '">'
                                + '</span>'
                                + card.keywords.join(" ")
                                + '</span>';
                            if (card.keywords.length > 1) {
                                message.splice(j + 1, card.keywords.length - 1);
                            }
                            j = j - 1 + card.keywords.length;
                        }
                    }
                    posts[i].innerHTML = message.join("");
                }
                console.log("Executed in " + (new Date().getTime() - start));
            });
        }
    };
});
