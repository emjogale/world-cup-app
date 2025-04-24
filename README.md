# 🧭 World Cup App Overview

## 🎮 1. UI Flow

```
[Qualifiers View]
   ↓ Start Tournament
[Group Stage View]
   ↓ Advance winners
[Knockout Stage View]
   ↓ Repeat
[Final Winner]
```

---

## 🧩 2. Component Structure

```jsx
<App>
├── <Qualifiers />        // shows all teams with flags
├── <GroupStage />        // shows grouped teams in tables
│   └── <GroupTable />    // optional: renders each group
├── <KnockoutStage />        // knockout stage matches
│   └── <Match />         // 1 vs 1 match with score input
```

---

## ⚙️ 3. Logic Flow

```
1. App fetches /teams.json
2. Shuffle teams → save in state

3. QUALIFIERS STAGE
   • Show all teams
   • Button: Start Tournament

4. GROUP STAGE
   • Use shuffled teams → groupTeams()
   • Generate group fixtures
   • User enters results
   • Call getWinners() for each group

5. KNOCKOUT STAGE
   - createFirstKnockoutRound(winners, second place and best thirds from Group Stage)
   - createRoundMatches
   - User enters results
   - Repeat until 1 team left
```

---

## 🧾 4. Data Shapes

### ✅ Team

```js
{
  name: 'Brazil',
  flag: 'https://flagcdn.com/w320/br.png'
}
```

### ✅ Match

```js
{
  team1: 'Brazil',
  team2: 'Germany',
  score1: 2,
  score2: 1
}
```

### ✅ Group

```js
{
  groupName: 'A',
  teams: ['Brazil', 'Germany', 'France', 'Japan']
}
```

---

## ✅ TDD Strategy Per Stage

-   Qualifiers: fetch test, display test, error fallback test
-   GroupStage: test group logic, test match rendering
-   Tournament: test match results, advancing rounds
-   Utility Functions: pure unit tests for shuffle, group, match creation
