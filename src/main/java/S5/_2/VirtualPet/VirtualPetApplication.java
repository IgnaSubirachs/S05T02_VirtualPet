package S5._2.VirtualPet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VirtualPetApplication {

	public static void main(String[] args) {
		SpringApplication.run(VirtualPetApplication.class, args);
	}

}
