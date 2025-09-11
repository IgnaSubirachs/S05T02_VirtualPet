package S5._2.VirtualPet.Config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI virtualPetOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Virtual Pet API")
                        .description("A dark-humor alien zoo API where users adopt, train and sometimes eliminate rebellious creatures.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Ignasi Subirachs")
                                .email("ignasubirachs@gmail.com")
                                .url("https://github.com/IgnaSubirachs"))
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .externalDocs(new ExternalDocumentation()
                        .description("Project Repository")
                        .url("https://github.com/IgnaSubirachs/virtual-pet"));
    }
}
