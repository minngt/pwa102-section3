# Lesson 03 Key Takeaways

## Environment Variables

### Overview

- File `.env` saves the enviroments variables discretely from the codebase.
- Advantages:
  - Keeps sensitive information like token, username, password secure.
  - Makes it easier to manage different configurations for different environments (development, staging, production) without changing the code.

### Basic Concepts

1. Install the package `npm install dotenv`.
2. Project structure:

    ```
    project-root/
    ├── .env
    ├── .env.example 
    ├── playwright.config.js
    └── package.json
    ```

Where: `.env.example` is a template file that lists all the environment variables your application needs, without actual sensitive values.

3. Load the environment variables in playwright config file:

    ```typescript
    import { defineConfig } from '@playwright/test';
    import dotenv from 'dotenv';

    dotenv.config();

    export default defineConfig({
        use: {
        baseURL: process.env.BASE_URL,
    },
    });
    ```

4. Access the environment variables in your tests:

    ```typescript
    test('login', async ({ page }) => {
        await page.fill('#username', process.env.USERNAME!);
        await page.fill('#password', process.env.PASSWORD!);
    });
    ```

5. Manage different environments by creating separate `.env` files (e.g., `.env.dev`, `.env.prod`) and loading the appropriate one based on the environment.

```dotenv.config({ path: `.env.${process.env.ENV || 'dev'}` })```;

We can set the `ENV` variable when running the tests to switch between environments. If it's not set, it defaults to `dev`.

6. Best Practices:
   - Never commit `.env` files with sensitive information to version control. Add `.env`, `.env.*` to `.gitignore`.
   - Use `.env.example` to document required environment variables. Add `!.env.example` to gitignore to make it tracked.
   - Naming convention: SCREAMING_SNAKE_CASE, all uppercase with underscores, prefixed with the application or module name.

**Auth**

AUTH_USERNAME=admin

AUTH_PASSWORD=secret

AUTH_API_KEY=xyz123

**Database**

DB_HOST=localhost

DB_PORT=5432

DB_NAME=testdb

**App URLs**

APP_BASE_URL=https://app.example.com

APP_API_URL=https://api.example.com

**Playwright settings**

PW_TIMEOUT=30000

PW_RETRIES=2

PW_WORKERS=4

## Crontab

### Overview

- Crontab is a Unix-based utility that allows scheduling of scripts or commands to run automatically at specified intervals.

### Why do we need it?

- Automate repetitive tasks such as backups, system maintenance or email notifications.
- Save time by eliminating the need for manual execution of tasks.
- Run tasks during off-peak hours to prevent system overload.
- Trustworthy and reliable for scheduling tasks.

### Basic Syntax

```
* * * * * command to be executed
│ │ │ │ │
│ │ │ │ └─── Weekday (0-7) = (Sunday=0 or 7)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of Month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

Basic Cron Syntax:

- `*` every value
- `,` value list separator
- `-` range of values
- `/` step values

## Untrack/ Igrore Files in Git

When a file is already being tracked by Git, adding it to `.gitignore` will not stop Git from tracking changes to that file. To untrack a file that is currently being tracked, you need to remove it from the index using the following command:

- Example with File:

```bash
git rm --cached .env
git commit -m "Stop tracking .env"
```

- Example with Folder:

```bash
git rm -r --cached folder_name
```

- If file contains secrets, we should also remove those secrets from the Git history.

```bash
git filter-branch --force --index-filter \ "git rm --cached
--ignore-unmatch .env" \ --prune-empty --tag-name-filter cat --
--all

git push origin --force --all
```

Where:

- `--force`: forces the rewrite of history.
- `--index-filter`: edit commit.
- `git rm --cached --ignore-unmatch .env`: removes the specified file from the index, skipping if it doesn't exist.
- `--prune-empty`: removes empty commits after filtering.
- `--tag-name-filter cat`: keeps tags unchanged.
- `-- --all`: applies the filter to all branches and tags.

Force push will affect collaborators, so it's important to change the credentials (like passwords, API keys) that were exposed in the file.

## VIM Editor

Vim is a default text editor in Unix-based systems. It is a tool for editing files directly from the terminal, which commonly used when commiting messages in Git or editing configuration files on remote servers.

### Basic Commands

| Command | Description |
|:-|:-|
| `i` | Switch to Insert mode to start editing the file. |
| `Esc` | Switch back to Normal mode from Insert mode. |
| `:w` | Save the changes made to the file. |
| `:q` | Quit Vim. |
| `:wq` | Save changes and quit Vim. |
| `:q!` | Quit Vim without saving changes. |

### Moving Around in Normal Mode

|Command | Description |
|:-|:-|
| `h` | Move the cursor left. |
| `j` | Move the cursor down. |
| `k` | Move the cursor up. |
| `l` | Move the cursor right. |
| `g` | Move to the beginning of the line. |
| `G` | Move to the end of the file. |

### Editing Text in Normal Mode

|Command | Description |
|:-|:-|
| `dd` | Delete the entire current line. |
| `yy` | Copy the entire current line. |
| `p` | Paste. |
| `u` | Undo. |

! Note: Press `Esc` and type `:q!` to exit Vim without saving if you get stuck.