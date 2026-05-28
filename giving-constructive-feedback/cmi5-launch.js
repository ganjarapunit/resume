const CMI5 = (function() {
    const params = new URLSearchParams(window.location.search);
    const launchData = {
        endpoint: params.get("endpoint"),
        auth: params.get("auth"),
        actor: params.get("actor") ? JSON.parse(decodeURIComponent(params.get("actor"))) : null,
        registration: params.get("registration"),
        activityId: params.get("activityId") || "https://ganjarapunit.github.io/resume/giving-constructive-feedback/",
        fetch: params.get("fetch")
    };

    function getActor() {
        if (!launchData.actor) return {
            objectType: "Agent",
            account: {
                homePage: "https://ganjarapunit.github.io/resume",
                name: "anonymous-" + Date.now()
            },
            name: "Learner"
        };
        return {
            objectType: "Agent",
            mbox: launchData.actor.mbox,
            account: launchData.actor.account,
            name: launchData.actor.name
        };
    }

    function sendStatement(verb, result, contextExtras) {
        if (!launchData.endpoint) return Promise.resolve();
        const statement = {
            actor: getActor(),
            verb: verb,
            object: {
                objectType: "Activity",
                id: launchData.activityId,
                definition: {
                    name: { "en-US": "Giving Constructive Feedback" },
                    description: { "en-US": "A microlearning module on delivering effective feedback in the workplace." }
                }
            },
            context: {
                registration: launchData.registration,
                contextActivities: {
                    category: [{
                        id: "http://www.adlnet.gov/expapi/activities/profile",
                        definition: { type: "http://adlnet.gov/expapi/activities/cmi5" }
                    }]
                }
            },
            timestamp: new Date().toISOString()
        };
        if (result) statement.result = result;
        if (contextExtras) Object.assign(statement.context, contextExtras);
        const authHeader = launchData.auth || "";
        return fetch(launchData.endpoint + "/statements", {
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/json",
                "X-Experience-API-Version": "1.0.3"
            },
            body: JSON.stringify(statement)
        }).catch(function() {});
    }

    return {
        initialized: false,

        initialize: function() {
            if (this.initialized) return;
            this.initialized = true;
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/initialized",
                display: { "en-US": "initialized" }
            });
        },

        complete: function(success) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: { "en-US": "completed" }
            }, {
                completion: true,
                success: success !== false
            });
        },

        pass: function(score) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/passed",
                display: { "en-US": "passed" }
            }, {
                completion: true,
                success: true,
                score: score || { scaled: 1 }
            });
        },

        fail: function(score) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/failed",
                display: { "en-US": "failed" }
            }, {
                completion: true,
                success: false,
                score: score || { scaled: 0 }
            });
        },

        terminate: function() {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/terminated",
                display: { "en-US": "terminated" }
            });
        },

        progressed: function(pct) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/progressed",
                display: { "en-US": "progressed" }
            }, {
                extensions: { "https://w3id.org/xapi/cmi5/result/extensions/progress": pct }
            });
        },

        interacted: function(action, details) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/interacted",
                display: { "en-US": "interacted" }
            }, null, {
                extensions: {
                    "https://ganjarapunit.github.io/resume/ext/action": action,
                    "https://ganjarapunit.github.io/resume/ext/details": details
                }
            });
        },

        answered: function(questionId, correct) {
            sendStatement({
                id: "http://adlnet.gov/expapi/verbs/answered",
                display: { "en-US": "answered" }
            }, {
                response: questionId,
                success: correct,
                completion: true
            });
        }
    };
})();

document.addEventListener("DOMContentLoaded", function() {
    CMI5.initialize();
});

window.addEventListener("beforeunload", function() {
    CMI5.terminate();
});
