import { test, expect } from '@playwright/test';
import { GalleryPage, measurePerformance } from './helpers';

test.describe('Gallery and Lightbox Tests', () => {
  let galleryPage: GalleryPage;

  test.beforeEach(async ({ page }) => {
    galleryPage = new GalleryPage(page);
    await galleryPage.navigate();
  });

  test('Gallery should load with photos', async () => {
    const cardCount = await galleryPage.getGalleryCardCount();
    expect(cardCount).toBeGreaterThan(0);

    const cards = await galleryPage.getGalleryCards();
    await expect(cards.first()).toBeVisible();
  });

  test('Should open lightbox when clicking gallery image', async () => {
    await galleryPage.clickFirstGalleryImage();

    const isOpen = await galleryPage.isLightboxOpen();
    expect(isOpen).toBeTruthy();

    const lightboxImage = await galleryPage.getLightboxImage();
    await expect(lightboxImage).toBeVisible();

    const title = await galleryPage.getLightboxTitle();
    await expect(title).toContainText('Photo');
  });

  test('Lightbox should display EXIF metadata', async () => {
    await galleryPage.clickFirstGalleryImage();

    const metadata = await galleryPage.getExifMetadata();

    // Überprüfe, dass alle erwarteten Metadaten vorhanden sind
    const expectedLabels = [
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

    for (const label of expectedLabels) {
      expect(metadata[label]).toBeDefined();
      expect(metadata[label].length).toBeGreaterThan(0);
    }
  });

  test('Lightbox navigation should work', async () => {
    await galleryPage.clickFirstGalleryImage();

    const initialInfo = await galleryPage.getCurrentPhotoInfo();

    // Navigiere zum nächsten Bild
    await galleryPage.navigateLightboxNext();

    const nextInfo = await galleryPage.getCurrentPhotoInfo();
    expect(nextInfo.current).toBe(initialInfo.current + 1);

    // Navigiere zurück zum vorherigen Bild
    await galleryPage.navigateLightboxPrev();

    const prevInfo = await galleryPage.getCurrentPhotoInfo();
    expect(prevInfo.current).toBe(initialInfo.current);
  });

  test('Lightbox should close properly', async () => {
    await galleryPage.clickFirstGalleryImage();

    let isOpen = await galleryPage.isLightboxOpen();
    expect(isOpen).toBeTruthy();

    await galleryPage.closeLightbox();

    isOpen = await galleryPage.isLightboxOpen();
    expect(isOpen).toBeFalsy();
  });

  test('Keyboard navigation in lightbox', async ({ page }) => {
    await galleryPage.clickFirstGalleryImage();

    const initialInfo = await galleryPage.getCurrentPhotoInfo();

    // Pfeil rechts für nächstes Bild
    await page.keyboard.press('ArrowRight');

    const nextInfo = await galleryPage.getCurrentPhotoInfo();
    expect(nextInfo.current).toBe(initialInfo.current + 1);

    // Pfeil links für vorheriges Bild
    await page.keyboard.press('ArrowLeft');

    const prevInfo = await galleryPage.getCurrentPhotoInfo();
    expect(prevInfo.current).toBe(initialInfo.current);

    // Escape zum Schließen
    await page.keyboard.press('Escape');

    const isOpen = await galleryPage.isLightboxOpen();
    expect(isOpen).toBeFalsy();
  });

  test('Performance: Gallery load time', async ({ page }) => {
    const { duration } = await measurePerformance(
      page,
      async () => {
        await page.goto('/');
        await page.waitForSelector('.gallery-card', { state: 'visible' });
      },
      'Gallery load'
    );

    expect(duration).toBeLessThan(5000); // Unter 5 Sekunden
  });

  test('Performance: Lightbox open time', async ({ page }) => {
    await galleryPage.navigate();

    const { duration } = await measurePerformance(
      page,
      async () => {
        await galleryPage.clickFirstGalleryImage();
      },
      'Lightbox open'
    );

    expect(duration).toBeLessThan(1000); // Unter 1 Sekunde
  });

  test('Year filter should change gallery card count', async () => {
    const cardCount = await galleryPage.getGalleryCardCount();

    await galleryPage.clickYearFilter(2022);
    const count2022 = await galleryPage.getGalleryCardCount();
    expect(count2022).toBeLessThan(cardCount);
    expect(count2022).toBe(43);

    await galleryPage.clickYearFilter(2023);
    const count2023 = await galleryPage.getGalleryCardCount();
    expect(count2023).toBe(63);
  });

  test('Year filter links should be derived from data and include all years', async () => {
    const yearLinks = await galleryPage.getYearFilterLinks();
    const yearTexts = await yearLinks.allTextContents();
    const years = yearTexts.map((t) => parseInt(t.trim()));
    years.sort((a, b) => a - b);
    expect(years).toEqual([2022, 2023, 2024, 2025]);
  });

  test('Lightbox correctly reflects filter changes across sessions', async () => {
    await galleryPage.clickFirstGalleryImage();
    const info1 = await galleryPage.getCurrentPhotoInfo();
    expect(info1.total).toBe(69);

    await galleryPage.closeLightbox();
    await galleryPage.clickYearFilter(2022);
    await galleryPage.clickFirstGalleryImage();
    const info2 = await galleryPage.getCurrentPhotoInfo();
    expect(info2.total).toBe(43);
  });

  test('Lightbox clamps index when filter changes reduce photo count', async ({ page }) => {
    await galleryPage.clickFirstGalleryImage();
    const info1 = await galleryPage.getCurrentPhotoInfo();
    expect(info1.total).toBe(69);

    for (let i = 0; i < 68; i++) {
      await galleryPage.navigateLightboxNext();
    }
    expect((await galleryPage.getCurrentPhotoInfo()).current).toBe(69);

    // Programmatically click 2022 filter through modal overlay
    await page.evaluate(() => {
      const links = document.querySelectorAll('nav a[role="button"]');
      for (const link of links) {
        if (link.textContent?.trim() === '2022') {
          (link as HTMLElement).click();
          break;
        }
      }
    });

    await page.waitForTimeout(500);
    const infoAfter = await galleryPage.getCurrentPhotoInfo();
    expect(infoAfter.current).toBe(43);
    expect(infoAfter.total).toBe(43);
  });

  test('Lightbox resilience: renders without crash and metadata has fallback values', async ({ page }) => {
    await galleryPage.clickFirstGalleryImage();

    const isOpen = await galleryPage.isLightboxOpen();
    expect(isOpen).toBeTruthy();

    // Navigate through several photos to exercise boundary conditions
    // targeting a photo with known null metadata fields (index 21 has lensmodel and aperturevalue null)
    const { total } = await galleryPage.getCurrentPhotoInfo();
    const targetIndex = Math.min(21, total - 1);
    for (let i = 0; i < targetIndex; i++) {
      await galleryPage.navigateLightboxNext();
    }

    // Verify all 8 EXIF metadata fields have content (including fallback)
    const metadata = await galleryPage.getExifMetadata();
    const expectedLabels = [
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
    for (const label of expectedLabels) {
      expect(metadata[label]).toBeDefined();
      expect(metadata[label]!.length).toBeGreaterThan(0);
    }

    // Verify the em-dash fallback character is rendered for null metadata fields
    const fallbackCount = await page.locator('.exif-value').filter({ hasText: '—' }).count();
    expect(fallbackCount).toBeGreaterThan(0);

    // Close via keyboard
    await page.keyboard.press('Escape');
    const stillOpen = await galleryPage.isLightboxOpen();
    expect(stillOpen).toBeFalsy();
  });
});
