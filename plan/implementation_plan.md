# Squardle Game Implementation Plan

## Game Requirements

| Feature | Value |
|---------|-------|
| Grid Size | Configurable (default 4×4) |
| Min Word Length | 4 letters |
| Timer | None (untimed) |
| Scoring | Fibonacci: 4→5, 5→8, 6→13, 7→21, 8→34 pts |

---

## Critical Rules

> [!CAUTION]
> **STOP-ON-FAILURE**: Do NOT proceed if ANY verification fails. Fix issues first.

---

## Code Examples

All complete code examples are in these files:
- [Phase 1 Code (Part 1)](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code.md) - types, grid, neighbors
- [Phase 1 Code (Part 2)](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code_part2.md) - validators, scoring, word finder, generator
- [Phase 2 Code](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase2_code.md) - React components, hooks, integration

---

## Phase 1: Core Game Logic (TDD)

### Step 1.1: Types Module
**Create**: `src/game/types.ts`
**Code**: See [phase1_code.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code.md#11-types-module)

#### 🔴 CHECKPOINT 1.1
```bash
npx tsc src/game/types.ts --noEmit --strict
```

---

### Step 1.2: Grid Module
**Create**: `src/game/grid.ts`, `src/game/__tests__/grid.test.ts`
**Code**: See [phase1_code.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code.md#12-grid-module)

| Test | Expected |
|------|----------|
| createEmptyGrid dimensions | 4x4 grid |
| createEmptyGrid empty letters | All '' |
| createGridFromLetters | 2D → Grid |
| getLetterAt valid/invalid | Letter / null |
| isValidPosition | true/false |
| getWordFromPath | Path → word |

#### 🔴 CHECKPOINT 1.2
```bash
pnpm test:run src/game/__tests__/grid.test.ts
pnpm lint src/game/grid.ts
```

---

### Step 1.3: Neighbors Module
**Create**: `src/game/neighbors.ts`, `src/game/__tests__/neighbors.test.ts`
**Code**: See [phase1_code.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code.md#13-neighbors-module)

| Test | Expected |
|------|----------|
| getNeighbors center | 8 neighbors |
| getNeighbors corner | 3 neighbors |
| areNeighbors adjacent | true |
| areNeighbors same | false |
| isPositionInPath | true/false |

#### 🔴 CHECKPOINT 1.3
```bash
pnpm test:run src/game/__tests__/neighbors.test.ts
pnpm lint src/game/neighbors.ts
```

---

### Step 1.4: Path Validator Module
**Create**: `src/game/pathValidator.ts`, `src/game/__tests__/pathValidator.test.ts`
**Code**: See [phase1_code_part2.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code_part2.md#14-path-validator-module)

| Test | Expected |
|------|----------|
| validatePath empty | valid |
| validatePath horizontal | valid |
| validatePath non-adjacent | invalid |
| validatePath repeated | invalid |
| canAddToPath neighbor | true |
| canAddToPath already used | false |

#### 🔴 CHECKPOINT 1.4
```bash
pnpm test:run src/game/__tests__/pathValidator.test.ts
pnpm lint src/game/pathValidator.ts
```

---

### Step 1.5: Word Validator Module
**Create**: `src/game/wordValidator.ts`, `src/game/__tests__/wordValidator.test.ts`
**Code**: See [phase1_code_part2.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code_part2.md#15-word-validator-module)

| Test | Expected |
|------|----------|
| isValidWord valid | true |
| isValidWord invalid | false |
| meetsLengthRequirement | true/false |

#### 🔴 CHECKPOINT 1.5
```bash
pnpm test:run src/game/__tests__/wordValidator.test.ts
pnpm lint src/game/wordValidator.ts
```

---

### Step 1.6: Scoring Module
**Create**: `src/game/scoring.ts`, `src/game/__tests__/scoring.test.ts`
**Code**: See [phase1_code_part2.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code_part2.md#16-scoring-module)

| Test | Expected |
|------|----------|
| 4-letter | 5 pts |
| 5-letter | 8 pts |
| 6-letter | 13 pts |
| 7-letter | 21 pts |
| calculateTotalScore | sum |

#### 🔴 CHECKPOINT 1.6
```bash
pnpm test:run src/game/__tests__/scoring.test.ts
pnpm lint src/game/scoring.ts
```

---

### Step 1.7: Word Finder Module
**Create**: `src/game/wordFinder.ts`, `src/game/__tests__/wordFinder.test.ts`
**Code**: See [phase1_code_part2.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code_part2.md#17-word-finder-module)

| Test | Expected |
|------|----------|
| findAllWords | finds words |
| findAllWords minLength | respects 4 |
| findWordInGrid exists | path |
| findWordInGrid missing | null |

#### 🔴 CHECKPOINT 1.7
```bash
pnpm test:run src/game/__tests__/wordFinder.test.ts
pnpm lint src/game/wordFinder.ts
```

---

### Step 1.8: Grid Generator Module
**Create**: `src/game/gridGenerator.ts`, `src/game/__tests__/gridGenerator.test.ts`
**Code**: See [phase1_code_part2.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase1_code_part2.md#18-grid-generator-module)

| Test | Expected |
|------|----------|
| generateRandomLetter | A-Z |
| fillGrid | no empty cells |
| generateGrid | ≥20 words |

#### 🔴 CHECKPOINT 1.8
```bash
pnpm test:run src/game/__tests__/gridGenerator.test.ts
pnpm lint src/game/gridGenerator.ts
```

---

### 🔴🔴 PHASE 1 GATE
```bash
pnpm test:run src/game/
pnpm test:coverage src/game/
pnpm lint src/game/
```
**Required**: All pass, 100% coverage, no lint errors.

---

## Phase 2: React Components

All code in [phase2_code.md](file:///home/node/.gemini/antigravity/brain/d0e37825-79cf-458b-8641-8567fae72fc7/phase2_code.md)

### Step 2.1: Letter Component
**Create**: `src/components/Letter.tsx`, `Letter.css`, `__tests__/Letter.test.tsx`

#### 🔴 CHECKPOINT 2.1
```bash
pnpm test:run src/components/__tests__/Letter.test.tsx
pnpm lint src/components/Letter.tsx
```

---

### Step 2.2: SelectionOverlay Component
**Create**: `src/components/SelectionOverlay.tsx`, `SelectionOverlay.css`

#### 🔴 CHECKPOINT 2.2
```bash
pnpm test:run src/components/__tests__/SelectionOverlay.test.tsx
pnpm lint src/components/SelectionOverlay.tsx
```

---

### Step 2.3: Board Component
**Create**: `src/components/Board.tsx`, `Board.css`

#### 🔴 CHECKPOINT 2.3
```bash
pnpm test:run src/components/__tests__/Board.test.tsx
pnpm lint src/components/Board.tsx
```

---

### Step 2.4: UI Components
**Create**: `WordCounter.tsx`, `ScoreDisplay.tsx`, `ProgressBar.tsx`, `CurrentWord.tsx`, `GameControls.tsx`

#### 🔴 CHECKPOINT 2.4
```bash
pnpm test:run src/components/__tests__/
pnpm lint src/components/
```

---

### Step 2.5: useGameState Hook
**Create**: `src/hooks/useGameState.ts`, `src/hooks/__tests__/useGameState.test.ts`

| Test | Expected |
|------|----------|
| initializes grid | valid grid |
| startSelection | path length 1 |
| extendSelection | path grows |
| endSelection valid | score increases |
| endSelection duplicate | ignored |
| resetGame | clears score |
| newGame | new grid |

#### 🔴 CHECKPOINT 2.5
```bash
pnpm test:run src/hooks/__tests__/useGameState.test.ts
pnpm lint src/hooks/
```

---

### Step 2.6: Game Component
**Create**: `src/components/Game.tsx`, `Game.css`

#### 🔴 CHECKPOINT 2.6
```bash
pnpm test:run src/components/__tests__/Game.test.tsx
pnpm lint src/components/Game.tsx
```

---

### 🔴🔴 PHASE 2 GATE
```bash
pnpm test:run
pnpm test:coverage
pnpm lint
```
**Required**: All pass, 100% coverage, no lint errors.

---

## Phase 3: Integration

### Step 3.1: Update App.tsx
Replace Vite demo with `<Game />`.

#### 🔴 CHECKPOINT 3.1
```bash
pnpm test:run
pnpm lint
```

---

### Step 3.2: Manual Browser Test
```bash
pnpm dev
```

**Checklist**:
- [ ] Grid displays
- [ ] Word counter shows "0 / X words"
- [ ] Score shows "0"
- [ ] Drag selection works
- [ ] Red line appears
- [ ] Valid word: score increases
- [ ] Invalid/duplicate: ignored
- [ ] Reset clears progress
- [ ] New game creates new grid

---

### 🔴🔴 PHASE 3 GATE
```bash
pnpm build
pnpm test:coverage
pnpm lint
```
**Required**: Build succeeds, 100% coverage, all manual tests pass.
