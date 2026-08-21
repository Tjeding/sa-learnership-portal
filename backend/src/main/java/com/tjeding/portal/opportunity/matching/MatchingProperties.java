package com.tjeding.portal.opportunity.matching;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration for the AI matching subsystem.
 *
 * <p>Properties are bound from {@code app.matching.*} in application.yml:
 * <pre>
 * app:
 *   matching:
 *     strategy: skill-based          # skill-based | embedding | openai | ollama
 *     openai:
 *       api-url: https://api.openai.com/v1/chat/completions
 *       api-key: ${OPENAI_API_KEY:}
 *       model: gpt-4o-mini
 *     ollama:
 *       api-url: http://localhost:11434/api/generate
 *       model: nomic-embed-text
 * </pre>
 *
 * <p>Switching strategies: set {@code app.matching.strategy} and make the
 * corresponding strategy bean {@code @Primary}, or inject all strategies
 * and select at runtime based on this property.
 */
@Configuration
@ConfigurationProperties(prefix = "app.matching")
public class MatchingProperties {

    /** Active matching strategy. Default: "skill-based". */
    private String strategy = "skill-based";

    private OpenAiConfig openai = new OpenAiConfig();
    private OllamaConfig ollama = new OllamaConfig();

    public String getStrategy() { return strategy; }
    public void setStrategy(String strategy) { this.strategy = strategy; }

    public OpenAiConfig getOpenai() { return openai; }
    public void setOpenai(OpenAiConfig openai) { this.openai = openai; }

    public OllamaConfig getOllama() { return ollama; }
    public void setOllama(OllamaConfig ollama) { this.ollama = ollama; }

    public static class OpenAiConfig {
        private String apiUrl = "https://api.openai.com/v1/chat/completions";
        private String apiKey = "";
        private String model = "gpt-4o-mini";

        public String getApiUrl() { return apiUrl; }
        public void setApiUrl(String apiUrl) { this.apiUrl = apiUrl; }
        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
    }

    public static class OllamaConfig {
        private String apiUrl = "http://localhost:11434/api/generate";
        private String model = "nomic-embed-text";

        public String getApiUrl() { return apiUrl; }
        public void setApiUrl(String apiUrl) { this.apiUrl = apiUrl; }
        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
    }
}
