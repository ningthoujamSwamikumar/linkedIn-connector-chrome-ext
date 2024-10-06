chrome.runtime.onInstalled.addListener(function () {
    //disable
    chrome.action.disable();
    //enable on condition
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: "www.linkedin.com" },
                        css: ["button[aria-label^='Invite'][aria-label$='to connect']"]
                    })
                ],
                actions: [new chrome.declarativeContent.ShowAction()]
            }
        ]);
    });
});

