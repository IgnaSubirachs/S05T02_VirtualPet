package S5._2.VirtualPet.Service;

import S5._2.VirtualPet.Exception.UsernameAlreadyExistsException;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String username, String password) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        if(existingUser.isPresent()){
            throw new UsernameAlreadyExistsException(username);
        }
        User user = User.builder()
                .username(username)
                .password(password)
                .role("ROLE_USER")
                .build();
        return userRepository.save(user);

    }
}
