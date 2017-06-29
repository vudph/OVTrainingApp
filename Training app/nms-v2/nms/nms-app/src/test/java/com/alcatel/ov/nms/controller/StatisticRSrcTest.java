package com.alcatel.ov.nms.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.Mockito.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.alcatel.ov.nms.dao.AlarmDAO;
import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.data.constant.AlarmSeverity;
import com.alcatel.ov.nms.data.constant.Status;

@ContextConfiguration(locations = { "/applicationContext_REST.xml" })
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class StatisticRSrcTest {

    private MockMvc mockMvc;
    
    @Autowired
    private WebApplicationContext webApplicationContext;
    
    @Autowired
    private AlarmDAO alarmDAO;

    @Autowired
    private DeviceDAO deviceDAO;

    private final String alarmsJson = "[{\"name\":\"CRITICAL\",\"count\":23},{\"name\":\"MAJOR\",\"count\":30},{\"name\":\"MINOR\",\"count\":51}]";
    private final String devicesJson = "[{\"name\":\"ACTIVE\",\"count\":3},{\"name\":\"OFFLINE\",\"count\":5}]";

    @Before
    public void setUp() {
        Mockito.reset(alarmDAO);
        Mockito.reset(deviceDAO);

        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    public void testGetSeverity() throws Exception {

        // prepare result
        when(alarmDAO.countAlarmBySeverity(AlarmSeverity.CRITICAL)).thenReturn(Long.valueOf("23"));
        when(alarmDAO.countAlarmBySeverity(AlarmSeverity.MAJOR)).thenReturn(Long.valueOf("30"));
        when(alarmDAO.countAlarmBySeverity(AlarmSeverity.MINOR)).thenReturn(Long.valueOf("51"));

        mockMvc.perform(get("/devices/alarms/status").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string(containsString(alarmsJson)));
    }

    @Test
    public void testGetStatus() throws Exception {

        when(deviceDAO.countDeviceByStatus(Status.ACTIVE)).thenReturn(Long.valueOf("3"));
        when(deviceDAO.countDeviceByStatus(Status.OFFLINE)).thenReturn(Long.valueOf("5"));

        mockMvc.perform(get("/devices/status").accept(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string(containsString(devicesJson)));
    }
}
