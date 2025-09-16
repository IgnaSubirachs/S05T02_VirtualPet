package S5._2.VirtualPet.Service.User;

import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Exception.InvalidCredentialsException;
import S5._2.VirtualPet.Exception.ReservedUsernameException;
import S5._2.VirtualPet.Exception.ResourceNotFoundException;
import S5._2.VirtualPet.Exception.UsernameAlreadyExistsException;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import S5._2.VirtualPet.Security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(String username, String email, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyExistsException(username);
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new UsernameAlreadyExistsException(email);
        }
        if ("admin".equalsIgnoreCase(username)) {
            throw new ReservedUsernameException(username);
        }

        validatePassword(password);

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("ROLE_USER")
                .build();

        return userRepository.save(user);
    }
    private void validatePassword(String password) {
        String pattern = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).{8,}$";
        if (!password.matches(pattern)) {
            throw new IllegalArgumentException(
                    "Password must be at least 8 characters long and contain letters, numbers, and symbols."
            );
        }
    }


    @Override
    public User login(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return user;
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDTO(user.getId(), user.getEmail(), user.getUsername(), user.getRole()))
                .toList();
    }

    @Override
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Override
    public long getTotalUsers() {
        return userRepository.count();
    }

    @Override
    public long getActiveUsers() {
        return userRepository.count();
    }

    @Override
    public long getTodayLoginsCount() {
        return 0;
    }

    @Override
    public long getTodayRegistrationsCount() {
        return 0;
    }
}