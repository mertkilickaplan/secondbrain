# User Guide

Welcome to WhichNotes! This guide will help you get the most out of your personal knowledge management system.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Notes](#creating-notes)
3. [Using Search](#using-search)
4. [Understanding the Graph](#understanding-the-graph)
5. [Managing Your Subscription](#managing-your-subscription)
6. [Keyboard Shortcuts](#keyboard-shortcuts)
7. [Tips & Tricks](#tips--tricks)
8. [FAQ](#faq)

---

## Getting Started

### Creating Your Account

1. Visit the app homepage
2. Click **"Get Started"** or **"Sign In"**
3. Click **"Sign Up"**
4. Enter your email and create a strong password
5. Check your email for a confirmation link
6. Click the link to verify your account
7. Log in with your credentials

### Your First Note

After logging in, you'll see:
- **Input area** at the top - where you create notes
- **Graph visualization** in the center - shows your notes and connections
- **Search button** (🔍) - find notes quickly
- **User menu** - access settings and logout

---

## Creating Notes

### Text Notes

The simplest way to capture your thoughts:

1. Click in the input area
2. Type your note content
3. Click **"Add Note"** or press `Enter`

**Example**:
```
Just learned about the Pomodoro Technique - 
25 minutes of focused work followed by a 5-minute break.
```

### URL Notes

Save web pages with automatic title extraction:

1. Click **"URL"** tab
2. Paste a URL (e.g., `https://example.com`)
3. Optionally add notes about the link
4. Click **"Add"**

**Example**:
```
URL: https://wikipedia.org/wiki/Zettelkasten
Notes: Interesting method for note-taking
```

### Note Types

- **📝 Text**: Regular notes, thoughts, ideas
- **🔗 URL**: Bookmarks, articles, resources

---

## Using Search

### Quick Search

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux) to open search.

### Search Features

**Basic Search**:
```
artificial intelligence
```
Finds notes containing "artificial" or "intelligence"

**Tag Search**:
```
#important
```
Finds notes tagged with "important"

**Filters**:
- **Status**: Filter by Ready, Processing, or Error
- **Type**: Filter by Text or URL notes
- **Tags**: Filter by specific tags

### Search Tips

1. **Minimum 2 characters** required
2. **Instant results** as you type
3. **Arrow keys** (↑↓) to navigate results
4. **Enter** to open selected note
5. **Escape** to close search

### Turkish Language Support

Search automatically handles Turkish characters:
- Searching "sehir" finds "şehir"
- Searching "gol" finds "göl"
- Works both ways!

---

## Understanding the Graph

### What is the Graph?

The graph visualizes your notes as **nodes** (circles) connected by **links** (lines). Related notes are automatically connected based on AI analysis.

### Graph Elements

**Nodes (Circles)**:
- Each circle = one note
- **Size** = number of connections
- **Color** = note type or status

**Links (Lines)**:
- Connect related notes
- **Thickness** = similarity strength
- Hover to see explanation

### Interacting with the Graph

**View Note**:
- Click any node to open note details

**Navigate**:
- **Drag** to pan around
- **Scroll** to zoom in/out
- **Double-click** node to center it

**Details Panel**:
- Shows note content
- Edit or delete note
- See connections
- View AI-generated summary (Premium)

---

## Managing Your Subscription

### Free Tier

**Includes**:
- ✅ 25 notes maximum
- ✅ Full-text search
- ✅ Graph visualization
- ✅ Export/Import
- ❌ No AI features

**Usage Indicator**:
Look for "15 / 25" in the top-right corner showing your current usage.

### Premium Tier

**Includes**:
- ✅ **Unlimited notes**
- ✅ **AI-powered features**:
  - Automatic summaries
  - Topic extraction
  - Smart connections
  - Connection explanations
- ✅ Priority support

**Price**: $9.99/month

### Upgrading to Premium

1. Click **"Upgrade"** button
2. Review features and pricing
3. Click **"Upgrade to Premium"**
4. Complete payment (when available)

> **Note**: Payment integration coming soon. Contact admin for manual upgrade.

### Checking Your Usage

Your current plan and usage are always visible:
- **Top-right corner**: Usage indicator (e.g., "15 / 25")
- **User menu** → **"Subscription"**: Full details

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` / `Ctrl+K` | Open search |
| `Escape` | Close search/modal |
| `Enter` | Submit note/form |

### Search Shortcuts

| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate results |
| `Enter` | Open selected note |
| `Escape` | Close search |

### Graph Shortcuts

| Shortcut | Action |
|----------|--------|
| `Click` | Select note |
| `Drag` | Pan graph |
| `Scroll` | Zoom in/out |

---

## Tips & Tricks

### 1. Use Tags for Organization

Add tags to your notes for easy filtering:
```
#important #work #project-alpha
```

Then search with `#important` to find all important notes.

### 2. Write Descriptive Notes

Better notes = better AI connections:

❌ **Bad**: "Meeting notes"  
✅ **Good**: "Team meeting about Q1 goals - focus on customer retention and new feature launches"

### 3. Save URLs with Context

Don't just save links - add why they're important:

❌ **Bad**: Just the URL  
✅ **Good**: URL + "Great article on React performance optimization techniques"

### 4. Regular Review

Use search to review old notes:
- Search by date: "December 2024"
- Search by topic: "machine learning"
- Browse the graph to discover connections

### 5. Export Regularly

Backup your data:
1. User menu → **"Export"**
2. Save JSON file
3. Store safely (cloud storage, external drive)

### 6. Leverage AI (Premium)

Let AI help you:
- **Automatic summaries**: Quickly scan long notes
- **Topic extraction**: Discover themes in your notes
- **Smart connections**: Find related ideas you might have missed

### 7. Use the Graph for Discovery

The graph reveals patterns:
- **Clusters**: Related topics group together
- **Central nodes**: Important recurring themes
- **Isolated nodes**: Ideas to develop further

---

## FAQ

### How many notes can I create?

- **Free**: 25 notes maximum
- **Premium**: Unlimited

### What happens when I hit the limit?

You'll see an upgrade modal. You can:
- Upgrade to Premium for unlimited notes
- Delete old notes to make room
- Export your data and start fresh

### How does AI analysis work?

(Premium only) When you create a note:
1. Note is created with "Processing" status
2. AI analyzes content (2-10 seconds)
3. Generates summary, topics, and connections
4. Status changes to "Ready"

### Can I edit notes?

Currently, notes are immutable (cannot be edited). You can:
- Delete and recreate
- Add a new note with updated information

### How is my data stored?

- **Database**: Supabase PostgreSQL (encrypted at rest)
- **Authentication**: Supabase Auth (industry-standard security)
- **Privacy**: Your notes are private - only you can see them

### Can I export my data?

Yes! User menu → **"Export"** downloads all your notes as JSON.

### Can I import notes?

Yes! User menu → **"Import"** accepts JSON files.

### What if I forget my password?

1. Click **"Forgot Password"** on login page
2. Enter your email
3. Check email for reset link
4. Create new password

### How do I delete my account?

Contact support to request account deletion. All your data will be permanently removed.

### Is there a mobile app?

Not yet, but the web app works great on mobile browsers!

### How do I contact support?

- Email: support@whichnotes.com
- GitHub Issues: [Report a bug](https://github.com/YOUR_USERNAME/whichnotes/issues)

---

## Troubleshooting

### Search not working

- Ensure query is at least 2 characters
- Check internet connection
- Try refreshing the page

### Graph not loading

- Refresh the page
- Clear browser cache
- Check if you have notes created

### AI processing stuck

- Wait up to 30 seconds
- Refresh the page
- If still stuck, note will show "Error" status

### Can't create notes

- Check if you've hit your limit (Free: 25 notes)
- Verify you're logged in
- Check internet connection

---

## Getting Help

Need more help?

1. 📚 Check [API Documentation](./API.md) for developers
2. 🏗️ Read [Architecture Decisions](./ARCHITECTURE.md) for technical details
3. 🐛 Report bugs on [GitHub Issues](https://github.com/YOUR_USERNAME/whichnotes/issues)
4. 💬 Join our community discussions

---

**Happy note-taking!** 🎉

Build your knowledge graph, one note at a time.
