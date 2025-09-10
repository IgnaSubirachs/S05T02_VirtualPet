package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Exception.UsernameAlreadyExistsException;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import S5._2.VirtualPet.Service.UserService;
import S5._2.VirtualPet.Service.UserServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final UserService userService = new UserServiceImpl(userRepository);


    @Test
    void shouldRegisterUserSuccessfully_whenUsernameIsValidAndUnique() {

        String username = "Ignasi";
        String password = "1234";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        when(userRepository.save(any(User.class)))
                .thenAnswer(invotacion -> invotacion.getArgument(0));

        User user = userService.register(username, password);

        assertThat(user.getUsername()).isEqualTo(username);
        assertThat(user.getPassword()).isNotNull();
        verify(userRepository).save(any(User.class));

    }

    @Test
    void shouldTrowException_whenUsernameAlreadyExists() {

        String username = "Ignasi";
        String password = "1234";
        User existingUser = new User();
        existingUser.setUsername(username);
        existingUser.setPassword("existingPass");

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(existingUser));

        UsernameAlreadyExistsException exception = assertThrows(
                UsernameAlreadyExistsException.class,
                () -> userService.register(username, password));
        assertEquals("Username 'Ignasi' already exists", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }
}
