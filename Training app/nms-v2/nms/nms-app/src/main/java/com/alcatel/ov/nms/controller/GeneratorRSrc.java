package com.alcatel.ov.nms.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alcatel.ov.nms.ctx.NMSAppContext;
import com.alcatel.ov.nms.dao.AlarmDAO;
import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.dao.PortDAO;
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

@Controller
@RequestMapping("/generate")
public class GeneratorRSrc {

    private final int TIME_DELAYS_SECONDS = 2;
    private static Logger m_log = LoggerFactory.getLogger(GeneratorRSrc.class);
    private ScheduledExecutorService pool;

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public void generate(@RequestParam(value = "action", required = false, defaultValue = "start") String action) {
        if (action.equalsIgnoreCase("start")) {

            pool = Executors.newSingleThreadScheduledExecutor();

            pool.scheduleAtFixedRate(new Generator(), 0, TIME_DELAYS_SECONDS, TimeUnit.SECONDS);

        } else if (action.equalsIgnoreCase("end")) {
            if (pool != null)
                pool.shutdown();
        }

    }

    @RequestMapping(value = "/database", method = RequestMethod.GET)
    public void generateDatabase(@RequestParam(value = "switch", required = true) int nSwitch,
            @RequestParam(value = "router", required = true) int nRouter) {
        generateSwitchDatabase(nSwitch);
        generateRouterDatabase(nRouter);
    }

    public static void thread(Runnable runnable, boolean daemon) {
        Thread brokerThread = new Thread(runnable);
        brokerThread.setDaemon(daemon);
        brokerThread.start();
    }

    public static class Generator implements Runnable {

        public void run() {
            try {

                Random random = new Random();
                int number = random.nextInt(10000);
                DeviceDAO deviceDAO = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");
                PortDAO portDAO = NMSAppContext.getService(PortDAO.class, "portDAO");
                AlarmDAO alarmDAO = NMSAppContext.getService(AlarmDAO.class, "alarmDAO");

                m_log.debug("Number: %s", number);
                List<Device> list = deviceDAO.getAll();
                int no1 = number % list.size();
                Device device = list.get(no1);
                no1 = number % device.getSubs().size();

                Port port = portDAO.getById(device.getSubs().get(no1).getId());
                long no = alarmDAO.getSequenceNumber();
                no1 = number % (AlarmSeverity.values().length);

                AlarmVO alarm = new AlarmVO();
                alarm.setId(String.valueOf(no));
                alarm.setName("alarm" + no);
                alarm.setSeverity(AlarmSeverity.values()[no1].toString());
                alarm.setSource(device.getName() + "/" + port.getName());

                AlarmRSrc resource = new AlarmRSrc();
                resource.addAlarm(device.getId(), port.getId(), alarm);

                m_log.info("Add a new alarm successful.");

            } catch (Exception e) {
                // System.out.println("Caught: " + e);
                m_log.error(e.getMessage(), e);
            }
        }
    }

    public void generateSwitchDatabase(int nSwitch) {
        AlarmDAO alarmDAO2 = NMSAppContext.getService(AlarmDAO.class, "alarmDAO");
        PortDAO portDAO2 = NMSAppContext.getService(PortDAO.class, "portDAO");
        DeviceDAO deviceDAO2 = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

        Random random = new Random();
        for (int iSwitch = 1; iSwitch <= nSwitch; iSwitch++) {
            List<Alarm> alarmsOfDevice = new ArrayList<Alarm>();
            List<AbstractObject> subsOfDevice = new ArrayList<AbstractObject>();
            List<Attribute> attributesOfDevice = new ArrayList<Attribute>();

            int nPort = (random.nextInt(100) % 11) + 5;
            for (int iPort = 1; iPort <= nPort; iPort++) {
                List<Alarm> alarmsOfPort = new ArrayList<Alarm>();

                int nAlarm = (random.nextInt(100) % 21) + 5;

                for (int iAlarm = 1; iAlarm <= nAlarm; iAlarm++) {

                    long idAlarm = alarmDAO2.getSequenceNumber();

                    if (iAlarm % 3 == 0) {
                        Alarm alarm = new Alarm("alarm" + idAlarm, "switch" + iSwitch + "/port" + iPort, AlarmSeverity.MAJOR);
                        alarm.setId(String.valueOf(idAlarm));
                        alarmDAO2.add(alarm);
                        alarmsOfPort.add(alarm);
                    } else if (iAlarm % 3 == 1) {
                        Alarm alarm = new Alarm("alarm" + idAlarm, "switch" + iSwitch + "/port" + iPort, AlarmSeverity.MINOR);
                        alarm.setId(String.valueOf(idAlarm));
                        alarmDAO2.add(alarm);
                        alarmsOfPort.add(alarm);
                    } else if (iAlarm % 3 == 2) {
                        Alarm alarm = new Alarm("alarm" + idAlarm, "switch" + iSwitch + "/port" + iPort, AlarmSeverity.CRITICAL);
                        alarm.setId(String.valueOf(idAlarm));
                        alarmDAO2.add(alarm);
                        alarmsOfPort.add(alarm);
                    }

                }
                alarmsOfDevice.addAll(alarmsOfPort);

                List<Attribute> attributesOfPort = new ArrayList<Attribute>();
                if (iPort % 2 == 0)
                    attributesOfPort.add(new Attribute("portType", "String", "ethernet", true, false, AttributeGroup.GENERAL));
                else
                    attributesOfPort.add(new Attribute("portType", "String", "telecom", true, false, AttributeGroup.GENERAL));
                attributesOfPort.add(new Attribute("editableConfig", "String", "value1", true, true, AttributeGroup.SPECIAL));
                attributesOfPort.add(new Attribute("writableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));

                int temp = random.nextInt(100);
                if (temp % 3 == 0 || temp % 3 == 1) {
                    Port port = new Port("port" + iPort, Status.ACTIVE, attributesOfPort, alarmsOfPort);
                    portDAO2.add(port);
                    subsOfDevice.add(new AbstractObject(port.getId(), port.getName(), port.getType(), port.getStatus()));
                } else {
                    Port port = new Port("port" + iPort, Status.OFFLINE, attributesOfPort, alarmsOfPort);
                    portDAO2.add(port);
                    subsOfDevice.add(new AbstractObject(port.getId(), port.getName(), port.getType(), port.getStatus()));
                }

            }

            attributesOfDevice.add(new Attribute("ipAddress", "String", "1.1.1." + iSwitch, true, false, AttributeGroup.GENERAL));
            attributesOfDevice.add(new Attribute("editableConfig", "String", "value1", true, true, AttributeGroup.SPECIAL));
            attributesOfDevice.add(new Attribute("writableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));

            int temp = random.nextInt(100);
            if (temp % 3 == 0 || temp % 3 == 1) {
                Device device = new Device("switch" + iSwitch, Status.ACTIVE, attributesOfDevice, subsOfDevice, alarmsOfDevice,
                        TypeObject.SWITCH, true);
                deviceDAO2.add(device);
            } else {
                Device device = new Device("switch" + iSwitch, Status.OFFLINE, attributesOfDevice, subsOfDevice, alarmsOfDevice,
                        TypeObject.SWITCH, true);
                deviceDAO2.add(device);
            }

        }
    }

    public void generateRouterDatabase(int nRouter) {
        AlarmDAO alarmDAO2 = NMSAppContext.getService(AlarmDAO.class, "alarmDAO");
        PortDAO portDAO2 = NMSAppContext.getService(PortDAO.class, "portDAO");
        DeviceDAO deviceDAO2 = NMSAppContext.getService(DeviceDAO.class, "deviceDAO");

        Random random = new Random();
        for (int iRouter = 1; iRouter <= nRouter; iRouter++) {
            List<Alarm> alarmsOfDevice = new ArrayList<Alarm>();
            List<AbstractObject> subsOfDevice = new ArrayList<AbstractObject>();
            List<Attribute> attributesOfDevice = new ArrayList<Attribute>();

            int nPort = (random.nextInt(100) % 11) + 5;
            for (int iPort = 1; iPort <= nPort; iPort++) {
                List<Alarm> alarmsOfPort = new ArrayList<Alarm>();

                int nAlarm = (random.nextInt(100) % 21) + 5;

                for (int iAlarm = 1; iAlarm <= nAlarm; iAlarm++) {

                    long idAlarm = alarmDAO2.getSequenceNumber();

                    if (iAlarm % 3 == 0) {
                        Alarm alarm = new Alarm("alarm" + idAlarm, "router" + iRouter + "/port" + iPort, AlarmSeverity.MAJOR);
                        alarm.setId(String.valueOf(idAlarm));
                        alarmDAO2.add(alarm);
                        alarmsOfPort.add(alarm);
                    } else if (iAlarm % 3 == 1) {
                        Alarm alarm = new Alarm("alarm" + idAlarm, "router" + iRouter + "/port" + iPort, AlarmSeverity.MINOR);
                        alarm.setId(String.valueOf(idAlarm));
                        alarmDAO2.add(alarm);
                        alarmsOfPort.add(alarm);
                    } else if (iAlarm % 3 == 2) {
                        Alarm alarm = new Alarm("alarm" + idAlarm, "router" + iRouter + "/port" + iPort, AlarmSeverity.CRITICAL);
                        alarm.setId(String.valueOf(idAlarm));
                        alarmDAO2.add(alarm);
                        alarmsOfPort.add(alarm);
                    }

                }
                alarmsOfDevice.addAll(alarmsOfPort);

                List<Attribute> attributesOfPort = new ArrayList<Attribute>();
                if (iPort % 2 == 0)
                    attributesOfPort.add(new Attribute("portType", "String", "ethernet", true, false, AttributeGroup.GENERAL));
                else
                    attributesOfPort.add(new Attribute("portType", "String", "telecom", true, false, AttributeGroup.GENERAL));
                attributesOfPort.add(new Attribute("editableConfig", "String", "value1", true, true, AttributeGroup.SPECIAL));
                attributesOfPort.add(new Attribute("writableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));

                int temp = random.nextInt(100);
                if (temp % 3 == 0 || temp % 3 == 1) {
                    Port port = new Port("port" + iPort, Status.ACTIVE, attributesOfPort, alarmsOfPort);
                    portDAO2.add(port);
                    subsOfDevice.add(new AbstractObject(port.getId(), port.getName(), port.getType(), port.getStatus()));
                } else {
                    Port port = new Port("port" + iPort, Status.OFFLINE, attributesOfPort, alarmsOfPort);
                    portDAO2.add(port);
                    subsOfDevice.add(new AbstractObject(port.getId(), port.getName(), port.getType(), port.getStatus()));
                }

            }

            attributesOfDevice.add(new Attribute("ipAddress", "String", "1.1.2." + iRouter, true, false, AttributeGroup.GENERAL));
            attributesOfDevice.add(new Attribute("editableConfig", "String", "value1", true, true, AttributeGroup.SPECIAL));
            attributesOfDevice.add(new Attribute("writableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));

            int temp = random.nextInt(100);
            if (temp % 3 == 0 || temp % 3 == 1) {
                Device device = new Device("router" + iRouter, Status.ACTIVE, attributesOfDevice, subsOfDevice, alarmsOfDevice,
                        TypeObject.ROUTER, true);
                deviceDAO2.add(device);
            } else {
                Device device = new Device("router" + iRouter, Status.OFFLINE, attributesOfDevice, subsOfDevice, alarmsOfDevice,
                        TypeObject.ROUTER, true);
                deviceDAO2.add(device);
            }

        }
    }

}
