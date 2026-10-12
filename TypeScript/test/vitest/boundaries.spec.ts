import { Item, GildedRose } from '@/gilded-rose';

/**
 * Sweeps every item name against the sellIn and quality boundaries and records
 * the result as a snapshot. This captures what the code does today, bugs
 * included, so the refactoring has something to break against. The thirtyDays
 * approval only exercises one value per item.
 */

const names = [
  '+5 Dexterity Vest',
  'Aged Brie',
  'Elixir of the Mongoose',
  'Sulfuras, Hand of Ragnaros',
  'Backstage passes to a TAFKAL80ETC concert',
  'Conjured Mana Cake',
  'Unknown Trinket'
];

// 51 is out of spec on purpose: the legacy code does not clamp an item that
// arrives above the ceiling, and that counts as behaviour to preserve.
const qualities = [0, 1, 2, 48, 49, 50, 51];

const sellIns = Array.from({ length: 14 }, (_, i) => i - 1);

const DAYS = 3;

function sweep(): string {
  const lines: string[] = [];

  names.forEach(name => {
    sellIns.forEach(sellIn => {
      qualities.forEach(quality => {
        const item = new Item(name, sellIn, quality);
        const gildedRose = new GildedRose([item]);
        const states = [`${item.sellIn}/${item.quality}`];

        for (let day = 0; day < DAYS; day++) {
          gildedRose.updateQuality();
          states.push(`${item.sellIn}/${item.quality}`);
        }

        lines.push(`${name} | ${sellIn} | ${quality} -> ${states.join(' ')}`);
      });
    });
  });

  return lines.join('\n');
}

describe('Gilded Rose boundaries', () => {
  it('should keep the behaviour of every name at the sellIn and quality edges', () => {
    expect(sweep()).toMatchSnapshot();
  });
});
