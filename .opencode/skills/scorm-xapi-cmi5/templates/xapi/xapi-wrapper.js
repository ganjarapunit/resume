/**
 * xAPI Wrapper — sends learning statements to an LRS.
 * Configure LRS_ENDPOINT and LRS_AUTH before deployment.
 */
const XAPI = {
    LRS_ENDPOINT: "{{LRS_ENDPOINT}}",
    LRS_AUTH: "{{LRS_AUTH}}",

    actor: {
        objectType: "Agent",
        account: {
            homePage: "{{LRS_HOMEPAGE}}",
            name: "{{LEARNER_ID}}"
        }
    },

    activityId: "{{ACTIVITY_IRI}}",

    sendStatement: function(verb, object, result, context) {
        const statement = {
            actor: this.actor,
            verb: verb,
            object: {
                objectType: "Activity",
                id: object.id || this.activityId,
                definition: object.definition || {
                    name: { "en-US": object.name || "{{ACTIVITY_NAME}}" },
                    description: { "en-US": object.description || "" }
                }
            }
        };

        if (result) statement.result = result;
        if (context) statement.context = context;
        if (object.extensions) statement.object.definition.extensions = object.extensions;

        return this.postStatement(statement);
    },

    postStatement: function(statement) {
        return fetch(this.LRS_ENDPOINT + "/statements", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + this.LRS_AUTH,
                "Content-Type": "application/json",
                "X-Experience-API-Version": "1.0.3"
            },
            body: JSON.stringify(statement)
        }).then(function(resp) {
            if (!resp.ok) console.error("xAPI: POST failed", resp.status);
            return resp;
        }).catch(function(err) {
            console.error("xAPI: Network error", err);
        });
    },

    // Helper verbs
    verbs: {
        launched:      { id: "http://adlnet.gov/expapi/verbs/launched",      display: { "en-US": "launched" } },
        initialized:   { id: "http://adlnet.gov/expapi/verbs/initialized",   display: { "en-US": "initialized" } },
        completed:     { id: "http://adlnet.gov/expapi/verbs/completed",     display: { "en-US": "completed" } },
        passed:        { id: "http://adlnet.gov/expapi/verbs/passed",        display: { "en-US": "passed" } },
        failed:        { id: "http://adlnet.gov/expapi/verbs/failed",        display: { "en-US": "failed" } },
        answered:      { id: "http://adlnet.gov/expapi/verbs/answered",      display: { "en-US": "answered" } },
        interacted:    { id: "http://adlnet.gov/expapi/verbs/interacted",    display: { "en-US": "interacted" } },
        experienced:   { id: "http://adlnet.gov/expapi/verbs/experienced",   display: { "en-US": "experienced" } },
        attempted:     { id: "http://adlnet.gov/expapi/verbs/attempted",     display: { "en-US": "attempted" } },
        progressed:    { id: "http://adlnet.gov/expapi/verbs/progressed",    display: { "en-US": "progressed" } },
        terminated:    { id: "http://adlnet.gov/expapi/verbs/terminated",    display: { "en-US": "terminated" } },
        scored:        { id: "http://adlnet.gov/expapi/verbs/scored",        display: { "en-US": "scored" } }
    }
};

// Auto-send launched statement
document.addEventListener("DOMContentLoaded", function() {
    XAPI.sendStatement(XAPI.verbs.launched, {
        id: XAPI.activityId,
        name: "{{ACTIVITY_NAME}}",
        description: "{{ACTIVITY_DESCRIPTION}}"
    });
});
