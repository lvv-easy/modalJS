const tbody = $("#main-table tbody");
$(document).ready(() => {
    getAllUsers();
});

function getAllUsers() {
    fetch("/api/users").then((response) => {
        console.log(response)
        if (response.ok) {
            response.json().then((users) => {
                users.forEach((user) => {
                    addUserRow(user)
                });
            });
        } else {
            console.error(response.status + " - " + response.statusText);
        }
    });
}

function addUserRow(user) {
    tbody.append(
        "<tr>" +
        "<td>" + user.id + "</td>" +
        "<td>" + user.firstName + "</td>" +
        "<td>" + user.lastName + "</td>" +
        "<td>" + user.age + "</td>" +
        "<td>" + user.email + "</td>" +
        "<td>" + user.roles.map(role => role.role.substr(5)) + "</td>" +
        "<td><button class='btn btn-primary' onclick='event.preventDefault(); editModal(" + user.id + ")'>Edit</button></td>" +
        "<td><button class='btn btn-danger' onclick='event.preventDefault(); deleteModal(" + user.id + ")'>Delete</button></td>" +
        "</tr>"
    )
}

function editModal(userId) {
    $("#editModal").modal('show')
    $("#editModal .modal-header h5").text('Edit user');
    $('#submitButton').text('Edit').addClass('btn btn-primary').attr('onClick', 'updateUser('+ userId + ');');

    getRoles()
    getUserById(userId)
}

function deleteModal(userId) {
    $("#editModal").modal('show')
    $("#editModal .modal-header h5").text('Delete user');


    getRoles()
    getUserById(userId)

    $('#password').hide();
    $('#passwordLabel').hide();
    $('#firstName').prop('readonly', true);
    $('#lastName').prop('readonly', true);
    $('#age').prop('readonly', true);
    $('#email').prop('readonly', true);
    $('#role').prop('disabled', true);
    $('#submitButton').text('Delete').addClass('btn btn-danger').attr('onClick', 'deleteUser('+ userId + ');');
    $('#method').val('delete');
}

function deleteUser(userId) {
    fetch("/api/users/"+userId, {method: "DELETE"})
        .then((response) => {
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                return;
            }
            tbody.empty();
            getAllUsers();
            $('#editModal').modal('hide');
        })
}

function createUser() {

    let form = $('#new-user');
    let user = {
        'firstName': form.find('#addFirstName').val(),
        'lastName': form.find('#addLastName').val(),
        'age': parseInt(form.find('#addAge').val()),
        'email': form.find('#addEmail').val(),
        'password': form.find('#addPassword').val(),
        'roles': form.find('#roles').val().map(id => parseInt(id))
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let request = new Request('/api/users', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(user)
    });
    console.log(user);
    fetch(request).then((response) => {
        response.json().then((userReturned) => {
            tbody.empty();
            getAllUsers();
            console.log(userReturned)
        })
    })

    const someTabTriggerEl = document.querySelector('#users-table-tab');
    const tab = new bootstrap.Tab(someTabTriggerEl);
    clearNewFormField()
    tab.show()
}

async function updateUser(userId) {
    let form = $('#editModal');
    let user = {
        'id': userId,
        'firstName': form.find('#firstName').val(),
        'lastName': form.find('#lastName').val(),
        'age': parseInt(form.find('#age').val()),
        'email': form.find('#email').val(),
        'password': form.find('#password').val(),
        'roles': form.find('#role').val()
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    let request = new Request("api/users/" + userId, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(user),
    });

    await fetch(request).then((response) => {
        response.json().then((userReturned) => {
            $("#firstName" + userReturned.id).text(userReturned.firstName);
            $("#lastName" + userReturned.id).text(userReturned.lastName);
            $("#age" + userReturned.id).text(userReturned.age);
            $("#email" + userReturned.id).text(userReturned.email);
            $("#password" + userReturned.id).text(userReturned.password)
            $("#role" + userReturned.id).text(userReturned.roles.map(role => role.name).substr(5)).contains(user.roles).selected(getRoles());
            console.log(userReturned);
            tbody.empty();
            getAllUsers();
        })
    })

    $('#editModal').modal('hide');
    console.log('hide modal')
}

function getUserById(userId) {
    fetch("api/users/" + userId).then((response) => {
        if (response.ok) {
            response.json().then((user) => {
                $('#method').val('patch');
                $('#firstName').val(user.firstName);
                $('#lastName').val(user.lastName);
                $('#age').val(user.age);
                $('#email').val(user.email);
                $('#role').val(user.roles.map(role => role.role).substr(5));
            })
        } else {
            console.error(response.status + " - " + response.statusText);
        }
    });
}

function getRoles() {
    fetch("/api/roles").then((response) => {
        if (response.ok) {
            response.json().then((roles) => {
                let option = '';
                roles.forEach((role) => {
                    option += '<option value="' + role.id + '">' + role.role.substr(5) + '</option>';
                });
                $('#role').append(option);
            });
        } else {
            console.error(response.status + " - " + response.statusText);
        }
    });
}

$('#editModal').on('hidden.bs.modal', function () {
    clearModalFormField();
});

function clearModalFormField() {
    $('#firstName').val('').prop('readonly', false);
    $('#lastName').val('').prop('readonly', false);
    $('#age').val('').prop('readonly', false);
    $('#email').val('').prop('readonly', false);
    $('#password').show().val('').prop('readonly', false);
    $('#passwordLabel').show();
    $('#role').prop('disabled', false);
    $('#role option').remove();
    $('#submitButton').removeAttr('class').removeAttr('onClick');
}

function clearNewFormField() {
    $('#addFirstName').val('');
    $('#addLastName').val('');
    $('#addAge').val('');
    $('#addEmail').val('');
    $('#addPassword').val('');
    $('#roles option').prop('selected', false)
}
