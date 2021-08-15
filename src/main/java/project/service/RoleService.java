package project.service;


import project.model.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();

    Role findByName(String name);
}
