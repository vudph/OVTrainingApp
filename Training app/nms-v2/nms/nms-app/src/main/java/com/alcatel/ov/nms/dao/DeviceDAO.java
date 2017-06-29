package com.alcatel.ov.nms.dao;

import java.util.List;

import com.alcatel.ov.nms.dao.GenericDAO;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Device;

public interface DeviceDAO extends GenericDAO<Device, String> {

    Device getDeviceByName(String nameDevice);

    Device getAttributesOfDevice(String idDevice);

    List<Attribute> getAttributes(String idDevice);

    Device getAlarmsOfDevice(String idDevice);

    List<Alarm> getAlarms(String idDevice);

    Device getSubsOfDevice(String idDevice);

    List<AbstractObject> getSubs(String idDevice);

    Device getInformationsOfDevice(String idDevice);

    List<Device> getRootsDevice();

    Boolean updateDevice(Device device);

    Boolean updateAttributesOfDevice(String idDevice, List<Attribute> attributes);

    Boolean updateAlarmsOfDevice(String idDevice, List<Alarm> alarms);

    Boolean updateStatusOfDevice(String idDevice, Status status);

    long countDeviceByStatus(Status status);

}
