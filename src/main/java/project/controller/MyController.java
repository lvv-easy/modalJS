package project.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import project.entity.User;
import project.service.RoleService;
import project.service.UserService;

import java.security.Principal;

@Controller
@RequestMapping()
public class MyController {

    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;

    @GetMapping("/admin")
    public String getUsers(ModelMap model) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        model.addAttribute("user", userService.getByEmail(email));
        model.addAttribute("roles", roleService.getAllRoles());
        return "users";
    }

    @GetMapping("/user")
    public String showUser(ModelMap model, Principal principal) {
        User user = userService.getByEmail(principal.getName());
        model.addAttribute("user", user);
        return "user";
    }
    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String loginPage() {
        return "login";
    }
}
