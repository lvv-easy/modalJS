package project.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginPageController {

    @GetMapping(value = "/login")
    public String loginPage() {
        return "login";
    }
}