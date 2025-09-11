package S5._2.VirtualPet.Mapper;

import S5._2.VirtualPet.Dto.PetRequestDTO;
import S5._2.VirtualPet.Dto.PetResponseDTO;
import S5._2.VirtualPet.Model.Pet;

public class PetMapper {

    public static Pet toEntity(PetRequestDTO dto) {
        return Pet.builder()
                .name(dto.getName())
                .species(dto.getSpecies())
                .hunger(dto.getHunger())
                .aggressiveness(dto.getAggressiveness())
                .level(1)
                .status(null)
                .build();
    }

    public static PetResponseDTO toDTO(Pet pet) {
        return PetResponseDTO.builder()
                .id(pet.getId())
                .name(pet.getName())
                .species(pet.getSpecies())
                .level(pet.getLevel())
                .hunger(pet.getHunger())
                .aggressiveness(pet.getAggressiveness())
                .status(pet.getStatus())
                .build();
    }
}
