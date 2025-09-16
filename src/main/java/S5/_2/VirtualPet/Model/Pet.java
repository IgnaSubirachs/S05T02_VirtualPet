package S5._2.VirtualPet.Model;

import S5._2.VirtualPet.Model.enums.Species;
import S5._2.VirtualPet.Model.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pets")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private Species species;
    private int level;
    private int hunger;
    private int aggressiveness;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Status status;

    private LocalDateTime lastFedAt;
    private LocalDateTime lastInteractedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    @Builder
    public Pet(String name, Species species, int level, int hunger, int aggressiveness, Status status) {
        this.name = name;
        this.species = species;
        this.level = level;
        this.hunger = hunger;
        this.aggressiveness = aggressiveness;
        this.status = status;
    }


}
