package com.alcatel.ov.nms.dao;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.mongodb.core.query.Query;

public interface GenericDAO<X, ID extends Serializable> {

    X getById(ID id);

    List<X> getAll();

    Boolean add(X x);

    Boolean update(X x);

    Boolean delete(X x);

    X getOneByQuery(Query query);

    List<X> getListByQuery(Query query);
}
