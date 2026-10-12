import { Item, GildedRose } from '@/gilded-rose';

function updateOnce(name: string, sellIn: number, quality: number): Item {
  const gildedRose = new GildedRose([new Item(name, sellIn, quality)]);
  return gildedRose.updateQuality()[0];
}

const SULFURAS = 'Sulfuras, Hand of Ragnaros';
const BACKSTAGE = 'Backstage passes to a TAFKAL80ETC concert';

describe('Gilded Rose', () => {
  it('should start with no items', () => {
    expect(new GildedRose().updateQuality()).toEqual([]);
  });

  it('should lower sellIn and quality of a normal item', () => {
    const item = updateOnce('+5 Dexterity Vest', 10, 20);

    expect(item.sellIn).toBe(9);
    expect(item.quality).toBe(19);
  });

  it('should degrade a normal item twice as fast after the sell by date', () => {
    expect(updateOnce('+5 Dexterity Vest', 0, 20).quality).toBe(18);
  });

  it('should never lower quality below zero', () => {
    expect(updateOnce('+5 Dexterity Vest', 0, 0).quality).toBe(0);
  });

  it('should improve Aged Brie as it gets older', () => {
    expect(updateOnce('Aged Brie', 5, 10).quality).toBe(11);
  });

  it('should improve Aged Brie twice as fast after the sell by date', () => {
    expect(updateOnce('Aged Brie', 0, 10).quality).toBe(12);
  });

  it('should never raise quality above fifty', () => {
    expect(updateOnce('Aged Brie', 5, 50).quality).toBe(50);
  });

  it('should never change Sulfuras', () => {
    const item = updateOnce(SULFURAS, 0, 80);

    expect(item.sellIn).toBe(0);
    expect(item.quality).toBe(80);
  });

  it('should raise backstage passes by one with more than ten days left', () => {
    expect(updateOnce(BACKSTAGE, 11, 20).quality).toBe(21);
  });

  it('should raise backstage passes by two with ten days or less left', () => {
    expect(updateOnce(BACKSTAGE, 10, 20).quality).toBe(22);
  });

  it('should raise backstage passes by three with five days or less left', () => {
    expect(updateOnce(BACKSTAGE, 5, 20).quality).toBe(23);
  });

  it('should drop backstage passes to zero after the concert', () => {
    expect(updateOnce(BACKSTAGE, 0, 20).quality).toBe(0);
  });
});
