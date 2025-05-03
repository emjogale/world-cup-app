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
   - createFirstKnockoutRound() avoids same-group rematches in R16
   - createRoundMatches() used for later rounds
   - User enters results (regular, extra time, penalties)
   - Repeat until 1 team left
   - Display Champion 🎉
```

---

## 🧾 4. Data Shapes

### ✅ Team

```js
{
  name: 'Brazil',
  flag: 'https://flagpedia.net/data/flags/w320/br.png'
}
```

### ✅ Match

```js
{
	team1,
		team2,
		score1,
		score2,
		extraTimeScore1,
		extraTimeScore2,
		penaltyScore1,
		penaltyScore2,
		regularTimePlayed,
		extraTimePlayed,
		showExtraTime,
		showPenalties,
		onScoreChange;
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

## ✅ Testing Strategy Per Stage

-   Qualifiers: fetch test, display test, error fallback test
-   GroupStage: test group logic, test match rendering
-   KnockoutStage: test match results, advancing rounds, penalties and extra time
-   Utility Functions: pure unit tests for shuffle, group, match creation
