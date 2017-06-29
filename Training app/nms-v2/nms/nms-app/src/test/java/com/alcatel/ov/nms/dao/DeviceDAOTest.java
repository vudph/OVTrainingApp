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
import com.alcatel.ov.nms.data.model.AbstractObject;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Attribute;
import com.alcatel.ov.nms.data.model.Device;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

@ContextConfiguration(locations = { "/applicationContext_DAO.xml" })
@RunWith(SpringJUnit4ClassRunner.class)
public class DeviceDAOTest {

    @Autowired
    private DeviceDAO deviceDAO;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Before
    public void before() throws IOException {
        //create collections & add data
        DBCollection deviceCollection = mongoTemplate.getCollection(mongoTemplate.getCollectionName(Device.class));
        URL deviceJsonFile = this.getClass().getResource("/devices.json");
        List<String> jsons = FileUtils.readLines(new File(deviceJsonFile.getFile()));
        
        for(String json : jsons) {
            DBObject object = (DBObject) JSON.parse(json);
            deviceCollection.insert((DBObject) object);
        }
        
    }

    @After
    public void after() {
        mongoTemplate.dropCollection(Device.class);
    }

    // Test add, update, delete function
    @Test
    public void testAddUpdateDelete() {
        Device device1 = new Device("deviceTemp1", Status.ACTIVE, new ArrayList<Attribute>(), new ArrayList<AbstractObject>(),
                new ArrayList<Alarm>(), TypeObject.SWITCH, true);
        Device device2 = new Device("deviceTemp2", Status.OFFLINE, new ArrayList<Attribute>(), new ArrayList<AbstractObject>(),
                new ArrayList<Alarm>(), TypeObject.ROUTER, true);
        device2.setId("111111111111111111111111");

        // Test add
        deviceDAO.add(device1);
        Assert.assertEquals(device1.getName(), deviceDAO.getById(device1.getId()).getName());
        Assert.assertEquals(false, deviceDAO.add(device1));

        // Test update
        device1.setStatus(Status.OFFLINE);
        Assert.assertEquals(true, deviceDAO.update(device1));
        Assert.assertEquals(device1.getStatus(), deviceDAO.getById(device1.getId()).getStatus());
        Assert.assertEquals(false, deviceDAO.update(device2));

        // Test updateDevice
        device1.setName("testUpdate");
        Assert.assertEquals(true, deviceDAO.updateDevice(device1));
        Assert.assertEquals(device1.getName(), deviceDAO.getById(device1.getId()).getName());
        Assert.assertEquals(false, deviceDAO.updateDevice(device2));

        // Test updateAttributesOfDevice
        List<Attribute> attributes = device1.getAttributes();
        Attribute attribute = new Attribute("attribute", "String", "value1", true, false, AttributeGroup.GENERAL);
        attributes.add(attribute);
        Assert.assertEquals(true, deviceDAO.updateAttributesOfDevice(device1.getId(), attributes));
        Assert.assertEquals(1, deviceDAO.getAttributes(device1.getId()).size());
        Assert.assertEquals(false, deviceDAO.updateAttributesOfDevice(device2.getId(), attributes));

        // Test updateAlarmsOfDevice
        List<Alarm> alarms = device1.getAlarms();
        Alarm alarm = new Alarm("alarm", "alarm", AlarmSeverity.CRITICAL);
        alarm.setId("2222222222222222");
        alarms.add(alarm);
        Assert.assertEquals(true, deviceDAO.updateAlarmsOfDevice(device1.getId(), alarms));
        Assert.assertEquals(1, deviceDAO.getAlarms(device1.getId()).size());
        Assert.assertEquals(false, deviceDAO.updateAlarmsOfDevice(device2.getId(), alarms));

        // Test updateStatusOfDevice
        Assert.assertEquals(true, deviceDAO.updateStatusOfDevice(device1.getId(), Status.ACTIVE));
        Assert.assertEquals(Status.ACTIVE, deviceDAO.getById(device1.getId()).getStatus());
        Assert.assertEquals(false, deviceDAO.updateStatusOfDevice(device2.getId(), Status.ACTIVE));

        // Test delete
        deviceDAO.delete(device1);
        Assert.assertEquals(null, deviceDAO.getById(device1.getId()));
        Assert.assertEquals(false, deviceDAO.delete(device2));
    }

    @Test
    public void testCountDeviceByStatus() {
        long nActive = deviceDAO.countDeviceByStatus(Status.ACTIVE);
        long nOffine = deviceDAO.countDeviceByStatus(Status.OFFLINE);
        Assert.assertEquals(4, nActive);
        Assert.assertEquals(2, nOffine);
    }
    

    // Test all get methods
    @Test
    public void testGetMethods() {
        String idDevice ="1";
        
        // Test getById
        Assert.assertEquals(idDevice, deviceDAO.getById(idDevice).getId());
        Assert.assertEquals(null, deviceDAO.getById("111111111111111111111111"));
        
        // Test getAttributes
        List<Attribute> attributes = deviceDAO.getAttributes(idDevice);
        Assert.assertEquals(2, attributes.size());
        Assert.assertEquals(null, deviceDAO.getAttributes("111111111111111111111111"));

        // Test getAlarms
        List<Alarm> alarms = deviceDAO.getAlarms(idDevice);
        Assert.assertEquals(3, alarms.size());
        Assert.assertEquals(null, deviceDAO.getAlarms("111111111111111111111111"));

        // Test getSubs
        List<AbstractObject> subs = deviceDAO.getSubs(idDevice);
        Assert.assertEquals(2, subs.size());
        Assert.assertEquals(null, deviceDAO.getSubs("111111111111111111111111"));
        
        // Test getRootsDevice
        {
            List<Device> devices = deviceDAO.getRootsDevice();
            Assert.assertEquals(5, devices.size());
        }
        
        // test getAll
        {
            List<Device> devices = deviceDAO.getAll();
            Assert.assertEquals(6, devices.size());
        }
        
        // Test getAttributesOfDevice
        Device device = deviceDAO.getAttributesOfDevice(idDevice);
        Assert.assertEquals(2, device.getAttributes().size());
        device = deviceDAO.getAttributesOfDevice("111111111111111111111111");
        Assert.assertEquals(null, device);

        // Test getAlarmsOfDevice
        device = deviceDAO.getAlarmsOfDevice(idDevice);
        Assert.assertEquals(3, device.getAlarms().size());
        device = deviceDAO.getAlarmsOfDevice("111111111111111111111111");
        Assert.assertEquals(null, device);

        // Test getInformationsOfDevice
        device = deviceDAO.getInformationsOfDevice(idDevice);
        Assert.assertEquals(idDevice, device.getId());
        Assert.assertEquals("deviceTest1", device.getName());
        Assert.assertEquals(Status.ACTIVE, device.getStatus());
        Assert.assertEquals(TypeObject.SWITCH, device.getType());
        device = deviceDAO.getInformationsOfDevice("111111111111111111111111");
        Assert.assertEquals(null, device);
        
    }

}
