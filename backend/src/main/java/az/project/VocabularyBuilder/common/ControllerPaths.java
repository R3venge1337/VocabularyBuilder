package az.project.VocabularyBuilder.common;

public class ControllerPaths {

    public static final String ENTRY_BASE = "/vocabulary";
    public static final String QUIZ_BASE = "/quizzes";
    public static final String TICTACTOE_BASE = "/games";

    public static final class Quiz {
        private Quiz() {
        }

        public static final String GENERATE = QUIZ_BASE + "/generate";
        public static final String SUBMIT = QUIZ_BASE + "/submit";
        public static final String HISTORY = QUIZ_BASE + "/history";
        public static final String DETAILS_BY_UUID = QUIZ_BASE + "/{quizUuid}";
    }

    public static final class Vocabulary {
        private Vocabulary() {
        }

        public static final String BY_ID = ENTRY_BASE + "/{id}";
    }

    public static final class TicTacToe {
        private TicTacToe() {
        }

        public static final String GAME_START = TICTACTOE_BASE + "/start";
        public static final String GAME_MOVE = TICTACTOE_BASE + "/move";
        public static final String GAME_HISTORY = TICTACTOE_BASE + "/history";
        public static final String GAME_REPLAY = TICTACTOE_BASE + "/replay/{sessionUuid}";
    }
}
