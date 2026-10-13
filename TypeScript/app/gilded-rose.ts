const AGED_BRIE = 'Aged Brie';
const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const BACKSTAGE_PASSES = 'Backstage passes to a TAFKAL80ETC concert';
const CONJURED_PREFIX = 'Conjured';

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

function decreaseSellIn(item: Item) {
  item.sellIn = item.sellIn - 1;
}

function updateNormalItem(item: Item) {
  decreaseQuality(item);
  decreaseSellIn(item);

  if (item.sellIn < 0) {
    decreaseQuality(item);
  }
}

function updateAgedBrie(item: Item) {
  increaseQuality(item);
  decreaseSellIn(item);

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

  decreaseSellIn(item);

  if (item.sellIn < 0) {
    item.quality = MIN_QUALITY;
  }
}

function updateConjuredItem(item: Item) {
  decreaseQuality(item);
  decreaseQuality(item);
  decreaseSellIn(item);

  if (item.sellIn < 0) {
    decreaseQuality(item);
    decreaseQuality(item);
  }
}

// Sulfuras is legendary: it never has to be sold and never loses quality, so
// there is nothing to do.
function keepUnchanged() {
}

// Conjured is a family of products rather than a single article, which is why
// it is matched on the name prefix while the others are matched by name.
function updaterFor(item: Item): ItemUpdater {
  if (item.name === SULFURAS) {
    return keepUnchanged;
  }
  if (item.name === AGED_BRIE) {
    return updateAgedBrie;
  }
  if (item.name === BACKSTAGE_PASSES) {
    return updateBackstagePasses;
  }
  if (item.name.startsWith(CONJURED_PREFIX)) {
    return updateConjuredItem;
  }

  return updateNormalItem;
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      const update = updaterFor(item);
      update(item);
    }

    return this.items;
  }
}
