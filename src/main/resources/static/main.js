const usersFetchUrl = "http://localhost:8080/rest/admin/users";
const oneUserFetchUrl = "http://localhost:8080/rest/user";

let form = $('#newUserForm');

async function createNewUser() {
    var data = getFormData('#newUserForm');

    await fetch(usersFetchUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(res => res.json().then(user => {
        newRow(user, true);
    }));

    clearUserEditForm();
    $('#allUsersTab').trigger("click");
}

function newRow(user, isButtons) {
    var row = `<tr id="row${user.id}">
                                             <td>${user.id}</td>
                                             <td>${user.name}</td>
                                             <td>${user.surname}</td>
                                             <td>${user.age}</td>
                                             <td>${user.email}</td>
                                             <td >${user.roles.map(function (item) {
            return item.name.replaceAll('ROLE_', '');
        }
    ).join(' ')
    }
                                             </td>`;

    if (!isButtons) {
        row += `</tr>`;
        $('#userTable').append(row);
    } else {
        row += `<td>
                  <button type="button" class="btn btn-info btn-sm" data-toggle="modal" 
                           onclick="editUser(${user.id})">Edit</button>
             </td>
             <td>
                 <button type="button" class="btn btn-danger btn-sm" data-toggle="modal"
                            onclick="deleteUser(${user.id})">Delete</button>
             </td>
                                     <td hidden>${user.password}</td>
                                
         </tr>`;

    }


    $('#usersTable').append(row);
}


function editUser(id) {
    $('#editModal').modal()
    fillRoles("#edit_roles")
    loadDataToFormData("#row" + id, "#edit")
    $('#submitButton').text('Edit').addClass('btn btn-primary').attr('onClick', 'updateUser();');
}

async function updateUser() {
    var data = getFormData('#editForm');
    var id = data.id;

    await fetch(usersFetchUrl + "/" + id, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    }).then(res => res.json());

    updateRow("#row" + id, data)

    $('#editModal').modal('toggle')


}

function updateRow(rowId, user) {
    var row = $(rowId).find('td')

    console.log(row);
    row.eq(1).html(user.name);
    row.eq(2).html(user.surname);
    row.eq(3).html(user.age);
    row.eq(4).html(user.email);
    row.eq(5).html(user.roles.map(function (item) {
            return item.name.replaceAll('ROLE_', '');
        }
    ).join(' '));
    row.eq(8).html(user.password);
}

function deleteUser(id) {
    $('#editModal').modal()
    fillRoles("#edit_roles")
    loadDataToFormData("#row" + id, "#edit")
    $('#submitButton').text('Delete').addClass('btn btn-danger').attr('onClick', 'removeUser();');
}

async function removeUser() {
    var data = getFormData('#editForm');
    var id = data.id;

    await fetch(usersFetchUrl + "/" + id, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
    }).then()

    deleteRow("#row" + id);
    $('#editModal').modal('toggle')


}

function deleteRow(rowId) {
    $(rowId).remove();
}

async function fillRoles(select) {
    $(select).find('option').remove();

    await fetch("http://localhost:8080/rest/admin/roles")
        .then(res => {
                res.json().then(roles => {
                        for (var i = 0; i < roles.length; i++) {
                            var option = new Option();
                            option.id = roles[i].id;
                            option.value = roles[i].name;
                            option.innerHTML = roles[i].name.replaceAll('ROLE_', '');
                            $(select).append(option);
                        }
                    }
                )
            }
        )
}

function clearUserEditForm() {
    form.find(":input").val("");
}

function getFormData(form) {

    var selectedRoles = [];
    $(form + ' option:selected').map(function () {
        selectedRoles.push({
            id: $(this).attr('id'),
            name: $(this).val()
        });
    });

    var user = {
        id: $(form + ' input[name="id"]').val(),
        name: $(form + ' input[name="name"]').val(),
        surname: $(form + ' input[name="surname"]').val(),
        age: $(form + ' input[name="age"]').val(),
        email: $(form + ' input[name="email"]').val(),
        password: $(form + ' input[name="password"]').val(),
        roles: selectedRoles
    }
    return user;
}

function loadDataToFormData(id, action) {
    $(id).each(async function () {
        $(action + '_id').val($(this).find("td:eq(0)").html())
        $(action + '_name').val($(this).find("td:eq(1)").html());
        $(action + '_surname').val($(this).find("td:eq(2)").html());
        $(action + '_age').val($(this).find("td:eq(3)").html());
        $(action + '_email').val($(this).find("td:eq(4)").html());
        $(action + '_password').val($(this).find("td:eq(8)").html());

        var userRole = $(this).find("td:eq(5)").html();

        await fetch("http://localhost:8080/rest/admin/roles")
            .then(res => {
                    res.json().then(roles => {
                            for (var i = 0; i < roles.length; i++) {
                                if (userRole.includes(roles[i].name.replaceAll('ROLE_', ''))) {
                                    var selector = 'option[value= "' + roles[i].name + '"]';
                                    $(selector).prop('selected', true);
                                }
                            }
                        }
                    )
                }
            )
    });
}

async function updateTable(fetchUrl, usersTable) {
    await fetch(fetchUrl, {
        method: "GET",
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
        .then(res => {
                res.json().then(data => {
                        console.log(data);

                        var users = [];

                        if ($.isArray(data)) {
                            users = data;
                        } else {
                            users.push(data);
                        }

                        $(usersTable).find('tr').remove();

                        for (var i = 0; i < users.length; i++) {
                            if (usersTable === "#userTable") {
                                newRow(users[i], false)
                            } else {
                                newRow(users[i], true)
                            }
                        }
                    }
                )
            }
        )
}