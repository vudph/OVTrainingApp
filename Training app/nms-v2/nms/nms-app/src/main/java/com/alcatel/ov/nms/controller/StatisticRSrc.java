package com.alcatel.ov.nms.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alcatel.ov.nms.ctx.NMSAppContext;
import com.alcatel.ov.nms.dao.AlarmDAO;
import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.data.constant.AlarmSeverity;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.vo.CounterVO;

@Controller
@RequestMapping(value = "/devices")
public class StatisticRSrc {

    @RequestMapping(value = "/status", method = RequestMethod.GET)
    @ResponseBody
    public List<CounterVO> getDevices() {

        DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");
        List<CounterVO> list = new ArrayList<CounterVO>();

        for (Status status : Status.values()) {
            CounterVO count = new CounterVO();
            count.setName(status.toString());
            count.setCount(deviceDAO.countDeviceByStatus(status));
            list.add(count);
        }

        return list;

    }

    @RequestMapping(value = "/alarms/count/{severity}", method = RequestMethod.GET)
    @ResponseBody
    public long getAlarmStatus(@PathVariable String severity) {

        AlarmDAO alarmDAO = NMSAppContext.getService(AlarmDAO.class, "alarmDAO");

        return alarmDAO.countAlarmBySeverity(AlarmSeverity.valueOf(severity.toUpperCase()));

    }

    @RequestMapping(value = "/severities", method = RequestMethod.GET)
    @ResponseBody
    public AlarmSeverity[] getAlarmSeverities() {
        return AlarmSeverity.values();
    }

    @RequestMapping(value = "/alarms/status", method = RequestMethod.GET)
    @ResponseBody
    public List<CounterVO> getAlarms() {
        AlarmDAO alarmDAO = NMSAppContext.getService(AlarmDAO.class, "alarmDAO");
        List<CounterVO> list = new ArrayList<CounterVO>();

        for (AlarmSeverity severity : AlarmSeverity.values()) {
            CounterVO count = new CounterVO();
            count.setName(severity.toString());
            count.setCount(alarmDAO.countAlarmBySeverity(severity));
            list.add(count);
        }

        return list;
    }

}
