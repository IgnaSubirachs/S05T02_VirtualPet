package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.UserRequestDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static S5._2.VirtualPet.Model.enums.Species.PREDATOR;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void endToEnd_registerLoginCreatePet() throws Exception {

        UserRequestDTO registerDto = new UserRequestDTO();
        registerDto.setUsername("ignasi");
        registerDto.setEmail("ignasi@example.com");
        registerDto.setPassword("P@ssw0rd!");

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isCreated());


        String loginPayload = """
                {"email": "ignasi@example.com", "password": "P@ssw0rd!"}
                """;

        MvcResult loginResult = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        assertThat(loginResponse).contains("token");
        String token = objectMapper.readTree(loginResponse).get("token").asText();


        PetRequestDTO petRequest = new PetRequestDTO();
        petRequest.setName("Predator");
        petRequest.setSpecies(PREDATOR);
        petRequest.setHunger(50);
        petRequest.setAggressiveness(30);

        mockMvc.perform(post("/api/pets/{userId}", 1L) // 👈 id usuari = 1 (el primer creat)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(petRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Predator"));


        mockMvc.perform(get("/api/pets")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Predator"));
    }
}