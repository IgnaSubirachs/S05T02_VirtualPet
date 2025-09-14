package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Security.JwtUtil;
import S5._2.VirtualPet.Service.PetService.PetService;
import S5._2.VirtualPet.Service.User.UserService;
import S5._2.VirtualPet.VirtualPetApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = {VirtualPetApplication.class, SecurityConfigTest.MockConfig.class})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtUtil jwtUtil;

    @TestConfiguration
    static class MockConfig {
        @Bean
        JwtUtil jwtUtil() {
            return mock(JwtUtil.class);
        }

        @Bean
        UserService userService() {
            return mock(UserService.class);
        }

        @Bean
        PetService petService() {
            return mock(PetService.class);
        }
    }

    @Test
    void shouldDenyAccessToProtectedEndpointsWithoutToken() throws Exception {
        mockMvc.perform(get("/api/pets"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldDenyAccessToAdminEndpointsWithUserToken() throws Exception {
        when(jwtUtil.validateToken("usertoken")).thenReturn(true);
        when(jwtUtil.extractUsername("usertoken")).thenReturn("user@mail.com");
        when(jwtUtil.extractRole("usertoken")).thenReturn("ROLE_USER");

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer usertoken"))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldAllowAccessToAdminEndpointsWithAdminToken() throws Exception {
        when(jwtUtil.validateToken("admintoken")).thenReturn(true);
        when(jwtUtil.extractUsername("admintoken")).thenReturn("admin@mail.com");
        when(jwtUtil.extractRole("admintoken")).thenReturn("ROLE_ADMIN");

        mockMvc.perform(get("/api/admin/stats")
                        .header("Authorization", "Bearer admintoken"))
                .andExpect(status().isOk());
    }
}
