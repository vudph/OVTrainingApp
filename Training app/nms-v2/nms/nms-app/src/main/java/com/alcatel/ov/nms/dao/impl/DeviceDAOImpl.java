package com.alcatel.ov.nms.dao.impl;

import java.util.List;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.dao.impl.GenericDAOImpl;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Device;
import com.mongodb.WriteResult;

public class DeviceDAOImpl extends GenericDAOImpl<Device, String> implements DeviceDAO {

    public DeviceDAOImpl() {
        super(Device.class);
    }

    // //Get functions
    public Device getDeviceByName(String nameDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(nameDevice));

        Device device = super.getOneByQuery(query);
        return device;
    }

    public Device getAttributesOfDevice(String idDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idDevice));
        query.fields().include("id").include("attributes").include("status");

        Device device = super.getOneByQuery(query);
        return device;
    }

    public List<Attribute> getAttributes(String idDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idDevice));
        query.fields().include("id").include("attributes");

        Device device = super.getOneByQuery(query);
        if (device == null)
            return null;

        return device.getAttributes();
    }

    public Device getAlarmsOfDevice(String idDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idDevice));
        query.fields().include("id").include("alarms");

        Device device = getOneByQuery(query);
        return device;
    }

    public List<Alarm> getAlarms(String idDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idDevice));
        query.fields().include("id").include("alarms");

        Device device = super.getOneByQuery(query);
        if (device == null) {
            return null;
        }

        return device.getAlarms();
    }

    public Device getSubsOfDevice(String idDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idDevice));
        query.fields().include("id").include("subs");

        Device device = super.getOneByQuery(query);
        return device;
    }

    public List<AbstractObject> getSubs(String idDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idDevice));
        query.fields().include("id").include("subs");

        Device device = super.getOneByQuery(query);
        if (device == null)
            return null;

        return device.getSubs();
    }

    public Device getInformationsOfDevice(String idDevice) {
        Query query = new Query();
        query.addCriteria(Criteria.where("id").is(idDevice));
        query.fields().include("id").include("name").include("status").include("type");

        Device device = super.getOneByQuery(query);
        return device;
    }

    public List<Device> getRootsDevice() {
        Query query = new Query();
        query.addCriteria(Criteria.where("isRoot").is(true));
        query.fields().include("id").include("name").include("type").include("status");

        List<Device> devices = getListByQuery(query);
        return devices;
    }

    // //End Get functions

    // //Update functions
    public Boolean updateDevice(Device device) {
        if (getById(device.getId()) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(device.getId()));

            Update update = new Update();
            update.set("name", device.getName());
            update.set("status", device.getStatus());
            update.set("attributes", device.getAttributes());
            update.set("subs", device.getSubs());
            update.set("alarms", device.getAlarms());
            update.set("isRoot", device.getIsRoot());

            WriteResult result = mongoOperation.updateFirst(query, update, entityClass);
            if (result.getN() == 1)
                return true;
        }
        return false;
    }

    public Boolean updateAttributesOfDevice(String idDevice, List<Attribute> attributes) {
        if (getById(idDevice) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(idDevice));

            Update update = new Update();
            update.set("attributes", attributes);

            WriteResult result = mongoOperation.updateFirst(query, update, entityClass);
            if (result.getN() == 1)
                return true;
        }
        return false;
    }

    public Boolean updateAlarmsOfDevice(String idDevice, List<Alarm> alarms) {
        if (getById(idDevice) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(idDevice));

            Update update = new Update();
            update.set("alarms", alarms);

            WriteResult result = mongoOperation.updateFirst(query, update, entityClass);
            if (result.getN() == 1)
                return true;
        }
        return false;
    }

    public Boolean updateStatusOfDevice(String idDevice, Status status) {
        if (getById(idDevice) != null) {
            Query query = new Query();
            query.addCriteria(Criteria.where("id").is(idDevice));

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
    public long countDeviceByStatus(Status status) {
        Query query = new Query();
        query.addCriteria(Criteria.where("status").is(status));

        long count = mongoOperation.count(query, entityClass);
        return count;
    }

    // //End Count functions

    // //Override functions GenericDAOImpl
    public Boolean add(Device device) {
        if (getDeviceByName(device.getName()) == null && getById(device.getId()) == null)
            return super.add(device);

        return false;
    }

    public Boolean update(Device device) {
        if (getById(device.getId()) != null)
            return super.update(device);

        return false;
    }

    public Boolean delete(Device device) {
        if (getById(device.getId()) != null)
            return super.delete(device);

        return false;
    }
    // //End Override functions GenericDAOImpl

}
