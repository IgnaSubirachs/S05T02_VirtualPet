package S5._2.VirtualPet.Dto;

import S5._2.VirtualPet.Model.enums.Species;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetRequestDTO {
    private String name;
    private Species species;
    private int hunger;
    private int aggressiveness;
}
