package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Controller.AuthController;
import S5._2.VirtualPet.Dto.LoginRequestDTO;
import S5._2.VirtualPet.Dto.LoginResponseDTO;
import S5._2.VirtualPet.Dto.UserRequestDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Exception.InvalidCredentialsException;
import S5._2.VirtualPet.Mapper.UserMapper;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Security.JwtUtil;
import S5._2.VirtualPet.Service.User.UserService;
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
        UserRequestDTO request = new UserRequestDTO("Ignasi", "ignasubirachs@gmail.com", "1234");

        User user = new User();
        user.setId(1L);
        user.setUsername("Ignasi");
        user.setEmail("ignasubirachs@gmail.com");
        user.setPassword("encoded");
        user.setRole("ROLE_USER");

        UserResponseDTO expectedResponse =
                new UserResponseDTO(1L, "Ignasi", "ignasubirachs@gmail.com", "ROLE_USER");

        when(userService.register("Ignasi", "ignasubirachs@gmail.com", "1234")).thenReturn(user);
        when(userMapper.toUserResponse(user)).thenReturn(expectedResponse);

        var response = authController.register(request);

        assertEquals(201, response.getStatusCodeValue());
        assertEquals(expectedResponse.getId(), response.getBody().getId());
        assertEquals(expectedResponse.getUsername(), response.getBody().getUsername());
        assertEquals(expectedResponse.getEmail(), response.getBody().getEmail());

        verify(userService).register("Ignasi", "ignasubirachs@gmail.com", "1234");
        verify(userMapper).toUserResponse(user);
    }

    @Test
    void shouldLoginUserSuccessfully_whenCredentialsAreValid() {
        LoginRequestDTO request = new LoginRequestDTO("ignasubirachs@gmail.com", "1234");

        User user = new User();
        user.setId(1L);
        user.setUsername("Ignasi");
        user.setEmail("ignasubirachs@gmail.com");
        user.setPassword("encoded");
        user.setRole("ROLE_USER");

        String expectedToken = "fake-jwt-token";

        when(userService.login("ignasubirachs@gmail.com", "1234")).thenReturn(user);
        when(jwtUtil.generateToken("ignasubirachs@gmail.com", "ROLE_USER")).thenReturn(expectedToken);

        var response = authController.login(request);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(expectedToken, response.getBody().getToken());
        assertEquals("Login successful", response.getBody().getMessage());

        verify(userService).login("ignasubirachs@gmail.com", "1234");
        verify(jwtUtil).generateToken("ignasubirachs@gmail.com", "ROLE_USER");
    }


    @Test
    void shouldPropagateInvalidCredentialsException_whenCredentialsAreInvalid() {
        LoginRequestDTO request = new LoginRequestDTO("ignasubirachs@gmail.com", "wrongpass");

        when(userService.login("ignasubirachs@gmail.com", "wrongpass"))
                .thenThrow(new InvalidCredentialsException("Invalid email or password"));

        try {
            authController.login(request);
        } catch (InvalidCredentialsException e) {
            assertEquals("Invalid email or password", e.getMessage());
        }

        verify(userService).login("ignasubirachs@gmail.com", "wrongpass");
        verifyNoInteractions(jwtUtil);
    }
}

