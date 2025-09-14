package S5._2.VirtualPet.Controller;

import S5._2.VirtualPet.Dto.AdminStats;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Service.PetService.PetService;
import S5._2.VirtualPet.Service.User.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin") // 🔥 canviat de /admin a /api/admin
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private PetService petService;

    @GetMapping("/hello")
    public String helloAdmin() {
        return "Oh welcome holly admin!";
    }

    @GetMapping("/users")
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{userId}/pets")
    public List<PetResponseDTO> getUserPets(@PathVariable Long userId) {
        return petService.getPetsByUserId(userId);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/pets/{petId}")
    public ResponseEntity<Void> deletePet(@PathVariable Long petId) {
        petService.deletePet(petId, true);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public AdminStats getStats() {
        AdminStats stats = new AdminStats();
        stats.setTotalUsers(userService.getTotalUsers());
        stats.setActiveUsers(userService.getActiveUsers());
        stats.setTotalPets(petService.getTotalPets());
        return stats;
    }
}
