
package S5._2.VirtualPet.Service.User;

import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Model.User;

import java.util.List;

public interface UserService {
    User register(String username, String email, String password);


    User login(String usernameOrEmail, String password);

    //Admin
    List<UserResponseDTO> getAllUsers();
    void deleteUser(Long userId);

    long getTotalUsers();
    long getActiveUsers();
    long getTodayLoginsCount();
    long getTodayRegistrationsCount();
}