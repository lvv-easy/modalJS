package project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import project.model.User;
import project.service.RoleService;
import project.service.UserService;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(value = "/rest", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserRestController {

    final UserService userService;
    final RoleService roleService;

    @Autowired
    public UserRestController(UserService service, RoleService roleService) {
        this.userService = service;
        this.roleService = roleService;
    }

    @GetMapping("/user")
    public ResponseEntity<User> getCurrentUserInfo(@AuthenticationPrincipal User user) {
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping("/admin/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/admin/users/{id}")
    public ResponseEntity<User> getUserInfo(@PathVariable("id") Long id) {
        if (id == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        User user = userService.getById(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/admin/users")
    public ResponseEntity<User> create(@RequestBody @Valid User user) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        userService.save(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @PutMapping("/admin/users/{id}")
    public ResponseEntity<User> update(@RequestBody @Valid User user) {
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        userService.save(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/admin/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable("id") Long id) {
        userService.delete(id);
    }
}