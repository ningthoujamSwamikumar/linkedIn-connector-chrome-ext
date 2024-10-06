async function getCurrentTab() {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    return tab;
}

// Using async/await to inject the script
const injectContentScript = async () => {
    try {
        const currentTab = await getCurrentTab();  // Wait for the tab to be retrieved

        if (currentTab && currentTab.id) {
            await chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                files: ["content-script.js"],  // Inject your content script
            });
            console.log("Content script injected successfully.");
        } else {
            console.error("No active tab found.");
        }
    } catch (error) {
        console.error("Error injecting script:", error);
    }
};

injectContentScript();

document.getElementById("send-btn").addEventListener("click", (e) => {
    console.log("send connections button clicked");
    (async () => {
        try {
            const tab = await getCurrentTab();

            const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
            // do something with response here, not outside the function
            console.log(response);

        } catch (error) {
            console.log("popup.js error:", error);
        }
    })();
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.count) {
            const counter = document.getElementById("counter");
            counter.textContent = parseInt(counter.textContent) + 1;
        }
        return false;
    }
);
