package S5._2.VirtualPet.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "pet")
public class PetProperties {

    private Hunger hunger = new Hunger();
    private Aggressiveness aggressiveness = new Aggressiveness();

    public Hunger getHunger() {
        return hunger;
    }

    public Aggressiveness getAggressiveness() {
        return aggressiveness;
    }

    public static class Hunger {
        private int increasePerHour;

        public int getIncreasePerHour() {
            return increasePerHour;
        }

        public void setIncreasePerHour(int increasePerHour) {
            this.increasePerHour = increasePerHour;
        }
    }

    public static class Aggressiveness {
        private int increasePerHour;

        public int getIncreasePerHour() {
            return increasePerHour;
        }

        public void setIncreasePerHour(int increasePerHour) {
            this.increasePerHour = increasePerHour;
        }
    }
}
