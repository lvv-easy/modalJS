package project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.entity.Role;
import project.repository.RoleRepository;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    private final RoleRepository repository;

    public RoleServiceImpl(RoleRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Role> getAllRoles() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Role findByName(String name) {
        return repository.findByName(name);
    }
}
