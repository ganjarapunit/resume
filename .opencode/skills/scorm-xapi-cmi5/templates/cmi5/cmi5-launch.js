/**
 * cmi5 AU Launch Handler
 * Handles the cmi5 launch flow: parses launch parameters, signals launched,
 * manages session state via xAPI, and terminates properly.
 *
 * This works alongside the xAPI wrapper (xapi-wrapper.js).
 */

const CMI5 = (function() {
    const launchData = parseLaunchParams();
    let sessionId = null;

    function parseLaunchParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            endpoint: params.get("endpoint"),
            auth: params.get("auth"),
            actor: params.get("actor") ? JSON.parse(decodeURIComponent(params.get("actor"))) : null,
            registration: params.get("registration"),
            activityId: params.get("activityId"),
            fetch: params.get("fetch")
        };
    }

    function getActor() {
        if (!launchData.actor) return null;
        return {
            objectType: "Agent",
            mbox: launchData.actor.mbox || undefined,
            account: launchData.actor.account || undefined,
            name: launchData.actor.name || undefined
        };
    }

    function base64Encode(str) {
        try { return btoa(str); } catch (e) { return ""; }
    }

    function sendStatement(verb, result, context) {
        if (!launchData.endpoint) return Promise.resolve();

        const statement = {
            actor: getActor(),
            verb: verb,
            object: {
                objectType: "Activity",
                id: launchData.activityId || "{{ACTIVITY_IRI}}"
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
        if (context) Object.assign(statement.context, context);

        const authHeader = launchData.auth || "Basic " + base64Encode("{{LRS_KEY}}:{{LRS_SECRET}}");

        return fetch(launchData.endpoint + "/statements", {
            method: "POST",
            headers: {
                "Authorization": authHeader,
                "Content-Type": "application/json",
                "X-Experience-API-Version": "1.0.3"
            },
            body: JSON.stringify(statement)
        }).catch(function(err) {
            console.error("cmi5: Statement failed", err);
        });
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

            if (typeof XAPI !== "undefined") {
                XAPI.LRS_ENDPOINT = launchData.endpoint || XAPI.LRS_ENDPOINT;
                XAPI.LRS_AUTH = launchData.auth || XAPI.LRS_AUTH;
                XAPI.actor = getActor() || XAPI.actor;
                XAPI.activityId = launchData.activityId || XAPI.activityId;
            }
        },

        complete: function(success) {
            const completionVerb = {
                id: "http://adlnet.gov/expapi/verbs/completed",
                display: { "en-US": "completed" }
            };

            const result = {
                completion: true,
                success: success !== false
            };

            sendStatement(completionVerb, result);
        },

        pass: function(score) {
            const verb = {
                id: "http://adlnet.gov/expapi/verbs/passed",
                display: { "en-US": "passed" }
            };

            const result = {
                completion: true,
                success: true,
                score: score || { scaled: 1 }
            };

            sendStatement(verb, result);
        },

        fail: function(score) {
            const verb = {
                id: "http://adlnet.gov/expapi/verbs/failed",
                display: { "en-US": "failed" }
            };

            const result = {
                completion: true,
                success: false,
                score: score || { scaled: 0 }
            };

            sendStatement(verb, result);
        },

        terminate: function() {
            const verb = {
                id: "http://adlnet.gov/expapi/verbs/terminated",
                display: { "en-US": "terminated" }
            };

            sendStatement(verb);
        }
    };
})();

document.addEventListener("DOMContentLoaded", function() {
    CMI5.initialize();
});

window.addEventListener("beforeunload", function() {
    CMI5.terminate();
});
