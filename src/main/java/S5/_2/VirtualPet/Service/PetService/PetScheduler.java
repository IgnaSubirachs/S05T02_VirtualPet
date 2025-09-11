package S5._2.VirtualPet.Service.PetService;

import S5._2.VirtualPet.Model.Pet;
import S5._2.VirtualPet.Model.enums.Status;
import S5._2.VirtualPet.Config.PetProperties;
import S5._2.VirtualPet.Repositories.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PetScheduler {

    private final PetRepository petRepository;
    private final PetProperties properties;

    @Scheduled(fixedRate = 3600000)
    public void increaseNeedsOverTime() {
        List<Pet> pets = petRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Pet pet : pets) {
            if (pet.getLasFedAt() != null) {
                long hoursSinceFed = ChronoUnit.HOURS.between(pet.getLasFedAt(), now);
                if (hoursSinceFed > 0) {
                    pet.setHunger(Math.min(100, pet.getHunger() +
                            (int) hoursSinceFed * properties.getHunger().getIncreasePerHour()));
                }
            }
            if (pet.getLastInteractedAt() != null) {
                long hoursSincePlayed = ChronoUnit.HOURS.between(pet.getLastInteractedAt(), now);
                if (hoursSincePlayed > 0) {
                    pet.setAggressiveness(Math.min(100, pet.getAggressiveness() + (int) hoursSincePlayed * 3));
                }
            }
            if (pet.getAggressiveness() >= 80 || pet.getHunger() >= 50) {
                pet.setStatus(Status.REBELLIOUS);
            } else if (pet.getAggressiveness() >= 50 || pet.getHunger() >= 50) {
                pet.setStatus(Status.ANGRY);
            } else {
                pet.setStatus(Status.CALM);
            }
            petRepository.save(pet);
        }

    }
}
