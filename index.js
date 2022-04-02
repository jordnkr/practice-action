const core = require('@actions/core');
const github = require('@actions/github');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

try {
  // `url` input defined in action metadata file
  const testUrl = core.getInput('url');

  const chrome = chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {logLevel: 'info', output: 'html', onlyCategories: ['performance'], port: chrome.port};
  const runnerResult = lighthouse(testUrl, options);

  // `.lhr` is the Lighthouse Result as a JS object
  core.setOutput("performancescore", runnerResult.lhr.score.categories.performance.score * 100);
  //console.log("-------------RUN RESULT------------");
  //console.log(JSON.stringify(runnerResult.lhr));
  //console.log('Report is done for', runnerResult.lhr.finalUrl);
  //console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

  chrome.kill();
} catch (error) {
  core.setFailed(error.message);
}