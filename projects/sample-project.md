
## Overview
<!-- Brief description of what this project is about -->

## Goals
- [ ] Define the primary goal of this project
- [ ] List any secondary objectives

## Tasks

```dataview
TASK
WHERE !completed 
AND (
  contains(lower(text), lower(this.file.name)) 
  OR contains(lower(text), "#" + lower(this.file.name)) 
  OR contains(lower(text), lower(this.file.name) + "/")
)
```

## Resources
<!-- Links to relevant files, references, or external resources -->
- [[Resource 1]]
- [[Resource 2]]

## Notes
<!-- Key insights, decisions, and important information -->

all the notes you have every now and and again worth putting them under /resources and connect them ==via== PARA method


## Progress
<!-- Milestones, achievements, and status updates -->

## Completed Tasks

```dataview
TASK
WHERE completed 
AND (
  contains(lower(text), lower(this.file.name)) 
  OR contains(lower(text), "#" + lower(this.file.name)) 
  OR contains(lower(text), lower(this.file.name) + "/")
)
```

## Related Areas
<!-- Areas of responsibility this project belongs to -->
- [[Area 1]]
- [[Area 2]]