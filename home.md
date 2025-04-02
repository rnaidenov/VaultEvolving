---

banner: "![[https://images.unsplash.com/photo-1518534249708-e8f3537753ee?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D]]"

banner_y: 0.538

cssclasses:

- dashboard

banner_x: 0.19841
---
  

<div class="title" style="color:white">HOME</div>

<div class='random'></div>

# Personal

  
- 📝 Journal
  
```button
name New Daily 
type note(ABC, tab) template
action 5_BuJo_Daily_Log
templater true
```


```dataviewjs
// Get today's date in YYYY-MM-DD format

const today = moment().format("YYYY-MM-DD");
const todaySplit = today.split('-');

const dailyNotePath = `journal/daily/${today}`;

// Use Dataview's native capabilities
dv.header(4, `What would make [today](${today}) great?`);
const tasks1 = dv.pages(`"journal/daily/${todaySplit[0]}/${todaySplit[1]}/${today}"`)
                .file.tasks;

const tasks2 = dv.pages(`"todo/🏗️ Tasks"`).file.tasks.filter(t => t.text.includes("☀️")); 
            
dv.taskList([...tasks1, ...tasks2]);
```

<br/>


- [[🏗️ Tasks]]

- [[🌅 Travel]]

- [[🎞️ Movies]]

  

# Projects

- 🧑🏻‍💻 Coding
	- [[Reflect Studios]]
	- [[J1]]
	- [[J2]]
	- [[In-house MacroFactor]]

- 📚 Learning
	- [[audiophile]]
	  
- 🤲🏻 Hands on
	- [[Obsidian]]
	- [[NAS]]
	- [[VaultEvolving]]
	- [[терасата]]

- ❤️‍🩹 Health
	- [[workouts/gym/progress|Gym]]
	- [[Sleep hygiene]]
	- [[Fix back pain (FBP)]]
	- [[Heart]]

* 💸 Finances
  * [[Personal]]
  * [[Dimitra’s investments]]



- 🧘🏻‍♂️ Spiritual 
    * [[throw or sell unused things]] 

  

  

# Vault Info

  

- 🗄️ Recent file updates

  

`$=dv.list(dv.pages('').sort(f=>f.file.mtime.ts,"desc").limit(4).file.link)`

  

- 🔖 Tagged: favorite

  

`$=dv.list(dv.pages('#favorite').sort(f=>f.file.name,"desc").limit(4).file.link)`

  

- 〽️ Stats

  

- File Count: `$=dv.pages().length`

  

- Personal recipes: `$=dv.pages('"Family/Recipes"').length`