package S5._2.VirtualPet.Config;

import S5._2.VirtualPet.Model.User;
import S5._2.VirtualPet.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.admin.email:admin@virtualpet.com}")
    private String adminEmail;

    @Override
    public void run(String... args) {
        userRepository.findByUsername(adminUsername).ifPresentOrElse(
                user -> log.info("Admin user '{}' already exists. Skipping creation.", adminUsername),
                () -> {
                    User admin = new User();
                    admin.setUsername(adminUsername);
                    admin.setPassword(passwordEncoder.encode(adminPassword));
                    admin.setEmail(adminEmail);
                    admin.setRole("ROLE_ADMIN");
                    userRepository.save(admin);

                    log.info("✅ Admin user '{}' created successfully!", adminUsername);
                }
        );
    }
}
