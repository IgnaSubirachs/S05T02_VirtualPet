// UserService.java
package S5._2.VirtualPet.Service;

import S5._2.VirtualPet.Model.User;

public interface UserService {
    User register(String username, String password);
    String login(String username, String password);
}
