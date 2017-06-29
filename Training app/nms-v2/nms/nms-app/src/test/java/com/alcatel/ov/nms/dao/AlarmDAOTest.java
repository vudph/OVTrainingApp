package com.alcatel.ov.nms.dao;

import java.util.List;

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
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Sequence;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

@ContextConfiguration(locations = { "/applicationContext_DAO.xml" })
@RunWith(SpringJUnit4ClassRunner.class)
public class AlarmDAOTest {

    @Autowired
    private AlarmDAO alarmDAO;
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Before
    public void before() {
        //create collections & add data
        DBCollection sequenceCollection = mongoTemplate.createCollection(Sequence.class);
        sequenceCollection.insert((DBObject) JSON.parse("{'name' : 'Alarm', 'sequence' : 6}"));
        
        DBCollection alarmCollection = mongoTemplate.createCollection(Alarm.class);
        alarmCollection.insert((DBObject) JSON.parse("{'_id' : '1', 'name' : 'alarm1', 'source' : 'switch1', severity : 'CRITICAL'}"));
        alarmCollection.insert((DBObject) JSON.parse("{'_id' : '2', 'name' : 'alarm2', 'source' : 'switch1', severity : 'MAJOR'}"));
        alarmCollection.insert((DBObject) JSON.parse("{'_id' : '3', 'name' : 'alarm2', 'source' : 'switch1', severity : 'MAJOR'}"));
        alarmCollection.insert((DBObject) JSON.parse("{'_id' : '4', 'name' : 'alarm1', 'source' : 'switch1', severity : 'MINOR'}"));
        alarmCollection.insert((DBObject) JSON.parse("{'_id' : '5', 'name' : 'alarm2', 'source' : 'switch1', severity : 'MINOR'}"));
        alarmCollection.insert((DBObject) JSON.parse("{'_id' : '6', 'name' : 'alarm2', 'source' : 'switch1', severity : 'MINOR'}"));
    }

    @After
    public void after() {
        mongoTemplate.dropCollection(Sequence.class);
        mongoTemplate.dropCollection(Alarm.class);
    }

    @Test
    public void testGetSequenceNumber() {
        long seq1 = alarmDAO.getSequenceNumber();
        long seq2 = alarmDAO.getSequenceNumber();
        Assert.assertEquals(seq1 + 1, seq2);
    }

    @Test
    public void testGetById() {
        Assert.assertEquals("1", alarmDAO.getById("1").getId());

        long seq = alarmDAO.getSequenceNumber();
        Assert.assertEquals(null, alarmDAO.getById(String.valueOf(seq)));
    }

    @Test
    public void testAddUpdateDelete() {
        Alarm alarm1 = new Alarm("alarm1", "switch1", AlarmSeverity.MINOR);
        String idAlarm1 = String.valueOf(alarmDAO.getSequenceNumber());
        alarm1.setId(idAlarm1);

        Alarm alarm2 = new Alarm("alarm2", "switch1", AlarmSeverity.MAJOR);
        String idAlarm2 = String.valueOf(alarmDAO.getSequenceNumber());
        alarm2.setId(idAlarm2);

        // Test add
        alarmDAO.add(alarm1);
        Assert.assertEquals(idAlarm1, alarmDAO.getById(idAlarm1).getId());
        Assert.assertEquals(false, alarmDAO.add(alarm1));

        // Test update
        alarm1.setSeverity(AlarmSeverity.CRITICAL);
        Assert.assertEquals(true, alarmDAO.update(alarm1));
        Assert.assertEquals(alarm1.getSeverity(), alarmDAO.getById(idAlarm1).getSeverity());
        Assert.assertEquals(false, alarmDAO.update(alarm2));

        // Test delete
        alarmDAO.delete(alarm1);
        Assert.assertEquals(null, alarmDAO.getById(idAlarm1));
        Assert.assertEquals(false, alarmDAO.delete(alarm2));
    }

    @Test
    public void testGetAll() {
        List<Alarm> alarms = alarmDAO.getAll();
        Assert.assertEquals(6 , alarms.size());
    }
    
    @Test
    public void testCountAlarmBySeverity() {
        long nMinor = alarmDAO.countAlarmBySeverity(AlarmSeverity.MINOR);
        long nMajor = alarmDAO.countAlarmBySeverity(AlarmSeverity.MAJOR);
        long nCritical = alarmDAO.countAlarmBySeverity(AlarmSeverity.CRITICAL);
        Assert.assertEquals(3, nMinor);
        Assert.assertEquals(2, nMajor);
        Assert.assertEquals(1, nCritical);
    }
}
