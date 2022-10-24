/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function viewTimeManager(fields) {
    fetch('/api/timemanager')
        .then(showResponse)
        .catch(showResponse)
}

function createTimeManager(fields) {
    fetch('/api/timemanager', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse);
}

function deleteTimeManager(fields) {
    fetch('/api/timemanager', {method: 'DELETE'})
        .then(showResponse)
        .catch(showResponse);
}

function modifyTimeManager(fields) {
    fetch('/api/timemanager', {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
        .then(showResponse)
        .catch(showResponse)
}