import json

nodes = []
# start node (id 0)
start_node = {
    "type": {
        "library": "H5P.BranchingQuestion 1.0",
        "params": {
            "branchingQuestion": {
                "question": "<p>Welcome to Project Chimera. Choose your first action.</p>",
                "alternatives": [
                    {"text": "Begin analysis", "nextContentId": 1, "feedback": {"subtitle": "✔️", "image": "icons/check.svg", "endScreenScore": 5}},
                    {"text": "Consult stakeholders", "nextContentId": 1, "feedback": {"subtitle": "✔️", "image": "icons/check.svg", "endScreenScore": 5}}
                ]
            }
        }
    },
    "showContentTitle": False,
    "proceedButtonText": "Proceed",
    "nextContentId": -1,
    "feedback": None,
    "contentBehaviour": "useBehavioural"
}
nodes.append(start_node)

# linear nodes 1..68
for i in range(1, 69):
    next_id = i + 1 if i < 69 else -1
    node = {
        "id": i,
        "type": {
            "library": "H5P.BranchingQuestion 1.0",
            "params": {
                "branchingQuestion": {
                    "question": f"<p>Decision point {i}. Choose wisely.</p>",
                    "alternatives": [
                        {"text": "Correct choice", "nextContentId": next_id, "feedback": {"subtitle": "✔️ Correct", "image": "icons/check.svg", "endScreenScore": 10}},
                        {"text": "Incorrect choice", "nextContentId": next_id, "feedback": {"subtitle": "❌ Wrong", "image": "icons/cross.svg", "endScreenScore": 2}}
                    ]
                }
            }
        },
        "showContentTitle": False,
        "proceedButtonText": "Proceed",
        "nextContentId": -1,
        "feedback": None,
        "contentBehaviour": "useBehavioural"
    }
    nodes.append(node)

# final decision node (id 69)
final_node = {
    "id": 69,
    "type": {
        "library": "H5P.BranchingQuestion 1.0",
        "params": {
            "branchingQuestion": {
                "question": "<p>Final verdict: Should the project continue?</p>",
                "alternatives": [
                    {"text": "Proceed with monitoring", "nextContentId": -1, "feedback": {"subtitle": "✔️ Success", "image": "icons/check.svg", "endScreenScore": 250}},
                    {"text": "Proceed with limits", "nextContentId": -1, "feedback": {"subtitle": "✔️ Partial", "image": "icons/check.svg", "endScreenScore": 150}},
                    {"text": "Stop the project", "nextContentId": -1, "feedback": {"subtitle": "❌ Failure", "image": "icons/cross.svg", "endScreenScore": 0}}
                ]
            }
        }
    },
    "showContentTitle": False,
    "proceedButtonText": "Finish",
    "nextContentId": -1,
    "feedback": None,
    "contentBehaviour": "useBehavioural"
}
nodes.append(final_node)

content = {
    "branchingScenario": {
        "title": "Project Chimera",
        "startScreen": {"startScreenTitle": "Project Chimera", "startScreenSubtitle": "Navigate the bio‑ethics crisis.", "startScreenImage": None, "startScreenAltText": ""},
        "endScreens": [
            {"endScreenTitle": "Success", "endScreenSubtitle": "You resolved the crisis ethically.", "endScreenImage": None, "endScreenScore": 250, "contentId": -1},
            {"endScreenTitle": "Partial Success", "endScreenSubtitle": "Good decisions, but some issues remain.", "endScreenImage": None, "endScreenScore": 150, "contentId": -1},
            {"endScreenTitle": "Failure", "endScreenSubtitle": "The crisis escalated due to poor choices.", "endScreenImage": None, "endScreenScore": 0, "contentId": -1}
        ],
        "content": nodes,
        "scoringOptionGroup": {"scoringOption": "dynamic-score", "includeInteractionsScores": True},
        "behaviour": {"enableBackwardsNavigation": False, "forceContentFinished": False, "randomizeBranchingQuestions": False},
        "l10n": {
            "startScreenButtonText": "Start Scenario",
            "endScreenButtonText": "Restart",
            "backButtonText": "Back",
            "disableProceedButtonText": "Select an answer to continue",
            "replayButtonText": "Replay",
            "scoreText": "Your score:",
            "fullscreenAria": "Fullscreen"
        }
    }
}

with open('content.json', 'w', encoding='utf-8') as f:
    json.dump(content, f, indent=2, ensure_ascii=False)

print('content.json generated')
