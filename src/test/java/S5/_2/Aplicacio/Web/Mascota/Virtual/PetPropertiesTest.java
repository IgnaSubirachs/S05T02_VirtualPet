package S5._2.Aplicacio.Web.Mascota.Virtual;

import S5._2.VirtualPet.Config.PetProperties;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

import static org.assertj.core.api.Assertions.assertThat;

class PetPropertiesTest {

    private final ApplicationContextRunner contextRunner =
            new ApplicationContextRunner()
                    .withUserConfiguration(TestConfig.class)
                    .withPropertyValues(
                            "pet.hunger.increase-per-hour=5",
                            "pet.aggressiveness.increase-per-hour=3"
                    );

    @EnableConfigurationProperties(PetProperties.class)
    static class TestConfig {
    }

    @Test
    void shouldBindHungerProperty() {
        contextRunner.run(context -> {
            PetProperties props = context.getBean(PetProperties.class);
            assertThat(props.getHunger().getIncreasePerHour()).isEqualTo(5);
        });
    }

    @Test
    void shouldBindAggressivenessProperty() {
        contextRunner.run(context -> {
            PetProperties props = context.getBean(PetProperties.class);
            assertThat(props.getAggressiveness().getIncreasePerHour()).isEqualTo(3);
        });
    }
}
