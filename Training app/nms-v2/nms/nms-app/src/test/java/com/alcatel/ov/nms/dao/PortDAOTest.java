package com.alcatel.ov.nms.dao;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.After;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.alcatel.ov.nms.data.constant.AlarmSeverity;
import com.alcatel.ov.nms.data.constant.AttributeGroup;
import com.alcatel.ov.nms.data.constant.Status;
import com.alcatel.ov.nms.data.constant.TypeObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Port;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

@ContextConfiguration(locations = { "/applicationContext_DAO.xml" })
@RunWith(SpringJUnit4ClassRunner.class)
public class PortDAOTest {

    @Autowired
    private PortDAO portDAO;

    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Before
    public void before() throws IOException {
        //create collections & add data
        DBCollection portCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(Port.class));
        URL portJsonFile = this.getClass().getResource("/ports.json");
        List<String> jsons = FileUtils.readLines(new File(portJsonFile.getFile()));
        
        for(String json : jsons) {
            DBObject object = (DBObject) JSON.parse(json);
            portCollection.insert((DBObject) object);
        }
    }

    @After
    public void after() {
        mongoTemplate.dropCollection(Port.class);
    }

    // Test add, all functions update, delete
    @Test
    public void testAddUpdateDelete() {
        Port port1 = new Port("portTemp1", Status.ACTIVE, new ArrayList<Attribute>(), new ArrayList<Alarm>());
        Port port2 = new Port("portTemp1", Status.OFFLINE, new ArrayList<Attribute>(), new ArrayList<Alarm>());
        port2.setId("111111111111111111111111");

        // Test add
        portDAO.add(port1);
        Assert.assertEquals(port1.getName(), portDAO.getById(port1.getId()).getName());
        Assert.assertEquals(false, portDAO.add(port1));

        // Test update
        port1.setStatus(Status.OFFLINE);
        Assert.assertEquals(true, portDAO.update(port1));
        Assert.assertEquals(port1.getStatus(), portDAO.getById(port1.getId()).getStatus());
        Assert.assertEquals(false, portDAO.update(port2));

        // Test updatePort
        port1.setName("testUpdate");
        Assert.assertEquals(true, portDAO.updatePort(port1));
        Assert.assertEquals(port1.getName(), portDAO.getById(port1.getId()).getName());
        Assert.assertEquals(false, portDAO.updatePort(port2));

        // Test updateAttributesOfPort
        List<Attribute> attributes = port1.getAttributes();
        Attribute attribute = new Attribute("attribute", "String", "value1", true, false, AttributeGroup.GENERAL);
        attributes.add(attribute);
        Assert.assertEquals(true, portDAO.updateAttributesOfPort(port1.getId(), attributes));
        Assert.assertEquals(1, portDAO.getAttributes(port1.getId()).size());
        Assert.assertEquals(false, portDAO.updateAttributesOfPort(port2.getId(), attributes));

        // Test updateAlarmsOfPort
        List<Alarm> alarms = port1.getAlarms();
        Alarm alarm = new Alarm("alarm", "alarm", AlarmSeverity.CRITICAL);
        alarm.setId("2222222222222222");
        alarms.add(alarm);
        Assert.assertEquals(true, portDAO.updateAlarmsOfPort(port1.getId(), alarms));
        Assert.assertEquals(1, portDAO.getAlarms(port1.getId()).size());
        Assert.assertEquals(false, portDAO.updateAlarmsOfPort(port2.getId(), alarms));

        // Test updateStatusOfPort
        Assert.assertEquals(true, portDAO.updateStatusOfPort(port1.getId(), Status.ACTIVE));
        Assert.assertEquals(Status.ACTIVE, portDAO.getById(port1.getId()).getStatus());
        Assert.assertEquals(false, portDAO.updateStatusOfPort(port2.getId(), Status.ACTIVE));

        // Test delete
        portDAO.delete(port1);
        Assert.assertEquals(null, portDAO.getById(port1.getId()));
        Assert.assertEquals(false, portDAO.delete(port2));
    }

    // Test all get methods
    @Test
    public void testGetMethods() {
        String idPort = "1";

        // Test getById
        Assert.assertEquals(idPort, portDAO.getById(idPort).getId());
        Assert.assertEquals(null, portDAO.getById("111111111111111111111111"));
        
        // Test getAttributes
        List<Attribute> attributes = portDAO.getAttributes(idPort);
        Assert.assertEquals(2, attributes.size());
        attributes = portDAO.getAttributes("111111111111111111111111");
        Assert.assertEquals(null, attributes);

        // Test getAlarms
        List<Alarm> alarms = portDAO.getAlarms(idPort);
        Assert.assertEquals(3, alarms.size());
        alarms = portDAO.getAlarms("111111111111111111111111");
        Assert.assertEquals(null, alarms);
        
        // Test getAttributesOfPort
        Port port = portDAO.getAttributesOfPort(idPort);
        Assert.assertEquals(2, port.getAttributes().size());
        port = portDAO.getAttributesOfPort("111111111111111111111111");
        Assert.assertEquals(null, port);

        // Test getAlarmsOfPort
        port = portDAO.getAlarmsOfPort(idPort);
        Assert.assertEquals(3, port.getAlarms().size());
        port = portDAO.getAlarmsOfPort("111111111111111111111111");
        Assert.assertEquals(null, port);

        // Test getInformationsOfPort
        port = portDAO.getInformationsOfPort(idPort);
        Assert.assertEquals(idPort, port.getId());
        Assert.assertEquals("portTest1", port.getName());
        Assert.assertEquals(Status.ACTIVE, port.getStatus());
        Assert.assertEquals(TypeObject.PORT, port.getType());
        port = portDAO.getInformationsOfPort("111111111111111111111111");
        Assert.assertEquals(null, port);
        
        // Test countPortByStatus
        long nActive = portDAO.countPortByStatus(Status.ACTIVE);
        long nOffine = portDAO.countPortByStatus(Status.OFFLINE);
        Assert.assertEquals(4, nActive);
        Assert.assertEquals(2, nOffine);

        // Test getAll
        List<Port> ports = portDAO.getAll();
        Assert.assertEquals(6, ports.size());
    }

}
