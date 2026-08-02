import type { Page } from '@playwright/test';
import photosData from '../../src/assets/photos.json' with { type: 'json' };
import type { PhotoProps } from '../../src/types/PhotoProps';
import { DEFAULT_YEAR } from '../../src/constants';

const photos = photosData as PhotoProps[];

export const expectedYearsAscending = (): number[] => {
  const years = new Set(photos.map((p) => p.year).filter((y) => y != null));
  return [...years].sort((a, b) => a - b);
};

export const photosForYear = (year: number): number =>
  photos.filter((p) => p.year === year).length;

export const defaultYearPhotosCount = (): number =>
  photos.filter((p) => p.year === DEFAULT_YEAR).length;

export const firstDefaultYearPhotoWithAbsentMetadata = (): number => {
  const sorted = photos
    .filter((p) => p.year === DEFAULT_YEAR)
    .sort((a, b) => b.file.localeCompare(a.file));
  const fallbackFields = [
    'createdate',
    'cameramodelname',
    'lensmodel',
    'focallengthin35mmformat',
    'aperturevalue',
    'exposuretime',
    'iso',
    'flash',
  ];
  return sorted.findIndex((p) =>
    fallbackFields.some((f) => !String(p[f as keyof PhotoProps] || '').trim()),
  );
};

export class GalleryPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForSelector('.gallery-card');
  }

  async getGalleryCards() {
    return this.page.locator('.gallery-card');
  }

  async getGalleryCardCount() {
    const cards = await this.getGalleryCards();
    return await cards.count();
  }

  async clickFirstGalleryImage() {
    await this.page.locator('.gallery-card img').first().click();
    await this.page.waitForSelector('.modal.show');
  }

  async clickGalleryImageByIndex(index: number) {
    await this.page.waitForSelector('.gallery-card');
    const cards = await this.getGalleryCards();
    const count = await cards.count();
    if (index < 0 || index >= count) {
      throw new Error(`clickGalleryImageByIndex: index ${index} out of bounds (0..${count - 1})`);
    }
    const card = cards.nth(index);
    await card.locator('img').click();
    await this.page.waitForSelector('.modal.show');
  }

  async getLightboxModal() {
    return this.page.locator('.modal.show');
  }

  async getLightboxTitle() {
    return this.page.locator('.modal-title');
  }

  async getLightboxImage() {
    return this.page.locator('.modal.show img[src*="lightbox/"]');
  }

  async getPrevButton() {
    return this.page.getByRole('button', { name: /← Previous/i });
  }

  async getNextButton() {
    return this.page.getByRole('button', { name: /Next →/i });
  }

  async closeLightbox() {
    const closeButton = this.page.locator('.btn-close');
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
    await this.page.waitForSelector('.modal.show', { state: 'hidden' });
  }

  async navigateLightboxNext() {
    const nextButton = await this.getNextButton();
    await nextButton.click();
  }

  async navigateLightboxPrev() {
    const prevButton = await this.getPrevButton();
    await prevButton.click();
  }

  async getExifMetadata() {
    const metadata: Record<string, string> = {};

    const exifLabels = [
      'Photo was taken',
      'Body',
      'Lens',
      'Focal length 35mm equivalent',
      'Aperture',
      'Exposure',
      'ISO',
      'Flash',
      'Copyright'
    ];

    for (const label of exifLabels) {
      const labelElement = this.page.locator(`.exif-label:has-text("${label}")`);
      if (await labelElement.isVisible()) {
        const valueElement = this.page.locator(`.exif-label:has-text("${label}") + .exif-value, .exif-label:has-text("${label}") ~ .exif-value`).first();
        const value = await valueElement.textContent();
        metadata[label] = value || '';
      }
    }

    return metadata;
  }

  async clickYearFilter(year: number) {
    await this.page.locator('nav').getByRole('button', { name: String(year) }).click();
    await this.page.waitForTimeout(100);
  }

  async getYearFilterLinks() {
    return this.page.locator('nav a').filter({ hasText: /^\d{4}$/ });
  }

  async isLightboxOpen() {
    const modal = await this.getLightboxModal();
    return await modal.isVisible();
  }

  async getCurrentPhotoInfo() {
    const title = await this.getLightboxTitle();
    const titleText = await title.textContent();

    // Extrahiere Photo X of Y aus dem Titel
    const match = titleText?.match(/Photo (\d+) of (\d+)/);

    return {
      title: titleText,
      current: match ? parseInt(match[1]) : 0,
      total: match ? parseInt(match[2]) : 0
    };
  }
}

export async function measurePerformance<T>(
  _page: Page,
  action: () => Promise<T>,
  description: string
): Promise<{ result: T; duration: number }> {
  const startTime = Date.now();
  const result = await action();
  const duration = Date.now() - startTime;

  console.log(`${description}: ${duration}ms`);
  return { result, duration };
}

export function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
