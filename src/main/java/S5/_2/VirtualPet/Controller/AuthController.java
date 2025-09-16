package S5._2.VirtualPet.Controller;

import S5._2.VirtualPet.Dto.LoginRequestDTO;
import S5._2.VirtualPet.Dto.LoginResponseDTO;
import S5._2.VirtualPet.Dto.UserRequestDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Mapper.UserMapper;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import S5._2.VirtualPet.Security.JwtUtil;
import S5._2.VirtualPet.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRequestDTO dto) {
        log.info("Register attempt for username={} email={}", dto.getUsername(), dto.getEmail());
        User user = userService.register(dto.getUsername(), dto.getEmail(), dto.getPassword());
        UserResponseDTO response = userMapper.toUserResponse(user);
        log.info("User registered successfully id={} username={}", user.getId(), user.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        log.info("Login attempt for email={}", dto.getEmail());
        User user = userService.login(dto.getEmail(), dto.getPassword());
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        log.info("User logged in successfully id={} email={}", user.getId(), user.getEmail());
        return ResponseEntity.ok(new LoginResponseDTO("Login successful", token));
    }

    @GetMapping("/me")
    public UserResponseDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        log.debug("Fetching current user with email={}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found for email={}", email);
                    return new RuntimeException("User not found");
                });
        return userMapper.toUserResponse(user);
    }
}
