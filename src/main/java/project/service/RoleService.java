package project.service;

import project.entity.Role;

import java.util.List;

public interface RoleService {
    List<Role> getAllRoles();

    Role findByName(String name);
}
