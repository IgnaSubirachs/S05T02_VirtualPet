package S5._2.VirtualPet.Service.PetService;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;

import java.util.List;

public interface PetService {
    PetResponseDTO createPet(Long userId, PetRequestDTO dto);
    List<PetResponseDTO> getPetsByUserId(Long userId);
    List<PetResponseDTO> getPetsByUserEmail(String email);
    PetResponseDTO updatePet(Long petId, PetRequestDTO dto);
    void deletePet(Long petId, boolean forced);
    void deletePet(Long petId);
    long getTotalPets();
    PetResponseDTO feedPet(Long petId);
    PetResponseDTO playWithPet(Long petId);
    PetResponseDTO trainPet(Long petId);
}

