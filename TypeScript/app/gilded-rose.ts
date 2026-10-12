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

type ItemUpdater = (item: Item) => void;

function increaseQuality(item: Item) {
  if (item.quality < MAX_QUALITY) {
    item.quality = item.quality + 1;
  }
}

function decreaseQuality(item: Item) {
  if (item.quality > MIN_QUALITY) {
    item.quality = item.quality - 1;
  }
}

function updateNormalItem(item: Item) {
  decreaseQuality(item);
  item.sellIn = item.sellIn - 1;

  if (item.sellIn < 0) {
    decreaseQuality(item);
  }
}

function updateAgedBrie(item: Item) {
  increaseQuality(item);
  item.sellIn = item.sellIn - 1;

  if (item.sellIn < 0) {
    increaseQuality(item);
  }
}

function updateBackstagePasses(item: Item) {
  increaseQuality(item);

  if (item.sellIn < 11) {
    increaseQuality(item);
  }
  if (item.sellIn < 6) {
    increaseQuality(item);
  }

  item.sellIn = item.sellIn - 1;

  if (item.sellIn < 0) {
    item.quality = MIN_QUALITY;
  }
}

// Sulfuras is legendary: it never has to be sold and never loses quality.
function keepUnchanged(item: Item) {
}

const UPDATERS: { [name: string]: ItemUpdater } = {
  [AGED_BRIE]: updateAgedBrie,
  [BACKSTAGE_PASSES]: updateBackstagePasses,
  [SULFURAS]: keepUnchanged
};

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      const update = UPDATERS[item.name] || updateNormalItem;
      update(item);
    }

    return this.items;
  }
}
