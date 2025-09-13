package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Dto.UserRequestDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Mapper.UserMapper;
import S5._2.VirtualPet.Model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    void setUp() {
        userMapper = new UserMapper();
    }

    @Test
    void shouldMapUserRequestDTOToUser() {
        UserRequestDTO dto = new UserRequestDTO("Ignasi", "ignasi@mail.com", "1234");

        User user = userMapper.toUser(dto);

        assertNotNull(user);
        assertEquals("Ignasi", user.getUsername());
        assertEquals("1234", user.getPassword());
        assertEquals("ignasi@mail.com", user.getEmail());
        assertEquals("ROLE_USER", user.getRole()); // 👈 comprovar que sempre posa ROLE_USER
    }

    @Test
    void shouldMapUserToUserResponseDTO() {
        User user = new User();
        user.setId(1L);
        user.setUsername("Ignasi");
        user.setPassword("1234"); // no s’hauria de mapejar al response
        user.setEmail("ignasi@mail.com");
        user.setRole("ROLE_USER");

        UserResponseDTO dto = userMapper.toUserResponse(user);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Ignasi", dto.getUsername());
        assertEquals("ignasi@mail.com", dto.getEmail());
        assertEquals("ROLE_USER", dto.getRole()); // 👈 comprovar també el role
    }
}
