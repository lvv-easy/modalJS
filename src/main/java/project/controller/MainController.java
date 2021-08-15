package project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/")
public class MainController {

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String loginPage() {
        return "login";
    }

    @GetMapping("/user")
    public String getCurrentUserInfo(Model model) {
        return "show";
    }

    @GetMapping("/admin/users")
    public String getAllUsers(Model model) {
        return "index";
    }
}