package az.project.VocabularyBuilder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VocabularyBuilderApplication {

	public static void main(String[] args) {
		SpringApplication.run(VocabularyBuilderApplication.class, args);
	}

}
