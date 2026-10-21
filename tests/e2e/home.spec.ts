import { expect, test } from "@playwright/test";

test("l'accueil affiche directement les domaines", async ({ page }) => {
  await page.goto("/");

  for (const domain of ["Espace", "Nature", "Histoire", "Sciences", "Psychologie", "Géographie"]) {
    await expect(page.getByRole("link", { name: new RegExp(domain) })).toBeVisible();
  }

  await expect(page.getByRole("heading", { name: /Le monde est plus vaste/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /À découvrir ensuite/i })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /La curiosité est un beau début/i })).toHaveCount(0);
});

test("la bibliothèque filtre les fiches", async ({ page }) => {
  await page.goto("/bibliotheque");
  await expect(page.getByRole("heading", { name: /Explorer la bibliothèque/i })).toBeVisible();
  await page.getByRole("textbox", { name: /Rechercher dans la bibliothèque/i }).fill("trous noirs");
  await expect(page.getByRole("heading", { name: "Les trous noirs" })).toBeVisible();
});
