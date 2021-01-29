const LDClient = require('launchdarkly-node-client-sdk');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const clientEnvironmentKey = "60107a9709cc3609daf97e17";
const maxDelayBetweenReportsMS = 1000;
const minDelayBetweenReportsMS = 100;
let userCount = 2;
let reportMetrics = (userCount) => {
    if(!userCount > 0) {
        return;
    }

    var key = uuidv4();
    var user = { "key": key };
    var ldclient = LDClient.initialize(clientEnvironmentKey, user);
    ldclient.on('ready', () => {
        // 50/50 chance of reporting any of these events.
        console.log("Connecting as %s", key);
        if (Math.random() > 0.5) {
            var metricName = "Chat with support via app";
            ldclient.track(metricName);
            console.log(`User ${key} logged ${metricName}.`);
        }
        if (Math.random() > 0.5) {
            var metricName = "Claim filed";
            ldclient.track(metricName);
            console.log(`User ${key} logged ${metricName}.`);
        }
        if (Math.random() > 0.5) {
            var metricName = "Documentation accessed";
            ldclient.track(metricName);
            console.log(`User ${key} logged ${metricName}.`);
        }
        ldclient.flush()
            .then(() => {
                ldclient.close()
                    .then(() => {
                        console.log(`Disconnected ${key}`);
                        setTimeout(
                            reportMetrics,
                            Math.random(minDelayBetweenReportsMS, maxDelayBetweenReportsMS),
                            (userCount - 1)
                        );
                    })
            });
    })
};

reportMetrics(userCount);