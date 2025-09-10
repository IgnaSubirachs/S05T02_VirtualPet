package S5._2.Aplicacio.Web.Mascota.Virtual;


import S5._2.VirtualPet.Controller.AuthController;
import S5._2.VirtualPet.Dto.UserRequestDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Mapper.UserMapper;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)
class AthControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthController authController;

    @Test
    void shouldRegisterUserSuccessfully_whenRequestIsValid() throws Exception {

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

}
