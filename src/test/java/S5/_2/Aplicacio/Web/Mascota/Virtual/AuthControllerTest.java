package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Controller.AuthController;
import S5._2.VirtualPet.Dto.UserRequestDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Exception.InvalidCredentialsException;
import S5._2.VirtualPet.Mapper.UserMapper;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Security.JwtUtil;
import S5._2.VirtualPet.Service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserService userService;
    @Mock
    private UserMapper userMapper;
    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthController authController;

    @Test
    void shouldRegisterUserSuccessfully_whenRequestIsValid() {
        UserRequestDTO request = new UserRequestDTO("Ignasi", "1234");

        User user = new User();
        user.setId(1L);
        user.setUsername("Ignasi");
        user.setPassword("encoded");
        user.setRole("ROLE_USER");

        UserResponseDTO expectedResponse = new UserResponseDTO(1L, "Ignasi");

        when(userService.register("Ignasi", "1234")).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(expectedResponse);

        var response = authController.register(request);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(expectedResponse.getId(), response.getBody().getId());
        assertEquals(expectedResponse.getUsername(), response.getBody().getUsername());

        verify(userService).register("Ignasi", "1234");
        verify(userMapper).toUserResponse(user);
    }

    @Test
    void shouldLoginUserSuccessfully_whenCredentialsAreValid() {
        UserRequestDTO request = new UserRequestDTO("Ignasi", "1234");

        User user = new User();
        user.setId(1L);
        user.setUsername("Ignasi");
        user.setPassword("encoded");

        String expectedToken = "fake-jwt-token";

        when(userService.login("Ignasi", "1234")).thenReturn(user);
        when(jwtUtil.generateToken("Ignasi")).thenReturn(expectedToken);

        var response = authController.login(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedToken, response.getBody().getToken());

        verify(userService).login("Ignasi", "1234");
        verify(jwtUtil).generateToken("Ignasi");
    }

    @Test
    void shouldPropagateInvalidCredentialsException_whenCredentialsAreInvalid() {
        UserRequestDTO request = new UserRequestDTO("Ignasi", "wrongpass");

        when(userService.login("Ignasi", "wrongpass"))
                .thenThrow(new InvalidCredentialsException("Invalid username or password"));

        try {
            authController.login(request);
        } catch (InvalidCredentialsException e) {
            assertEquals("Invalid username or password", e.getMessage());
        }

        verify(userService).login("Ignasi", "wrongpass");
        verifyNoInteractions(jwtUtil);
    }
}
