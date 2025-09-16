package S5._2.VirtualPet.Controller;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Service.PetService.PetServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
@Slf4j
public class PetController {

    private final PetServiceImpl petService;

    @Operation(summary = "Create a new pet", description = "Creates a new alien creature for the given user.")
    @PostMapping("/{userId}")
    public ResponseEntity<PetResponseDTO> createPet(
            @PathVariable Long userId,
            @RequestBody PetRequestDTO dto) {
        log.info("Request to create pet for userId={}", userId);
        PetResponseDTO response = petService.createPet(userId, dto);
        log.info("Pet created successfully with id={} for userId={}", response.getId(), userId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get all pets for a user", description = "Retrieves the zoo of alien creatures owned by the user.")
    @GetMapping("/{userId}")
    public ResponseEntity<List<PetResponseDTO>> getPetsByUserId(@PathVariable Long userId) {
        log.debug("Fetching pets for userId={}", userId);
        return ResponseEntity.ok(petService.getPetsByUserId(userId));
    }

    @Operation(summary = "Update a pet", description = "Update the basic attributes of a pet (name, species, hunger, aggressiveness).")
    @PutMapping("/{petId}")
    public ResponseEntity<PetResponseDTO> updatePet(
            @PathVariable Long petId,
            @RequestBody PetRequestDTO dto) {
        log.info("Request to update petId={}", petId);
        PetResponseDTO response = petService.updatePet(petId, dto);
        log.info("Pet updated successfully petId={}", petId);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Delete a pet", description = "Deletes a pet. If the pet is REBELLIOUS, deletion is mandatory. If CALM/ANGRY, deletion requires 'forced=true'.")
    @DeleteMapping("/{petId}")
    public ResponseEntity<String> deletePet(
            @PathVariable Long petId,
            @RequestParam(defaultValue = "false") boolean forced) {
        log.warn("Request to delete petId={} forced={}", petId, forced);
        petService.deletePet(petId, forced);

        if (forced) {
            log.info("Pet petId={} deleted with forced=true", petId);
            return ResponseEntity.ok("The creature looked at you with glowing eyes. It would never have hurt you... yet you pressed the button.");
        } else {
            log.info("Pet petId={} deleted due to rebellious status", petId);
            return ResponseEntity.ok("The creature rebelled and you had no choice but to end it.");
        }
    }

    @Operation(summary = "Feed a pet", description = "Feeds the pet, reducing hunger by 20 points.")
    @PostMapping("/{petId}/feed")
    public ResponseEntity<PetResponseDTO> feedPet(@PathVariable Long petId) {
        log.info("Feeding petId={}", petId);
        return ResponseEntity.ok(petService.feedPet(petId));
    }

    @Operation(summary = "Play with a pet", description = "Plays with the pet, reducing aggressiveness and increasing its level.")
    @PostMapping("/{petId}/play")
    public ResponseEntity<PetResponseDTO> playWithPet(@PathVariable Long petId) {
        log.info("Playing with petId={}", petId);
        return ResponseEntity.ok(petService.playWithPet(petId));
    }

    @Operation(summary = "Train a pet", description = "Trains the pet, increasing level by 2 but also increasing aggressiveness.")
    @PostMapping("/{petId}/train")
    public ResponseEntity<PetResponseDTO> trainPet(@PathVariable Long petId) {
        log.info("Training petId={}", petId);
        return ResponseEntity.ok(petService.trainPet(petId));
    }

    @GetMapping
    public ResponseEntity<List<PetResponseDTO>> getPetsForCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        log.debug("Fetching pets for current user email={}", email);
        return ResponseEntity.ok(petService.getPetsByUserEmail(email));
    }
}
