from urllib.request import urlopen
from bs4 import BeautifulSoup
import json;

res = [];

cards = ["Neutral_cards", "Ironclad_cards", "Silent_cards"]
for card in cards:
  page = urlopen('http://slay-the-spire.wikia.com/wiki/' + card).read()
  soup = BeautifulSoup(page, "lxml")

  rows = soup.find("table", class_='article-table').find_all("tr")


  for row in rows:
      cells = row.find_all("td")
      if len(cells):
        keyword = cells[0].get_text().strip("\n")
        img = row.find("img")

        if "data-src" in img.attrs:
          img = img["data-src"]
        else:
          img = img["src"]
        
        res.append({"keywords" : [keyword], "image": img})

print(json.dumps(res, sort_keys=True, indent=4, separators=(',', ': ')))

      