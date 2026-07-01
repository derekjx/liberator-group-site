# circle-of-life-engine

Shared game engine and React components for **Circle of Life** — a financial life
simulation board game.

This is consumed as a **git submodule** (not an npm package — there's no
`package.json`/build step here, just shared TypeScript/TSX source) by:

- `derekjx/liberator-group-site` — embeds the game behind a lead-capture gate at `/play`
- the standalone Circle of Life prototype app (local, not yet in git)

## Editing

Edit files here, commit, push. Then in each consumer repo:

```
cd <submodule-path>
git pull origin main
cd ../..
git add <submodule-path>
git commit -m "Update circle-of-life-engine submodule"
```

Both consumers will pick up the same fix/change — that's the point of this repo.

## Layout

- `lib/` — game state, engine logic (`game-engine.ts`), types (`game-types.ts`),
  card data (`cards.ts`), and the React context/provider (`game-context.tsx`)
- `components/` — board UI and screens (`Board`, `GameScreen`, `SetupScreen`,
  `CardModal`, `DiceRoller`, `FinancesPanel`, `GameLog`, `MarketPanel`, `QuickTrade`)

All cross-file imports inside this repo are relative (`../lib/...`), not aliased,
so it resolves correctly no matter where a consumer mounts the submodule.
