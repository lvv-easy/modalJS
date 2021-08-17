package project.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.entity.Role;
import project.repository.RoleRepository;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    final RoleRepository repository;

    public RoleServiceImpl(RoleRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public List<Role> getAllRoles() {
        return repository.findAll();
    }

    @Override
    @Transactional
    public Role findByName(String name) {
        return repository.findByName(name);
    }
}
