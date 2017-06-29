package com.alcatel.ov.nms.dao.impl;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Query;

import com.alcatel.ov.nms.dao.GenericDAO;

public class GenericDAOImpl<X, ID extends Serializable> implements GenericDAO<X, ID> {

    protected Class<X> entityClass;
    protected MongoOperations mongoOperation;

    public GenericDAOImpl() {

    }

    public GenericDAOImpl(Class<X> entityClass) {
        this.entityClass = entityClass;
    }

    public void setMongoOperation(MongoOperations mongoOperation) {
        this.mongoOperation = mongoOperation;
    }

    public X getById(ID id) {
        X x = mongoOperation.findById(id, entityClass);
        return x;
    }

    public List<X> getAll() {
        List<X> list = mongoOperation.findAll(entityClass, mongoOperation.getCollectionName(entityClass));
        return list;
    }

    public Boolean add(X x) {
        mongoOperation.insert(x, mongoOperation.getCollectionName(entityClass));
        return true;
    }

    public Boolean update(X x) {
        mongoOperation.save(x, mongoOperation.getCollectionName(entityClass));
        return true;
    }

    public Boolean delete(X x) {
        mongoOperation.remove(x, mongoOperation.getCollectionName(entityClass));
        return true;
    }

    public X getOneByQuery(Query query) {
        X x = mongoOperation.findOne(query, entityClass, mongoOperation.getCollectionName(entityClass));
        return x;
    }

    public List<X> getListByQuery(Query query) {
        List<X> list = mongoOperation.find(query, entityClass, mongoOperation.getCollectionName(entityClass));
        return list;
    }

}
