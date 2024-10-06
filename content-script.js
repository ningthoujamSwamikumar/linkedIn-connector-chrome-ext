function findConnectButtons() {
    const matches = document.querySelectorAll("button[aria-label^='Invite'][aria-label$='to connect']");
    console.log("found connection buttons", matches.length);
    return matches;
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting === "hello") {
            sendResponse({ farewell: "goodbye" });
            sendConnections();
        }
        return false;
    }
);

async function sendConnections() {
    const buttons = findConnectButtons();
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
        console.log("start working on button", buttons[i]);
        try {
            const res = await send(buttons[i]);
            console.log("result of", buttons[i], res);
        } catch (err) {
            console.error("error at", buttons[i], err);
        }
    }
}

async function updateCount() {
    try {
        await chrome.runtime.sendMessage({ count: 1 });
    } catch {
        console.log("failed to update count");
    }
}

const delay = 2000; //time delay to wait for UIs
const timeoutDuration = 30000;

const clickConnect = (button) => {
    return new Promise((resolve, reject) => {
        const connectObserver = new MutationObserver((_, observer) => {
            observer.disconnect();
            setTimeout(() => {
                resolve("clicked connect");
            }, delay);
        });
        connectObserver.observe(document.body, { childList: true, subtree: true });
        button.click();
    })
};

const handleNotePopup = () => {
    return new Promise((resolve, reject) => {
        const popupObserver = new MutationObserver((_, observer) => {
            observer.disconnect();
            clearTimeout(timeout);
            setTimeout(() => {
                updateCount();
                resolve("sent without note");
            }, delay);
        });
        popupObserver.observe(document.getElementById("artdeco-modal-outlet"), { childList: true, subtree: true });
        document.querySelector("button[aria-label='Send without a note']")?.click();
        //handle of no change detection for a period
        const timeout = setTimeout(() => {
            popupObserver.disconnect();
            reject("popup observer time out");
        }, timeoutDuration);
    })
}

const handleOtherPopup = () => {
    return new Promise((resolve, reject) => {
        //popup is something else, so wait for user to handle it
        const userHandleObserver = new MutationObserver((_, observer) => {
            if (document.getElementById("artdeco-modal-outlet").children.length == 0) {
                observer.disconnect();
                clearTimeout(timeout);
                setTimeout(() => {
                    resolve("user handled unexpected popup");
                }, delay);
            }
        });
        userHandleObserver.observe(document.getElementById("artdeco-modal-outlet"), { childList: true, subtree: true });
        const timeout = setTimeout(() => {
            userHandleObserver.disconnect();
            reject("userHandle observer time out");
        }, timeoutDuration);
    });
}

const handlePopup = () => {
    const popup = document.getElementById("send-invite-modal");
    const popupContainer = document.getElementById("artdeco-modal-outlet");
    if (popup) {
        return handleNotePopup();
    } else if (popupContainer.children.length > 0) {
        return handleOtherPopup();
    } else {
        return new Promise((resolve, reject) => {
            updateCount();
            resolve("no popup");
        });
    }
}

function send(btn) {
    return new Promise((resolve, reject) => {
        clickConnect(btn)
            .then((res) => {
                console.log(res);
                return handlePopup();
            }).then((res) => {
                console.log(res);
                setTimeout(() => {
                    resolve("connection request sent");
                }, delay);
            }).catch(err => reject(err));
    });
}
