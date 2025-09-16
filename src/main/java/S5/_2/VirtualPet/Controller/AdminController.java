package S5._2.VirtualPet.Controller;

import S5._2.VirtualPet.Dto.AdminStats;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Service.PetService.PetService;
import S5._2.VirtualPet.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final UserService userService;
    private final PetService petService;

    @GetMapping("/hello")
    public String helloAdmin() {
        log.info("Admin endpoint '/hello' accessed");
        return "Oh welcome holly admin!";
    }

    @GetMapping("/users")
    public List<UserResponseDTO> getAllUsers() {
        log.info("Fetching all users");
        return userService.getAllUsers();
    }

    @GetMapping("/users/{userId}/pets")
    public List<PetResponseDTO> getUserPets(@PathVariable Long userId) {
        log.info("Fetching pets for userId={}", userId);
        return petService.getPetsByUserId(userId);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        log.warn("Admin deleting userId={}", userId);
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/pets/{petId}")
    public ResponseEntity<Void> deletePet(@PathVariable Long petId) {
        log.warn("Admin deleting petId={}", petId);
        petService.deletePet(petId, true);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public AdminStats getStats() {
        log.info("Fetching system stats");
        AdminStats stats = new AdminStats();
        stats.setTotalUsers(userService.getTotalUsers());
        stats.setActiveUsers(userService.getActiveUsers());
        stats.setTotalPets(petService.getTotalPets());
        log.debug("Stats: totalUsers={}, activeUsers={}, totalPets={}",
                stats.getTotalUsers(), stats.getActiveUsers(), stats.getTotalPets());
        return stats;
    }
}
