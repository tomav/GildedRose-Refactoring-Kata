const AGED_BRIE = 'Aged Brie';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';

const MIN_QUALITY = 0;
const MAX_QUALITY = 50;

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      this.updateItem(item);
    }

    return this.items;
  }

  private updateItem(item: Item) {
    if (item.name != AGED_BRIE && item.name != BACKSTAGE_PASSES) {
      if (item.name != SULFURAS) {
        this.decreaseQuality(item);
      }
    } else {
      this.increaseQuality(item);
      if (item.name == BACKSTAGE_PASSES) {
        if (item.sellIn < 11) {
          this.increaseQuality(item);
        }
        if (item.sellIn < 6) {
          this.increaseQuality(item);
        }
      }
    }
    if (item.name != SULFURAS) {
      item.sellIn = item.sellIn - 1;
    }
    if (item.sellIn < 0) {
      if (item.name != AGED_BRIE) {
        if (item.name != BACKSTAGE_PASSES) {
          if (item.name != SULFURAS) {
            this.decreaseQuality(item);
          }
        } else {
          item.quality = MIN_QUALITY;
        }
      } else {
        this.increaseQuality(item);
      }
    }
  }

  private increaseQuality(item: Item) {
    if (item.quality < MAX_QUALITY) {
      item.quality = item.quality + 1;
    }
  }

  private decreaseQuality(item: Item) {
    if (item.quality > MIN_QUALITY) {
      item.quality = item.quality - 1;
    }
  }
}
