import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('browses every category, filters and restores the catalogue', async ({
  page,
}) => {
  await expect(page.getByRole('article')).toHaveCount(12)
  await expect(page.getByRole('heading', { level: 2 })).toHaveText([
    'Podcasts',
    'Articles',
    'Newsletters',
    'Recipes',
    'Fitness',
    'Meditation',
  ])
  await page.getByRole('searchbox').fill('  SLEEP  ')
  await expect(page.getByRole('article')).toHaveCount(2)
  await page.getByRole('button', { name: 'Clear search' }).click()
  await expect(page.getByRole('article')).toHaveCount(12)
  await page.getByRole('searchbox').fill('nothing matches this')
  await expect(page.getByRole('status')).toContainText('0 resources')
  await page.getByRole('button', { name: 'Show all resources' }).click()
  await expect(page.getByRole('article')).toHaveCount(12)
})

test('sorts categories and dates without losing grouping', async ({ page }) => {
  const sort = page.getByRole('combobox', { name: 'Sort resources' })
  await sort.selectOption('category-asc')
  await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText(
    'Articles',
  )
  await sort.selectOption('newest')
  const podcasts = page.getByRole('region', { name: 'Podcasts', exact: true })
  await expect(podcasts.getByRole('heading', { level: 3 })).toHaveText([
    'A Little More Balance',
    'Mindful Moments',
  ])
  await sort.selectOption('oldest')
  await expect(podcasts.getByRole('heading', { level: 3 })).toHaveText([
    'Mindful Moments',
    'A Little More Balance',
  ])
})

test('opens details from the keyboard, contains focus and returns it on Escape', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: 'View Mindful Moments' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Mindful Moments' })
  await expect(dialog).toBeVisible()
  const close = dialog.getByRole('button', { name: 'Close resource details' })
  await expect(close).toBeFocused()
  await expect(dialog.getByText('10 July 2025')).toBeVisible()
  await page.keyboard.press('Tab')
  // Native dialogs contain tab focus; the document itself may be the active
  // element at the wrap boundary, but no background control may receive it.
  expect(
    await page.evaluate(() => {
      const active = document.activeElement
      return active === document.body || !!active?.closest('dialog')
    }),
  ).toBe(true)
  await page.keyboard.press('Shift+Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await close.click()
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('keeps content usable when every remote thumbnail fails', async ({
  page,
}) => {
  await page.route('https://www.datocms-assets.com/**', (route) =>
    route.abort(),
  )
  await page.reload()
  await expect(
    page.getByRole('article').first().getByRole('img'),
  ).toHaveAttribute('aria-label', /Image unavailable/)
  await page.getByRole('button', { name: 'View Mindful Moments' }).click()
  await expect(
    page.getByRole('dialog').getByText('Mindful Moments', { exact: true }),
  ).toBeVisible()
})

test('has no horizontal overflow and passes automated accessibility checks', async ({
  page,
}, testInfo) => {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(results.violations).toEqual([])
  for (const card of await page.getByRole('article').all()) {
    await card.scrollIntoViewIfNeeded()
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({
    path: `test-results/previews/${testInfo.project.name}.png`,
    fullPage: true,
  })
  await page.getByRole('button', { name: 'View Mindful Moments' }).click()
  const dialogResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(dialogResults.violations).toEqual([])
  await page.screenshot({
    path: `test-results/previews/${testInfo.project.name}-details.png`,
  })
})
