



Source:
https://www.youtube.com/watch?v=ifTF3ags0XI


💻 The Command Pallete:

    🔳 (Pallete) CTRL + P
    - brings the command pallete
    - by default gives recently opened files
    - and a file searchbar
    - typing right angle bracket brings up commands



🌐 Navigating up and down a big file:

    ❌ Instead of scrolling,

    🔳 CTRL + F
    to text search

    🔳 (Pallete) CTRL + P, "@"
    it will provide a truncated list of all the sections
    including functions and scopes and variables
    which makes it easier to traverse!

    ⭐🔳 CTRL + SHIFT + .
    will bypass the command pallete altogether
    and you can directly search the symbols!


🎨 Throughout the entire project:

    ❌ Instead of navigating the file structure dropdown menu,

    🔳 Pallete, "#......"
    Allows you to search for a symbol throughout the entire project
    Tip: you can also type the abbreviation of a long camelcase name to find it (example: "#NAR" --> finds... "NextAPIResponse")

    🔳 Shift + Alt + F12,
    or right clicking a function > Find All References
    will select all the references of that function throughout the project
    then, right click it again and select > "rename symbol" option to rename it everywhere


📎 Editing Lines

    ❌ Instead of scrolling and clicking the line with your mouse,

    🔳 CTRL + G
    Type in the line number, and ENTER, and you'll start there!

    ⬇️🔳 Hold CTRL, while clicking left and right arrow keys
    To move word by word, instead of character by character

    ❌ Instead of CTRL + F and replacing every instance of a word manually

    🔳 CTRL + D
    A selected word your typy cursor is on to find all matches of it
    
    🔳 CTRL + D (x2)
    Hitting CTRL + D AGAIN (x2) will edit all instances of that word with whatever you type, showing multiple cursors! (multiline editing)

    Tip:
    🔳 ALT + clicking wherever,
    Sets up multiple cursors on those lines, allowing for multiline editing in that way
    (This is typically used for matching opening and closing HTML tags, though the AutoRenameTag extension can easily help with that automatically too)

    ❌ Instead of manually copy pasting lines to move them around,

    🔳 CTRL + X
    Cuts the line you're on without highlighting

    ⬇️🔳 Hold ALT
    & click the up and down arrows to easily move all the lines you've selected, or the line your cursor is on, up and down

    ⬇️🔳 Hold ALT + SHIFT
    will alternatively, copy the line up and down

    ❌ Instead of manually commenting out lines,

    🔳 CTRL + L
    to highlight entire lines

    🔳 CTRL + /
    to toggle comments on/off on the selected lines


    Exercise:
    4
    5
    6
    1
    2
    3

    - go to the line starting at 1, using CTRL G
    - highlight 1-3 with ctrl L
    - use ALT + ⬆️⬇️ to reorder the lines

    1
    2
    3
    4
    5
    6
    ✅

🔌 Helpful Extensions!

    The "Add JSDoc Comments" Extension
    allows you to highlight a function, and use the command pallete ">Add Doc Comments" to add JSDoc Comments to your function automatically
    Tip: use the {@link otherFunctionName} to easily link to other functions in your JSDoc Extension

    Installing "the Better Comments" Extension:
    anything comment that begins with ! is red, like danger
    any comments that begin with TODO, become orange

    The "Paste JSON as Code" Extension
    lets you easily convert JSON objects into TypeScript schemas, easily infering types saving hours of work


🪟 The Terminal:

    ❌ Instead of manually clicking View -> Terminal,

    🔳 Ctrl + `
    Toggle terminal, opens it in your default shell

    In the terminal, you can add multiple other terminals, rename them, and color code them, for ease

    ⬇️🔳 hold Ctrl w/ the left and right arrows,
    to switch between words instead of indiviual characters

    🔳 Ctrl + K
    clear the terminal

    🔳⬆️/⬇️
    view terminal history and do previous commands to rerun it easily

    Command Pallete ">tasks: Configure default build task"
    A JSON config that runs a command in the terminal
    then you can easily create tasks, and run them via the command pallete ">Taskname"

    Possible use case: Create a shorthand to run the dev server and run the tests
    See if tasks can take in args also


The tutorial goes through git stuff...

Create Snippets
Command Pallete ">configure user snippets"
You can create global snippets, or snippets used for a specific workspace
Modify the json file, and use the insert snippet command to add it in

Before building your own, check the extensions panel for prebuilt snippets
Such as the "Awesome Flutter Snippets"

when creating file folders, naming it with slashes like "deeply/nested/page.tsx" will auto create all the folders for that path



Exercises:

- Research what extensions are modern and up to date and would be good for the project
- Research using vscode in other environments like other game engines, and what plugins combine well with them
- Plan out the rest of the implementation of phase 2, noting the keybinds I will use to navigate the project along the way, trying to use the file explorer tab minimally
- Streamline npm run dev, and npm run test, with easy vscode tasks






