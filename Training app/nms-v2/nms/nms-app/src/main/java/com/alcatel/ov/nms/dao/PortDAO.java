package com.alcatel.ov.nms.dao;

import java.util.List;

import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Port;

public interface PortDAO extends GenericDAO<Port, String> {

    Port getAttributesOfPort(String idPort);

    List<Attribute> getAttributes(String idPort);

    Port getAlarmsOfPort(String idPort);

    List<Alarm> getAlarms(String idPort);

    Port getInformationsOfPort(String idPort);

    Boolean updatePort(Port port);

    Boolean updateAttributesOfPort(String idPort, List<Attribute> attributes);

    Boolean updateAlarmsOfPort(String idPort, List<Alarm> alarms);

    Boolean updateStatusOfPort(String idPort, Status status);

    long countPortByStatus(Status status);

}
