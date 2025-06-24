# 🧪 React Testing Cheat Sheet (Jest + Testing Library)

This guide covers the most common patterns and techniques when writing tests for React components using **Jest** and **React Testing Library**.

---

## ✅ No-op Callback

Use when a component expects a function, but you don’t need to test it:

```js
onSomething={() => {}}
```

🕵️‍♀️ Spy on a Callback
To ensure a function is called (and with correct args):

```js
const mockFn = jest.fn();
render(<MyComponent onComplete={mockFn} />);
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(expectedArg);
```

🧪 Mock a Utility Function
Mock an individual helper:

```js
import * as utils from '../utils/helpers';

jest.spyOn(utils, 'myHelper').mockReturnValue('mocked');
```

Mock an entire module:

```js
jest.mock('../utils/api');
```

🧹 Clean Up Between Tests
Ensure test isolation:

```js
afterEach(() => {
	jest.clearAllMocks();
});
```

🔍 Query the DOM

```js
screen.getByText(/Submit/i); // by text
screen.getByTestId('score-Brazil-vs-Germany-1'); // custom test ID
screen.getByRole('button', { name: /submit/i }); // by role + label
```

🧪 Simulate User Actions

```js
fireEvent.click(button);
userEvent.type(input, '3');
userEvent.selectOptions(select, 'option1');
```

🧮 Assert Output or Calls

```js
expect(input).toHaveValue(2);
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith('Asia', expect.any(Array));
```

⏲️ Test Timers / Effects

```js
jest.useFakeTimers();
jest.runAllTimers(); // or jest.advanceTimersByTime(1000);
```

🎯 Matchers Reference
Matcher Use
toBe() primitive equality
toEqual() deep object/array equality
toBeNull() / toBeUndefined() nullish
toBeTruthy() / toBeFalsy() truthy/falsy
toContain() substring or array item
toMatch() regex on strings
toHaveBeenCalledWith(...) function args

🚦 Misc
Use userEvent (from @testing-library/user-event) for more realistic interaction than fireEvent.

Add data-testid for precise selectors in testing.

Group related tests in describe(...) blocks.

💡 TDD Philosophy Reminders
✅ Write the test first, even for UI

🔴 See it fail, so you know it's valid

🟢 Make it pass, with the simplest fix

🧼 Clean it up, then move on

“You aren't done when it works, you're done when it's tested and clean.”
