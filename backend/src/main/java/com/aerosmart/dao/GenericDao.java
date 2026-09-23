package com.aerosmart.dao;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Generic DAO Pattern implementation using Jakarta Persistence EntityManager.
 * Eliminates the need for creating dozens of repetitive repository interfaces.
 */
@Repository
@Transactional
public class GenericDao {

    @PersistenceContext
    private EntityManager entityManager;

    public <T> T save(T entity) {
        return entityManager.merge(entity);
    }

    public <T> void persist(T entity) {
        entityManager.persist(entity);
    }

    @Transactional(readOnly = true)
    public <T> Optional<T> findById(Class<T> entityClass, Object id) {
        T entity = entityManager.find(entityClass, id);
        return Optional.ofNullable(entity);
    }

    @Transactional(readOnly = true)
    public <T> List<T> findAll(Class<T> entityClass) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);
        cq.select(root);
        return entityManager.createQuery(cq).getResultList();
    }

    @Transactional(readOnly = true)
    public <T> List<T> findByField(Class<T> entityClass, String fieldName, Object value) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);
        cq.select(root).where(cb.equal(root.get(fieldName), value));
        return entityManager.createQuery(cq).getResultList();
    }

    @Transactional(readOnly = true)
    public <T> List<T> findByFieldIgnoreCase(Class<T> entityClass, String fieldName, String value) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<T> cq = cb.createQuery(entityClass);
        Root<T> root = cq.from(entityClass);
        cq.select(root).where(cb.equal(cb.lower(root.get(fieldName)), value.toLowerCase()));
        return entityManager.createQuery(cq).getResultList();
    }

    public <T> void delete(T entity) {
        if (entityManager.contains(entity)) {
            entityManager.remove(entity);
        } else {
            entityManager.remove(entityManager.merge(entity));
        }
    }

    public <T> void deleteById(Class<T> entityClass, Object id) {
        findById(entityClass, id).ifPresent(this::delete);
    }
}
