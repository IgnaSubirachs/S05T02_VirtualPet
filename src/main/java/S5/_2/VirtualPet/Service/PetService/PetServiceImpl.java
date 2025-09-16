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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PetServiceImpl implements PetService {

    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Override
    public PetResponseDTO createPet(Long userId, PetRequestDTO dto) {
        log.info("Creating new pet for userId={}", userId);

        User owner = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User with id {} not found, cannot create pet", userId);
                    return new ResourceNotFoundException("User not found");
                });

        Pet pet = PetMapper.toEntity(dto);
        pet.setOwner(owner);
        pet.setLevel(1);
        updateStatus(pet);

        Pet saved = petRepository.save(pet);
        log.info("Pet created successfully: petId={} for userId={}", saved.getId(), userId);

        return PetMapper.toDTO(saved);
    }

    @Override
    public List<PetResponseDTO> getPetsByUserEmail(String email) {
        log.debug("Fetching pets for user email={}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User with email {} not found", email);
                    return new ResourceNotFoundException("User not found with email: " + email);
                });

        List<PetResponseDTO> pets = petRepository.findByOwnerId(user.getId()).stream()
                .map(PetMapper::toDTO)
                .toList();

        log.info("Found {} pets for user email={}", pets.size(), email);
        return pets;
    }

    @Override
    public List<PetResponseDTO> getPetsByUserId(Long userId) {
        log.debug("Fetching pets for userId={}", userId);

        List<PetResponseDTO> pets = petRepository.findByOwnerId(userId).stream()
                .map(PetMapper::toDTO)
                .toList();

        log.info("Found {} pets for userId={}", pets.size(), userId);
        return pets;
    }

    @Override
    public PetResponseDTO updatePet(Long petId, PetRequestDTO dto) {
        log.info("Updating petId={}", petId);

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> {
                    log.error("Pet with id {} not found", petId);
                    return new ResourceNotFoundException("Pet not found");
                });

        pet.setName(dto.getName());
        pet.setSpecies(dto.getSpecies());
        pet.setHunger(dto.getHunger());
        pet.setAggressiveness(dto.getAggressiveness());
        updateStatus(pet);

        Pet updated = petRepository.save(pet);
        log.info("Pet updated successfully: petId={}, newStatus={}", updated.getId(), updated.getStatus());

        return PetMapper.toDTO(updated);
    }

    @Override
    public void deletePet(Long petId, boolean forced) {
        log.warn("Deleting petId={} forced={}", petId, forced);

        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> {
                    log.error("Pet with id {} not found, cannot delete", petId);
                    return new ResourceNotFoundException("Pet not found");
                });

        updateStatus(pet);

        if (pet.getStatus() == Status.REBELLIOUS || forced) {
            petRepository.delete(pet);
            log.info("Pet deleted successfully: petId={}", petId);
        } else {
            log.warn("Deletion refused for petId={} with status={}", petId, pet.getStatus());
            throw new IllegalStateException("Pet is calm/angry. Deletion not allowed unless forced.");
        }
    }

    @Override
    public void deletePet(Long petId) {
        deletePet(petId, true);
    }

    @Override
    public PetResponseDTO feedPet(Long petId) {
        log.debug("Feeding petId={}", petId);

        Pet pet = getPetById(petId);
        pet.setHunger(Math.max(0, pet.getHunger() - 30));
        pet.setLastFedAt(LocalDateTime.now());
        updateStatus(pet);

        Pet updated = petRepository.save(pet);
        log.info("Pet fed successfully: petId={}, hunger={}", updated.getId(), updated.getHunger());

        return PetMapper.toDTO(updated);
    }

    @Override
    public PetResponseDTO playWithPet(Long petId) {
        log.debug("Playing with petId={}", petId);

        Pet pet = getPetById(petId);
        pet.setAggressiveness(Math.max(0, pet.getAggressiveness() - 15));
        pet.setLevel(pet.getLevel() + 1);
        pet.setHunger(Math.min(100, pet.getHunger() + 5));
        pet.setLastInteractedAt(LocalDateTime.now());
        updateStatus(pet);

        Pet updated = petRepository.save(pet);
        log.info("Played with pet successfully: petId={}, level={}, hunger={}", updated.getId(), updated.getLevel(), updated.getHunger());

        return PetMapper.toDTO(updated);
    }

    @Override
    public PetResponseDTO trainPet(Long petId) {
        log.debug("Training petId={}", petId);

        Pet pet = getPetById(petId);
        pet.setLevel(pet.getLevel() + 2);
        pet.setAggressiveness(Math.min(100, pet.getAggressiveness() + 10));
        pet.setHunger(Math.min(100, pet.getHunger() + 10));
        updateStatus(pet);

        Pet updated = petRepository.save(pet);
        log.info("Pet trained successfully: petId={}, level={}, aggressiveness={}", updated.getId(), updated.getLevel(), updated.getAggressiveness());

        return PetMapper.toDTO(updated);
    }

    @Override
    public long getTotalPets() {
        long count = petRepository.count();
        log.info("Total pets in the system: {}", count);
        return count;
    }

    private Pet getPetById(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Pet with id {} not found", id);
                    return new ResourceNotFoundException("Pet not found");
                });
    }

    private void updateStatus(Pet pet) {
        if (pet.getAggressiveness() >= 80 || pet.getHunger() >= 80) {
            pet.setStatus(Status.REBELLIOUS);
        } else if (pet.getAggressiveness() >= 50 || pet.getHunger() >= 50) {
            pet.setStatus(Status.ANGRY);
        } else {
            pet.setStatus(Status.CALM);
        }
        log.debug("Updated status for petId={}, newStatus={}", pet.getId(), pet.getStatus());
    }
}
