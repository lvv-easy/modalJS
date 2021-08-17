package project.controller.view;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserPageController {

    @GetMapping("/user")
    public String getCurrentUserInfo() {
        return "show";
    }
}
