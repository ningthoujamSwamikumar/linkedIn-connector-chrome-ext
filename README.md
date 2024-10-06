# linkedIn-connector-chrome-ext
This is a chrome extension to send LinkedIn Connection request automatically with just a click.
> ![Demo Video](/readme-resource/final-edited-lin_conn-ext.mp4)
> ![Youtube Demo Video](https://youtu.be/lpVW5z0hLkE)
> [![alt text](https://img.youtube.com/vi/lpVW5z0hLkE/0.jpg)](https://www.youtube.com/watch?v=lpVW5z0hLkE)
> <iframe width="560" height="315" src="https://www.youtube.com/embed/lpVW5z0hLkE?si=uOagrNMjsjCgLYVQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Features
- Extension is enabled only when connect buttons are available in a LinkedIn page.
- Handles 'send with note' pop up.
- Handles 'connection limit reached' popup.
- Tracks connection request count.

## How to installed and run
1. Get code from the repository - do one of the following:
>`git clone git@github.com:ningthoujamSwamikumar/linkedIn-connector-chrome-ext.git`
>`git clone https://github.com/ningthoujamSwamikumar/linkedIn-connector-chrome-ext.git`
>Download [zip](https://github.com/ningthoujamSwamikumar/linkedIn-connector-chrome-ext/archive/refs/heads/main.zip). and extract at your prefered location.
2. Load the extension in Chrome browser:
- Go to extensions by `chrome://extensions` or through settings.
- Enable developer mode at the top right side.
- Load unpacked by selecting the folder which presents the extension.
3. Now you will see the extension in extension page and in extensions in toolbar.

## Architecture/Design
![architecure diagram of extension](/readme-resource/linkedin-conn-ext-architecture.png)

## Work Flow
1. Service worker
    - Checks the webpage in the current tab and enables the extension when it is a LinkedIn page and connect buttons are present in the page.
2. Open extension
    - clicking on enabled extension icon brings a small UI popup which has a button in it.
    - when extension UI pops up, content-script is injected into webpage context and can access the DOM tree.
    - clicking on send connections button finds all the connect buttons on the page
    - for every button found:
        - click connect.
        - if 'add note' popup, click 'send without note' and increment count.
        - if found some other popup, wait for user to handle it.
        - if no popup, increment count and continue.

## Note:
1. A combination of Mutation Observer and time delay is used to make connection requests smoothly and sequentially, which otherwise could lead to skipping of connect buttons or become too fast to track.
2. In the current code, minimum of connect buttons and 5 is the maximum connection requests that can be sent at a time. This is to consider the maximum connection limit while testing the extension.
