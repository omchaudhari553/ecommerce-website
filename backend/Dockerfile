FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN sed -i 's/\r$//' mvnw && chmod +x mvnw && ./mvnw clean package -DskipTests

EXPOSE 5000

CMD ["java", "-jar", "target/FinalProject-0.0.1-SNAPSHOT.jar"]