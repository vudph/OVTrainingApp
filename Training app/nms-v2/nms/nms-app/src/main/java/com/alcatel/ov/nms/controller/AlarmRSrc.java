package com.alcatel.ov.nms.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alcatel.ov.nms.converter.Convert;
import com.alcatel.ov.nms.ctx.NMSAppContext;
import com.alcatel.ov.nms.dao.AlarmDAO;
import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.dao.PortDAO;
import com.alcatel.ov.nms.data.constant.TypeObject;
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Device;
import com.alcatel.ov.nms.data.model.Port;
import com.alcatel.ov.nms.resolvers.JaxbJacksonObjectMapper;
import com.alcatel.ov.nms.vo.AlarmVO;

@Controller
@RequestMapping(value = "/devices")
public class AlarmRSrc {

    private ObjectMapper m_objectMapper = new JaxbJacksonObjectMapper();
    private static Logger m_log = LoggerFactory.getLogger(AlarmRSrc.class);

    @RequestMapping(value = "/{id}/alarms", method = RequestMethod.GET)
    @ResponseBody
    public List<AlarmVO> getAlarms(@PathVariable(value = "id") String id,
            @RequestParam(value = "type", required = false, defaultValue = "Device") String type,
            @RequestParam(value = "startIndex", required = false, defaultValue = "0") String startIndex,
            @RequestParam(value = "maxRecords", required = false, defaultValue = "1000") String maxRecords,
            @RequestParam(value = "orderDesc", required = false) String orderDesc[],
            @RequestParam(value = "orderAsc", required = false) String orderAsc[]) {
        List<AlarmVO> listAlarm = new ArrayList<AlarmVO>();

        if (type.equalsIgnoreCase(TypeObject.PORT.toString())) {

            PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");

            List<Alarm> list = portDAO.getAlarms(id);

            if (list != null) {
                listAlarm.addAll(Convert.convert(list));
            }

        } else {

            DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

            List<Alarm> list = deviceDAO.getAlarms(id);

            if (list != null) {
                listAlarm.addAll(Convert.convert(list));
            }

        }

        return listAlarm;
    }

    @SuppressWarnings("rawtypes")
    @RequestMapping(value = "/{id}/ports/{portid}/alarms", method = RequestMethod.GET)
    @ResponseBody
    public List<AlarmVO> getPortAlarms(@PathVariable String id, @PathVariable String portid,
            @RequestParam(value = "startIndex", required = false, defaultValue = "0") String startIndex,
            @RequestParam(value = "maxRecords", required = false, defaultValue = "1000") String maxRecords,
            @RequestParam(value = "orderDesc", required = false) String orderDesc[],
            @RequestParam(value = "orderAsc", required = false) String orderAsc[]) {
        List<AlarmVO> listAlarm = new ArrayList<AlarmVO>();

        DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");
        PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");

        // verify portid
        List<AbstractObject> listPort = deviceDAO.getSubs(id);
        boolean notFound = true;
        if (listPort != null) {
            for (Iterator iterator = listPort.iterator(); iterator.hasNext() && notFound;) {
                AbstractObject vo = (AbstractObject) iterator.next();
                if (portid.equals(vo.getId())) {
                    notFound = false;
                }
            }
        }
        // portid is true
        if (!notFound) {

            List<Alarm> list = portDAO.getAlarms(portid);

            // check whether port has alarms
            listAlarm.addAll(Convert.convert(list));

        }

        return listAlarm;
    }

    @RequestMapping(value = "/alarms", method = RequestMethod.GET)
    @ResponseBody
    public List<AlarmVO> getAlarms() {

        /****************** GET VALUE FROM DB ******************/
        AlarmDAO alarmDAO = NMSAppContext.getService(AlarmDAO.class, "alarmDAO");

        List<AlarmVO> listAlarm = new ArrayList<AlarmVO>();

        List<Alarm> list = alarmDAO.getAll();

        for (Alarm alarm : list) {
            listAlarm.add(Convert.convert(alarm));
        }

        return listAlarm;

    }

    @RequestMapping(value = "/alarms", method = RequestMethod.POST)
    @ResponseBody
    public AlarmVO addAlarm(@RequestParam(value = "deviceid", required = true) String deviceid,
            @RequestParam(value = "portid", required = false) String portid, @RequestBody AlarmVO alarmVO) throws JsonGenerationException,
            JsonMappingException, IOException {

        AlarmDAO alarmDAO = NMSAppContext.getService(AlarmDAO.class, "alarmDAO");
        PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");
        DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

        Device device = deviceDAO.getById(deviceid);
        Alarm alarm = Convert.convert(alarmVO);
        alarm.setId(String.valueOf(alarmDAO.getSequenceNumber()));

        // insert in alarm
        alarmDAO.add(alarm);
        List<Alarm> la = null;
        m_log.debug("Insert alarm success.");

        // insert in device
        la = device.getAlarms();
        la.add(alarm);
        deviceDAO.updateAlarmsOfDevice(deviceid, la);
        m_log.debug("Insert device success.");

        // insert in port
        Port port = null;
        for (AbstractObject object : device.getSubs()) {
            if (object.getId().equals(portid)) {
                port = portDAO.getById(portid);
            }
        }
        if (port != null) {
            la = port.getAlarms();
            la.add(alarm);
            portDAO.updateAlarmsOfPort(portid, la);
        }
        m_log.debug("Insert port success.");
        m_log.info("Insert a new alarm");

        /************************** INSERT ALARM SUCCESSFUL *******************************/

        Broadcaster broadcaster = BroadcasterFactory.getDefault().lookup(EventRSrc.EVENT_BROADCAST, false);
        if (broadcaster != null) {
            broadcaster.broadcast(m_objectMapper.writeValueAsString(Convert.convert(alarmVO)));
        }

        return Convert.convert(alarm);
    }

}
