package S5._2.VirtualPet.Dto;


import S5._2.VirtualPet.Model.enums.Species;
import S5._2.VirtualPet.Model.enums.Status;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PetResponseDTO {
    private Long id;
    private String name;
    private Species species;
    private int level;
    private int hunger;
    private int aggressiveness;
    private Status status;

}
