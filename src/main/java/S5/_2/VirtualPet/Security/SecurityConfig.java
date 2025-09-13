package S5._2.VirtualPet.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth

                        // 🔹 FRONTEND (Next.js exportat)
                        .requestMatchers("/", "/index.html").permitAll()
                        .requestMatchers("/_next/**").permitAll()
                        .requestMatchers("/static/**").permitAll()
                        .requestMatchers("/public/**").permitAll()

                        // 🔹 Recursos típics (sense `**/*.ext`, només patrons vàlids)
                        .requestMatchers("/*.css", "/*.js", "/*.png", "/*.jpg",
                                "/*.jpeg", "/*.gif", "/*.svg", "/*.ico").permitAll()

                        // 🔹 PÀGINES HTML renderitzades (routes Next exportades)
                        .requestMatchers("/register/**").permitAll()
                        .requestMatchers("/dashboard/**").permitAll()
                        .requestMatchers("/admin/**").permitAll()
                        .requestMatchers("/404/**").permitAll()

                        // 🔹 SWAGGER (docs API)
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/swagger-resources",
                                "/swagger-resources/**",
                                "/webjars/**"
                        ).permitAll()

                        // 🔹 API REST (aquí sí seguretat real)
                        .requestMatchers("/auth/**").permitAll()   // registre/login públic
                        .requestMatchers("/pets/**").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 🔹 Tot el restant requereix autenticació
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
