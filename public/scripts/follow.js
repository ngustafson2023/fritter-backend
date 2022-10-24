/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewAllFollows(fields) {
    fetch('/api/follows')
        .then(showResponse)
        .catch(showResponse);
}

function viewFollowsByUser(fields) {
    fetch(`/api/follows?username=${fields.username}`)
        .then(showResponse)
        .catch(showResponse);
}

function followUser(fields) {
    fetch(`/api/follows/${fields.username}`, {method: 'POST'})
        .then(showResponse)
        .catch(showResponse);
}

function unfollowUser(fields) {
    fetch(`/api/follows/${fields.username}`, {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}