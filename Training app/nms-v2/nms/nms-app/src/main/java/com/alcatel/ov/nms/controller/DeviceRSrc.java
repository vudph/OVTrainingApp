package com.alcatel.ov.nms.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alcatel.ov.nms.converter.Convert;
import com.alcatel.ov.nms.ctx.NMSAppContext;
import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.dao.PortDAO;
import com.alcatel.ov.nms.data.constant.AttributeGroup;
import com.alcatel.ov.nms.data.constant.TypeObject;
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Device;
import com.alcatel.ov.nms.data.model.Port;
import com.alcatel.ov.nms.vo.AlarmVO;
import com.alcatel.ov.nms.vo.AttributeVO;
import com.alcatel.ov.nms.vo.ListAttributeVO;
import com.alcatel.ov.nms.vo.NMSObjectVO;

@Controller
@RequestMapping(value = "/devices")
public class DeviceRSrc {

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<NMSObjectVO> getRootDevice() {

        List<NMSObjectVO> list = new ArrayList<NMSObjectVO>();

        DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

        List<Device> listDevice = deviceDAO.getRootsDevice();

        for (Device device : listDevice) {
            NMSObjectVO object = Convert.convert(device);
            list.add(object);
        }

        return list;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public List<NMSObjectVO> getChildren(@PathVariable String id) {

        List<NMSObjectVO> list = new ArrayList<NMSObjectVO>();

        DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

        Device device = deviceDAO.getSubsOfDevice(id);

        // check whether device is existed
        if (device != null) {

            List<AbstractObject> listVO = device.getSubs();

            for (AbstractObject virtualObject : listVO) {
                list.add(Convert.convert(virtualObject));
            }
        }

        return list;
    }

    @RequestMapping(value = "/{id}/info", method = RequestMethod.GET)
    @ResponseBody
    public NMSObjectVO getInfo(@PathVariable String id, @RequestParam(required = false, value = "type", defaultValue = "Device") String type) {

        NMSObjectVO object = null;

        if (type.equalsIgnoreCase(TypeObject.PORT.toString())) {

            PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");

            Port port = portDAO.getInformationsOfPort(id);

            if (port != null) {
                object = Convert.convert(port);
            }

        } else {

            DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

            Device device = deviceDAO.getInformationsOfDevice(id);

            if (device != null) {
                object = Convert.convert(deviceDAO.getInformationsOfDevice(id));
            }
        }

        return object;
    }

    @RequestMapping(value = "/{id}/info", method = RequestMethod.PUT)
    @ResponseBody
    public Map<String, Object> updateInfo(@PathVariable String id,
            @RequestParam(required = false, value = "type", defaultValue = "Device") String type, @RequestBody NMSObjectVO object) {

        Map<String, Object> result = new HashMap<String, Object>();
        if (type.equalsIgnoreCase(TypeObject.PORT.toString())) {
            PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");

            Port port = Convert.getPortFromVO(object);

            result.put("result", portDAO.updateStatusOfPort(id, port.getStatus()));
            result.put("body", object);

        } else {

            DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

            Device device = Convert.getDeviceFromVO(object);

            result.put("result", deviceDAO.updateStatusOfDevice(id, device.getStatus()));
            result.put("body", object);

        }

        return result;

    }

    @RequestMapping(value = "/{id}/attributes", method = RequestMethod.GET)
    @ResponseBody
    public List<AttributeVO> getAttribute(@PathVariable String id,
            @RequestParam(required = false, value = "type", defaultValue = "Device") String type) {

        List<AttributeVO> list = new ArrayList<AttributeVO>();

        if (type.equalsIgnoreCase(TypeObject.PORT.toString())) {

            PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");

            Port port = portDAO.getAttributesOfPort(id);

            // check whether port is existed
            if (port != null) {

                List<Attribute> latt = port.getAttributes();

                for (Attribute attribute : latt) {
                    list.add(Convert.convert(attribute));
                }

                list.add(new AttributeVO("status", port.getStatus().toString(), "String", AttributeGroup.GENERAL.toString(), true, false,
                        null, null));
            }

        } else {

            DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

            Device device = deviceDAO.getAttributesOfDevice(id);

            // check whether device is existed
            if (device != null) {

                List<Attribute> latt = device.getAttributes();

                for (Attribute attribute : latt) {
                    list.add(Convert.convert(attribute));
                }

                list.add(new AttributeVO("status", device.getStatus().toString(), "String", AttributeGroup.GENERAL.toString(), true, false,
                        null, null));

            }

        }

        return list;
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    @RequestMapping(value = "/{id}/ports/{portid}", method = RequestMethod.GET)
    @ResponseBody
    public List getPortAttribute(@PathVariable String id, @PathVariable String portid, @RequestParam(required = false, value = "info",
            defaultValue = "attributes") String tab) {

        PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");
        DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

        List<AbstractObject> listPort = deviceDAO.getSubs(id);
        boolean notFound = true;

        if (listPort != null) {
            for (Iterator iterator = listPort.iterator(); iterator.hasNext() && notFound;) {

                AbstractObject vo = (AbstractObject) iterator.next();
                if (portid.equals(vo.getId()) && TypeObject.PORT.equals(vo.getType())) {
                    notFound = false;
                }

            }
        }

        // check if port is true
        List list = null;
        if (!notFound) {

            Port port = portDAO.getAttributesOfPort(portid);

            if (tab.equalsIgnoreCase("attributes")) {

                list = new ArrayList<AttributeVO>();
                List<Attribute> latt = port.getAttributes();

                for (Attribute attribute : latt) {
                    list.add(Convert.convert(attribute));
                }

                list.add(new AttributeVO("status", port.getStatus().toString(), "String", AttributeGroup.GENERAL.toString(), true, false,
                        null, null));
            } else if (tab.equalsIgnoreCase("alarms")) {
                list = new ArrayList<AlarmVO>();
                List<Alarm> listAlarm = portDAO.getAlarms(portid);

                // check whether port has alarms
                list.addAll(Convert.convert(listAlarm));
            }

        }

        return list;
    }

    @RequestMapping(value = "/{id}/attributes", method = RequestMethod.PUT)
    @ResponseBody
    public void updateAttribute(@PathVariable String id, @RequestBody ListAttributeVO list, @RequestParam(required = false, value = "type",
            defaultValue = "Device") String type) {

        List<Attribute> latt = new ArrayList<Attribute>();

        for (AttributeVO attributeVO : list) {
            if (!attributeVO.getName().equalsIgnoreCase("status"))
                latt.add(Convert.convert(attributeVO));
        }

        if (type.equalsIgnoreCase(TypeObject.PORT.toString())) {

            PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");

            portDAO.updateAttributesOfPort(id, latt);

        } else {

            DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

            deviceDAO.updateAttributesOfDevice(id, latt);

        }

    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/{id}/ports/{portid}", method = RequestMethod.PUT)
    @ResponseBody
    public void updateAttributeDefault(String id, String portid, ListAttributeVO list) {
        DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

        List<AbstractObject> listPort = deviceDAO.getSubs(id);
        boolean notFound = true;
        if (listPort != null) {
            for (Iterator iterator = listPort.iterator(); iterator.hasNext() && notFound;) {

                AbstractObject vo = (AbstractObject) iterator.next();
                if (portid.equals(vo.getId()) && TypeObject.PORT.equals(vo.getType())) {
                    notFound = false;
                }

            }
        }

        if (!notFound) {
            // return updateAttribute(portid, list, "port");
            updateAttribute(portid, list, "port");
        }

    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/{id}/attributes/single", method = RequestMethod.PUT)
    @ResponseBody
    public void updateAttribute(@PathVariable String id,
            @RequestParam(required = false, value = "type", defaultValue = "Device") String type, @RequestBody AttributeVO att) {

        Attribute attribute = Convert.convert(att);
        String name = attribute.getName();

        if (type.equalsIgnoreCase(TypeObject.PORT.toString())) {

            PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");

            List<Attribute> list = portDAO.getAttributes(id);
            boolean flag = true;

            for (Iterator iterator = list.iterator(); iterator.hasNext() && flag;) {
                Attribute _attribute = (Attribute) iterator.next();

                if (name.equals(_attribute.getName())) {
                    _attribute.setValue(attribute.getValue());
                    _attribute.setIsReadable(attribute.getIsReadable());
                    _attribute.setIsWritable(attribute.getIsWritable());
                    flag = false;
                }
            }

            portDAO.updateAttributesOfPort(id, list);

        } else {

            DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

            List<Attribute> list = deviceDAO.getAttributes(id);
            boolean flag = true;

            for (Iterator iterator = list.iterator(); iterator.hasNext() && flag;) {
                Attribute _attribute = (Attribute) iterator.next();

                if (name.equals(_attribute.getName())) {
                    _attribute.setValue(attribute.getValue());
                    _attribute.setIsReadable(attribute.getIsReadable());
                    _attribute.setIsWritable(attribute.getIsWritable());
                    flag = false;
                }
            }

            deviceDAO.updateAttributesOfDevice(id, list);
        }

    }

}
