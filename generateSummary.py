import json
from collections import Counter

# Read tasks.json
with open("tasks.json", "r") as f:
    data = json.load(f)

tasks = data.get("tasks", [])

# Total number of tasks
total_tasks = len(tasks)

# Count tasks by status
status_count = Counter(task.get("status", "unknown") for task in tasks)

# Count tasks by assigned user
assigned_count = Counter(
    task.get("assigned_user", {}).get("name", "unassigned") for task in tasks
)

# Prepare summary dictionary
summary = {
    "total_tasks": total_tasks,
    "count_by_status": dict(status_count),
    "count_by_assigned_user": dict(assigned_count)
}

# Write summary.json
with open("summary.json", "w") as f:
    json.dump({
        "summary": summary,
        "tasks": tasks
    }, f, indent=4)

print("summary.json has been created successfully!")
