Create a very detailed plan implement the game squardle. 

With detailed I mean:
- Multiple phases
- Lots of code examples
- There should be no ambiguities after reading the plan

The game:
Squardle is a game where players must find words in in A by B grid of letters. See the screenshots for an impression of the game. 

Note:
- letters of a word must be neighbors: horizontally, vertically of diagonally
- letters may only be used once in a word
- words are selected by pressing the mouse down and then dragging over the letters. Mouseup when the word is finished.
- A red line is placed over the selected letters. Use an SVG ovrlay for this.

About the implementaion:
- Look at the current workspace: TypeScript + React + Vitest
- There is already a wordlist
- First implement all the game logic: creating a grid, determine how many words there are in this grid, iterate if there are not enough words, determine if a single word is in a grid, etc. All logic shoud be part of this logic and not live in the React components. This part of the app should be developed test driven.
- Then implement all the needed React components: a letter, a board, a progress bar, a word counter etc.
- Then connect everything together and make sure everything works.

Note:
- Work test driven as much as possible
- Build in a lot of verification steps. This should involve running all tests, linting and manual tests.
- You must have 100% test coverage
- The plan should also describe all the test you are planning to create (implementation not needed, test description are needed)
- Ask questions about anything that is unclear.