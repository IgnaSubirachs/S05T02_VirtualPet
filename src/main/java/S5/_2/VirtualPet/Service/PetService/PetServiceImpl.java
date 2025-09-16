package S5._2.VirtualPet.Service.PetService;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Exception.ResourceNotFoundException;
import S5._2.VirtualPet.Mapper.PetMapper;
import S5._2.VirtualPet.Model.Pet;
import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Model.enums.Status;
import S5._2.VirtualPet.Repositories.PetRepository;
import S5._2.VirtualPet.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Override
    public PetResponseDTO createPet(Long userId, PetRequestDTO dto) {
        User owner = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pet pet = PetMapper.toEntity(dto);
        pet.setOwner(owner);
        pet.setLevel(1);
        updateStatus(pet);
        pet.setStatus(Status.CALM);

        return PetMapper.toDTO(petRepository.save(pet));
    }

    @Override
    public List<PetResponseDTO> getPetsByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return petRepository.findByOwnerId(user.getId()).stream()
                .map(PetMapper::toDTO)
                .toList();
    }

    @Override
    public List<PetResponseDTO> getPetsByUserId(Long userId) {
        return petRepository.findByOwnerId(userId).stream()
                .map(PetMapper::toDTO)
                .toList();
    }

    @Override
    public PetResponseDTO updatePet(Long petId, PetRequestDTO dto) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found"));

        pet.setName(dto.getName());
        pet.setSpecies(dto.getSpecies());
        pet.setHunger(dto.getHunger());
        pet.setAggressiveness(dto.getAggressiveness());

        updateStatus(pet);

        return PetMapper.toDTO(petRepository.save(pet));
    }

    @Override
    public void deletePet(Long petId, boolean forced) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found"));

        updateStatus(pet);

        if (pet.getStatus() == Status.REBELLIOUS || forced) {
            petRepository.delete(pet);
        } else {
            throw new IllegalStateException("Pet is calm/angry. Deletion not allowed unless forced.");
        }
    }

    @Override
    public void deletePet(Long petId) {
        deletePet(petId, true);
    }

    @Override
    public PetResponseDTO feedPet(Long petId) {
        Pet pet = getPetById(petId);
        pet.setHunger(Math.max(0, pet.getHunger() - 30));
        pet.setLastFedAt(LocalDateTime.now());
        updateStatus(pet);
        return PetMapper.toDTO(petRepository.save(pet));
    }

    @Override
    public PetResponseDTO playWithPet(Long petId) {
        Pet pet = getPetById(petId);
        pet.setAggressiveness(Math.max(0, pet.getAggressiveness() - 15));
        pet.setLevel(pet.getLevel() + 1);
        pet.setHunger(Math.min(100, pet.getHunger() + 5));
        pet.setLastInteractedAt(LocalDateTime.now());
        updateStatus(pet);
        return PetMapper.toDTO(petRepository.save(pet));
    }

    @Override
    public PetResponseDTO trainPet(Long petId) {
        Pet pet = getPetById(petId);
        pet.setLevel(pet.getLevel() + 2);
        pet.setAggressiveness(Math.min(100, pet.getAggressiveness() + 10));
        pet.setHunger(Math.min(100, pet.getHunger() + 10));
        updateStatus(pet);
        return PetMapper.toDTO(petRepository.save(pet));
    }


    @Override
    public long getTotalPets() {
        return petRepository.count();
    }


    private Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet not found"));
    }

    private void updateStatus(Pet pet) {
        if (pet.getAggressiveness() >= 80 || pet.getHunger() >= 80) {
            pet.setStatus(Status.REBELLIOUS);
        } else if (pet.getAggressiveness() >= 50 || pet.getHunger() >= 50) {
            pet.setStatus(Status.ANGRY);
        } else {
            pet.setStatus(Status.CALM);
        }
    }
}
