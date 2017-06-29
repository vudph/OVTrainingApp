package com.alcatel.ov.nms.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.map.ObjectMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.alcatel.ov.nms.converter.Convert;
import com.alcatel.ov.nms.dao.AlarmDAO;
import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.dao.PortDAO;
import com.alcatel.ov.nms.data.constant.AlarmSeverity;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.constant.TypeObject;
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Port;
import com.alcatel.ov.nms.vo.AlarmVO;

@ContextConfiguration(locations = { "/applicationContext_REST.xml" })
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class AlarmRSrcTest {

    private MockMvc mockMvc;
    private ObjectMapper mapper;

    @Autowired
    private WebApplicationContext webApplicationContext;
    
    @Autowired
    private AlarmDAO alarmDAO;

    @Autowired
    private DeviceDAO deviceDAO;

    @Autowired
    private PortDAO portDAO;

    @Before
    public void setUp() {
        Mockito.reset(alarmDAO);
        Mockito.reset(deviceDAO);
        Mockito.reset(portDAO);

        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        mapper = new ObjectMapper();
    }

    @Test
    public void getAlarmsTest() throws Exception {

        // prepare result
        List<Alarm> devAlarms = new ArrayList<Alarm>();
        devAlarms.add(new Alarm("alarm1", "switch1/port1", AlarmSeverity.CRITICAL));
        devAlarms.add(new Alarm("alarm2", "switch1/port1", AlarmSeverity.MAJOR));
        devAlarms.add(new Alarm("alarm3", "switch1/port1", AlarmSeverity.MINOR));
        devAlarms.add(new Alarm("alarm4", "switch1/port2", AlarmSeverity.CRITICAL));
        devAlarms.add(new Alarm("alarm5", "switch1/port3", AlarmSeverity.MINOR));
        devAlarms.add(new Alarm("alarm6", "switch1/port3", AlarmSeverity.MINOR));
        devAlarms.add(new Alarm("alarm7", "switch1/port3", AlarmSeverity.MAJOR));

        List<Alarm> portAlarms = new ArrayList<Alarm>();
        portAlarms.add(new Alarm("alarm1", "switch1/port1", AlarmSeverity.CRITICAL));
        portAlarms.add(new Alarm("alarm2", "switch1/port1", AlarmSeverity.MAJOR));
        portAlarms.add(new Alarm("alarm3", "switch1/port1", AlarmSeverity.MINOR));

        when(deviceDAO.getAlarms("faf45")).thenReturn(devAlarms);
        when(portDAO.getAlarms("gfd45s")).thenReturn(portAlarms);

        // prepare expect
        List<AlarmVO> listAtt = Convert.convert(devAlarms);
        List<AlarmVO> listAtt2 = Convert.convert(portAlarms);

        // test
        String result;

        // wrong id
        mockMvc.perform(get("/devices/fdaf45/alarms").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string("[]"));
        // get alarms of a device
        result = mockMvc.perform(get("/devices/faf45/alarms").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn()
                .getResponse().getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(listAtt), result, false);

        // get alarms of a port
        result = mockMvc.perform(get("/devices/gfd45s/alarms?type={type}", "Port").accept(MediaType.APPLICATION_JSON)).andExpect(
                status().isOk()).andReturn().getResponse().getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(listAtt2), result, false);

    }

    @Test
    public void getPortAlarms() throws Exception {

        // prepare result
        List<AbstractObject> ports = new ArrayList<AbstractObject>();
        ports.add(new AbstractObject("15dsas", "port1", TypeObject.PORT, Status.ACTIVE));
        ports.add(new AbstractObject("45afdd", "port2", TypeObject.PORT, Status.OFFLINE));

        Port port = new Port();
        List<Alarm> portAlarms = new ArrayList<Alarm>();
        portAlarms.add(new Alarm("alarm1", "switch1/port1", AlarmSeverity.CRITICAL));
        portAlarms.add(new Alarm("alarm2", "switch1/port1", AlarmSeverity.MAJOR));
        portAlarms.add(new Alarm("alarm3", "switch1/port1", AlarmSeverity.MINOR));

        port.setAlarms(portAlarms);

        when(deviceDAO.getSubs("gdfg5g")).thenReturn(ports);
        when(portDAO.getAlarms("45afdd")).thenReturn(portAlarms);

        // prepare expect
        List<AlarmVO> alarms = Convert.convert(portAlarms);

        // test
        String result;

        // wrong device id
        mockMvc.perform(get("/devices/gdfg5/ports/45afdd/alarms").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string("[]"));
        // wrong port id
        mockMvc.perform(get("/devices/gdfg5g/ports/45afd/alarms").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string("[]"));
        // get port alarms
        result = mockMvc.perform(get("/devices/gdfg5g/ports/45afdd/alarms").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn()
                .getResponse().getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(alarms), result, false);

    }

}
