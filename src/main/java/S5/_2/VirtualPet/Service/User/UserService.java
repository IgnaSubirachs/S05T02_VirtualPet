// UserService.java
package S5._2.VirtualPet.Service.User;

import S5._2.VirtualPet.Model.User;

public interface UserService {
    User register(String username, String password);
    User login(String username, String password);
}
