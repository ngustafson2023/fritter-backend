/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewFeed(fields) {
    fetch('/api/feed')
        .then(showResponse)
        .catch(showResponse);
}

function createFeed(fields) {
    fetch('/api/feed', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function deleteFeed(fields) {
    fetch('/api/feed', {method:'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}

function modifyFeed(fields) {
    fetch('/api/feed', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}