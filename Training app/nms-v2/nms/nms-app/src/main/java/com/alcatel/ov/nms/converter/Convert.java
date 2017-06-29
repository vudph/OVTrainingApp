package com.alcatel.ov.nms.converter;

import java.util.ArrayList;
import java.util.List;

import com.alcatel.ov.nms.data.constant.AlarmSeverity;
import com.alcatel.ov.nms.data.constant.AttributeGroup;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.constant.TypeObject;
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Device;
import com.alcatel.ov.nms.data.model.Port;
import com.alcatel.ov.nms.vo.AlarmVO;
import com.alcatel.ov.nms.vo.AttributeVO;
import com.alcatel.ov.nms.vo.NMSObjectVO;

public final class Convert {

    public static AlarmVO convert(Alarm alarm) {

        AlarmVO al = new AlarmVO();

        al.setId(alarm.getId());
        al.setName(alarm.getName());
        al.setSource(alarm.getSource());
        al.setSeverity(alarm.getSeverity().toString());

        return al;
    }

    public static List<AlarmVO> convert(List<Alarm> lalarm) {

        List<AlarmVO> list = new ArrayList<AlarmVO>();

        for (Alarm alarm : lalarm) {
            list.add(Convert.convert(alarm));
        }

        return list;
    }

    public static Alarm convert(AlarmVO alarm) {

        Alarm al = new Alarm();

        al.setId(alarm.getId());
        al.setName(alarm.getName());
        al.setSource(alarm.getSource());

        // System.out.println("Coming here");
        al.setSeverity(AlarmSeverity.valueOf(alarm.getSeverity().toUpperCase()));
        // System.out.println("Come one more");
        return al;
    }

    public static NMSObjectVO convert(Device device) {

        NMSObjectVO object = new NMSObjectVO();

        object.setId(device.getId());
        object.setName(device.getName());
        object.setType(device.getType().toString());
        object.setStatus(device.getStatus().toString());

        return object;
    }

    public static NMSObjectVO convert(AbstractObject vobject) {

        NMSObjectVO object = new NMSObjectVO();

        object.setId(vobject.getId());
        object.setName(vobject.getName());
        object.setType(vobject.getType().toString());
        object.setStatus(vobject.getStatus().toString());

        return object;
    }

    public static NMSObjectVO convert(Port port) {

        NMSObjectVO object = new NMSObjectVO();

        object.setId(port.getId());
        object.setName(port.getName());
        object.setStatus(port.getStatus().toString());
        object.setType(TypeObject.PORT.toString());

        return object;
    }

    public static Device getDeviceFromVO(NMSObjectVO object) {
        Device device = new Device();
        device.setId(object.getId());
        device.setName(object.getName());
        device.setStatus(Status.valueOf(object.getStatus().toUpperCase()));
        device.setType(TypeObject.valueOf(object.getType().toUpperCase()));

        return device;
    }

    public static Port getPortFromVO(NMSObjectVO object) {
        Port port = new Port();
        port.setId(object.getId());
        port.setName(object.getName());
        port.setStatus(Status.valueOf(object.getStatus().toUpperCase()));
        port.setType(TypeObject.valueOf(object.getType().toUpperCase()));

        return port;
    }

    public static AttributeVO convert(Attribute attribute) {
        AttributeVO attributevo = new AttributeVO();

        attributevo.setName(attribute.getName());
        attributevo.setValue(attribute.getValue());
        attributevo.setGroupName(attribute.getAttributeGroup().toString());
        attributevo.setReadable(attribute.getIsReadable());
        attributevo.setWritable(attribute.getIsWritable());
        attributevo.setDataType(attribute.getDataType());

        return attributevo;
    }

    public static Attribute convert(AttributeVO attributevo) {
        Attribute attribute = new Attribute();

        attribute.setName(attributevo.getName());
        attribute.setValue(attributevo.getValue());
        attribute.setAttributeGroup(AttributeGroup.valueOf(attributevo.getGroupName().toUpperCase()));
        attribute.setIsReadable(attributevo.getReadable());
        attribute.setIsWritable(attributevo.getWritable());
        attribute.setDataType(attributevo.getDataType());

        return attribute;
    }

}
