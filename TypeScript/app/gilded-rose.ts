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

function updateConjuredItem(item: Item) {
  decreaseQuality(item);
  decreaseQuality(item);
  item.sellIn = item.sellIn - 1;

  if (item.sellIn < 0) {
    decreaseQuality(item);
    decreaseQuality(item);
  }
}

// Sulfuras is legendary: it never has to be sold and never loses quality, so
// there is nothing to do. The lookup entry below is still required: without it
// the name falls through to updateNormalItem and the item starts degrading.
function keepUnchanged() {
}

const UPDATERS: { [name: string]: ItemUpdater } = {
  [AGED_BRIE]: updateAgedBrie,
  [BACKSTAGE_PASSES]: updateBackstagePasses,
  [SULFURAS]: keepUnchanged
};

// Conjured is a family of products rather than a single item, so it is matched
// on the name prefix and not through the lookup.
function updaterFor(item: Item): ItemUpdater {
  if (item.name.startsWith(CONJURED_PREFIX)) {
    return updateConjuredItem;
  }

  return UPDATERS[item.name] || updateNormalItem;
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (const item of this.items) {
      updaterFor(item)(item);
    }

    return this.items;
  }
}
