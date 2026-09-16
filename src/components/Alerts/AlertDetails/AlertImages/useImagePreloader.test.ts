import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useImagePreloader } from './useImagePreloader';

const makeUrls = (n: number) =>
  Array.from({ length: n }, (_, i) => `https://example/${i.toString()}`);

interface SettableImage {
  src: string;
}

let createdImages: SettableImage[] = [];
let originalImage: typeof Image;

beforeEach(() => {
  createdImages = [];
  originalImage = globalThis.Image;
  // @ts-expect-error -- minimal Image stub for test
  globalThis.Image = class {
    private _src = '';
    set src(value: string) {
      this._src = value;
      createdImages.push({ src: value });
    }
    get src() {
      return this._src;
    }
  };
});

afterEach(() => {
  globalThis.Image = originalImage;
  vi.restoreAllMocks();
});

describe('useImagePreloader', () => {
  it('preloads window of 5 back / 20 forward, clamped at start of sequence', () => {
    const urls = makeUrls(50);
    renderHook(() =>
      useImagePreloader({
        cacheKey: 1,
        urls,
        currentIndex: 0,
        framesBackward: 5,
        framesForward: 20,
      })
    );

    const requested = new Set(createdImages.map((img) => img.src));
    // 0 (current) + 1..20 forward = 21 unique URLs preloaded
    expect(requested.size).toBe(21);
    expect(requested.has(urls[0])).toBe(true);
    expect(requested.has(urls[20])).toBe(true);
    expect(requested.has(urls[21])).toBe(false);
  });

  it('does not re-request URLs already preloaded across renders', () => {
    const urls = makeUrls(50);
    const { rerender } = renderHook(
      ({ idx }: { idx: number }) =>
        useImagePreloader({
          cacheKey: 1,
          urls,
          currentIndex: idx,
          framesBackward: 5,
          framesForward: 20,
        }),
      { initialProps: { idx: 0 } }
    );

    const initialCount = createdImages.length;

    // Move forward by 1; the new window should overlap heavily with the
    // previous one and request only 1 new URL (index 21).
    rerender({ idx: 1 });
    expect(createdImages.length).toBe(initialCount + 1);
    expect(createdImages[createdImages.length - 1].src).toBe(urls[21]);
  });

  it('clamps the window at the end of the sequence', () => {
    const urls = makeUrls(10);
    renderHook(() =>
      useImagePreloader({
        cacheKey: 1,
        urls,
        currentIndex: 9,
        framesBackward: 5,
        framesForward: 20,
      })
    );

    const requested = new Set(createdImages.map((img) => img.src));
    // indices 4..9 = 6 URLs; nothing past length-1
    expect(requested.size).toBe(6);
    expect(requested.has(urls[4])).toBe(true);
    expect(requested.has(urls[9])).toBe(true);
  });

  it('handles empty url list without throwing', () => {
    expect(() =>
      renderHook(() =>
        useImagePreloader({
          cacheKey: 1,
          urls: [],
          currentIndex: 0,
          framesBackward: 5,
          framesForward: 20,
        })
      )
    ).not.toThrow();
    expect(createdImages.length).toBe(0);
  });

  it('clears the requested-urls set when cacheKey changes', () => {
    const seqA = makeUrls(5);
    const seqB = makeUrls(5).map((u) => u.replace('example', 'other'));

    const { rerender } = renderHook(
      ({ key, urls }: { key: number; urls: string[] }) =>
        useImagePreloader({
          cacheKey: key,
          urls,
          currentIndex: 0,
          framesBackward: 5,
          framesForward: 20,
        }),
      { initialProps: { key: 1, urls: seqA } }
    );

    const afterSeqA = createdImages.length;
    expect(afterSeqA).toBe(5);

    // Same cacheKey, same urls: no new requests.
    rerender({ key: 1, urls: seqA });
    expect(createdImages.length).toBe(afterSeqA);

    // Different cacheKey: Set clears, all 5 of seqB get preloaded.
    rerender({ key: 2, urls: seqB });
    expect(createdImages.length).toBe(afterSeqA + 5);
    const lastFive = createdImages.slice(-5).map((img) => img.src);
    expect(lastFive).toEqual(seqB);
  });
});
