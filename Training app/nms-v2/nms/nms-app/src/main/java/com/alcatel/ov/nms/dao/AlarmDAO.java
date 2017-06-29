package com.alcatel.ov.nms.dao;

import com.alcatel.ov.nms.dao.GenericDAO;
import com.alcatel.ov.nms.data.constant.AlarmSeverity;
import com.alcatel.ov.nms.data.model.Alarm;

public interface AlarmDAO extends GenericDAO<Alarm, String> {
    long getSequenceNumber();

    long countAlarmBySeverity(AlarmSeverity severity);
}
