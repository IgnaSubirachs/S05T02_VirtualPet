package S5._2.VirtualPet.Controller;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Service.PetService.PetServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetServiceImpl petService;


    @PostMapping("/{userId}")
    public ResponseEntity<PetResponseDTO> createPet(
            @PathVariable Long userId,
            @RequestBody PetRequestDTO dto) {
        return ResponseEntity.ok(petService.createPet(userId, dto));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PetResponseDTO>> getPetsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(petService.getPetsByUser(userId));
    }

    @PutMapping("/{petId}")
    public ResponseEntity<PetResponseDTO> updatePet(
            @PathVariable Long petId,
            @RequestBody PetRequestDTO dto) {
        return ResponseEntity.ok(petService.updatePet(petId, dto));
    }

    @DeleteMapping("/{petId}")
    public ResponseEntity<String> deletePet(
            @PathVariable Long petId,
            @RequestParam(defaultValue = "false") boolean forced) {

        try {
            petService.deletePet(petId, forced);
            if (forced) {
                return ResponseEntity.ok("The creature looked at you with glowing eyes. It would never have hurt you... yet you pressed the button.");
            } else {
                return ResponseEntity.ok("The creature rebelled and you had no choice but to end it.");
            }
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/{petId}/feed")
    public ResponseEntity<PetResponseDTO> feedPet(@PathVariable Long petId) {
        return ResponseEntity.ok(petService.feedPet(petId));
    }

    @PostMapping("/{petId}/play")
    public ResponseEntity<PetResponseDTO> playWithPet(@PathVariable Long petId) {
        return ResponseEntity.ok(petService.playWithPet(petId));
    }

    @PostMapping("/{petId}/train")
    public ResponseEntity<PetResponseDTO> trainPet(@PathVariable Long petId) {
        return ResponseEntity.ok(petService.trainPet(petId));
    }


}
