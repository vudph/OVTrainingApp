package com.alcatel.ov.nms.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.alcatel.ov.nms.dao.DeviceDAO;
import com.alcatel.ov.nms.dao.PortDAO;
import com.alcatel.ov.nms.data.constant.AttributeGroup;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.constant.TypeObject;
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Device;
import com.alcatel.ov.nms.data.model.Port;
import com.alcatel.ov.nms.vo.AttributeVO;
import com.alcatel.ov.nms.vo.NMSObjectVO;

@ContextConfiguration(locations = { "/applicationContext_REST.xml" })
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
public class DeviceRSrcTest {

    private MockMvc mockMvc;
    private ObjectMapper mapper;

    @Autowired
    private WebApplicationContext webApplicationContext;
    
    @Autowired
    private DeviceDAO deviceDAO;
    @Autowired
    private PortDAO portDAO;

    @Before
    public void setUp() {
        Mockito.reset(deviceDAO);
        Mockito.reset(portDAO);

        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        mapper = new ObjectMapper();
    }

    @Test
    public void testGetRoot() throws Exception {

        // prepare result
        List<Device> devices = new ArrayList<Device>();
        devices.add(new Device("123d4", "switch1", TypeObject.SWITCH, Status.OFFLINE));
        devices.add(new Device("456s7", "switch2", TypeObject.SWITCH, Status.ACTIVE));
        devices.add(new Device("897a6", "router3", TypeObject.SWITCH, Status.OFFLINE));
        devices.add(new Device("021q5", "router2", TypeObject.ROUTER, Status.ACTIVE));
        devices.add(new Device("312sa", "router3", TypeObject.ROUTER, Status.OFFLINE));

        when(deviceDAO.getRootsDevice()).thenReturn(devices);

        // prepare expect
        List<NMSObjectVO> nmsObjs = new ArrayList<NMSObjectVO>();
        for (Device device : devices) {
            nmsObjs.add(Convert.convert(device));
        }

        // test
        String result = mockMvc.perform(get("/devices").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andReturn()
                .getResponse().getContentAsString();

        JSONAssert.assertEquals(mapper.writeValueAsString(nmsObjs), result, false);
    }

    @Test
    public void testGetChild() throws Exception {

        // prepare result
        Device device = new Device();
        List<AbstractObject> objs = new ArrayList<AbstractObject>();
        objs.add(new AbstractObject("3326a", "switch1", TypeObject.PORT, Status.OFFLINE));
        objs.add(new AbstractObject("458sa", "switch2", TypeObject.PORT, Status.ACTIVE));

        device.setSubs(objs);

        when(deviceDAO.getSubsOfDevice("54daQ")).thenReturn(device);

        // prepare expect
        List<NMSObjectVO> nmsObjs = new ArrayList<NMSObjectVO>();
        for (AbstractObject obj : objs) {
            nmsObjs.add(Convert.convert(obj));
        }

        // test
        String result = mockMvc.perform(get("/devices/54daQ").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        JSONAssert.assertEquals(mapper.writeValueAsString(nmsObjs), result, false);

        // wrong id
        mockMvc.perform(get("/devices/51ef2").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string("[]"));

    }

    @Test
    public void testGetAttribute() throws Exception {

        // prepare result
        Device device = new Device();
        List<Attribute> attributes = new ArrayList<Attribute>();
        attributes.add(new Attribute("readableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("editableConfig", "String", "test123", true, true, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("ipAddress", "String", "value1", true, false, AttributeGroup.GENERAL));

        device.setAttributes(attributes);
        device.setStatus(Status.ACTIVE);

        when(deviceDAO.getAttributesOfDevice("54daQ")).thenReturn(device);

        // prepare expect
        List<AttributeVO> attributeVOs = new ArrayList<AttributeVO>();
        for (Attribute attribute : attributes) {
            attributeVOs.add(Convert.convert(attribute));
        }
        attributeVOs.add(new AttributeVO("status", device.getStatus().toString(), "String", AttributeGroup.GENERAL.toString(), true, false,
                null, null));

        // get attribute of a fake device
        mockMvc.perform(get("/devices/54daQ456/attributes").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string("[]"));

        // get attribute of a device
        String result = mockMvc.perform(get("/devices/54daQ/attributes").contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(attributeVOs), result, false);

    }

    @Test
    public void testUpdateAttribute() throws Exception {

        // prepare body
        // BEFORE UPDATE
        Device device = new Device();
        List<Attribute> attributes = new ArrayList<Attribute>();
        attributes.add(new Attribute("readableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("editableConfig", "String", "test123", true, true, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("ipAddress", "String", "value1", true, false, AttributeGroup.GENERAL));

        device.setAttributes(attributes);
        device.setStatus(Status.ACTIVE);

        // AFTER UPDATED
        Device deviceUpdated = new Device();
        List<Attribute> listUpdated = new ArrayList<Attribute>();
        listUpdated.add(new Attribute("readableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));
        listUpdated.add(new Attribute("editableConfig", "String", "test", true, true, AttributeGroup.SPECIAL));
        listUpdated.add(new Attribute("ipAddress", "String", "value1", true, false, AttributeGroup.GENERAL));

        deviceUpdated.setAttributes(listUpdated);
        deviceUpdated.setStatus(Status.ACTIVE);

        when(deviceDAO.updateAttributesOfDevice("54daQ", listUpdated)).thenReturn(true);
        when(deviceDAO.updateAttributesOfDevice("54daQdas", listUpdated)).thenReturn(false);

        List<AttributeVO> attributeVOs = new ArrayList<AttributeVO>();
        for (Attribute attribute : listUpdated) {
            attributeVOs.add(Convert.convert(attribute));
        }
        attributeVOs.add(new AttributeVO("status", deviceUpdated.getStatus().toString(), "String", AttributeGroup.GENERAL.toString(), true,
                false, null, null));

        // update attribute of a device
        mockMvc.perform(put("/devices/54daQ/attributes").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsBytes(attributeVOs)))
                .andExpect(status().isOk());

    }

    @Test
    public void testGetPortAttribute() throws Exception {

        String result;

        // prepare result
        List<AbstractObject> ports = new ArrayList<AbstractObject>();
        ports.add(new AbstractObject("15dsa", "port1", TypeObject.PORT, Status.ACTIVE));
        ports.add(new AbstractObject("45afd", "port2", TypeObject.PORT, Status.OFFLINE));

        Port port = new Port();
        List<Attribute> attributes = new ArrayList<Attribute>();
        attributes.add(new Attribute("readableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("editableConfig", "String", "test123", true, true, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("ipAddress", "String", "value1", true, false, AttributeGroup.GENERAL));

        port.setAttributes(attributes);
        port.setStatus(Status.OFFLINE);

        when(deviceDAO.getSubs("45f6as")).thenReturn(ports);
        when(portDAO.getAttributesOfPort("45afd")).thenReturn(port);

        // prepare expect
        List<AttributeVO> attributeVOs = new ArrayList<AttributeVO>();
        for (Attribute attribute : attributes) {
            attributeVOs.add(Convert.convert(attribute));
        }
        attributeVOs.add(new AttributeVO("status", port.getStatus().toString(), "String", AttributeGroup.GENERAL.toString(), true, false, null,
                null));

        // get attribute from fake device id
        mockMvc.perform(get("/devices/51ef9/ports/45afd").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string(""));

        // get attribute from fake port id
        mockMvc.perform(get("/devices/45f6as/ports/51ef").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string(""));

        // get attribute of a portid
        result = mockMvc.perform(get("/devices/45f6as/ports/45afd").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(attributeVOs), result, false);

    }

    @Test
    public void testUpdatePortAttribute() throws Exception {

        // prepare body
        List<AbstractObject> ports = new ArrayList<AbstractObject>();
        ports.add(new AbstractObject("15dsa", "port1", TypeObject.PORT, Status.ACTIVE));
        ports.add(new AbstractObject("45afd", "port2", TypeObject.PORT, Status.OFFLINE));

        Port port = new Port();
        List<Attribute> attributes = new ArrayList<Attribute>();
        attributes.add(new Attribute("readableConfig", "String", "value1", true, false, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("editableConfig", "String", "test123", true, true, AttributeGroup.SPECIAL));
        attributes.add(new Attribute("ipAddress", "String", "value1", true, false, AttributeGroup.GENERAL));

        port.setAttributes(attributes);
        port.setStatus(Status.OFFLINE);

        when(deviceDAO.getSubs("45f6as")).thenReturn(ports);
        when(portDAO.getAttributesOfPort("45afd")).thenReturn(port);

        List<AttributeVO> attributeVOS = new ArrayList<AttributeVO>();
        for (Attribute attribute : attributes) {
            attributeVOS.add(Convert.convert(attribute));
        }
        attributeVOS.add(new AttributeVO("status", port.getStatus().toString(), "String", AttributeGroup.GENERAL.toString(), true, false, null,
                null));

        // update attribute of a port
        mockMvc.perform(put("/devices/45f6as/ports/45afd").contentType(MediaType.APPLICATION_JSON).content(mapper.writeValueAsBytes(attributeVOS)))
                .andExpect(status().isOk());

    }

    @Test
    public void testGetInfo() throws Exception {
        String result;

        // prepare result
        Device device = new Device("dsa1a2", "switch1", TypeObject.SWITCH, Status.ACTIVE);
        Port port = new Port("d4as56", "port1", TypeObject.PORT, Status.OFFLINE);

        when(deviceDAO.getInformationsOfDevice("dsa1a2")).thenReturn(device);
        when(portDAO.getInformationsOfPort("d4as56")).thenReturn(port);

        // fake id
        mockMvc.perform(get("/devices/123456/info").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk()).andExpect(
                content().string(""));

        // id of device
        result = mockMvc.perform(get("/devices/dsa1a2/info").contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(Convert.convert(device)), result, false);

        // id of port
        result = mockMvc.perform(get("/devices/d4as56/info?type={type}", "Port").contentType(MediaType.APPLICATION_JSON)).andExpect(
                status().isOk()).andReturn().getResponse().getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(Convert.convert(port)), result, false);

    }

    @Test
    public void testUpdateInfo() throws Exception {
        String result;

        // prepare body
        Device device = new Device("dsa1a2", "switch1", TypeObject.SWITCH, Status.ACTIVE);
        Port port = new Port("d4as56", "port1", TypeObject.PORT, Status.OFFLINE);

        when(deviceDAO.updateStatusOfDevice("dsa1a2", Status.ACTIVE)).thenReturn(true);
        when(portDAO.updateStatusOfPort("d4as56", Status.OFFLINE)).thenReturn(false);

        // prepare result
        Map<String, Object> resultDeviceUpdate = new HashMap<String, Object>();
        resultDeviceUpdate.put("result", true);
        resultDeviceUpdate.put("body", Convert.convert(device));

        Map<String, Object> resultPortUpdate = new HashMap<String, Object>();
        resultPortUpdate.put("result", false);
        resultPortUpdate.put("body", Convert.convert(port));

        // id of device
        result = mockMvc
                .perform(
                        put("/devices/dsa1a2/info").contentType(MediaType.APPLICATION_JSON).content(
                                mapper.writeValueAsBytes(Convert.convert(device)))).andExpect(status().isOk()).andReturn().getResponse()
                .getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(resultDeviceUpdate), result, false);

        // id of port
        result = mockMvc.perform(
                put("/devices/d4as56/info?type={type}", "Port").contentType(MediaType.APPLICATION_JSON).content(
                        mapper.writeValueAsBytes(Convert.convert(port)))).andExpect(status().isOk()).andReturn().getResponse()
                .getContentAsString();
        JSONAssert.assertEquals(mapper.writeValueAsString(resultPortUpdate), result, false);

    }

}
