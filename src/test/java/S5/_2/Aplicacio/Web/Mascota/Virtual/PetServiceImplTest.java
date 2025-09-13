package S5._2.VirtualPet.Service;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Model.*;
import S5._2.VirtualPet.Model.enums.Species;
import S5._2.VirtualPet.Model.enums.Status;
import S5._2.VirtualPet.Repositories.PetRepository;
import S5._2.VirtualPet.Repositories.UserRepository;
import S5._2.VirtualPet.Service.PetService.PetServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PetServiceImplTest {

    @Autowired
    private PetServiceImpl petService;

    @Autowired
    private PetRepository petRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {

        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setPassword("1234");
        userRepository.save(testUser);
    }

    @Test
    void createPet_shouldPersistInDatabase() {
        PetRequestDTO dto = PetRequestDTO.builder()
                .name("Xeno")
                .species(Species.XENOMORPH)
                .hunger(10)
                .aggressiveness(20)
                .build();

        PetResponseDTO response = petService.createPet(testUser.getId(), dto);

        assertNotNull(response.getId());
        assertEquals("Xeno", response.getName());
        assertEquals(Status.CALM, response.getStatus());


        assertEquals(1, petRepository.findAll().size());
    }

    @Test
    void feedPet_shouldReduceHungerAndUpdateLastFedAt() {

        PetRequestDTO dto = PetRequestDTO.builder()
                .name("Predator")
                .species(Species.PREDATOR)
                .hunger(50)
                .aggressiveness(20)
                .build();
        PetResponseDTO created = petService.createPet(testUser.getId(), dto);


        PetResponseDTO fed = petService.feedPet(created.getId());

        assertEquals(30, fed.getHunger()); // 50 - 20
        assertNotNull(petRepository.findById(created.getId()).get().getLastFedAt());
    }

    @Test
    void playWithPet_shouldReduceAggressivenessAndIncreaseLevel() {
        PetRequestDTO dto = PetRequestDTO.builder()
                .name("Facehugger")
                .species(Species.FACEHUGGER)
                .hunger(10)
                .aggressiveness(40)
                .build();
        PetResponseDTO created = petService.createPet(testUser.getId(), dto);

        PetResponseDTO played = petService.playWithPet(created.getId());

        assertEquals(25, played.getAggressiveness());
        assertEquals(2, played.getLevel());
    }

    @Test
    void trainPet_shouldIncreaseLevelAndAggressiveness() {
        PetRequestDTO dto = PetRequestDTO.builder()
                .name("Chestburster")
                .species(Species.ACIDSPITTER)
                .hunger(10)
                .aggressiveness(90)
                .build();
        PetResponseDTO created = petService.createPet(testUser.getId(), dto);

        PetResponseDTO trained = petService.trainPet(created.getId());

        assertEquals(3, trained.getLevel());         // 1 + 2
        assertEquals(100, trained.getAggressiveness()); // no passa de 100
    }

    @Test
    void deletePet_shouldWorkWhenForced() {
        PetRequestDTO dto = PetRequestDTO.builder()
                .name("Engineer")
                .species(Species.NEUROMANCER)
                .hunger(10)
                .aggressiveness(10)
                .build();
        PetResponseDTO created = petService.createPet(testUser.getId(), dto);

        // forcem la eliminació
        petService.deletePet(created.getId(), true);

        assertTrue(petRepository.findAll().isEmpty());
    }

    @Test
    void deletePet_shouldFailIfNotRebelliousAndNotForced() {
        PetRequestDTO dto = PetRequestDTO.builder()
                .name("CalmXeno")
                .species(Species.XENOMORPH)
                .hunger(10)
                .aggressiveness(10)
                .build();
        PetResponseDTO created = petService.createPet(testUser.getId(), dto);

        assertThrows(IllegalStateException.class, () -> {
            petService.deletePet(created.getId(), false);
        });
    }

    @Test
    void deletePet_shouldWorkIfRebellious() {
        PetRequestDTO dto = PetRequestDTO.builder()
                .name("AngryXeno")
                .species(Species.XENOMORPH)
                .hunger(90) // rebel per gana
                .aggressiveness(10)
                .build();
        PetResponseDTO created = petService.createPet(testUser.getId(), dto);

        petService.deletePet(created.getId(), false);

        assertTrue(petRepository.findAll().isEmpty());
    }
}
