package S5._2.VirtualPet.Config;

import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception{

        if(userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
                    admin.setUsername("admin");
                    admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole("ROLE_ADMIN");
                    userRepository.save(admin);

            System.out.println("Admin User created!");

        }
    }

}
