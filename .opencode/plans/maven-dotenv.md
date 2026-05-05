# Plan: Configurar carga automática de `.env` con Maven

## Problema
Las variables del archivo `.env` no se cargan automáticamente al ejecutar `./mvnw spring-boot:run`, causando error de autenticación con PostgreSQL.

## Solución
Agregar `maven-dotenv-plugin` al `pom.xml`.

## Cambios en `pom.xml`

Agregar el siguiente plugin dentro de `<build><plugins>`, después de `spring-boot-maven-plugin`:

```xml
<plugin>
  <groupId>me.qoomon</groupId>
  <artifactId>maven-dotenv-plugin</artifactId>
  <version>1.0.2</version>
  <executions>
    <execution>
      <phase>initialize</phase>
      <goals>
        <goal>load</goal>
      </goals>
    </execution>
  </executions>
  <configuration>
    <envFilePath>${project.basedir}/.env</envFilePath>
  </configuration>
</plugin>
```

## Resultado
Después de este cambio, ejecutar:
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod
```
Las variables `POSTGRES_PASSWORD`, `POSTGRES_USER`, `POSTGRES_DB`, `DB_HOST`, `DB_PORT` se cargarán automáticamente desde `.env`.
