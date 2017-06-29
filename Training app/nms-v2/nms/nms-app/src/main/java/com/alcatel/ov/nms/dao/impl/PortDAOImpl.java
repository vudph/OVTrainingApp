package com.alcatel.ov.nms.dao.impl;

import java.util.List;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.alcatel.ov.nms.dao.PortDAO;
import com.alcatel.ov.nms.dao.impl.GenericDAOImpl;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Port;
import com.mongodb.WriteResult;

public class PortDAOImpl extends GenericDAOImpl<Port, String> implements PortDAO {

    public PortDAOImpl() {
        super(Port.class);
    }

    // //Get functions
    public Port getAttributesOfPort(String idPort) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idPort));
        query.fields().include("id").include("attributes").include("status");

        Port port = super.getOneByQuery(query);
        return port;
    }

    public List<Attribute> getAttributes(String idPort) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idPort));
        query.fields().include("id").include("attributes");

        Port port = super.getOneByQuery(query);
        if (port == null)
            return null;

        return port.getAttributes();
    }

    public Port getAlarmsOfPort(String idPort) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idPort));
        query.fields().include("id").include("alarms");

        Port port = super.getOneByQuery(query);
        return port;
    }

    public List<Alarm> getAlarms(String idPort) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idPort));
        query.fields().include("id").include("alarms");

        Port port = super.getOneByQuery(query);
        if (port == null)
            return null;

        return port.getAlarms();
    }

    public Port getInformationsOfPort(String idPort) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idPort));
        query.fields().include("id").include("name").include("status").include("type");

        Port port = super.getOneByQuery(query);
        return port;
    }

    // //End Get functions

    // //Update functions
    public Boolean updatePort(Port port) {
        if (getById(port.getId()) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(port.getId()));

            Update update = new Update();
            update.set("name", port.getName());
            update.set("status", port.getStatus());
            update.set("attributes", port.getAttributes());
            update.set("alarms", port.getAlarms());

            WriteResult result = mongoOperation.updateFirst(query, update, entityClass);
            if (result.getN() == 1)
                return true;
        }
        return false;
    }

    public Boolean updateAttributesOfPort(String idPort, List<Attribute> attributes) {
        if (getById(idPort) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(idPort));

            Update update = new Update();
            update.set("attributes", attributes);

            WriteResult result = mongoOperation.updateFirst(query, update, entityClass);
            if (result.getN() == 1)
                return true;
        }
        return false;
    }

    public Boolean updateAlarmsOfPort(String idPort, List<Alarm> alarms) {
        if (getById(idPort) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(idPort));

            Update update = new Update();
            update.set("alarms", alarms);

            WriteResult result = mongoOperation.updateFirst(query, update, entityClass);
            if (result.getN() == 1)
                return true;
        }
        return false;
    }

    public Boolean updateStatusOfPort(String idPort, Status status) {
        if (getById(idPort) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(idPort));

            Update update = new Update();
            update.set("status", status);

            WriteResult result = mongoOperation.updateFirst(query, update, entityClass);
            if (result.getN() == 1)
                return true;
        }
        return false;
    }

    // //End Update functions

    // //Count functions
    public long countPortByStatus(Status status) {
        Query query = new Query();
        query.addCriteria(Criteria.where("status").is(status));

        long count = mongoOperation.count(query, entityClass);
        return count;
    }

    // //Count functions

    // //Override functions GenericDAOImpl
    public Boolean add(Port port) {
        if (getById(port.getId()) == null)
            return super.add(port);

        return false;
    }

    public Boolean update(Port port) {
        if (getById(port.getId()) != null)
            return super.update(port);

        return false;
    }

    public Boolean delete(Port port) {
        if (getById(port.getId()) != null)
            return super.delete(port);

        return false;
    }
    // //End Override functions GenericDAOImpl

}
