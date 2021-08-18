package project.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import project.entity.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(" SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.roles ")
    List<User> findAll();

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.id = (:id)")
    User getById(@Param("id") Long id);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.roles WHERE u.email = (:email)")
    User getByEmail(@Param("email") String email);
}
