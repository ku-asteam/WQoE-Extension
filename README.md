# WQoE-Extension
An environment-independent web Quality-of-Experience measuring tool

## Introduction
WQoE-Extension is a Chrome extension program which gathers real users' web experience. 
WQpE-Extension gathers web page load events, scroll events, touch events, and etc.
WQpE-Extension is useful for someone who wants to contribute to the research which collects users' data and analyze the data to enhance the web browsing experience. The data are stored our lab server and used only for our study.

We only collect the data mentioned below. We never collect any other private data like passwords. And all collected data is used just for the study. We collect data as follows:
* URL
* Timing information of web pages
* Components of web pages
* Scroll events, click events
* CPU, Memory, Network, Battery
* Geolocation
* The result of survey which asks if the page load is loaded quick

## Requirements and Dependencies
* Chromium-based browsers (Chrome, Whale, etc.)

## Instructions
* Modify 'API_SERVER' constant (in background.js, options.js)
* Install the extension
* If you don't know how to install an extension, please see [Install Chrome extension not in the store](https://stackoverflow.com/questions/24577024/install-chrome-extension-not-in-the-store)
