package project.service;

import org.springframework.transaction.annotation.Transactional;
import project.entity.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();

    User save(User user);

    User update(User user);

    void delete(Long id);

    User getById(Long id);

    User getByEmail(String email);
}
