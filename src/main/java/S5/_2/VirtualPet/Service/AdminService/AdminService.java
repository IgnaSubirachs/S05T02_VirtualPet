package S5._2.VirtualPet.Service.AdminService;

import S5._2.VirtualPet.Dto.AdminStats;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Dto.UserResponseDTO;
import S5._2.VirtualPet.Service.PetService.PetService;
import S5._2.VirtualPet.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserService userService;
    private final PetService petService;

    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    public List<PetResponseDTO> getUserPets(Long userId) {
        return petService.getPetsByUserId(userId);
    }

    public void deleteUser(Long userId) {
        userService.deleteUser(userId);
    }

    public void deletePet(Long petId) {
        petService.deletePet(petId, true);
    }

    public AdminStats getStats() {
        AdminStats stats = new AdminStats();
        stats.setTotalUsers(userService.getTotalUsers());
        stats.setActiveUsers(userService.getActiveUsers());
        stats.setTotalPets(petService.getTotalPets());
        stats.setDailyLogins(userService.getTodayLoginsCount());
        stats.setNewRegistrations(userService.getTodayRegistrationsCount());
        return stats;
    }
}
