package S5._2.VirtualPet.Controller;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Service.PetService.PetServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets") // 🔥 canviat de /pets a /api/pets
@RequiredArgsConstructor
public class PetController {

    private final PetServiceImpl petService;

    @Operation(summary = "Create a new pet", description = "Creates a new alien creature for the given user.")
    @PostMapping("/{userId}")
    public ResponseEntity<PetResponseDTO> createPet(
            @PathVariable Long userId,
            @RequestBody PetRequestDTO dto) {
        return ResponseEntity.ok(petService.createPet(userId, dto));
    }

    @Operation(summary = "Get all pets for a user", description = "Retrieves the zoo of alien creatures owned by the user.")
    @GetMapping("/{userId}")
    public ResponseEntity<List<PetResponseDTO>> getPetsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(petService.getPetsByUserId(userId));
    }

    @Operation(summary = "Update a pet", description = "Update the basic attributes of a pet (name, species, hunger, aggressiveness).")
    @PutMapping("/{petId}")
    public ResponseEntity<PetResponseDTO> updatePet(
            @PathVariable Long petId,
            @RequestBody PetRequestDTO dto) {
        return ResponseEntity.ok(petService.updatePet(petId, dto));
    }

    @Operation(summary = "Delete a pet", description = "Deletes a pet. If the pet is REBELLIOUS, deletion is mandatory. If CALM/ANGRY, deletion requires 'forced=true'.")
    @DeleteMapping("/{petId}")
    public ResponseEntity<String> deletePet(
            @PathVariable Long petId,
            @RequestParam(defaultValue = "false") boolean forced) {
        petService.deletePet(petId, forced);

        if (forced) {
            return ResponseEntity.ok("The creature looked at you with glowing eyes. It would never have hurt you... yet you pressed the button.");
        } else {
            return ResponseEntity.ok("The creature rebelled and you had no choice but to end it.");
        }
    }

    @Operation(summary = "Feed a pet", description = "Feeds the pet, reducing hunger by 20 points.")
    @PostMapping("/{petId}/feed")
    public ResponseEntity<PetResponseDTO> feedPet(@PathVariable Long petId) {
        return ResponseEntity.ok(petService.feedPet(petId));
    }

    @Operation(summary = "Play with a pet", description = "Plays with the pet, reducing aggressiveness and increasing its level.")
    @PostMapping("/{petId}/play")
    public ResponseEntity<PetResponseDTO> playWithPet(@PathVariable Long petId) {
        return ResponseEntity.ok(petService.playWithPet(petId));
    }

    @Operation(summary = "Train a pet", description = "Trains the pet, increasing level by 2 but also increasing aggressiveness.")
    @PostMapping("/{petId}/train")
    public ResponseEntity<PetResponseDTO> trainPet(@PathVariable Long petId) {
        return ResponseEntity.ok(petService.trainPet(petId));
    }

    @GetMapping
    public ResponseEntity<List<PetResponseDTO>> getPetsForCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(petService.getPetsByUserEmail(email));
    }
}
