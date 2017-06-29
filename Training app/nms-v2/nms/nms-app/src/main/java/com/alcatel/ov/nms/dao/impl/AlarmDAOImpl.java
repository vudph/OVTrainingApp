package com.alcatel.ov.nms.dao.impl;

import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.alcatel.ov.nms.dao.AlarmDAO;
import com.alcatel.ov.nms.dao.impl.GenericDAOImpl;
import com.alcatel.ov.nms.data.constant.AlarmSeverity;
import com.alcatel.ov.nms.data.model.Alarm;
import com.alcatel.ov.nms.data.model.Sequence;

public class AlarmDAOImpl extends GenericDAOImpl<Alarm, String> implements AlarmDAO {

    public AlarmDAOImpl() {
        super(Alarm.class);
    }

    public long getSequenceNumber() {
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is("Alarm"));
        Update update = new Update();
        update.inc("sequence", 1);

        Sequence sequence = mongoOperation.findAndModify(query, update, FindAndModifyOptions.options().returnNew(true), Sequence.class,
                "Sequence");
        return sequence.getSequence();
    }

    // //Count functions
    public long countAlarmBySeverity(AlarmSeverity severity) {
        Query query = new Query();
        query.addCriteria(Criteria.where("severity").is(severity));
        long count = mongoOperation.count(query, entityClass);
        return count;
    }

    // //End Count functions

    // //Override functions GenericDAOImpl
    public Boolean add(Alarm alarm) {
        if (super.getById(alarm.getId()) == null)
            return super.add(alarm);

        return false;
    }

    public Boolean update(Alarm alarm) {
        if (getById(alarm.getId()) != null)
            return super.update(alarm);

        return false;
    }

    public Boolean delete(Alarm alarm) {
        if (getById(alarm.getId()) != null)
            return super.delete(alarm);

        return false;
    }
    // //End Override functions GenericDAOImpl

}
