package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Exception.InvalidCredentialsException;
import S5._2.VirtualPet.Exception.UsernameAlreadyExistsException;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import S5._2.VirtualPet.Service.User.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void shouldRegisterUserSuccessfully_whenUsernameIsValidAndUnique() {
        String username = "Ignasi";
        String rawPassword = "1234";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(rawPassword)).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.register(username, rawPassword);

        assertEquals("encodedPassword", result.getPassword());
        verify(passwordEncoder).encode(rawPassword);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowException_whenUsernameAlreadyExists() {
        String username = "Ignasi";
        String rawPassword = "1234";

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(new User()));

        assertThrows(UsernameAlreadyExistsException.class,
                () -> userService.register(username, rawPassword));

        verify(userRepository, never()).save(any());
    }

    @Test
    void shouldThrowException_whenLoginCredentialsInvalid() {
        String username = "Ignasi";
        String rawPassword = "wrong";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(InvalidCredentialsException.class,
                () -> userService.login(username, rawPassword));
    }
    @Test
    void shouldLoginSuccessfully_whenCredentialsAreValid() {
        String username = "Ignasi";
        String rawPassword = "1234";
        String encodedPassword = "encodedPassword";

        User user = new User();
        user.setUsername(username);
        user.setPassword(encodedPassword);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);

        User result = userService.login(username, rawPassword);

        assertNotNull(result);
        assertEquals(username, result.getUsername());
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
    }

}
