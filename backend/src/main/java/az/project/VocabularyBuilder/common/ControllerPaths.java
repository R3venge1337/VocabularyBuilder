package az.project.VocabularyBuilder.common;

public class ControllerPaths {

    // Ścieżki Bazowe Kontrolerów
    public static final String ENTRY_BASE = "/vocabulary";
    public static final String QUIZ_BASE = " /quizzes";

    // Szczegółowe Ścieżki Quizów
    public static final class Quiz {
        private Quiz() {
        }

        public static final String GENERATE = QUIZ_BASE + "/generate"; // GET /api/quizzes/generate
        public static final String SUBMIT = QUIZ_BASE + "/submit";     // POST /api/quizzes/submit
        public static final String HISTORY = QUIZ_BASE + "/history";   // GET /api/quizzes/history
        public static final String DETAILS_BY_UUID = QUIZ_BASE + "/{quizUuid}"; // GET /api/quizzes/{uuid}
    }

    // Szczegółowe Ścieżki Słówek
    public static final class Vocabulary {
        private Vocabulary() {
        }

        public static final String BY_ID = ENTRY_BASE + "/{id}";        // GET/PUT/DELETE /api/entries/{id}
    }
}
