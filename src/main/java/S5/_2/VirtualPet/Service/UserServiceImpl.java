package S5._2.VirtualPet.Service;

import S5._2.VirtualPet.Exception.InvalidCredentialsException;
import S5._2.VirtualPet.Exception.ReservedUsernameException;
import S5._2.VirtualPet.Exception.UsernameAlreadyExistsException;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import S5._2.VirtualPet.Security.JwtUtil;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public User register(String username, String password) {
        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new UsernameAlreadyExistsException(username);
        }
        if("admin".equalsIgnoreCase(username)){
            throw new ReservedUsernameException(username);
        }

        User user = User.builder()
                .username(username)
                .password(password)
                .role("ROLE_USER")
                .build();

        return userRepository.save(user);
    }

    @Override
    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!user.getPassword().equals(password)) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        return jwtUtil.generateToken(user.getUsername());
    }
}