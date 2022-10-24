/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createTimeManager(fields) {
    fetch('/api/timemanagers', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function deleteTimeManager(fields) {
    fetch('/api/timemanagers', {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}

function modifyTimeManager(fields) {
    fetch('/api/timemanagers', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse)
}