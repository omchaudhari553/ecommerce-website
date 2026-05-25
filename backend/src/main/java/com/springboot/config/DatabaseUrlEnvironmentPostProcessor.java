package com.springboot.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

/**
 * Normalizes Railway / cloud MySQL env vars into a JDBC URL Spring Boot can use.
 * Handles mysql:// (no jdbc prefix), credentials embedded in URL, and SSL params.
 */
public class DatabaseUrlEnvironmentPostProcessor implements EnvironmentPostProcessor {

    private static final String DEFAULT_PARAMS =
            "useSSL=true&requireSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // Railway: MYSQL_PUBLIC_URL is reachable from Render; MYSQL_URL / mysql.railway.internal are not
        String mysqlUrl = firstNonBlank(
                environment.getProperty("MYSQL_PUBLIC_URL"),
                environment.getProperty("MYSQL_URL"));
        String mysqlHost = environment.getProperty("MYSQLHOST");

        if (isRailwayInternal(mysqlUrl) || isRailwayInternalHost(mysqlHost)) {
            mysqlUrl = environment.getProperty("MYSQL_PUBLIC_URL");
            mysqlHost = null;
        }

        if ((mysqlUrl == null || mysqlUrl.isBlank()) && (mysqlHost == null || mysqlHost.isBlank())) {
            return;
        }

        Map<String, Object> overrides = new HashMap<>();

        if (mysqlUrl != null && !mysqlUrl.isBlank()) {
            parseMysqlUrl(mysqlUrl.trim(), overrides);
        } else {
            String port = environment.getProperty("MYSQLPORT", "3306");
            String database = firstNonBlank(
                    environment.getProperty("MYSQLDATABASE"),
                    environment.getProperty("MYSQL_DATABASE"),
                    "railway");
            overrides.put("spring.datasource.url",
                    buildJdbcUrl(mysqlHost, port, database, environment.getProperty("MYSQL_SSL", "true")));
        }

        if (!overrides.containsKey("spring.datasource.username")) {
            String user = environment.getProperty("MYSQLUSER");
            if (user != null && !user.isBlank()) {
                overrides.put("spring.datasource.username", user);
            }
        }
        if (!overrides.containsKey("spring.datasource.password")) {
            String password = environment.getProperty("MYSQLPASSWORD");
            if (password != null) {
                overrides.put("spring.datasource.password", password);
            }
        }

        environment.getPropertySources().addFirst(new MapPropertySource("cloudDatabaseConfig", overrides));
    }

    private void parseMysqlUrl(String url, Map<String, Object> overrides) {
        String jdbcUrl = url;
        if (jdbcUrl.startsWith("mysql://")) {
            jdbcUrl = "jdbc:" + jdbcUrl;
        }

        String user = null;
        String password = null;

        if (jdbcUrl.startsWith("jdbc:mysql://") && jdbcUrl.contains("@")) {
            int schemeEnd = "jdbc:mysql://".length();
            int at = jdbcUrl.indexOf('@');
            String userInfo = jdbcUrl.substring(schemeEnd, at);
            if (userInfo.contains(":")) {
                int colon = userInfo.indexOf(':');
                user = userInfo.substring(0, colon);
                password = userInfo.substring(colon + 1);
            } else {
                user = userInfo;
            }
            jdbcUrl = "jdbc:mysql://" + jdbcUrl.substring(at + 1);
        }

        jdbcUrl = ensureConnectionParams(jdbcUrl);

        overrides.put("spring.datasource.url", jdbcUrl);
        if (user != null) {
            overrides.put("spring.datasource.username", user);
        }
        if (password != null) {
            overrides.put("spring.datasource.password", password);
        }
    }

    private String buildJdbcUrl(String host, String port, String database, String sslEnabled) {
        String params = "true".equalsIgnoreCase(sslEnabled) ? DEFAULT_PARAMS
                : "useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
        return String.format("jdbc:mysql://%s:%s/%s?%s", host, port, database, params);
    }

    private String ensureConnectionParams(String url) {
        if (url.contains("useSSL=") || url.contains("sslMode=")) {
            return url;
        }
        return url.contains("?") ? url + "&" + DEFAULT_PARAMS : url + "?" + DEFAULT_PARAMS;
    }

    private static boolean isRailwayInternal(String url) {
        return url != null && url.contains("railway.internal");
    }

    private static boolean isRailwayInternalHost(String host) {
        return host != null && host.contains("railway.internal");
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }
}
