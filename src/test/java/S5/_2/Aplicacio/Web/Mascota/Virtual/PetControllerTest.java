package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Controller.PetController;
import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Model.enums.Species;
import S5._2.VirtualPet.Model.enums.Status;
import S5._2.VirtualPet.Service.PetService.PetServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PetControllerTest {

    @Mock
    private PetServiceImpl petService;

    @InjectMocks
    private PetController petController;

    @Test
    void shouldCreatePet() {
        PetRequestDTO request = new PetRequestDTO("Huggy", Species.FACEHUGGER, 70, 40);
        PetResponseDTO responseDTO = new PetResponseDTO(
                1L, "Huggy", Species.FACEHUGGER, 1, 70, 40, Status.CALM
        );

        when(petService.createPet(eq(1L), any(PetRequestDTO.class))).thenReturn(responseDTO);

        ResponseEntity<PetResponseDTO> result = petController.createPet(1L, request);

        assertThat(result.getStatusCodeValue()).isEqualTo(200);
        assertThat(result.getBody()).isNotNull();
        assertThat(result.getBody().getName()).isEqualTo("Huggy");
    }

    @Test
    void shouldGetPetsByUser() {
        PetResponseDTO pet1 = new PetResponseDTO(
                1L, "XenoOne", Species.XENOMORPH, 2, 50, 20, Status.ANGRY
        );
        PetResponseDTO pet2 = new PetResponseDTO(
                2L, "Predo", Species.PREDATOR, 3, 30, 60, Status.REBELLIOUS
        );

        when(petService.getPetsByUser(1L)).thenReturn(List.of(pet1, pet2));

        ResponseEntity<List<PetResponseDTO>> result = petController.getPetsByUser(1L);

        assertThat(result.getStatusCodeValue()).isEqualTo(200);
        assertThat(result.getBody()).hasSize(2);
        assertThat(result.getBody().get(0).getName()).isEqualTo("XenoOne");
        assertThat(result.getBody().get(1).getName()).isEqualTo("Predo");
    }
}

