package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Controller.AuthController;
import S5._2.VirtualPet.Dto.UserRequestDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Exception.InvalidCredentialsException;
import S5._2.VirtualPet.Mapper.UserMapper;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthController authController;

    @Test
    void shouldRegisterUserSuccessfully_whenRequestIsValid() {
        UserRequestDTO request = new UserRequestDTO("Ignasi", "1234");

        User user = new User();
        user.setUsername("Ignasi");
        user.setPassword("1234");

        UserResponseDTO expectedResponse = new UserResponseDTO(1L, "Ignasi");

        when(userService.register("Ignasi", "1234")).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(expectedResponse);

        UserResponseDTO actualResponse = authController.register(request).getBody();

        assertEquals(expectedResponse.getId(), actualResponse.getId());
        assertEquals(expectedResponse.getUsername(), actualResponse.getUsername());

        verify(userService).register("Ignasi", "1234");
        verify(userMapper).toUserResponse(user);
    }

    @Test
    void shouldLoginUserSuccessfully_whenCredentialsAreValid() {
        UserRequestDTO request = new UserRequestDTO("Ignasi", "1234");
        String expectedToken = "fake-jwt-token";

        when(userService.login("Ignasi", "1234")).thenReturn(expectedToken);

        var response = authController.login(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedToken, response.getBody().get("token"));

        verify(userService).login("Ignasi", "1234");
    }

    @Test
    void shouldThrowException_whenCredentialsAreInvalid() {
        UserRequestDTO request = new UserRequestDTO("Ignasi", "wrongpass");

        when(userService.login("Ignasi", "wrongpass"))
                .thenThrow(new InvalidCredentialsException("Invalid username or password"));

        InvalidCredentialsException exception = assertThrows(
                InvalidCredentialsException.class,
                () -> authController.login(request)
        );

        assertEquals("Invalid username or password", exception.getMessage());
        verify(userService).login("Ignasi", "wrongpass");
    }
}
