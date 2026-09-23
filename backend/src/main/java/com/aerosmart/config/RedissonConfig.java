package com.aerosmart.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.extern.slf4j.Slf4j;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.lang.Nullable;

/**
 * Redis wiring: a Redisson client for distributed seat locks and a JSON
 * {@link RedisTemplate} used for short-lived flight search caching.
 * Falls back gracefully to in-memory locking if Redis is not running.
 */
@Slf4j
@Configuration
public class RedissonConfig {

    @Value("${aerosmart.redis.address:redis://localhost:6379}")
    private String redisAddress;

    @Bean(destroyMethod = "shutdown")
    @Nullable
    public RedissonClient redissonClient() {
        try {
            Config c = new Config();
            c.useSingleServer()
                    .setAddress(redisAddress)
                    .setConnectionMinimumIdleSize(2)
                    .setConnectionPoolSize(8)
                    .setRetryAttempts(1)
                    .setRetryInterval(500)
                    .setTimeout(1500)
                    .setConnectTimeout(1500);
            return Redisson.create(c);
        } catch (Exception e) {
            log.warn("Notice: Redis server is offline at {}. AeroSmart is running in Standalone In-Memory mode for seat locks & caching.", redisAddress);
            return null;
        }
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(@Autowired(required = false) @Nullable RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        if (connectionFactory != null) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                mapper.registerModule(new JavaTimeModule());
                mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                mapper.activateDefaultTyping(
                        BasicPolymorphicTypeValidator.builder().allowIfBaseType(Object.class).build(),
                        ObjectMapper.DefaultTyping.NON_FINAL,
                        JsonTypeInfo.As.PROPERTY);

                GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer(mapper);
                StringRedisSerializer keySerializer = new StringRedisSerializer();

                template.setConnectionFactory(connectionFactory);
                template.setKeySerializer(keySerializer);
                template.setHashKeySerializer(keySerializer);
                template.setValueSerializer(jsonSerializer);
                template.setHashValueSerializer(jsonSerializer);
                template.afterPropertiesSet();
            } catch (Exception e) {
                log.warn("RedisConnectionFactory initialization notice: {}", e.getMessage());
            }
        }
        return template;
    }
}
