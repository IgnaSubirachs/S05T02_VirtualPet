# Etapa 1: Build amb Maven
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Port on escoltarà Spring Boot
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
