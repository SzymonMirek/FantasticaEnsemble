# Fantastica Ensemble (Astro)

Strona zespołu Fantastica Ensemble zbudowana w Astro, z treściami wydarzeń edytowanymi przez Decap CMS (Netlify CMS).

## Szybki start

```bash
npm install
npm run dev
```

## Komendy

```bash
npm run dev
npm run build
npm run preview
```

## Formatowanie

Repo używa Prettiera (z `prettier-plugin-astro`).

```bash
npm run format
npm run format:check
```

## Treści (Content Collections)

Wydarzenia są trzymane jako markdown w:

- `src/content/wydarzenia/` (PL)
- `src/content/events/` (EN)

Każdy plik ma frontmatter zgodny ze schematem kolekcji (wykorzystywane w komponentach renderujących listy/karty wydarzeń).

## CMS (Decap)

Konfiguracja panelu CMS jest w `public/admin/config.yml` i wskazuje foldery kolekcji powyżej.

## Zmienne środowiskowe

Integracja `astro-decap-cms-oauth` wymaga podczas builda zmiennych:

- `OAUTH_GITHUB_CLIENT_ID`
- `OAUTH_GITHUB_CLIENT_SECRET`

W repo jest plik `.env.example` z placeholderami. **Nie commituj** prawdziwych sekretów do `.env` (plik `.env` jest zignorowany przez git).

## Struktura projektu (najważniejsze)

- `src/pages/`: strony
- `src/components/`: komponenty
- `src/layouts/`: layouty (w tym globalny `<head>` i style)
- `public/`: statyczne zasoby i panel admina
